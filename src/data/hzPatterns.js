// 24 AI Writing Patterns for Humanizer
// Extracted from prompt_manager.html

export const hzPatterns = [
  { id:1, name:'过度强调意义', cat:'content', brief:'夸大的象征意义、遗产和更广泛趋势', kw:'作为/标志着/见证了/是……的体现' },
  { id:2, name:'过度强调知名度', cat:'content', brief:'反复强调媒体报道和知名度主张', kw:'独立报道/地方媒体/由知名专家' },
  { id:3, name:'肤浅的 -ing 分析', cat:'content', brief:'用现在分词短语增加虚假深度', kw:'突出/强调/彰显……/确保……' },
  { id:4, name:'宣传广告式语言', cat:'content', brief:'夸张的宣传性用语', kw:'充满活力的/丰富的/令人叹为观止' },
  { id:5, name:'模糊归因', cat:'content', brief:'将观点归因于模糊权威而非具体来源', kw:'行业报告/观察者指出/专家认为' },
  { id:6, name:'提纲式挑战展望', cat:'content', brief:'公式化的"挑战与未来展望"部分', kw:'尽管其……面临挑战/未来展望' },
  { id:7, name:'AI 高频词汇', cat:'language', brief:'过度使用特定的 AI 偏好词汇', kw:'此外/至关重要/深入探讨/格局/复杂性' },
  { id:8, name:'系动词回避', cat:'language', brief:'用复杂结构替代简单的"是"', kw:'作为/代表/标志着/充当' },
  { id:9, name:'否定式排比', cat:'language', brief:'过度使用"不仅……而且……"结构', kw:'不仅仅……而是……' },
  { id:10, name:'三段式法则', cat:'language', brief:'强行将想法分成三组', kw:'三项并列列举' },
  { id:11, name:'刻意换词', cat:'language', brief:'过度使用同义词替换避免重复', kw:'近义词循环替换' },
  { id:12, name:'虚假范围', cat:'language', brief:'使用"从X到Y"结构但无实际意义', kw:'从……到……的旅程' },
  { id:13, name:'破折号过度使用', cat:'style', brief:'比人类更频繁地使用破折号', kw:'——' },
  { id:14, name:'粗体过度使用', cat:'style', brief:'机械地用粗体强调短语', kw:'**粗体**' },
  { id:15, name:'内联标题列表', cat:'style', brief:'列表项以粗体标题+冒号开头', kw:'- **标题：**' },
  { id:16, name:'标题大写', cat:'style', brief:'标题中所有主要单词大写（英文）', kw:'Title Case Headings' },
  { id:17, name:'表情符号滥用', cat:'style', brief:'用表情符号装饰标题或项目符号', kw:'🚀 💡 ✅' },
  { id:18, name:'弯引号', cat:'style', brief:'使用弯引号而非直引号', kw:'双引号 单引号' },
  { id:19, name:'协作交流痕迹', cat:'comm', brief:'聊天机器人对话痕迹被粘贴为内容', kw:'希望这对您有帮助/请告诉我' },
  { id:20, name:'知识截止免责声明', cat:'comm', brief:'AI知识截止日期免责声明残留', kw:'截至[日期]/根据我的训练更新' },
  { id:21, name:'谄媚讨好语气', cat:'comm', brief:'过于积极、讨好的语言', kw:'好问题！/您说得完全正确' },
  { id:22, name:'填充短语', cat:'filler', brief:'冗长的开场白和强调性拐杖词', kw:'值得注意的是/为了实现这一目标' },
  { id:23, name:'过度限定', cat:'filler', brief:'过度限定陈述，削弱表达力', kw:'可以潜在地可能被认为' },
  { id:24, name:'通用积极结论', cat:'filler', brief:'模糊乐观的结尾，缺乏具体信息', kw:'未来看起来光明/激动人心的时代' },
];

export const hzCategories = [
  { id:'all', name:'全部' },
  { id:'content', name:'内容模式' },
  { id:'language', name:'语言语法' },
  { id:'style', name:'风格模式' },
  { id:'comm', name:'交流模式' },
  { id:'filler', name:'填充回避' },
];
