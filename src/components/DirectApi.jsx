import { useEffect, useRef, useState } from "preact/hooks";
import { DEFAULT_ENDPOINT, sendDirectChat, validateEndpoint } from "../api/directClient.js";
import { clearRuns, deleteRun, listRuns, saveRun } from "../api/localHistory.js";
import { pendingDirectPrompt, sessionApiKey } from "../api/memory.js";

function readSetting(key, fallback) {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

function writeSetting(key, value) {
  try { localStorage.setItem(key, value); } catch { /* private mode */ }
}

export function DirectApi() {
  const [endpoint, setEndpoint] = useState(() => readSetting("zgpaper-api-endpoint", DEFAULT_ENDPOINT));
  const [model, setModel] = useState(() => readSetting("zgpaper-api-model", ""));
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [usage, setUsage] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [saveLocally, setSaveLocally] = useState(true);
  const [runs, setRuns] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const controllerRef = useRef(null);
  const apiKey = sessionApiKey.value;

  useEffect(() => {
    if (pendingDirectPrompt.value) {
      setPrompt(pendingDirectPrompt.value);
      pendingDirectPrompt.value = "";
    }
    listRuns().then(setRuns).catch((err) => setNotice(err.message));
    return () => controllerRef.current?.abort();
  }, []);

  let destination = "未填写有效地址";
  try { destination = new URL(validateEndpoint(endpoint)).host; } catch { /* shown on send */ }

  function updateEndpoint(value) {
    setEndpoint(value);
    writeSetting("zgpaper-api-endpoint", value);
    setConfirmed(false);
  }

  function updateModel(value) {
    setModel(value);
    writeSetting("zgpaper-api-model", value);
  }

  async function handleSend() {
    setError("");
    setNotice("");
    if (!confirmed) {
      setError("请先确认请求地址确实属于目标模型服务商。");
      return;
    }
    let providerHost;
    try {
      providerHost = new URL(validateEndpoint(endpoint)).host;
    } catch (err) {
      setError(err.message);
      return;
    }
    const controller = new AbortController();
    controllerRef.current = controller;
    setBusy(true);
    setAnswer("");
    setUsage(null);
    try {
      const result = await sendDirectChat({
        endpoint, model, apiKey: sessionApiKey.value, prompt, signal: controller.signal,
      });
      setAnswer(result.answer);
      setUsage(result.usage);
      if (saveLocally) {
        try {
          await saveRun({
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            providerHost,
            model: model.trim(),
            prompt: prompt.trim(),
            answer: result.answer,
            usage: result.usage,
          });
          setRuns(await listRuns());
        } catch (err) {
          setNotice(`回答已收到，但保存到本机失败：${err.message}`);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      controllerRef.current = null;
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    try { await deleteRun(id); setRuns(await listRuns()); } catch (err) { setError(err.message); }
  }

  async function handleClear() {
    if (!window.confirm("删除此浏览器中保存的全部 API 使用记录？此操作无法撤销。")) return;
    try { await clearRuns(); setRuns([]); setNotice("本机记录已清空。"); } catch (err) { setError(err.message); }
  }

  async function copyAnswer() {
    try { await navigator.clipboard.writeText(answer); setNotice("回答已复制。"); }
    catch { setError("复制失败，请手动选择回答文本。"); }
  }

  return (
    <div className="direct-api stagger">
      <div className="direct-hero">
        <div className="direct-eyebrow">BYOK · 自带密钥</div>
        <h3>浏览器直连模型</h3>
        <p>你填写密钥和接口地址，点击发送后，浏览器直接向该地址请求。本站不设代理服务器。</p>
      </div>

      <div className="direct-note" role="note">
        <strong>数据去向</strong>：密钥与本次提示词会发送到你确认的模型服务商；该服务商可能按自己的规则记录请求。本站仅在当前页面内存中保留密钥，刷新即清除。成功请求的提示词和回答默认只保存在本机浏览器，可在下方关闭或删除。
      </div>

      <div className="card direct-card">
        <div className="section-title">1 · 连接设置</div>
        <div className="direct-protocol">OpenAI 标准接口 · Chat Completions</div>
        <div className="field">
          <label htmlFor="direct-endpoint">完整 API 地址</label>
          <input id="direct-endpoint" type="url" spellcheck="false" value={endpoint}
            onInput={(event) => updateEndpoint(event.currentTarget.value)}
            placeholder="https://服务商域名/.../chat/completions" />
          <div className="direct-help">只接受 HTTPS 且以 /chat/completions 结尾的地址。不会自动切换到代理。</div>
        </div>
        <div className="direct-grid">
          <div className="field">
            <label htmlFor="direct-model">模型 ID</label>
            <input id="direct-model" value={model} spellcheck="false"
              onInput={(event) => updateModel(event.currentTarget.value)}
              placeholder="从服务商模型列表复制准确 ID" />
          </div>
          <div className="field">
            <label htmlFor="direct-key">API 密钥（仅本页内存）</label>
            <input id="direct-key" type="password" value={apiKey} autocomplete="off"
              onInput={(event) => { sessionApiKey.value = event.currentTarget.value; }}
              placeholder="粘贴你的专用 API 密钥" />
          </div>
        </div>
        <div className="direct-destination">本次请求目的地：<strong>{destination}</strong></div>
        <label className="direct-check">
          <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.currentTarget.checked)} />
          <span>我已核对这个域名属于目标服务商，了解密钥和提示词会直接发给它。</span>
        </label>
        <button className="btn direct-clear-key" type="button" onClick={() => { sessionApiKey.value = ""; setNotice("本页密钥已清除。"); }}>
          清除本页密钥
        </button>
      </div>

      <div className="card direct-card">
        <div className="section-title">2 · 提示词与回答</div>
        <div className="field">
          <label htmlFor="direct-prompt">将发送的提示词</label>
          <textarea id="direct-prompt" rows={10} value={prompt}
            onInput={(event) => setPrompt(event.currentTarget.value)}
            placeholder="先在“生成提示词”页创建，再点“在本页使用”；也可以直接粘贴提示词。" />
        </div>
        <label className="direct-check">
          <input type="checkbox" checked={saveLocally} onChange={(event) => setSaveLocally(event.currentTarget.checked)} />
          <span>把本次提示词、回答及用量信息保存在此浏览器（不保存密钥）</span>
        </label>
        <div className="direct-actions">
          <button className="btn-primary" type="button" disabled={busy} onClick={handleSend}>
            {busy ? "等待模型回答…" : "直接发送给目标服务商"}
          </button>
          {busy && <button className="btn" type="button" onClick={() => controllerRef.current?.abort()}>取消请求</button>}
        </div>
        {error && <div className="direct-error" role="alert">{error}</div>}
        {notice && <div className="direct-notice" role="status">{notice}</div>}
        {answer && (
          <div className="direct-result">
            <div className="direct-result-head">
              <strong>模型回答</strong>
              <button className="btn" type="button" onClick={copyAnswer}>复制回答</button>
            </div>
            <pre>{answer}</pre>
            {usage?.totalTokens != null && <div className="direct-help">服务商报告的 Token 用量：{usage.totalTokens}</div>}
          </div>
        )}
      </div>

      <div className="card direct-card">
        <div className="direct-result-head">
          <div className="section-title">3 · 本机使用记录</div>
          {runs.length > 0 && <button className="btn" type="button" onClick={handleClear}>清空全部</button>}
        </div>
        <p className="direct-help">记录保存在当前浏览器的 IndexedDB。其他设备看不到；清理浏览器站点数据也会删除记录。关闭上面的保存选项后，新请求不留本机记录。</p>
        {runs.length === 0 ? <p className="direct-empty">暂无本机记录。</p> : (
          <div className="direct-history">
            {runs.map((run) => (
              <div className="direct-history-item" key={run.id}>
                <div><strong>{run.model}</strong> · {run.providerHost} · {new Date(run.createdAt).toLocaleString()}</div>
                <p>{run.prompt.slice(0, 120)}{run.prompt.length > 120 ? "…" : ""}</p>
                <div className="direct-actions">
                  <button className="btn" type="button" onClick={() => { setPrompt(run.prompt); setAnswer(run.answer); setUsage(run.usage); window.scrollTo({ top: 0, behavior: "smooth" }); }}>查看并复用</button>
                  <button className="btn" type="button" onClick={() => handleDelete(run.id)}>删除</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <details className="card direct-card direct-guide">
        <summary>详细教程 · 从申请密钥到排查连接问题</summary>
        <ol>
          <li><strong>申请专用密钥。</strong>在目标模型服务商官网开通 API，创建一个单独用于本站的密钥。优先设置较小的额度、使用范围和有效期。OpenAI 用户可从 <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">官方密钥页面</a>创建。</li>
          <li><strong>填写完整接口地址。</strong>官方 OpenAI 示例为 <code>https://api.openai.com/v1/chat/completions</code>。使用相同协议的服务请查其官方文档。先核对域名，再勾选确认框。</li>
          <li><strong>填写模型 ID。</strong>从服务商当前模型列表复制准确名称；ChatGPT 订阅与 API 额度通常分开管理，具体以服务商账单页面为准。</li>
          <li><strong>粘贴密钥并发送。</strong>先使用一条不含敏感资料的短提示词。每次点击发送都可能产生 API 费用；本站没有测试连接时使用免费代理。</li>
          <li><strong>管理本机记录。</strong>可关闭本机保存、逐条删除或清空全部。密钥不会进入记录；刷新页面后需重新输入。</li>
        </ol>
        <p><strong>连接失败：</strong>401 通常是密钥问题，404 常见于地址或模型 ID，429 可能是额度或限流。若出现 CORS / 网络错误，说明浏览器无法直接使用该服务商的接口；本站不会绕道自己的服务器。请换用服务商明确支持浏览器直连的接口，或继续使用“复制提示词”模式。</p>
        <p><strong>安全边界：</strong>浏览器页面无法像受信任后端那样保护长期密钥。站点托管方负责提供页面代码，浏览器扩展、设备环境和服务商自身的记录策略也不在本站控制内。请只使用专用、限额、可撤销的密钥；不要输入需要长期保密的主密钥。更多说明见仓库中的 API 直连使用指南。</p>
      </details>
    </div>
  );
}
