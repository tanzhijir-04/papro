import { useSignal, effect } from "@preact/signals";
import { useState, useEffect, useRef } from "preact/hooks";
import {
  hzSelected, hzIntensity, hzTone, hzLang, hzType, hzExtra,
  hzCurrentCat, pendingText, currentTab, showToast, paintRange,
} from "../store.js";
import { hzPatterns, hzCategories } from "../data/hzPatterns.js";

const TONE_OPTIONS = [
  { value: "neutral", label: "中性客观" },
  { value: "casual", label: "轻松随意" },
  { value: "professional", label: "专业严谨" },
  { value: "academic", label: "学术正式" },
  { value: "creative", label: "创意表达" },
];

const LANG_OPTIONS = [
  { value: "zh-CN", label: "简体中文" },
  { value: "en", label: "English" },
  { value: "zh-TW", label: "繁體中文" },
];

const TYPE_OPTIONS = [
  { value: "general", label: "通用文本" },
  { value: "academic", label: "学术论文" },
  { value: "blog", label: "博客文章" },
  { value: "social", label: "社交媒体" },
  { value: "business", label: "商务文档" },
  { value: "creative", label: "创意写作" },
];

const TONE_MAP = { neutral: "中性客观", casual: "轻松随意", professional: "专业严谨", academic: "学术正式", creative: "创意表达" };
const TYPE_MAP = { general: "通用文本", academic: "学术论文", blog: "博客文章", social: "社交媒体", business: "商务文档", creative: "创意写作" };
const LANG_MAP = { "zh-CN": "简体中文", en: "English", "zh-TW": "繁體中文" };

function togglePattern(id) {
  const s = new Set(hzSelected.value);
  s.has(id) ? s.delete(id) : s.add(id);
  hzSelected.value = s;
}

function selectAll() {
  hzSelected.value = new Set(hzPatterns.map((p) => p.id));
  hzCurrentCat.value = "all";
}

function deselectAll() {
  hzSelected.value = new Set();
}

function generateHumanizerPrompt(textInput) {
  if (hzSelected.value.size === 0) {
    showToast("请至少选择一个 AI 模式");
    return null;
  }

  const intensity = hzIntensity.value;
  const tone = hzTone.value;
  const lang = hzLang.value;
  const type = hzType.value;
  const extra = hzExtra.value.trim();

  const intensityDesc = intensity <= 3
    ? "轻度优化：微调措辞，保留大部分原文结构"
    : intensity <= 6
    ? "中度优化：重写有问题的段落，改善表达方式"
    : "深度重写：大幅重构文本，注入个性化表达，彻底消除 AI 痕迹";

  const selected = hzPatterns.filter((p) => hzSelected.value.has(p.id));
  const patternList = selected.map((p) => `- **#${p.id} ${p.name}**：${p.brief}（关键词：${p.kw}）`).join("\n");

  const cats = new Set(selected.map((p) => p.cat));
  const rules = [
    "1. **删除填充短语** — 去除开场白和强调性拐杖词",
    "2. **打破公式结构** — 避免二元对比、戏剧性分段、修辞性设置",
    "3. **变化节奏** — 混合句子长度。两项优于三项。段落结尾要多样化",
    "4. **信任读者** — 直接陈述事实，跳过软化、辩解和手把手引导",
    "5. **删除金句** — 如果听起来像可引用的语句，重写它",
  ];

  if (cats.has("content")) {
    rules.push("", "**内容模式规则：**");
    rules.push('- 删除"作为……的证明"类夸大的象征意义陈述');
    rules.push("- 用具体事实替代模糊的宣传性语言");
    rules.push('- 删除模糊归因（"专家认为"），如有具体来源则替换');
    rules.push('- 删除公式化的"挑战与未来展望"部分');
  }
  if (cats.has("language")) {
    rules.push("", "**语言模式规则：**");
    rules.push("- 替换所有 AI 高频词汇（此外、至关重要、格局、复杂性等）");
    rules.push('- 用简单的"是/有"替代"作为/代表/标志着"等复杂结构');
    rules.push('- 删除"不仅……而且……"等否定式排比');
    rules.push("- 三项并列改为两项或四项");
  }
  if (cats.has("style")) {
    rules.push("", "**风格模式规则：**");
    rules.push("- 减少破折号使用，改用逗号或句号");
    rules.push("- 移除不必要的粗体标记");
    rules.push("- 将粗体标题+冒号的列表格式改为连贯的段落");
  }
  if (cats.has("comm")) {
    rules.push("", "**交流模式规则：**");
    rules.push("- 删除所有聊天机器人对话痕迹（希望这对您有帮助、请告诉我）");
    rules.push("- 删除知识截止日期免责声明");
    rules.push("- 删除谄媚讨好的语气");
  }
  if (cats.has("filler")) {
    rules.push("", "**填充词规则：**");
    rules.push("- 替换冗长填充短语为简短表达");
    rules.push("- 删除过度限定，直接陈述");
    rules.push("- 用具体结论替代通用积极结尾");
  }

  if (intensity >= 7) {
    rules.push("", "**深度重写要求：**");
    rules.push("- 重新组织段落结构，不要保留原文的分段逻辑");
    rules.push("- 注入第一人称视角和个人观点（如适当）");
    rules.push("- 使用具体的、非模板化的开头和结尾");
    rules.push("- 确保每句话都有独特的声音和节奏");
  }
  if (intensity <= 3) {
    rules.push("", "**轻度修改要求：**");
    rules.push("- 保留原文大部分结构，只修改最明显的 AI 痕迹");
    rules.push("- 优先处理高频词汇和填充短语");
    rules.push("- 不改变段落顺序");
  }

  const toneGuidance = {
    neutral: "- 保持客观中立，不带个人情感\n- 直接陈述事实和数据\n- 避免任何立场性表述",
    casual: "- 像在和朋友聊天\n- 可以使用口语化表达\n- 允许一些不正式的句式\n- 可以有个人观点和感受",
    professional: "- 保持专业但不冷漠\n- 使用行业术语但不过度\n- 结构清晰，逻辑严密\n- 结论明确，有理有据",
    academic: "- 严谨的学术表达\n- 适当的引用和引述\n- 避免口语化和情感化\n- 逻辑推导清晰",
    creative: "- 允许修辞手法和文学性表达\n- 可以有节奏感和韵律\n- 鼓励独特的比喻和意象\n- 保持新鲜感",
  };

  const langRule = lang === "zh-CN"
    ? "用中文回复。保持中文的自然节奏，不要受英文句式影响。"
    : lang === "en"
    ? "Reply in English. Keep natural English rhythm, avoid translated-Chinese sentence patterns."
    : "根据原文语言自动判断。中文部分保持中文，英文部分保持英文。";

  const prompt = `# 去 AI 味 — 人性化处理系统提示词

## 角色设定

你是一位专业的文字编辑，专门识别和去除 AI 生成文本的痕迹。你基于维基百科的"AI 写作特征"指南（WikiProject AI Cleanup 维护），对文本进行精准的人性化处理。

## 你的任务

当收到需要人性化处理的文本时：

1. **识别 AI 模式** — 扫描下面列出的所有模式
2. **重写问题片段** — 用自然的替代方案替换 AI 痕迹
3. **保留含义** — 保持核心信息完整，不改变事实和观点
4. **维持语调** — 匹配目标语调：${TONE_MAP[tone]}
5. **注入灵魂** — 不仅去除不良模式，还要注入真实的个性和声音

## 配置信息

| 参数 | 值 |
|------|-----|
| 优化强度 | ${intensity}/10 — ${intensityDesc} |
| 目标语调 | ${TONE_MAP[tone]} |
| 目标语言 | ${LANG_MAP[lang]} |
| 文本类型 | ${TYPE_MAP[type]} |

## 需要修复的 AI 模式（${selected.length} 个）

${patternList}

## 核心规则

${rules.join("\n")}

## 语调要求：${TONE_MAP[tone]}

${toneGuidance[tone] || toneGuidance.neutral}

## 语言要求

${langRule}

## 处理流程

1. 仔细阅读输入文本
2. 识别上述所有已选模式的实例
3. 重写每个有问题的部分
4. 确保修订后的文本：
   - 大声朗读时听起来自然
   - 自然地改变句子结构和节奏
   - 使用具体细节而不是模糊的主张
   - 为上下文保持适当的语气（${TONE_MAP[tone]}）
   - 适当时使用简单的结构（是/有）
5. 呈现人性化版本

## 质量评分

对改写后的文本进行 5 维度评分（每项 1-10 分，总分 50）：

| 维度 | 评估标准 |
|------|----------|
| **直接性** | 直接陈述事实还是绕圈宣告？ |
| **节奏** | 句子长度是否变化？长短交错？ |
| **信任度** | 是否尊重读者智慧，不过度解释？ |
| **真实性** | 听起来像真人说话吗？有个性吗？ |
| **精炼度** | 还有可删减的内容吗？无冗余？ |

**评分标准：**
- 45-50 分：优秀，已去除 AI 痕迹
- 35-44 分：良好，仍有改进空间
- 低于 35 分：需要重新修订

## 快速检查清单

交付文本前，逐项检查：

- 连续三个句子长度是否相同？→ 打断其中一个
- 段落是否都以简洁单行结尾？→ 变换结尾方式
- 揭示前是否有破折号？→ 删除它
- 是否在解释隐喻？→ 相信读者能理解
- 是否过度使用"此外""然而"等连接词？→ 考虑删除
- 是否三段式列举？→ 改为两项或四项

## 输出格式

请提供：

1. **重写后的完整文本**
2. **修改摘要**（列出主要改动）
3. **质量评分表**（5 维度打分 + 总分）
${textInput ? `\n## 待处理文本\n\n${textInput}` : ""}
${extra ? `\n## 附加要求\n${extra}` : ""}`;

  return prompt;
}

export function Humanizer() {
  const [textInput, setTextInput] = useState("");
  const [outputText, setOutputText] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const intensityRef = useRef(null);

  // Listen for pendingText from template linkage
  useEffect(() => {
    if (pendingText.value) {
      setTextInput(pendingText.value);
      pendingText.value = "";
    }
  }, [pendingText.value]);

  // Paint intensity range on mount
  useEffect(() => {
    if (intensityRef.current) paintRange(intensityRef.current);
  }, []);

  const filteredPatterns = hzCurrentCat.value === "all"
    ? hzPatterns
    : hzPatterns.filter((p) => p.cat === hzCurrentCat.value);

  const handleGenerate = () => {
    const prompt = generateHumanizerPrompt(textInput);
    if (prompt) {
      setOutputText(prompt);
      setShowOutput(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText).then(() => {
      showToast("已复制到剪贴板");
    });
  };

  return (
    <div className="stagger">
      {/* Pattern Selection Header */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div className="section-title" style={{ marginBottom: 0 }}>AI 写作模式识别</div>
          <div style={{ fontSize: 13, color: "var(--an-muted)" }}>
            已选 <strong style={{ color: "var(--an-ink)" }}>{hzSelected.value.size}</strong> / 24
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button className="btn" onClick={selectAll}>全选</button>
          <button className="btn" onClick={deselectAll}>全不选</button>
        </div>

        {/* Category Filter */}
        <div className="pill-row" style={{ marginBottom: 12 }}>
          {hzCategories.map((c) => (
            <button
              key={c.id}
              className={`pill${hzCurrentCat.value === c.id ? " selected" : ""}`}
              onClick={() => { hzCurrentCat.value = c.id; }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Patterns Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 360, overflowY: "auto" }}>
          {filteredPatterns.map((p) => {
            const sel = hzSelected.value.has(p.id);
            return (
              <div
                key={p.id}
                className={`pattern-card${sel ? " selected" : ""}`}
                onClick={() => togglePattern(p.id)}
              >
                <div className="pattern-check">
                  {sel && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="pattern-id">#{p.id} · {p.cat.toUpperCase()}</div>
                  <div className="pattern-name">{p.name}</div>
                  <div className="pattern-brief">{p.brief}</div>
                </div>
                <div className="pattern-kw">{p.kw}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configuration Card */}
      <div className="card">
        <div className="section-title">优化配置</div>

        <div className="field">
          <label>优化强度（{hzIntensity.value}/10）</label>
          <div className="range-row">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={hzIntensity.value}
              ref={intensityRef}
              onInput={(e) => {
                hzIntensity.value = parseInt(e.target.value);
                paintRange(e.target);
              }}
            />
            <span className="range-val">{hzIntensity.value}</span>
          </div>
        </div>

        <div className="grid2">
          <div className="field">
            <label>目标语调</label>
            <select value={hzTone.value} onChange={(e) => { hzTone.value = e.target.value; }}>
              {TONE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label>目标语言</label>
            <select value={hzLang.value} onChange={(e) => { hzLang.value = e.target.value; }}>
              {LANG_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label>文本类型</label>
          <div className="pill-row">
            {TYPE_OPTIONS.map((o) => (
              <button
                key={o.value}
                className={`pill${hzType.value === o.value ? " selected" : ""}`}
                onClick={() => { hzType.value = o.value; }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>附加要求</label>
          <input
            type="text"
            placeholder="例：保留所有专业术语 / 需要中英双语对照"
            value={hzExtra.value}
            onInput={(e) => { hzExtra.value = e.target.value; }}
          />
        </div>
      </div>

      {/* Text Input */}
      <div className="card-subtle">
        <div className="section-title">待处理文本（可选）</div>
        <textarea
          placeholder="粘贴需要人性化处理的文本，或留空仅生成系统提示词..."
          rows={5}
          value={textInput}
          onInput={(e) => setTextInput(e.target.value)}
        />
      </div>

      {/* Generate Button */}
      <button className="btn-primary" onClick={handleGenerate}>
        <i className="ti ti-feather" aria-hidden="true"></i> 生成优化提示词
      </button>

      {/* Output */}
      {showOutput && (
        <div>
          <div className="output-box">{outputText}</div>
          <div className="copy-row">
            <button className="btn" onClick={handleCopy}>
              <i className="ti ti-copy" aria-hidden="true"></i> 复制全部
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
