import test from "node:test";
import assert from "node:assert/strict";
import { sendDirectChat, validateEndpoint } from "./directClient.js";

const endpoint = "https://api.openai.com/v1/chat/completions";

test("only complete HTTPS Chat Completions URLs are accepted", () => {
  assert.equal(validateEndpoint(endpoint), endpoint);
  for (const value of [
    "http://api.openai.com/v1/chat/completions",
    "https://name:pass@api.openai.com/v1/chat/completions",
    `${endpoint}?key=secret`,
    `${endpoint}#secret`,
    "https://api.openai.com/v1/responses",
  ]) {
    assert.throws(() => validateEndpoint(value));
  }
});

test("sends one request directly to the configured endpoint", async () => {
  const calls = [];
  const result = await sendDirectChat({
    endpoint,
    model: "example-model",
    apiKey: "secret-key",
    prompt: "hello",
    fetchImpl: async (...args) => {
      calls.push(args);
      return {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: "world" } }],
          usage: { total_tokens: 12 },
        }),
      };
    },
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], endpoint);
  assert.equal(calls[0][1].method, "POST");
  assert.equal(calls[0][1].credentials, "omit");
  assert.equal(calls[0][1].redirect, "error");
  assert.equal(calls[0][1].referrerPolicy, "no-referrer");
  assert.equal(calls[0][1].headers.Authorization, "Bearer secret-key");
  assert.deepEqual(JSON.parse(calls[0][1].body), {
    model: "example-model",
    messages: [{ role: "user", content: "hello" }],
    stream: false,
  });
  assert.equal(result.answer, "world");
  assert.equal(result.usage.totalTokens, 12);
});

test("network errors never trigger a proxy fallback or expose the key", async () => {
  let calls = 0;
  await assert.rejects(
    sendDirectChat({
      endpoint,
      model: "example-model",
      apiKey: "secret-key",
      prompt: "hello",
      fetchImpl: async () => { calls++; throw new Error("secret-key in provider error"); },
    }),
    (error) => error.message.includes("CORS") && !error.message.includes("secret-key"),
  );
  assert.equal(calls, 1);
});

test("HTTP failures do not show provider response bodies", async () => {
  await assert.rejects(
    sendDirectChat({
      endpoint,
      model: "example-model",
      apiKey: "secret-key",
      prompt: "hello",
      fetchImpl: async () => ({ ok: false, status: 401, text: async () => "secret-key" }),
    }),
    (error) => error.message.includes("401") && !error.message.includes("secret-key"),
  );
});
