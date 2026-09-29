import test from "node:test";
import assert from "node:assert/strict";
import { buildTopicMessages, INITIAL_REQUEST } from "./topicAgent.js";

const draft = {
  discipline: "教育学",
  interests: "乡村学校的数字教学",
  paperType: "课程论文",
  materials: "公开政策文本",
  methods: "案例分析",
  constraints: "两周完成",
};

test("topic agent includes research constraints and an explicit verification boundary", () => {
  const messages = buildTopicMessages(draft);
  assert.deepEqual(messages.map((message) => message.role), ["system", "user", "user"]);
  assert.match(messages[0].content, /不要编造参考文献/);
  assert.match(messages[1].content, /公开政策文本/);
  assert.match(messages[1].content, /两周完成/);
  assert.equal(messages[2].content, INITIAL_REQUEST);
});

test("follow-up preserves recent conversation and caps transmitted history", () => {
  const turns = Array.from({ length: 14 }, (_, index) => ({
    role: index % 2 ? "assistant" : "user",
    content: `第 ${index} 条`,
  }));
  const messages = buildTopicMessages(draft, turns, "请收窄范围");
  assert.equal(messages.length, 13);
  assert.equal(messages[2].content, "第 4 条");
  assert.equal(messages.at(-1).content, "请收窄范围");
});
