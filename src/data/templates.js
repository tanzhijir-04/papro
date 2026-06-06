// Academic Writing Templates - 5 templates
// 知更·Paper v3.0 — pure academic focus

export const tplCategories = [
  { id:'all', name:'全部' },
  { id:'academic', name:'学术' },
];

export const tplCatColors = {
  academic:'var(--an-primary)',
};

export const templates = [
  { id:'review', name:'文献综述', cat:'academic', desc:'基于真实文献撰写结构化学术综述', tags:['学术','综述','研究'] },
  { id:'abstract', name:'论文摘要', cat:'academic', desc:'生成符合期刊规范的中英文摘要', tags:['学术','摘要','精炼'] },
  { id:'proposal', name:'开题报告', cat:'academic', desc:'包含研究背景、文献综述、研究方案的完整开题报告', tags:['学术','开题','研究计划'] },
  { id:'critique', name:'论文评审意见', cat:'academic', desc:'模拟审稿人给出结构化的论文评审意见', tags:['学术','评审','审稿'] },
  { id:'defense', name:'答辩提纲', cat:'academic', desc:'生成论文答辩PPT逐页讲稿与常见问题应答', tags:['学术','答辩','演示'] },
];
