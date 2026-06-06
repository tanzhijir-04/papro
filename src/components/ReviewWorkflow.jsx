import { useSignal } from "@preact/signals";
import { useState } from "preact/hooks";
import { showToast } from "../store.js";

const STEPS = [
  { title: "准备文献", desc: "收集 PDF 文献，建立文献清单" },
  { title: "导入文献", desc: "将 PDF 文件放入工作目录" },
  { title: "生成提示词", desc: "配置综述参数，生成写作提示词" },
  { title: "AI 写作", desc: "将提示词发送给 AI 进行写作" },
  { title: "格式转换", desc: "使用 Pandoc 将 Markdown 转为 Word" },
];

const WORD_COUNTS = ["3000", "5000", "8000", "10000"];
const PAPER_COUNTS = ["8", "10", "12", "15"];
const CITATION_FORMATS = ["GB/T 7714-2015", "APA 7th", "MLA 9th"];

export function ReviewWorkflow() {
  const [topic, setTopic] = useState("");
  const [field, setField] = useState("");
  const [words, setWords] = useState("5000");
  const [citation, setCitation] = useState("GB/T 7714-2015");
  const [paperCount, setPaperCount] = useState("10");
  const [extra, setExtra] = useState("");

  const [csvOutput, setCsvOutput] = useState("");
  const [showCsv, setShowCsv] = useState(false);
  const [promptOutput, setPromptOutput] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [pandocOutput, setPandocOutput] = useState("");
  const [showPandoc, setShowPandoc] = useState(false);

  const handleGenerateCSV = () => {
    const count = parseInt(paperCount);
    let csv = "filename,citation\n";
    for (let i = 1; i <= count; i++) {
      csv += `paper_${i}.pdf,【在此粘贴 ${citation} 格式的引用】\n`;
    }
    setCsvOutput(csv);
    setShowCsv(true);
  };

  const handleGeneratePrompt = () => {
    const t = topic.trim() || "【填写综述主题】";
    const f = field.trim() || "【填写学科领域】";
    const w = parseInt(words);

    const prompt = `你是一位资深的中文学术综述写作专家，熟悉 ${f} 领域的研究进展。

## 任务

基于我提供的文献（PDF 文件）和文献清单（CSV 文件），撰写一篇关于「${t}」的学术综述。

## 工作方式

1. 先阅读 CSV 文件，了解每篇文献的引用信息
2. 逐一阅读我提供的 PDF 文献，提取各文献的核心观点、方法和结论
3. 按照以下大纲结构组织综述，确保每个部分都有文献支撑
4. 所有引用必须严格使用 CSV 中的引用格式，不得虚构任何文献

## 综述大纲（请按此结构撰写）

1. 引言（约 ${Math.round(w * 0.1).toLocaleString()} 字）
   - 研究背景与意义
   - 综述范围与方法说明

2. ${t} 的发展脉络（约 ${Math.round(w * 0.15).toLocaleString()} 字）
   - 早期研究
   - 近年进展

3. 核心方法/理论/技术梳理（约 ${Math.round(w * 0.35).toLocaleString()} 字）
   - 按主题或方法分类梳理各文献的核心贡献
   - 对比不同研究的异同

4. 现有研究的不足与展望（约 ${Math.round(w * 0.2).toLocaleString()} 字）
   - 当前研究的局限性
   - 未来可能的研究方向

5. 结论（约 ${Math.round(w * 0.1).toLocaleString()} 字）
   - 总结核心发现
   - 强调研究意义

## 写作规范

- 全文约 ${w.toLocaleString()} 字（不含参考文献）
- 使用"本文""本综述"，不得使用"我"
- 引用格式严格遵循 ${citation}
- 每段首句为主题句，段落之间有逻辑衔接
- 禁止空洞套语："综上所述""由此可见""不言而喻"
- 禁止 AI 腔："值得注意的是""不可忽视的是""具有重要意义"
- 数字用阿拉伯数字，百分比用阿拉伯数字
- 专业术语首次出现须给出全称或定义

## 输出格式

直接输出 Markdown 格式的综述全文，结构为：

\`\`\`
# [综述标题]

## 摘要
（200-300字）

关键词：词1；词2；词3

## 1 引言
[正文]

## 2 [章节标题]
[正文]

...（按大纲展开）

## 参考文献
[按 ${citation} 格式，从 CSV 中提取]
\`\`\` ${extra.trim() ? `\n\n## 额外要求\n${extra.trim()}` : ""}`;

    setPromptOutput(prompt);
    setShowPrompt(true);
  };

  const handleGeneratePandoc = () => {
    const cmd = `# 安装 Pandoc（如果还没装）
# Windows: https://pandoc.org/installing.html
# macOS: brew install pandoc
# Linux: sudo apt install pandoc

# 基础转换
pandoc draft.md -o output.docx

# 带参考文献的转换（需要 references.bib 文件）
pandoc draft.md --citeproc --bibliography=references.bib -o output.docx

# 使用学术论文模板（如果安装了 template.docx）
pandoc draft.md --reference-doc=template.docx -o output.docx

# 一步到位：带引用 + 页边距 + 字体
pandoc draft.md \\
  --citeproc \\
  --bibliography=references.bib \\
  --reference-doc=template.docx \\
  -o 综述终稿.docx

# 提示：如果 CSV 里的引用信息需要转成 BibTeX 格式，
# 可以用 Zotero 导出 .bib 文件，然后用 --bibliography 参数`;
    setPandocOutput(cmd);
    setShowPandoc(true);
  };

  const copyOutput = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast("已复制到剪贴板");
    });
  };

  return (
    <div className="stagger">
      {/* 5-Step Workflow Guide */}
      <div className="card">
        <div className="section-title">综述工作流</div>
        <div className="wf-steps">
          {STEPS.map((step, i) => (
            <div key={i} className="wf-step">
              <div className="wf-step-num">{i + 1}</div>
              {i < STEPS.length - 1 && <div className="wf-step-line"></div>}
              <div className="wf-step-content">
                <div className="wf-step-title">{step.title}</div>
                <div className="wf-step-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div className="card">
        <div className="section-title">综述配置</div>

        <div className="field">
          <label>综述主题</label>
          <input
            type="text"
            placeholder="例：大语言模型在医学影像诊断中的应用"
            value={topic}
            onInput={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="field">
          <label>学科领域</label>
          <input
            type="text"
            placeholder="例：计算机科学 / 人工智能"
            value={field}
            onInput={(e) => setField(e.target.value)}
          />
        </div>

        <div className="grid2">
          <div className="field">
            <label>目标字数</label>
            <select value={words} onChange={(e) => setWords(e.target.value)}>
              {WORD_COUNTS.map((w) => <option key={w} value={w}>{w} 字</option>)}
            </select>
          </div>
          <div className="field">
            <label>引用格式</label>
            <select value={citation} onChange={(e) => setCitation(e.target.value)}>
              {CITATION_FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        <div className="grid2">
          <div className="field">
            <label>文献数量</label>
            <select value={paperCount} onChange={(e) => setPaperCount(e.target.value)}>
              {PAPER_COUNTS.map((c) => <option key={c} value={c}>{c} 篇</option>)}
            </select>
          </div>
          <div className="field">
            <label>特殊要求</label>
            <input
              type="text"
              placeholder="例：侧重国内研究"
              value={extra}
              onInput={(e) => setExtra(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button className="btn-primary" onClick={handleGenerateCSV}>
          <i className="ti ti-file-spreadsheet" aria-hidden="true"></i> 生成 CSV 模板
        </button>
        <button className="btn-primary" onClick={handleGeneratePrompt}>
          <i className="ti ti-sparkles" aria-hidden="true"></i> 生成完整提示词
        </button>
        <button className="btn-primary btn-teal" onClick={handleGeneratePandoc}>
          <i className="ti ti-terminal" aria-hidden="true"></i> 生成 Pandoc 命令
        </button>
      </div>

      {/* CSV Output */}
      {showCsv && (
        <div>
          <h3 style={{ marginTop: 20, marginBottom: 8 }}>CSV 模板</h3>
          <div className="output-box">{csvOutput}</div>
          <div className="copy-row">
            <button className="btn" onClick={() => copyOutput(csvOutput)}>
              <i className="ti ti-copy" aria-hidden="true"></i> 复制
            </button>
          </div>
        </div>
      )}

      {/* Prompt Output */}
      {showPrompt && (
        <div>
          <h3 style={{ marginTop: 20, marginBottom: 8 }}>综述提示词</h3>
          <div className="output-box">{promptOutput}</div>
          <div className="copy-row">
            <button className="btn" onClick={() => copyOutput(promptOutput)}>
              <i className="ti ti-copy" aria-hidden="true"></i> 复制
            </button>
          </div>
        </div>
      )}

      {/* Pandoc Output */}
      {showPandoc && (
        <div>
          <h3 style={{ marginTop: 20, marginBottom: 8 }}>Pandoc 命令</h3>
          <div className="output-box">{pandocOutput}</div>
          <div className="copy-row">
            <button className="btn" onClick={() => copyOutput(pandocOutput)}>
              <i className="ti ti-copy" aria-hidden="true"></i> 复制
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
