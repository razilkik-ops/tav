import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import worker, { handleChatRequest } from "../worker/index.js";

test("proxies a validated conversation to DeepSeek without exposing the key", async () => {
  let upstreamRequest;
  const response = await handleChatRequest(
    new Request("https://example.test/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "Нужен промышленный насос" }] }),
    }),
    { DEEPSEEK_API_KEY: "secret-test-key" },
    async (url, init) => {
      upstreamRequest = { url, init, body: JSON.parse(init.body) };
      return Response.json({ choices: [{ message: { content: "Уточните рабочую точку и перекачиваемую среду." } }] });
    },
  );

  const responseBody = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(responseBody, { message: "Уточните рабочую точку и перекачиваемую среду." });
  assert.equal(upstreamRequest.url, "https://api.aiai.by/v1/chat/completions");
  assert.equal(upstreamRequest.init.headers.authorization, "Bearer secret-test-key");
  assert.equal(upstreamRequest.body.model, "deepseek-chat");
  assert.equal(upstreamRequest.body.messages.at(-1).content, "Нужен промышленный насос");
  assert.equal(JSON.stringify(responseBody).includes("secret-test-key"), false);
});

test("returns a safe error when the DeepSeek key is not configured", async () => {
  const response = await handleChatRequest(new Request("https://example.test/api/chat", { method: "POST", body: "{}" }));
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error.includes("Чат временно недоступен"), true);
});

test("rejects invalid chat history before contacting DeepSeek", async () => {
  let upstreamCalls = 0;
  const response = await handleChatRequest(
    new Request("https://example.test/api/chat", { method: "POST", body: JSON.stringify({ messages: [] }) }),
    { DEEPSEEK_API_KEY: "secret-test-key" },
    async () => {
      upstreamCalls += 1;
      return Response.json({});
    },
  );
  assert.equal(response.status, 400);
  assert.equal(upstreamCalls, 0);
});

test("serves existing static assets without a fallback", async () => {
  const calls = [];
  const response = await worker.fetch(new Request("https://example.test/assets/app.js"), {
    ASSETS: {
      fetch: async (request) => {
        calls.push(new URL(request.url).pathname);
        return new Response("asset", { status: 200 });
      },
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/assets/app.js"]);
});

test("falls back to index.html for an unknown app route", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://example.test/flow/step-two?source=share", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          calls.push(url.pathname + url.search);
          return new Response(url.pathname === "/index.html" ? "app" : "missing", {
            status: url.pathname === "/index.html" ? 200 : 404,
          });
        },
      },
    },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/flow/step-two?source=share", "/index.html"]);
});

test("does not turn missing API or write requests into the app shell", async () => {
  for (const request of [
    new Request("https://example.test/api/missing", { headers: { accept: "application/json" } }),
    new Request("https://example.test/flow", { method: "POST", headers: { accept: "text/html" } }),
  ]) {
    let calls = 0;
    const response = await worker.fetch(request, {
      ASSETS: {
        fetch: async () => {
          calls += 1;
          return new Response("missing", { status: 404 });
        },
      },
    });

    assert.equal(response.status, 404);
    assert.equal(calls, 1);
  }
});

test("emits the files required by Sites packaging", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));
});
