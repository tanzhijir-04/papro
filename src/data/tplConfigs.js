// Template Configurations - 5 academic templates
// 知更·Paper v3.0 — pure academic focus

export const tplConfigs = {
  review: {
    fields: [
      { id:'topic', label:'综述主题', type:'text', placeholder:'例：大语言模型在医学影像诊断中的应用' },
      { id:'field', label:'学科领域', type:'text', placeholder:'例：计算机科学 / 人工智能' },
      { id:'words', label:'目标字数', type:'select', options:['3000','5000','8000','10000'], def:'5000' },
      { id:'citation', label:'引用格式', type:'select', options:['GB/T 7714-2015','APA 7th','MLA 9th'] },
      { id:'count', label:'文献数量', type:'select', options:['8','10','12','15'], def:'10' },
      { id:'extra', label:'特殊要求', type:'text', placeholder:'例：侧重国内研究 / 需要对比表格', required:false },
    ],
    buildPrompt(cfg) {
      const w = parseInt(cfg.words);
      return `你是一位资深的中文学术综述写作专家，擅长将零散文献整合为逻辑严密的综述。

## 任务

围绕「${cfg.topic || '【填写主题】'}」，基于我提供的文献撰写一篇${cfg.words}字的学术综述。

## 学科领域

${cfg.field || '【填写学科】'}

## 综述结构

1. 引言（约 ${Math.round(w*0.1)} 字）— 研究背景与综述范围
2. 发展脉络（约 ${Math.round(w*0.15)} 字）— 早期研究到近年进展
3. 核心方法/理论梳理（约 ${Math.round(w*0.35)} 字）— 按主题分类，对比异同
4. 不足与展望（约 ${Math.round(w*0.2)} 字）— 局限性与未来方向
5. 结论（约 ${Math.round(w*0.1)} 字）— 核心发现总结

## 写作规范

- 引用格式：${cfg.citation}
- 禁止空洞套语和AI腔表达
- 每段首句为主题句，段落间有逻辑衔接
- 专业术语首次出现须给出全称或定义${cfg.extra ? `\n\n## 额外要求\n${cfg.extra}` : ''}`;
    }
  },
  abstract: {
    fields: [
      { id:'title', label:'论文题目', type:'text', placeholder:'例：基于深度学习的医学影像分割方法研究' },
      { id:'field', label:'学科领域', type:'text', placeholder:'例：计算机视觉' },
      { id:'lang', label:'语言', type:'select', options:['中文','英文','中英双语'] },
      { id:'type', label:'摘要类型', type:'select', options:['结构式摘要','非结构式摘要'] },
      { id:'extra', label:'其他信息', type:'text', placeholder:'例：核心方法、主要结论', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位学术论文写作专家，擅长撰写精炼的论文摘要。

## 任务

为以下论文撰写${cfg.lang || '中文'}摘要（${cfg.type || '结构式摘要'}）：

**题目：** ${cfg.title || '【待填写】'}
**学科：** ${cfg.field || '【待填写】'}
${cfg.extra ? `**关键信息：** ${cfg.extra}` : ''}

## 结构式摘要要素

- **目的**：研究目标（1-2句）
- **方法**：研究方法（2-3句）
- **结果**：主要发现（2-3句）
- **结论**：核心结论（1-2句）

## 要求

- 字数：200-300字（中文）/ 150-250词（英文）
- 避免"本文""本研究"以外的主语
- 禁止引用参考文献
- 关键词：3-5个，用分号分隔`;
    }
  },
  proposal: {
    fields: [
      { id:'title', label:'研究题目', type:'text', placeholder:'例：社交媒体对青少年心理健康的影响研究' },
      { id:'field', label:'学科领域', type:'text', placeholder:'例：心理学 / 传播学' },
      { id:'words', label:'目标字数', type:'select', options:['3000','5000','8000'], def:'5000' },
      { id:'method', label:'研究方法', type:'select', options:['定量研究','定性研究','混合研究','文献研究'] },
      { id:'extra', label:'其他要求', type:'text', placeholder:'例：需包含技术路线图描述', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位学术写作专家，擅长撰写开题报告。

## 任务

为以下课题撰写一份${cfg.words || '5000'}字的开题报告：

**题目：** ${cfg.title || '【待填写】'}
**学科：** ${cfg.field || '【待填写】'}
**研究方法：** ${cfg.method || '定量研究'}

## 开题报告结构

1. 选题背景与意义（约800字）
2. 国内外研究现状（约1200字）
3. 研究内容与目标（约800字）
4. 研究方法与技术路线（约1000字）
5. 创新点（约400字）
6. 研究计划与进度安排（约400字）
7. 参考文献（至少15篇，GB/T 7714格式）${cfg.extra ? `\n\n## 额外要求\n${cfg.extra}` : ''}`;
    }
  },
  critique: {
    fields: [
      { id:'title', label:'论文题目', type:'text', placeholder:'例：xxxxx' },
      { id:'field', label:'学科领域', type:'text', placeholder:'例：人工智能' },
      { id:'venue', label:'投稿期刊/会议', type:'text', placeholder:'例：ACL 2026' },
      { id:'tone', label:'评审语气', type:'select', options:['建设性（温和）','客观中立','严格'] },
    ],
    buildPrompt(cfg) {
      return `你是一位资深的学术期刊审稿人，擅长给出建设性的论文评审意见。

## 任务

为以下论文撰写结构化评审意见：

**题目：** ${cfg.title || '【待填写】'}
**学科：** ${cfg.field || '【待填写】'}
**投稿目标：** ${cfg.venue || '【待填写】'}
**评审语气：** ${cfg.tone || '建设性（温和）'}

## 评审结构

### 1. 总体评价
（一段话概括论文质量、创新性和适合度）

### 2. 优点
（列出3-5个主要优点）

### 3. 主要问题
（按重要性排序，每个问题给出具体位置和修改建议）

### 4. 次要问题
（格式、语言、细节问题）

### 5. 评审结论
（接受/小修/大修/拒绝，附简要理由）`;
    }
  },
  defense: {
    fields: [
      { id:'title', label:'论文题目', type:'text', placeholder:'例：xxxxx' },
      { id:'field', label:'学科领域', type:'text', placeholder:'例：计算机科学' },
      { id:'slides', label:'PPT页数', type:'select', options:['10','15','20','25'], def:'15' },
      { id:'extra', label:'其他要求', type:'text', placeholder:'例：重点讲第3章的实验设计', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位学术答辩辅导专家，擅长帮助学生准备论文答辩。

## 任务

为以下论文生成答辩PPT逐页讲稿和常见问题应答：

**题目：** ${cfg.title || '【待填写】'}
**学科：** ${cfg.field || '【待填写】'}
**PPT页数：** ${cfg.slides || '15'}页

## 输出内容

### Part 1：逐页讲稿
为每页PPT提供：
- 本页核心信息（1句话）
- 讲稿内容（30-60秒口述量）
- 时间建议

### Part 2：常见问题预测
预测5-8个评委可能提出的问题，每个问题提供：
- 问题本身
- 参考回答要点（不是逐字稿，是回答方向）
- 回答时间建议${cfg.extra ? `\n\n## 重点注意\n${cfg.extra}` : ''}`;
    }
  },
};
