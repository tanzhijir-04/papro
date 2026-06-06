import { useState, useEffect } from "preact/hooks";
import { pendingText, currentTab, showToast } from "../store.js";
import { hzPatterns } from "../data/hzPatterns.js";

const DIMENSIONS = [
  { id: "logic", name: "逻辑结构", desc: "论文整体逻辑是否严密，各章节衔接是否自然，论证链条是否完整" },
  { id: "norms", name: "学术规范", desc: "引用格式、术语使用、学术表达是否符合规范" },
  { id: "language", name: "语言质量", desc: "语法准确性、表达流畅度、句式多样性" },
  { id: "aigc", name: "AIGC 痕迹检测", desc: "检测 24 种 AI 写作痕迹，评估文本的人类原创性" },
  { id: "argument", name: "论证充分性", desc: "论点是否有充分的证据支撑，数据/案例是否到位" },
  { id: "format", name: "格式规范", desc: "标题层级、图表编号、参考文献格式、页面布局" },
];

const LEVELS = [
  { id: "undergrad", name: "本科课程论文", desc: "3000-8000字，注重基础规范和结构完整性" },
  { id: "master", name: "硕士学位论文", desc: "3-5万字，要求研究方法严谨、创新点明确" },
  { id: "phd", name: "博士学位论文", desc: "8-15万字，要求理论深度和系统性贡献" },
  { id: "journal", name: "期刊投稿", desc: "按目标期刊要求，注重创新性和学术影响力" },
];

function buildAigcChecklist() {
  return hzPatterns.map((p) =>
    `- **#${p.id} ${p.name}**（${p.cat}）：${p.brief} — 关键词：${p.kw}`
  ).join("\n");
}

function generateReviewPrompt(level, dims, textInput) {
  const levelObj = LEVELS.find((l) => l.id === level);
  const selectedDims = DIMENSIONS.filter((d) => dims.includes(d.id));
  const includeAigc = dims.includes("aigc");

  const dimStandards = {
    logic: `### 逻辑结构审阅标准

- 论文是否有明确的核心论点？
- 各章节之间是否有清晰的逻辑递进关系？
- 引言是否有效引出研究问题？
- 文献综述是否为研究方法提供了充分的理论支撑？
- 研究方法是否与研究问题匹配？
- 结论是否回应了引言中提出的问题？
- 是否存在逻辑跳跃或自相矛盾之处？`,

    norms: `### 学术规范审阅标准

- 引用格式是否统一（如 GB/T 7714、APA）？
- 是否存在引用但未列入参考文献的情况？
- 参考文献是否存在于真实数据库中（建议通过知网/万方核实）？
- 专业术语使用是否准确、一致？
- 首次出现的专业术语是否给出了全称或定义？
- 是否使用了"本文""本研究"等恰当的学术主语？
- 数字、单位、公式的书写是否规范？`,

    language: `### 语言质量审阅标准

- 是否存在语法错误或拼写错误？
- 句式是否多样（避免连续相同长度的句子）？
- 段落是否有主题句，段落间是否有逻辑衔接词？
- 是否存在口语化或过于随意的表达？
- 用词是否精准，是否存在模糊或歧义表达？
- 中英文混排时，英文术语的使用是否规范？`,

    aigc: `### AIGC 痕迹检测清单

检测以下 24 种 AI 写作痕迹（基于维基百科 AI 写作特征指南）：

**内容模式（6 种）：**
${buildAigcChecklist().split("\n").filter((l) => l.includes("content")).join("\n")}

**语言语法（6 种）：**
${buildAigcChecklist().split("\n").filter((l) => l.includes("language")).join("\n")}

**风格模式（6 种）：**
${buildAigcChecklist().split("\n").filter((l) => l.includes("style")).join("\n")}

**交流模式（3 种）：**
${buildAigcChecklist().split("\n").filter((l) => l.includes("comm")).join("\n")}

**填充回避（3 种）：**
${buildAigcChecklist().split("\n").filter((l) => l.includes("filler")).join("\n")}

对每个检测到的模式，给出：
- 出现位置（章节/段落）
- 原文摘录
- 严重程度（🔴严重 / 🟡中等 / 🟢轻微）
- 修改建议`,

    argument: `### 论证充分性审阅标准

- 核心论点是否有足够的证据支撑？
- 数据/案例/文献引用是否充分且有代表性？
- 是否存在"以偏概全"或"过度推断"的情况？
- 对比分析是否全面（是否忽略了反面证据）？
- 实验/调查的方法论是否可靠？
- 结论是否被证据充分支撑，还是存在过度声明？`,

    format: `### 格式规范审阅标准

- 标题层级是否清晰（一/二/三级标题）？
- 图表是否有编号和标题？是否在正文中被引用？
- 参考文献格式是否统一且符合目标期刊/学校要求？
- 页边距、行距、字体字号是否符合规范？
- 摘要、关键词、致谢等附属部分是否完整？
- 目录是否与正文标题一致？`,
  };

  const dimSections = selectedDims.map((d) => dimStandards[d.id]).join("\n\n");

  const prompt = `# 学术论文审阅系统提示词

## 角色设定

你是一位资深的中文学术论文审稿人，具备跨学科审稿经验，熟悉中国高校学位论文规范和学术期刊投稿要求。你的审阅风格严谨但建设性，旨在帮助作者提升论文质量。

## 审阅配置

| 参数 | 值 |
|------|-----|
| 审阅等级 | ${levelObj.name} |
| 审阅维度 | ${selectedDims.map((d) => d.name).join("、")} |
| 等级说明 | ${levelObj.desc} |

## 审阅维度与标准

${dimSections}

## 问题分级标准

对发现的每个问题，按以下标准分级：

| 级别 | 标记 | 定义 |
|------|------|------|
| 严重 | 🔴 | 影响论文核心质量，必须修改（如逻辑错误、数据造假、严重格式问题） |
| 中等 | 🟡 | 影响可读性或规范性，建议修改（如表述不清、引用格式不一致） |
| 轻微 | 🟢 | 细节问题，可选修改（如个别用词、微小格式调整） |

## 输出格式

请按以下结构输出审阅报告：

### 1. 总体评价
（一段话概括论文质量、主要优缺点、总体建议）

### 2. 逐维度审阅
（按每个勾选的维度分别审阅，每个维度包含：评分 1-10、主要发现、具体修改建议）

### 3. 问题汇总表

| # | 级别 | 维度 | 位置 | 问题描述 | 修改建议 |
|---|------|------|------|----------|----------|
| 1 | 🔴/🟡/🟢 | ... | ... | ... | ... |

### 4. 修改优先级

**必须修改（🔴）：**
1. ...

**建议修改（🟡）：**
1. ...

**可选优化（🟢）：**
1. ...

---

## 待审阅论文

${textInput || "【请在此粘贴论文内容】"}`;

  return prompt;
}

export function PaperReview() {
  const [selectedDims, setSelectedDims] = useState(["logic", "language", "aigc"]);
  const [level, setLevel] = useState("undergrad");
  const [textInput, setTextInput] = useState("");
  const [outputText, setOutputText] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Listen for pendingText from other tabs
  useEffect(() => {
    if (pendingText.value) {
      setTextInput(pendingText.value);
      pendingText.value = "";
    }
  }, [pendingText.value]);

  useEffect(() => {
    setCharCount(textInput.length);
  }, [textInput]);

  const toggleDim = (id) => {
    setSelectedDims((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const selectAllDims = () => setSelectedDims(DIMENSIONS.map((d) => d.id));
  const clearAllDims = () => setSelectedDims([]);

  const handleGenerate = () => {
    if (selectedDims.length === 0) {
      showToast("请至少选择一个审阅维度");
      return;
    }
    const prompt = generateReviewPrompt(level, selectedDims, textInput);
    setOutputText(prompt);
    setShowOutput(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText).then(() => {
      showToast("已复制到剪贴板");
    });
  };

  const handleSendToHumanizer = () => {
    pendingText.value = outputText;
    currentTab.value = "humanizer";
  };

  return (
    <div className="stagger">
      {/* Dimension Selection */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div className="section-title" style={{ marginBottom: 0 }}>审阅维度</div>
          <div style={{ fontSize: 13, color: "var(--an-muted)" }}>
            已选 <strong style={{ color: "var(--an-ink)" }}>{selectedDims.length}</strong> / {DIMENSIONS.length}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button className="btn" onClick={selectAllDims}>全选</button>
          <button className="btn" onClick={clearAllDims}>全不选</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {DIMENSIONS.map((d) => {
            const sel = selectedDims.includes(d.id);
            return (
              <div
                key={d.id}
                className={`pattern-card${sel ? " selected" : ""}`}
                onClick={() => toggleDim(d.id)}
              >
                <div className="pattern-check">
                  {sel && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="pattern-name">{d.name}</div>
                  <div className="pattern-brief">{d.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Selection */}
      <div className="card">
        <div className="section-title">审阅等级</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {LEVELS.map((l) => (
            <div
              key={l.id}
              className={`pattern-card${level === l.id ? " selected" : ""}`}
              onClick={() => setLevel(l.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="pattern-check">
                {level === l.id && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="pattern-name">{l.name}</div>
                <div className="pattern-brief">{l.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paper Content Input */}
      <div className="card-subtle">
        <div className="section-title">论文内容（可选）</div>
        <textarea
          placeholder="粘贴需要审阅的论文或段落。留空则生成通用审阅框架，粘贴内容后会针对具体内容生成审阅提示词。"
          rows={6}
          value={textInput}
          onInput={(e) => setTextInput(e.target.value)}
        />
        {charCount > 0 && (
          <div style={{ fontSize: 12, color: "var(--an-muted-soft)", marginTop: 6, textAlign: "right" }}>
            {charCount.toLocaleString()} 字
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button className="btn-primary" onClick={handleGenerate}>
        <i className="ti ti-search" aria-hidden="true"></i> 生成审阅提示词
      </button>

      {/* Output */}
      {showOutput && (
        <div>
          <div className="output-box">{outputText}</div>
          <div className="copy-row">
            <button className="btn" onClick={handleCopy}>
              <i className="ti ti-copy" aria-hidden="true"></i> 复制全部
            </button>
            <button className="btn" onClick={handleSendToHumanizer} style={{ color: "var(--an-primary)", borderColor: "var(--an-primary)" }}>
              <i className="ti ti-feather" aria-hidden="true"></i> 发送到写作优化
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
