// Template Configurations - 25 templates with fields and buildPrompt
// Extracted from prompt_manager.html

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
  wechat: {
    fields: [
      { id:'topic', label:'文章主题', type:'text', placeholder:'例：为什么90后开始存钱了' },
      { id:'audience', label:'目标读者', type:'text', placeholder:'例：25-35岁城市白领' },
      { id:'words', label:'目标字数', type:'select', options:['1500','2000','3000','5000'], def:'2000' },
      { id:'tone', label:'语气风格', type:'select', options:['轻松聊天','有深度但不装','犀利毒舌','温暖治愈'] },
      { id:'extra', label:'额外要求', type:'text', placeholder:'例：开头要有一个钩子故事', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位资深的公众号内容创作者，擅长将专业内容转化为读者爱看的长文。

## 任务

围绕「${cfg.topic || '【填写主题】'}」，撰写一篇${cfg.words || '2000'}字的公众号长文。

## 目标读者

${cfg.audience || '泛互联网用户'}

## 风格要求

- 语气：${cfg.tone || '轻松聊天'}
- 口语化但不低俗，像在和读者聊天
- 每3-4段加一个小标题
- 禁止：空洞抒情、过度排比、假大空总结
- 开头必须有钩子（反直觉观点/真实故事/具体数据）${cfg.extra ? `\n\n## 额外要求\n${cfg.extra}` : ''}

## 输出格式

直接输出完整文章，包含标题和正文。`;
    }
  },
  xiaohongshu: {
    fields: [
      { id:'topic', label:'种草内容', type:'text', placeholder:'例：这款降噪耳机真的绝了' },
      { id:'style', label:'风格', type:'select', options:['真实分享','好物推荐','避雷测评','干货攻略'] },
      { id:'extra', label:'产品/品牌', type:'text', placeholder:'例：Sony WH-1000XM5', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位小红书爆款文案创作者，擅长写出高互动的种草内容。

## 任务

围绕「${cfg.topic || '【填写内容】'}」，撰写一篇小红书风格的种草文案。

## 风格：${cfg.style || '真实分享'}

## 要求

- 标题：带emoji，有冲击力，15字以内
- 正文：分段短句，多用换行
- 口吻：像闺蜜推荐，真诚不虚假
- 必须有真实感受和细节描述
- 结尾加互动引导（提问/投票）${cfg.extra ? `\n\n## 涉及产品\n${cfg.extra}` : ''}
- 总字数控制在300-500字`;
    }
  },
  zhihu: {
    fields: [
      { id:'question', label:'知乎问题', type:'text', placeholder:'例：如何看待xxx现象？' },
      { id:'angle', label:'回答角度', type:'text', placeholder:'例：从技术原理角度分析' },
      { id:'words', label:'目标字数', type:'select', options:['500','1000','2000','3000'], def:'1000' },
      { id:'extra', label:'其他要求', type:'text', placeholder:'例：需要引用具体数据', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位知乎高赞回答者，擅长用专业但易懂的方式回答问题。

## 任务

回答知乎问题：「${cfg.question || '【填写问题】'}」

## 回答角度

${cfg.angle || '综合分析'}

## 风格要求

- 先给结论，再展开分析
- 有理有据，引用数据或案例
- 语言专业但不学术，有个人风格
- 段落清晰，适当加粗关键信息
- 禁止：复制粘贴教科书、无信息量的废话${cfg.extra ? `\n\n## 额外要求\n${cfg.extra}` : ''}
- 目标字数：${cfg.words || '1000'}字`;
    }
  },
  thread: {
    fields: [
      { id:'topic', label:'话题主题', type:'text', placeholder:'例：AI编程助手的正确使用姿势' },
      { id:'count', label:'推文数量', type:'select', options:['5','8','10','15'], def:'8' },
      { id:'tone', label:'风格', type:'select', options:['专业分析','轻松分享','观点输出'] },
      { id:'extra', label:'其他要求', type:'text', placeholder:'例：第一推要有钩子', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位Twitter/X内容创作者，擅长用线程形式输出高密度信息。

## 任务

围绕「${cfg.topic || '【填写主题】'}」，撰写一组${cfg.count || '8'}条推文的线程。

## 风格：${cfg.tone || '专业分析'}

## 要求

- 第1条：钩子推，吸引人点开看后续
- 每条推文独立成段，280字符以内（中文约140字）
- 条与条之间有逻辑递进
- 适当加编号（1/${cfg.count || '8'}）
- 可以用换行增加可读性${cfg.extra ? `\n\n## 额外要求\n${cfg.extra}` : ''}`;
    }
  },
  newsletter: {
    fields: [
      { id:'name', label:'通讯名称', type:'text', placeholder:'例：AI周刊' },
      { id:'topic', label:'本期主题', type:'text', placeholder:'例：本周AI领域重要进展' },
      { id:'count', label:'内容条数', type:'select', options:['3','5','7','10'], def:'5' },
      { id:'extra', label:'其他要求', type:'text', placeholder:'例：每条附简短点评', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位Newsletter编辑，擅长撰写简洁有料的邮件通讯。

## 任务

撰写「${cfg.name || '【通讯名称】'}」的一期Newsletter，主题：${cfg.topic || '【填写主题】'}

## 结构

- 开头：一句话问候 + 本期亮点预告
- 主体：${cfg.count || '5'}条内容，每条包含：
  - 加粗标题
  - 2-3句话摘要
  - 你的简短点评或延伸思考
- 结尾：一句话总结 + 下期预告

## 风格

- 简洁、有信息密度
- 像朋友写信，不像公司公告
- 禁止：空洞的"让我们来看看"${cfg.extra ? `\n\n## 额外要求\n${cfg.extra}` : ''}`;
    }
  },
  weekly: {
    fields: [
      { id:'period', label:'周期', type:'select', options:['周报','月报','季度总结'] },
      { id:'role', label:'你的角色', type:'text', placeholder:'例：产品经理' },
      { id:'projects', label:'本周工作', type:'textarea', placeholder:'列出本周完成/推进/解决的事情...' },
      { id:'extra', label:'其他要求', type:'text', placeholder:'例：需要包含下周计划', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位职场写作专家，擅长撰写简洁有力的工作汇报。

## 任务

撰写一份${cfg.period || '周报'}。

## 我的角色

${cfg.role || '【填写角色】'}

## 本周工作

${cfg.projects || '【填写本周工作内容】'}

## 写作规范

- 用"完成/推进/解决"等动词开头
- 每条写结果，不写过程
- 有数据用数据说话
- 禁止：流水账、自我评价、空洞感悟
- 结构：完成事项 → 进行中 → 下周计划${cfg.extra ? `\n\n## 额外要求\n${cfg.extra}` : ''}`;
    }
  },
  email: {
    fields: [
      { id:'purpose', label:'邮件目的', type:'text', placeholder:'例：邀请对方参加产品评审会' },
      { id:'recipient', label:'收件人', type:'text', placeholder:'例：合作方产品经理' },
      { id:'tone', label:'语气', type:'select', options:['正式商务','友好专业','简洁直接'] },
      { id:'extra', label:'其他要求', type:'text', placeholder:'例：需要包含时间选项', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位商务沟通专家，擅长撰写专业高效的商务邮件。

## 任务

撰写一封商务邮件：

**目的：** ${cfg.purpose || '【填写目的】'}
**收件人：** ${cfg.recipient || '【填写收件人】'}
**语气：** ${cfg.tone || '正式商务'}

## 要求

- 主题行：简洁明确，一句话说明邮件目的
- 称呼：得体
- 正文：开门见山，先说目的，再说细节
- 行动项：明确标注需要对方做什么、截止时间
- 结尾：专业得体
- 总长度控制在200字以内${cfg.extra ? `\n\n## 额外要求\n${cfg.extra}` : ''}`;
    }
  },
  prd: {
    fields: [
      { id:'product', label:'产品/功能名称', type:'text', placeholder:'例：用户积分系统' },
      { id:'field', label:'所属领域', type:'text', placeholder:'例：电商平台' },
      { id:'audience', label:'目标用户', type:'text', placeholder:'例：平台注册用户' },
      { id:'extra', label:'其他要求', type:'text', placeholder:'例：需要支持海外用户', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位资深产品经理，擅长撰写清晰完整的产品需求文档。

## 任务

为「${cfg.product || '【填写产品/功能】'}」撰写PRD。

## 背景

- 所属领域：${cfg.field || '【填写】'}
- 目标用户：${cfg.audience || '【填写】'}

## PRD 结构

1. **需求背景** — 为什么要做这个功能
2. **目标与指标** — 成功标准、核心指标
3. **用户故事** — 关键场景描述
4. **功能规格** — 详细功能描述、字段、逻辑
5. **交互流程** — 核心流程描述
6. **边界与异常** — 不做什么、异常处理
7. **数据需求** — 需要埋点的数据
8. **排期建议** — 开发/测试/上线节奏${cfg.extra ? `\n\n## 额外要求\n${cfg.extra}` : ''}`;
    }
  },
  okr: {
    fields: [
      { id:'role', label:'你的角色', type:'text', placeholder:'例：技术团队负责人' },
      { id:'period', label:'周期', type:'select', options:['Q1','Q2','Q3','Q4','半年度','年度'] },
      { id:'focus', label:'核心方向', type:'text', placeholder:'例：提升系统稳定性和开发效率' },
      { id:'count', label:'O的数量', type:'select', options:['2','3','4'], def:'3' },
    ],
    buildPrompt(cfg) {
      return `你是一位OKR教练，擅长帮助团队设定可量化、有挑战性的目标。

## 任务

为以下角色撰写${cfg.period || '本季度'}OKR：

**角色：** ${cfg.role || '【填写角色】'}
**核心方向：** ${cfg.focus || '【填写方向】'}

## 要求

- 设定${cfg.count || '3'}个Objective
- 每个O下设2-4个Key Result
- 每个KR必须可量化，有明确的衡量标准
- O要有鼓舞性，KR要具体可衡量
- 包含信心指数（0.7为最佳挑战度）
- 标注每个KR的当前基线值`;
    }
  },
  'review-biz': {
    fields: [
      { id:'project', label:'项目名称', type:'text', placeholder:'例：v2.0版本上线' },
      { id:'period', label:'项目周期', type:'text', placeholder:'例：2024.03 - 2024.06' },
      { id:'result', label:'项目结果', type:'select', options:['成功达成目标','部分达成','未达预期'] },
      { id:'extra', label:'其他要求', type:'text', placeholder:'例：需要包含数据对比', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位项目管理专家，擅长撰写结构化的项目复盘报告。

## 任务

为「${cfg.project || '【填写项目】'}」撰写项目复盘报告。

## 基本信息

- 项目周期：${cfg.period || '【填写周期】'}
- 项目结果：${cfg.result || '成功达成目标'}

## 复盘结构

1. **项目概述** — 目标、范围、团队
2. **目标达成情况** — 对比预期与实际结果
3. **做得好的（Keep）** — 3-5个成功经验
4. **待改进的（Problem）** — 3-5个问题及根因
5. **改进方案（Try）** — 具体可执行的改进措施
6. **关键数据** — 核心指标对比${cfg.extra ? `\n\n## 额外要求\n${cfg.extra}` : ''}`;
    }
  },
  'tech-blog': {
    fields: [
      { id:'topic', label:'技术主题', type:'text', placeholder:'例：用Rust重写CLI工具的体验' },
      { id:'audience', label:'目标读者', type:'text', placeholder:'例：有1-3年经验的后端开发者' },
      { id:'words', label:'目标字数', type:'select', options:['1000','2000','3000','5000'], def:'2000' },
      { id:'extra', label:'其他要求', type:'text', placeholder:'例：需要包含性能对比数据', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位技术博客作者，擅长将技术内容写得既专业又好读。

## 任务

撰写一篇关于「${cfg.topic || '【填写主题】'}」的技术博客。

## 目标读者

${cfg.audience || '有一定技术基础的开发者'}

## 写作规范

- 先说"是什么"和"为什么需要"，再说"怎么做"
- 必须包含可运行的代码示例
- 禁止：教科书式定义、"让我们来看看"
- 有观点，不是干巴巴的文档
- 段落短，节奏快${cfg.extra ? `\n\n## 额外要求\n${cfg.extra}` : ''}
- 目标字数：${cfg.words || '2000'}字`;
    }
  },
  'api-doc': {
    fields: [
      { id:'api', label:'API 名称', type:'text', placeholder:'例：用户认证接口' },
      { id:'method', label:'请求方法', type:'select', options:['GET','POST','PUT','DELETE','PATCH'] },
      { id:'endpoint', label:'接口路径', type:'text', placeholder:'例：/api/v1/auth/login' },
      { id:'extra', label:'其他说明', type:'text', placeholder:'例：需要Token认证', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位技术文档专家，擅长撰写清晰的API文档。

## 任务

为以下API接口撰写文档：

**接口名称：** ${cfg.api || '【填写名称】'}
**请求方法：** ${cfg.method || 'POST'}
**接口路径：** ${cfg.endpoint || '【填写路径】'}

## 文档结构

1. **接口说明** — 一句话描述用途
2. **请求参数** — 表格形式，含字段名、类型、必填、说明
3. **请求示例** — JSON格式
4. **响应示例** — 成功和失败两种
5. **错误码** — 常见错误及处理方式
6. **注意事项** — 频率限制、权限等${cfg.extra ? `\n\n## 额外说明\n${cfg.extra}` : ''}`;
    }
  },
  readme: {
    fields: [
      { id:'name', label:'项目名称', type:'text', placeholder:'例：知更·Paper' },
      { id:'desc', label:'项目简介', type:'text', placeholder:'例：一组帮助写作者生成AI提示词的单页应用' },
      { id:'tech', label:'技术栈', type:'text', placeholder:'例：HTML + CSS + Vanilla JS' },
      { id:'features', label:'核心功能', type:'textarea', placeholder:'列出3-5个核心功能点...' },
      { id:'extra', label:'其他要求', type:'text', placeholder:'例：需要包含贡献指南', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位开源项目维护者，擅长撰写专业的README。

## 任务

为项目「${cfg.name || '【填写项目名】'}」撰写README。

## 项目信息

- 简介：${cfg.desc || '【填写简介】'}
- 技术栈：${cfg.tech || '【填写技术栈】'}
- 核心功能：
${cfg.features || '【填写功能点】'}

## README 结构

1. 项目标题 + 一句话描述
2. 功能特性列表
3. 快速开始（安装/运行）
4. 使用示例
5. 项目结构
6. 贡献指南
7. License${cfg.extra ? `\n\n## 额外要求\n${cfg.extra}` : ''}`;
    }
  },
  postmortem: {
    fields: [
      { id:'incident', label:'故障事件', type:'text', placeholder:'例：2024-03-15 服务不可用30分钟' },
      { id:'impact', label:'影响范围', type:'text', placeholder:'例：全站用户无法登录' },
      { id:'extra', label:'其他信息', type:'text', placeholder:'例：已定位到Redis连接池耗尽', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位SRE专家，擅长撰写技术故障复盘报告。

## 任务

为以下故障事件撰写复盘报告：

**事件：** ${cfg.incident || '【填写故障事件】'}
**影响：** ${cfg.impact || '【填写影响范围】'}

## 复盘结构

1. **事件概要** — 时间、影响、持续时长
2. **时间线** — 关键节点（发现→响应→定位→修复→恢复）
3. **根因分析** — 直接原因 + 根本原因（5 Whys）
4. **改进措施** — 短期/中期/长期
5. **Action Items** — 具体负责人和截止日期
6. **经验教训** — 可复用的经验${cfg.extra ? `\n\n## 额外信息\n${cfg.extra}` : ''}`;
    }
  },
  rfc: {
    fields: [
      { id:'title', label:'提案标题', type:'text', placeholder:'例：引入消息队列解耦订单系统' },
      { id:'author', label:'作者', type:'text', placeholder:'例：张三' },
      { id:'status', label:'状态', type:'select', options:['Draft','Review','Accepted','Rejected'] },
      { id:'extra', label:'其他要求', type:'text', placeholder:'例：需要包含架构图描述', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位技术架构师，擅长撰写结构化的技术方案设计文档（RFC）。

## 任务

为以下技术提案撰写RFC：

**标题：** ${cfg.title || '【填写标题】'}
**作者：** ${cfg.author || '【填写作者】'}
**状态：** ${cfg.status || 'Draft'}

## RFC 结构

1. **摘要** — 一句话概括方案
2. **动机** — 为什么需要这个方案
3. **详细设计** — 技术实现细节
4. **替代方案** — 考虑过的其他方案及放弃原因
5. **影响分析** — 对现有系统的影响
6. **测试计划** — 如何验证方案
7. **排期建议** — 里程碑和时间节点${cfg.extra ? `\n\n## 额外要求\n${cfg.extra}` : ''}`;
    }
  },
  cn2en: {
    fields: [
      { id:'text', label:'待翻译文本', type:'textarea', placeholder:'粘贴中文文本...' },
      { id:'field', label:'领域', type:'select', options:['学术论文','技术文档','商务邮件','通用文本'] },
      { id:'extra', label:'其他要求', type:'text', placeholder:'例：保留所有专业术语', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位专业的中英翻译专家，擅长将中文翻译为地道英文。

## 任务

将以下中文文本翻译为英文。

## 领域：${cfg.field || '通用文本'}

## 翻译要求

- 使用地道的英文表达，避免翻译腔
- 学术文本保持正式严谨
- 技术文档保持准确简洁
- 保持原文的逻辑结构和段落划分
- 专业术语使用领域通用译法${cfg.extra ? `\n\n## 额外要求\n${cfg.extra}` : ''}

## 待翻译文本

${cfg.text || '【粘贴中文文本】'}`;
    }
  },
  en2cn: {
    fields: [
      { id:'text', label:'待翻译文本', type:'textarea', placeholder:'Paste English text...' },
      { id:'field', label:'领域', type:'select', options:['学术论文','技术文档','商务邮件','通用文本'] },
      { id:'extra', label:'其他要求', type:'text', placeholder:'例：保持原文的学术风格', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位专业的英中翻译专家，擅长将英文翻译为流畅中文。

## 任务

将以下英文文本翻译为中文。

## 领域：${cfg.field || '通用文本'}

## 翻译要求

- 流畅自然，避免翻译腔
- 使用中文习惯的句式结构
- 学术文本保持严谨
- 专业术语使用中文领域通用译法
- 长句适当拆分${cfg.extra ? `\n\n## 额外要求\n${cfg.extra}` : ''}

## 待翻译文本

${cfg.text || '【粘贴英文文本】'}`;
    }
  },
  polish: {
    fields: [
      { id:'text', label:'待润色文本', type:'textarea', placeholder:'粘贴需要润色的学术文本...' },
      { id:'field', label:'学科领域', type:'text', placeholder:'例：计算机科学' },
      { id:'target', label:'目标期刊级别', type:'select', options:['普通期刊','核心期刊','SCI/EI'] },
      { id:'extra', label:'其他要求', type:'text', placeholder:'例：需要符合APA格式', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位学术润色专家，擅长提升学术文本的表达质量。

## 任务

润色以下学术文本。

## 学科领域

${cfg.field || '【填写学科】'}
**目标级别：** ${cfg.target || '核心期刊'}

## 润色要求

- 修正语法错误和拼写问题
- 提升句子结构的多样性和流畅度
- 增强学术表达的准确性和严谨性
- 保持专业术语的一致性
- 不改变原文的核心内容和观点${cfg.extra ? `\n\n## 额外要求\n${cfg.extra}` : ''}

## 待润色文本

${cfg.text || '【粘贴学术文本】'}`;
    }
  },
  simplify: {
    fields: [
      { id:'text', label:'待改写文本', type:'textarea', placeholder:'粘贴需要通俗化的专业内容...' },
      { id:'audience', label:'目标读者', type:'text', placeholder:'例：初中生 / 普通大众' },
      { id:'extra', label:'其他要求', type:'text', placeholder:'例：用生活中的例子类比', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位科普写作专家，擅长将专业内容转化为大众可读的语言。

## 任务

将以下专业内容改写为通俗易懂的版本。

## 目标读者

${cfg.audience || '普通大众（无专业背景）'}

## 改写要求

- 用生活中的例子类比专业概念
- 避免使用专业术语，或首次出现时用括号解释
- 句子简短，每句话一个意思
- 可以用比喻、类比帮助理解
- 保持核心信息准确，不简化到失真${cfg.extra ? `\n\n## 额外要求\n${cfg.extra}` : ''}

## 待改写文本

${cfg.text || '【粘贴专业内容】'}`;
    }
  },
  tone: {
    fields: [
      { id:'text', label:'待转换文本', type:'textarea', placeholder:'粘贴需要转换语调的文本...' },
      { id:'from', label:'当前语调', type:'select', options:['正式','轻松','学术','商务','口语'] },
      { id:'to', label:'目标语调', type:'select', options:['正式','轻松','学术','商务','口语','专业严谨','亲切友好'] },
      { id:'extra', label:'其他要求', type:'text', placeholder:'例：保留所有数据', required:false },
    ],
    buildPrompt(cfg) {
      return `你是一位语调转换专家，擅长在不同语调间转换文本风格。

## 任务

将以下文本从「${cfg.from || '正式'}」语调转换为「${cfg.to || '轻松'}」语调。

## 转换要求

- 保持核心信息不变
- 调整用词、句式、节奏以匹配目标语调
- 不同语调的特征：
  - 正式：完整句式、被动语态、专业术语
  - 轻松：口语化、短句、有个人色彩
  - 学术：严谨逻辑、引用风格、客观表述
  - 商务：简洁高效、结论先行、行动导向${cfg.extra ? `\n\n## 额外要求\n${cfg.extra}` : ''}

## 待转换文本

${cfg.text || '【粘贴文本】'}`;
    }
  },
};
