import { useSignal } from "@preact/signals";
import {
  paperTitle, paperVenue, paperType, paperTypeCustom, citationFmt,
  version, discipline, researchDir, audience, audienceCustom,
  coreArg, researchQ, writingStyle, constraint, totalWords, sections,
  showToast,
} from "../store.js";

function getPaperType() {
  return paperType.value === "__custom__"
    ? paperTypeCustom.value.trim() || "【待填写】"
    : paperType.value;
}

function getAudience() {
  return audience.value === "__custom__"
    ? audienceCustom.value.trim() || "【待填写】"
    : audience.value;
}

function buildCheckList() {
  const checks = [
    { label: "论文题目", val: paperTitle.value.trim(), required: false },
    { label: "核心论点", val: coreArg.value.trim(), required: true },
    { label: "学科领域", val: discipline.value.trim(), required: false },
    { label: "论文类型", val: getPaperType(), required: false },
    { label: "大纲章节", val: sections.value.length > 0 ? "已配置" : "", required: false },
  ];
  return checks.map((c) => {
    const ok = !!c.val;
    const color = ok ? "var(--an-success)" : (c.required ? "var(--an-error)" : "var(--an-warning)");
    const icon = ok ? "ti-circle-check" : (c.required ? "ti-circle-x" : "ti-circle-dashed");
    return { ...c, ok, color, icon };
  });
}

function generatePrompt() {
  const v = version.value;
  const title = paperTitle.value.trim() || "【待填写】";
  const type = getPaperType();
  const disc = discipline.value.trim() || "【待填写】";
  const rDir = researchDir.value.trim() || "【待填写】";
  const aud = getAudience();
  const venue = paperVenue.value.trim() || "【待填写】";
  const citFmt = citationFmt.value;
  const cArg = coreArg.value.trim() || "【待填写核心论点】";
  const rQ = researchQ.value.trim();
  const wStyle = writingStyle.value;
  const cons = constraint.value.trim();
  const tw = totalWords.value;

  const outlineText = sections.value.map((s, i) => `  ${i + 1}. ${s.name}（${s.words.toLocaleString()}字）`).join("\n");

  const systemPrompt = v === "A"
    ? `你是一位资深中文学术写作专家，具备跨学科写作能力，熟悉中国高校及学术期刊的论文规范。\n你的写作准则：\n- 严格以用户提供的文献为引用依据，不得引用用户未提供的文献\n- 忠实呈现文献原意，不得歪曲或过度推断文献内容\n- 语言严谨、逻辑清晰、结构完整，符合中文学术写作惯例\n- 遇到文献不足以支撑某论点时，主动告知用户，而非捏造内容`
    : `你是一位资深中文学术写作专家，具备跨学科写作能力，熟悉中国高校及学术期刊的论文规范。\n你的写作准则：\n- 基于你的训练知识进行写作，语言严谨、逻辑清晰、结构完整\n- 参考文献只能列出你有高度把握真实存在的文献；凡存在不确定性，须在文献列表末尾附注免责声明\n- 不得捏造实验数据、调查结果或统计数字；用概括性表述替代不确定的具体数据\n- 遇到超出你知识边界的内容，主动说明，而非臆断填充`;

  const preWriting = `在开始写作之前，请先完成写前分析（200-400字），内容包括：
1. 论题解构：核心研究问题是什么？研究范围边界在哪里？
2. ${v === "A" ? "文献梳理：提供的文献能支撑哪些论点？哪些论点文献支撑不足？" : "知识评估：你对该论题的把握程度如何？哪些内容有高度确定性？"}
3. 逻辑框架：提出2-3个分论点，说明各节之间的递进逻辑
4. 字数规划：确认各章节字数分配是否合理
5. 默认假设：如信息有模糊之处，列出补充假设后直接继续写作，不要停下来询问`;

  const versionNote = v === "A"
    ? `\n\n【文献规则（版本A）】\n- 只能引用用户在"参考文献"区提供的文献\n- 若文献不足以支撑某论点，在写前分析中告知，正文用"已有研究表明"等概括性表述替代\n- 禁止虚构任何文献信息`
    : `\n\n【文献规则（版本B）】\n- 文献真实性分级：高确定性→正常引用；中确定性→标注[建议用户核实]；低确定性→禁止列入\n- 参考文献列表末尾必须附加免责声明：「本参考文献列表由AI根据训练知识生成，请在提交前通过中国知网、万方数据等数据库逐一核实」\n- 禁止捏造实验数据和统计数字`;

  const styleRules = `\n\n【语言风格规范】\n✅ 必须遵守：\n- 每段聚焦一个核心意思，首句为主题句\n- 逻辑连接词须体现真实逻辑关系（因果/转折/递进/并列）\n- 全文统一使用"本文""本研究"，不得与"我"混用\n- 专业术语首次出现须给出全称或定义\n- 数字超过两位用阿拉伯数字；百分比一律用阿拉伯数字\n\n❌ 严格禁止：\n- 空洞套语："综上所述""由此可见""不言而喻""众所周知"\n- 无效过渡："接下来本文将……""在上文分析的基础上……"\n- AI腔表达："值得注意的是""不可忽视的是""令人深思的是"\n- 捏造内容：虚构数据、实验结果、文献信息\n- 主观煽情："具有极其重要的意义""对人类文明产生不可估量的影响"`;

  const outputFmt = `\n\n【输出格式】\n请严格按以下顺序输出：\n════════════════════\n【写前分析】\n（约200-400字）\n════════════════════\n【正式论文】\n\n[标题]\n\n摘要\n（200-300字）\n关键词：词1；词2；词3\n\n${sections.value.filter(s => s.type !== "abstract").map((s, i) => `${i + 1} ${s.name}\n[正文，约${s.words}字]`).join("\n\n")}\n\n参考文献\n[按${citFmt}格式]${v === "B" ? "\n【文献说明】[附免责声明]" : ""}\n════════════════════`;

  return `## 系统角色

${systemPrompt}

---

## 任务指令

请根据以下论文信息，完成一篇完整的中文学术论文。

${preWriting}

---

## 论文基本信息

| 字段 | 内容 |
|------|------|
| 题目 | ${title} |
| 论文类型 | ${type} |
| 学科领域 | ${disc} |
| 研究方向 | ${rDir} |
| 目标字数 | ${parseInt(tw).toLocaleString()}字（不含参考文献）|
| 目标读者 | ${aud} |
| 提交场合 | ${venue} |
| 参考文献格式 | ${citFmt} |${cons ? `\n| 特殊限制 | ${cons} |` : ""}
| 版本 | 版本${v}（${v === "A" ? "用户自提供文献" : "AI知识写作，文献需核实"}）|

---

## 核心论点与写作方向

**核心论点：**
${cArg}
${rQ ? `\n**研究问题：**\n${rQ}` : ""}${wStyle ? `\n\n**写作风格倾向：** ${wStyle}` : ""}

---

## 大纲与字数规划

总字数：${parseInt(tw).toLocaleString()}字

${outlineText}

---
${versionNote}
${styleRules}
${outputFmt}`;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("已复制到剪贴板");
  });
}

export function GeneratePrompt() {
  const outputText = useSignal("");
  const showOutput = useSignal(false);
  const checks = buildCheckList();

  const handleGenerate = () => {
    const text = generatePrompt();
    outputText.value = text;
    showOutput.value = true;
  };

  return (
    <div className="stagger">
      {/* Check List */}
      <div className="card-subtle">
        <div className="section-title">配置检查</div>
        {checks.map((c, i) => (
          <div key={i} className="check-item" style={{ animation: `fadeUp 0.35s var(--ease-out) ${i * 50}ms both` }}>
            <i className={`ti ${c.icon} check-icon`} style={{ color: c.color }} aria-hidden="true"></i>
            <span className="check-label">{c.label}</span>
            <span className="check-val">
              {c.ok ? c.val : <span style={{ color: "var(--an-muted-soft)" }}>{c.required ? "必填" : "未填"}</span>}
            </span>
          </div>
        ))}
      </div>

      {/* Generate Button */}
      <button className="btn-primary" onClick={handleGenerate}>
        <i className="ti ti-sparkles" aria-hidden="true"></i> 生成提示词
      </button>

      {/* Output */}
      {showOutput.value && (
        <div>
          <div className="output-box">{outputText.value}</div>
          <div className="copy-row">
            <button className="btn" onClick={() => copyToClipboard(outputText.value)}>
              <i className="ti ti-copy" aria-hidden="true"></i> 复制全部
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
