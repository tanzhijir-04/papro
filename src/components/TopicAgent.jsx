import { signal } from "@preact/signals";
import { useEffect, useRef, useState } from "preact/hooks";
import { DEFAULT_ENDPOINT, sendChatMessages, validateEndpoint } from "../api/directClient.js";
import { buildTopicMessages, INITIAL_REQUEST } from "../api/topicAgent.js";
import { sessionApiKey } from "../api/memory.js";
import { currentTab, discipline, paperTitle, paperType, researchDir, researchQ } from "../store.js";

const topicSession = signal({
  initialized: false,
  draft: {
    discipline: "",
    interests: "",
    paperType: "课程论文",
    materials: "",
    methods: "",
    constraints: "",
  },
  turns: [],
  chosenTitle: "",
  chosenQuestion: "",
});

function readSetting(key, fallback = "") {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

const SUGGESTIONS = [
  "请帮我把最推荐的题目缩小到课程论文能完成的范围。",
  "请比较这三个选题需要的资料，并指出最可能卡住的地方。",
  "请把我偏好的方向整理成题目、研究问题和三步研究路径。",
];

export function TopicAgent() {
  const session = topicSession.value;
  const { draft, turns } = session;
  const endpoint = readSetting("zgpaper-api-endpoint", DEFAULT_ENDPOINT);
  const model = readSetting("zgpaper-api-model");
  const hasKey = Boolean(sessionApiKey.value.trim());
  let destination = "地址无效";
  try { destination = new URL(validateEndpoint(endpoint)).host; } catch { /* validated on send */ }

  const [confirmed, setConfirmed] = useState(false);
  const [followup, setFollowup] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const controllerRef = useRef(null);

  useEffect(() => {
    if (!topicSession.value.initialized) {
      topicSession.value = {
        ...topicSession.value,
        initialized: true,
        draft: {
          ...topicSession.value.draft,
          discipline: discipline.value,
          interests: researchDir.value,
          paperType: paperType.value,
        },
      };
    }
    return () => controllerRef.current?.abort();
  }, []);

  function updateDraft(field, value) {
    topicSession.value = { ...topicSession.value, draft: { ...topicSession.value.draft, [field]: value } };
  }

  async function run(request) {
    if (busy) return;
    setError("");
    setNotice("");
    if (!draft.discipline.trim() && !draft.interests.trim()) {
      setError("请先填写学科或感兴趣的研究方向。");
      return;
    }
    if (!model.trim() || !hasKey) {
      setError("请先到“API 直连”填写模型 ID 和本页 API 密钥。");
      return;
    }
    if (!confirmed) {
      setError("请先核对并确认本次请求的目标域名。");
      return;
    }
    try { validateEndpoint(endpoint); } catch (err) { setError(err.message); return; }
    if (!request.trim()) {
      setError("请先写下想进一步讨论的问题。");
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setBusy(true);
    try {
      const result = await sendChatMessages({
        endpoint, model, apiKey: sessionApiKey.value,
        messages: buildTopicMessages(draft, turns, request),
        signal: controller.signal,
      });
      topicSession.value = {
        ...topicSession.value,
        turns: [...turns, { role: "user", content: request }, { role: "assistant", content: result.answer }],
      };
      setFollowup("");
    } catch (err) {
      setError(err.message);
    } finally {
      controllerRef.current = null;
      setBusy(false);
    }
  }

  function resetConversation() {
    if (busy) controllerRef.current?.abort();
    if (turns.length && !window.confirm("清空当前选题讨论？这段对话只在本页内存中，清空后无法恢复。")) return;
    topicSession.value = { ...topicSession.value, turns: [], chosenTitle: "", chosenQuestion: "" };
    setFollowup("");
    setError("");
    setNotice("已清空讨论，可以修改背景后重新开始。");
  }

  function useTopic() {
    const title = topicSession.value.chosenTitle.trim();
    if (!title) { setError("请先填写确定采用的论文题目。"); return; }
    paperTitle.value = title;
    if (draft.discipline.trim()) discipline.value = draft.discipline.trim();
    if (draft.interests.trim()) researchDir.value = draft.interests.trim();
    if (draft.paperType.trim()) paperType.value = draft.paperType.trim();
    if (topicSession.value.chosenQuestion.trim()) researchQ.value = topicSession.value.chosenQuestion.trim();
    setError("");
    setNotice("题目和已填写的研究信息已带入“论文参数”。");
  }

  return (
    <div className="topic-agent direct-api stagger">
      <div className="direct-hero">
        <div className="direct-eyebrow">选题 · 比较 · 收敛</div>
        <h3>论文选题助手</h3>
        <p>从你的兴趣和可用资料出发，讨论可执行的研究题目。每一步都由你确认；本站不提供文献或数据核验。</p>
      </div>

      <div className="direct-note" role="note">
        使用现有的 OpenAI 标准 Chat Completions 直连设置。你的背景与最近 5 轮对话会直接发给目标模型服务商；本站不设中转。每次请求可能产生 API 费用。讨论仅在当前页面内存中保留，刷新即清除。服务商仍可能按其规则记录请求。
      </div>

      <div className="card direct-card topic-connection">
        <div className="direct-result-head">
          <div className="section-title">1 · 检查连接</div>
          <button type="button" className="btn" onClick={() => { currentTab.value = "api"; }}>打开 API 直连设置</button>
        </div>
        <div className="topic-connection-grid">
          <div><span>接口协议</span><strong>OpenAI 标准 · Chat Completions</strong></div>
          <div><span>请求域名</span><strong>{destination}</strong></div>
          <div><span>模型 ID</span><strong>{model || "尚未填写"}</strong></div>
          <div><span>本页密钥</span><strong>{hasKey ? "已填写" : "尚未填写"}</strong></div>
        </div>
        <label className="direct-check">
          <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.currentTarget.checked)} />
          <span>我已核对请求域名，了解密钥和选题对话会直接发送给该服务商。</span>
        </label>
      </div>

      <div className="card direct-card">
        <div className="section-title">2 · 告诉助手你的情况</div>
        <p className="direct-help topic-intro">至少填写学科或兴趣。已开始讨论后，背景会锁定；可清空讨论再修改。</p>
        <div className="topic-fields">
          <div className="field"><label htmlFor="topic-discipline">学科 / 专业</label><input id="topic-discipline" type="text" value={draft.discipline} disabled={turns.length > 0} maxLength={120} onInput={(event) => updateDraft("discipline", event.currentTarget.value)} placeholder="例如：教育学、公共管理" /></div>
          <div className="field"><label htmlFor="topic-type">论文类型</label><select id="topic-type" value={draft.paperType} disabled={turns.length > 0} onChange={(event) => updateDraft("paperType", event.currentTarget.value)}><option>课程论文</option><option>毕业论文</option><option>期刊论文</option><option>会议论文</option><option>研究报告</option><option>学位论文</option></select></div>
          <div className="field topic-wide"><label htmlFor="topic-interests">感兴趣的现象或方向</label><textarea id="topic-interests" rows={3} value={draft.interests} disabled={turns.length > 0} maxLength={1200} onInput={(event) => updateDraft("interests", event.currentTarget.value)} placeholder="你想研究什么？尽量说清人群、地区、时间或具体问题。" /></div>
          <div className="field topic-wide"><label htmlFor="topic-materials">手头已有的材料 / 数据</label><textarea id="topic-materials" rows={3} value={draft.materials} disabled={turns.length > 0} maxLength={1200} onInput={(event) => updateDraft("materials", event.currentTarget.value)} placeholder="例如：访谈机会、公开统计、课程阅读材料；没有也可以留空。" /></div>
          <div className="field"><label htmlFor="topic-methods">希望使用的方法</label><input id="topic-methods" type="text" value={draft.methods} disabled={turns.length > 0} maxLength={240} onInput={(event) => updateDraft("methods", event.currentTarget.value)} placeholder="如：案例分析、访谈、问卷" /></div>
          <div className="field"><label htmlFor="topic-constraints">时间与其他限制</label><input id="topic-constraints" type="text" value={draft.constraints} disabled={turns.length > 0} maxLength={320} onInput={(event) => updateDraft("constraints", event.currentTarget.value)} placeholder="如：两周完成、只能用公开资料" /></div>
        </div>
        <div className="direct-actions">
          {turns.length === 0 && <button type="button" className="btn-primary" disabled={busy} onClick={() => run(INITIAL_REQUEST)}>{busy ? "正在分析…" : "生成 3 个选题建议"}</button>}
          {busy && <button type="button" className="btn" onClick={() => controllerRef.current?.abort()}>取消请求</button>}
          {turns.length > 0 && <button type="button" className="btn" disabled={busy} onClick={resetConversation}>清空并重新开始</button>}
        </div>
      </div>

      {turns.length > 0 && <div className="card direct-card">
        <div className="section-title">3 · 比较并继续追问</div>
        <div className="topic-turns" aria-live="polite">
          {turns.map((turn, index) => <div className={`topic-turn ${turn.role}`} key={index}>
            <strong>{turn.role === "assistant" ? "选题助手" : "你"}</strong>
            <pre>{turn.content}</pre>
          </div>)}
        </div>
        <div className="topic-suggestions">
          {SUGGESTIONS.map((suggestion) => <button type="button" className="btn" key={suggestion} onClick={() => setFollowup(suggestion)}>{suggestion}</button>)}
        </div>
        <div className="field"><label htmlFor="topic-followup">继续讨论</label><textarea id="topic-followup" rows={4} value={followup} maxLength={3000} onInput={(event) => setFollowup(event.currentTarget.value)} placeholder="例如：我更喜欢第二个题目，但拿不到访谈对象。能改用公开资料吗？" /></div>
        <div className="direct-actions"><button type="button" className="btn-primary" disabled={busy} onClick={() => run(followup)}>{busy ? "正在回复…" : "发送追问"}</button>{busy && <button type="button" className="btn" onClick={() => controllerRef.current?.abort()}>取消请求</button>}</div>
      </div>}

      {turns.length > 0 && <div className="card direct-card">
        <div className="section-title">4 · 确定题目并带入论文参数</div>
        <p className="direct-help topic-intro">请自己核对建议中的资料与可行性，再填写最终采用的题目。不会自动采用模型输出。</p>
        <div className="field"><label htmlFor="topic-final-title">确定的论文题目</label><input id="topic-final-title" type="text" value={session.chosenTitle} maxLength={240} onInput={(event) => { topicSession.value = { ...topicSession.value, chosenTitle: event.currentTarget.value }; }} placeholder="填写你最终决定使用的题目" /></div>
        <div className="field"><label htmlFor="topic-final-question">核心研究问题（可选）</label><textarea id="topic-final-question" rows={3} value={session.chosenQuestion} maxLength={800} onInput={(event) => { topicSession.value = { ...topicSession.value, chosenQuestion: event.currentTarget.value }; }} placeholder="用一句话写出论文要回答的问题" /></div>
        <div className="direct-actions"><button type="button" className="btn-primary" onClick={useTopic}>带入论文参数</button><button type="button" className="btn" onClick={() => { currentTab.value = "params"; }}>查看论文参数</button></div>
      </div>}

      {error && <div className="direct-error" role="alert">{error}</div>}
      {notice && <div className="direct-notice" role="status">{notice}</div>}
    </div>
  );
}
