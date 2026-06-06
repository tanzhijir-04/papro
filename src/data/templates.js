// 25 Writing Templates - Category Definitions
// Extracted from prompt_manager.html

export const tplCategories = [
  { id:'all', name:'全部' },
  { id:'academic', name:'学术' },
  { id:'content', name:'内容创作' },
  { id:'business', name:'职场' },
  { id:'tech', name:'技术' },
  { id:'translate', name:'翻译润色' },
];

export const tplCatColors = {
  academic:'var(--an-primary)',
  content:'var(--an-accent-teal)',
  business:'var(--an-accent-amber)',
  tech:'#7c6deb',
  translate:'#c76dba',
};

export const templates = [
  { id:'review', name:'文献综述', cat:'academic', desc:'基于真实文献撰写结构化学术综述', tags:['学术','综述','研究'] },
  { id:'abstract', name:'论文摘要', cat:'academic', desc:'生成符合期刊规范的中英文摘要', tags:['学术','摘要','精炼'] },
  { id:'proposal', name:'开题报告', cat:'academic', desc:'包含研究背景、文献综述、研究方案的完整开题报告', tags:['学术','开题','研究计划'] },
  { id:'critique', name:'论文评审意见', cat:'academic', desc:'模拟审稿人给出结构化的论文评审意见', tags:['学术','评审','审稿'] },
  { id:'defense', name:'答辩提纲', cat:'academic', desc:'生成论文答辩PPT逐页讲稿与常见问题应答', tags:['学术','答辩','演示'] },
  { id:'wechat', name:'公众号长文', cat:'content', desc:'口语化但有深度，适合公众号、知乎等平台', tags:['公众号','长文','自媒体'] },
  { id:'xiaohongshu', name:'小红书种草', cat:'content', desc:'活泼、有感染力的小红书风格文案', tags:['小红书','种草','社交'] },
  { id:'zhihu', name:'知乎回答', cat:'content', desc:'专业、有理有据的知乎风格回答', tags:['知乎','回答','专业'] },
  { id:'thread', name:'Twitter/X 线程', cat:'content', desc:'适合信息密度高的推文线程', tags:['Twitter','线程','短内容'] },
  { id:'newsletter', name:'邮件通讯', cat:'content', desc:'简洁有料的Newsletter风格', tags:['Newsletter','邮件','订阅'] },
  { id:'weekly', name:'周报/月报', cat:'business', desc:'用"完成/推进/解决"开头，结果导向', tags:['周报','月报','汇报'] },
  { id:'email', name:'商务邮件', cat:'business', desc:'专业、简洁、有行动项的商务邮件', tags:['邮件','商务','正式'] },
  { id:'prd', name:'PRD 需求文档', cat:'business', desc:'完整的产品需求文档模板', tags:['PRD','产品','需求'] },
  { id:'okr', name:'OKR 目标设定', cat:'business', desc:'撰写可量化、有挑战性的OKR', tags:['OKR','目标','管理'] },
  { id:'review-biz', name:'项目复盘', cat:'business', desc:'结构化的项目复盘报告', tags:['复盘','项目','总结'] },
  { id:'tech-blog', name:'技术博客', cat:'tech', desc:'先说"是什么"和"为什么"，必须有代码示例', tags:['博客','技术','教程'] },
  { id:'api-doc', name:'API 文档', cat:'tech', desc:'清晰的API接口文档，含请求/响应示例', tags:['API','文档','接口'] },
  { id:'readme', name:'README', cat:'tech', desc:'项目README，含安装、使用、贡献指南', tags:['README','开源','项目'] },
  { id:'postmortem', name:'故障复盘', cat:'tech', desc:'技术故障的根因分析和改进方案', tags:['故障','复盘','SRE'] },
  { id:'rfc', name:'RFC 技术提案', cat:'tech', desc:'结构化的技术方案设计文档', tags:['RFC','设计','方案'] },
  { id:'cn2en', name:'中译英润色', cat:'translate', desc:'将中文翻译为地道英文，保留学术/专业风格', tags:['翻译','中英','润色'] },
  { id:'en2cn', name:'英译中润色', cat:'translate', desc:'将英文翻译为流畅中文，避免翻译腔', tags:['翻译','英中','润色'] },
  { id:'polish', name:'学术润色', cat:'translate', desc:'提升学术文本的表达质量和规范性', tags:['润色','学术','规范'] },
  { id:'simplify', name:'通俗化改写', cat:'translate', desc:'将专业内容转化为大众可读的语言', tags:['改写','通俗','科普'] },
  { id:'tone', name:'语调转换', cat:'translate', desc:'在正式/轻松/专业/亲切等语调间转换', tags:['语调','风格','转换'] },
];
