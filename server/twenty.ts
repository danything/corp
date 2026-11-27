// 問い合わせを Twenty (https://t.doany.io、家のクラスタの CRM) に記録する。
//
// GraphQL (/graphql) で、次の順に作る。値はすべて変数で渡す (クエリの文字列に入力を混ぜない)。
// 1. 人 (person): メールのアドレスで探し、無ければ作る (名前は firstName にまとめて入れる)
// 2. 会社 (company): 会社・団体の欄が空でなければ、名前で探し、無ければ作る。空なら人の会社を使う
// 3. お問い合わせ (inquiry、Twenty に足した独自のオブジェクト): 入力そのものと、Matrix 向けの通知の文面
// 4. タスク (task) と、そのつながり (taskTarget: お問い合わせと人)
//
// 3 ができれば記録できたとみなす。Twenty のワークフロー「お問い合わせを Matrix に通知」が、
// inquiry が作られたのを受けて、通知の文面を hookshot の webhook (Element の contact ルーム) に送る。
// 4 の失敗はログに残すだけにする (お問い合わせそのものは残っていて、通知も届く)。
//
// API キーは Twenty のロール「corp のお問い合わせ」のもの (人・会社・お問い合わせ・タスクを読んで作るだけ)。
// 利用者の入力はログに出さない
import type { Lang } from "./contact";

export interface TwentyEnv {
  /** Twenty の URL (TWENTY_URL、例 https://t.doany.io) */
  url: string;
  /** API キー (TWENTY_API_KEY) */
  apiKey: string;
  /** タスクの担当にするワークスペースのメンバーの ID (TWENTY_ASSIGNEE_ID)。無ければ担当なし */
  assigneeId?: string;
}

export interface InquiryInput {
  name: string;
  email: string;
  company: string;
  message: string;
  lang: Lang;
  ip?: string;
  /** Matrix に送る文面 (Markdown。入力はコードに入れて無害にしたもの) */
  notification: string;
}

/** どこまで進んだか。失敗したときのログに出す */
export type Stage = "person" | "company" | "inquiry";

export type RecordResult =
  | { ok: true; inquiryId: string; taskCreated: boolean }
  | { ok: false; stage: Stage };

class TwentyError extends Error {}

/** ILIKE の % と _ と \ を文字どおりに比べるようにする */
export const escapeLike = (value: string) => value.replace(/[\\%_]/g, "\\$&");

export async function recordInquiry(
  input: InquiryInput,
  env: TwentyEnv,
  fetchFn: typeof fetch,
): Promise<RecordResult> {
  const endpoint = new URL("/graphql", env.url).toString();
  const gql = async <T>(
    query: string,
    variables: Record<string, unknown>,
  ): Promise<T> => {
    let res: Response;
    try {
      res = await fetchFn(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
        signal: AbortSignal.timeout(10_000),
      });
    } catch (e) {
      throw new TwentyError(e instanceof Error ? e.name : "error");
    }
    if (!res.ok) throw new TwentyError(`HTTP ${res.status}`);
    const body = (await res.json().catch(() => null)) as {
      data?: T;
      errors?: { message?: string }[];
    } | null;
    if (!body?.data || body.errors?.length) {
      // エラーの文面に入力が混ざることがあるので、件数だけ出す
      throw new TwentyError(`GraphQL errors: ${body?.errors?.length ?? 0}`);
    }
    return body.data;
  };

  let stage: Stage = "person";
  try {
    // 1. 人
    const found = await gql<{
      people: { edges: { node: { id: string; companyId: string | null } }[] };
    }>(
      `query ($email: String!) {
        people(filter: { emails: { primaryEmail: { ilike: $email } } }, first: 1) {
          edges { node { id companyId } }
        }
      }`,
      { email: escapeLike(input.email) },
    );
    let person = found.people.edges[0]?.node;

    // 2. 会社 (人を作る前に決めて、新しい人はその会社に入れる)
    stage = "company";
    let companyId = person?.companyId ?? null;
    if (input.company) {
      const companies = await gql<{
        companies: { edges: { node: { id: string } }[] };
      }>(
        `query ($name: String!) {
          companies(filter: { name: { ilike: $name } }, first: 1) {
            edges { node { id } }
          }
        }`,
        { name: escapeLike(input.company) },
      );
      companyId =
        companies.companies.edges[0]?.node.id ??
        (
          await gql<{ createCompany: { id: string } }>(
            `mutation ($data: CompanyCreateInput!) { createCompany(data: $data) { id } }`,
            { data: { name: input.company } },
          )
        ).createCompany.id;
    }

    stage = "person";
    if (!person) {
      const created = await gql<{ createPerson: { id: string } }>(
        `mutation ($data: PersonCreateInput!) { createPerson(data: $data) { id } }`,
        {
          data: {
            name: { firstName: input.name, lastName: "" },
            emails: { primaryEmail: input.email },
            ...(companyId ? { companyId } : {}),
          },
        },
      );
      person = { id: created.createPerson.id, companyId };
    }

    // 3. お問い合わせ
    stage = "inquiry";
    const inquiry = await gql<{ createInquiry: { id: string } }>(
      `mutation ($data: InquiryCreateInput!) { createInquiry(data: $data) { id } }`,
      {
        data: {
          name: input.name,
          email: { primaryEmail: input.email },
          companyName: input.company,
          message: input.message,
          lang: input.lang === "en" ? "EN" : "JA",
          ip: input.ip ?? "",
          notification: input.notification,
          personId: person.id,
          ...(companyId ? { companyId } : {}),
        },
      },
    );
    const inquiryId = inquiry.createInquiry.id;

    // 4. タスク
    let taskCreated = false;
    try {
      const task = await gql<{ createTask: { id: string } }>(
        `mutation ($data: TaskCreateInput!) { createTask(data: $data) { id } }`,
        {
          data: {
            title: `お問い合わせに返信する: ${input.name}`,
            status: "TODO",
            bodyV2: {
              markdown:
                "doany.io のお問い合わせフォームから届いた。中身はつながっている「お問い合わせ」を見る。",
            },
            ...(env.assigneeId ? { assigneeId: env.assigneeId } : {}),
          },
        },
      );
      await gql(
        `mutation ($data: [TaskTargetCreateInput!]!) { createTaskTargets(data: $data) { id } }`,
        {
          data: [
            { taskId: task.createTask.id, targetInquiryId: inquiryId },
            { taskId: task.createTask.id, targetPersonId: person.id },
          ],
        },
      );
      taskCreated = true;
    } catch (e) {
      console.warn(
        `contact: Twenty にタスクを作れなかった (${e instanceof Error ? e.message : "error"})`,
      );
    }
    return { ok: true, inquiryId, taskCreated };
  } catch (e) {
    console.error(
      `contact: Twenty に記録できなかった (${stage}: ${e instanceof Error ? e.message : "error"})`,
    );
    return { ok: false, stage };
  }
}
