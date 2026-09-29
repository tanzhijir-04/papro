export const DEFAULT_ENDPOINT = "https://api.openai.com/v1/chat/completions";

export function validateEndpoint(value) {
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("请输入完整的 HTTPS 请求地址。");
  }

  if (url.protocol !== "https:") {
    throw new Error("直连模式只允许 HTTPS 地址。");
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new Error("请求地址不能包含账号、密码、查询参数或片段。");
  }
  if (!url.pathname.endsWith("/chat/completions")) {
    throw new Error("请输入以 /chat/completions 结尾的完整请求地址。");
  }
  return url.href;
}

function responseError(status) {
  if (status === 401) return "认证失败（401）。请检查 API 密钥。";
  if (status === 403) return "服务商拒绝访问（403）。请检查密钥权限及服务商设置。";
  if (status === 404) return "接口或模型不存在（404）。请检查请求地址与模型 ID。";
  if (status === 429) return "请求受限（429）。请检查额度、账单或速率限制。";
  if (status >= 500) return `模型服务暂时不可用（${status}）。`;
  return `模型服务返回 HTTP ${status}。请检查接口、模型与请求格式。`;
}

export async function sendChatMessages({ endpoint, model, apiKey, messages, signal, fetchImpl = fetch }) {
  const url = validateEndpoint(endpoint);
  const cleanModel = model.trim();
  const cleanKey = apiKey.trim();
  if (!cleanModel) throw new Error("请填写模型 ID。");
  if (!cleanKey) throw new Error("请填写 API 密钥。");
  if (!Array.isArray(messages) || !messages.length || messages.some((item) =>
    !["system", "user", "assistant"].includes(item?.role) ||
    typeof item.content !== "string" || !item.content.trim()
  )) throw new Error("请先填写有效的对话内容。");

  let response;
  try {
    response = await fetchImpl(url, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      redirect: "error",
      referrerPolicy: "no-referrer",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cleanKey}`,
      },
      body: JSON.stringify({
        model: cleanModel,
        messages: messages.map(({ role, content }) => ({ role, content: content.trim() })),
        stream: false,
      }),
      signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") throw new Error("请求已取消。");
    throw new Error("浏览器无法直连该地址。可能是网络故障、证书问题或服务商未开放 CORS；本站不会改走代理服务器。");
  }

  if (!response.ok) throw new Error(responseError(response.status));
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("服务商返回了无法解析的响应。");
  }
  const content = data?.choices?.[0]?.message?.content;
  const answer = typeof content === "string"
    ? content
    : Array.isArray(content)
      ? content.filter((part) => part?.type === "text").map((part) => part.text || "").join("\n")
      : "";
  if (!answer.trim()) throw new Error("服务商没有返回可显示的文本。请检查模型或请求结果。");

  return {
    answer,
    usage: {
      promptTokens: Number.isFinite(data?.usage?.prompt_tokens) ? data.usage.prompt_tokens : null,
      completionTokens: Number.isFinite(data?.usage?.completion_tokens) ? data.usage.completion_tokens : null,
      totalTokens: Number.isFinite(data?.usage?.total_tokens) ? data.usage.total_tokens : null,
    },
  };
}

export function sendDirectChat({ prompt, ...options }) {
  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("请先填写或导入提示词。");
  }
  return sendChatMessages({ ...options, messages: [{ role: "user", content: prompt }] });
}
