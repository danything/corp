// server/twenty.ts: 問い合わせを Twenty の GraphQL で記録する。fetch を差し替えて、送った中身と順番を見る
import { beforeEach, describe, expect, test } from "bun:test";

import { escapeLike, recordInquiry } from "../server/twenty";

const ENV = { url: "http://twenty.test:3000", apiKey: "key", assigneeId: "m1" };

interface Call {
  op: string;
  variables: Record<string, unknown>;
  auth: string | null;
}

let calls: Call[];
/** 操作の名前 (people・createPerson など) ごとの返す値。関数なら投げる */
let replies: Record<string, unknown>;

const opName = (query: string) =>
  /(?:query|mutation)[^{]*\{\s*(\w+)/.exec(query)?.[1] ?? "?";

const fakeFetch = (async (
  input: string | URL | Request,
  init?: RequestInit,
) => {
  expect(String(input)).toBe("http://twenty.test:3000/graphql");
  const { query, variables } = JSON.parse(String(init?.body));
  const op = opName(query);
  calls.push({
    op,
    variables,
    auth: new Headers(init?.headers).get("authorization"),
  });
  const reply = replies[op];
  if (reply instanceof Error) throw reply;
  if (reply instanceof Response) return reply;
  if (reply === undefined) throw new Error(`unexpected ${op}`);
  return Response.json({ data: { [op]: reply } });
}) as typeof fetch;

const input = {
  name: "山田 太郎",
  email: "taro@example.com",
  company: "",
  message: "見積もりをお願いします。",
  lang: "ja" as const,
  ip: "203.0.113.1",
  notification: "**doany.io のお問い合わせ**",
};

beforeEach(() => {
  calls = [];
  replies = {
    people: { edges: [] },
    companies: { edges: [] },
    createCompany: { id: "c-new" },
    createPerson: { id: "p-new" },
    createInquiry: { id: "i1" },
    createTask: { id: "t1" },
    createTaskTargets: [{ id: "tt1" }, { id: "tt2" }],
  };
});

describe("recordInquiry", () => {
  test("知らない人は作り、お問い合わせとタスクを作る", async () => {
    const r = await recordInquiry(input, ENV, fakeFetch);
    expect(r).toEqual({ ok: true, inquiryId: "i1", taskCreated: true });
    expect(calls.map((c) => c.op)).toEqual([
      "people",
      "createPerson",
      "createInquiry",
      "createTask",
      "createTaskTargets",
    ]);
    expect(calls.every((c) => c.auth === "Bearer key")).toBe(true);
    expect(calls[1]?.variables.data).toEqual({
      name: { firstName: "山田 太郎", lastName: "" },
      emails: { primaryEmail: "taro@example.com" },
    });
    expect(calls[2]?.variables.data).toEqual({
      name: "山田 太郎",
      email: { primaryEmail: "taro@example.com" },
      companyName: "",
      message: "見積もりをお願いします。",
      lang: "JA",
      ip: "203.0.113.1",
      notification: "**doany.io のお問い合わせ**",
      personId: "p-new",
    });
    expect(calls[3]?.variables.data).toMatchObject({
      status: "TODO",
      assigneeId: "m1",
    });
    expect(calls[4]?.variables.data).toEqual([
      { taskId: "t1", targetInquiryId: "i1" },
      { taskId: "t1", targetPersonId: "p-new" },
    ]);
  });

  test("知っている人はそのまま使い、その人の会社につなぐ", async () => {
    replies.people = { edges: [{ node: { id: "p1", companyId: "c1" } }] };
    const r = await recordInquiry(input, ENV, fakeFetch);
    expect(r.ok).toBe(true);
    expect(calls.map((c) => c.op)).not.toContain("createPerson");
    expect(calls[1]?.variables.data).toMatchObject({
      personId: "p1",
      companyId: "c1",
    });
  });

  test("会社の欄があれば名前で探し、無ければ作って、新しい人もそこに入れる", async () => {
    const r = await recordInquiry(
      { ...input, company: "100%_Corp" },
      ENV,
      fakeFetch,
    );
    expect(r.ok).toBe(true);
    expect(calls.map((c) => c.op).slice(0, 4)).toEqual([
      "people",
      "companies",
      "createCompany",
      "createPerson",
    ]);
    // 入力の % と _ は文字どおりに比べる
    expect(calls[1]?.variables.name).toBe("100\\%\\_Corp");
    expect(calls[2]?.variables.data).toEqual({ name: "100%_Corp" });
    expect(calls[3]?.variables.data).toMatchObject({ companyId: "c-new" });
    expect(calls[4]?.variables.data).toMatchObject({ companyId: "c-new" });
  });

  test("会社が見つかれば作らない", async () => {
    replies.companies = { edges: [{ node: { id: "c2" } }] };
    await recordInquiry({ ...input, company: "Acme" }, ENV, fakeFetch);
    expect(calls.map((c) => c.op)).not.toContain("createCompany");
    expect(
      calls.find((c) => c.op === "createInquiry")?.variables.data,
    ).toMatchObject({ companyId: "c2" });
  });

  test("お問い合わせを作れなければ失敗 (どこで止まったか)", async () => {
    replies.createInquiry = new Response("", { status: 500 });
    expect(await recordInquiry(input, ENV, fakeFetch)).toEqual({
      ok: false,
      stage: "inquiry",
    });
  });

  test("Twenty に届かなければ失敗", async () => {
    replies.people = new TypeError("fetch failed");
    expect(await recordInquiry(input, ENV, fakeFetch)).toEqual({
      ok: false,
      stage: "person",
    });
  });

  test("GraphQL のエラーも失敗", async () => {
    replies.people = Response.json({ errors: [{ message: "Forbidden" }] });
    expect((await recordInquiry(input, ENV, fakeFetch)).ok).toBe(false);
  });

  test("タスクを作れなくても、お問い合わせができていれば成功", async () => {
    replies.createTask = new Response("", { status: 500 });
    expect(await recordInquiry(input, ENV, fakeFetch)).toEqual({
      ok: true,
      inquiryId: "i1",
      taskCreated: false,
    });
  });
});

test("escapeLike", () => {
  expect(escapeLike("a%b_c\\d")).toBe("a\\%b\\_c\\\\d");
});
