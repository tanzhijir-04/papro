import { useEffect, useRef } from "preact/hooks";
import { guideProgress } from "../store.js";

const STEPS = [
  { id: "prep", num: 1, title: "准备工作" },
  { id: "topic", num: 2, title: "选题与文献" },
  { id: "params", num: 3, title: "配置参数" },
  { id: "outline", num: 4, title: "创建大纲" },
  { id: "generate", num: 5, title: "生成提示词" },
  { id: "review", num: 6, title: "审阅修改" },
  { id: "humanize", num: 7, title: "去AI味" },
  { id: "faq", num: "?", title: "常见问题" },
];

function scrollToSection(id) {
  const el = document.getElementById(`guide-step-${id}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function WritingGuide() {
  const contentRef = useRef(null);
  const currentStep = guideProgress.value;

  // Track scroll position to update progress
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const handleScroll = () => {
      const sections = container.querySelectorAll("[data-guide-step]");
      let closest = 0;
      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        if (rect.top - containerRect.top <= 100) {
          closest = parseInt(sec.dataset.guideStep, 10);
        }
      });
      if (closest !== guideProgress.value) {
        guideProgress.value = closest;
      }
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      scrollToSection(STEPS[currentStep + 1].id);
    }
  };
  const goPrev = () => {
    if (currentStep > 0) {
      scrollToSection(STEPS[currentStep - 1].id);
    }
  };

  return (
    <div className="guide-wrap">
      {/* Horizontal pill nav */}
      <nav className="guide-pills">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            className={`guide-pill${i === currentStep ? " active" : ""}`}
            onClick={() => scrollToSection(s.id)}
          >
            <span className="guide-pill-num">{s.num}</span>
            {s.title}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="guide-body" ref={contentRef}>
        {/* ═══ Step 1 ═══ */}
        <section className="guide-step" data-guide-step="0" id="guide-step-prep">
          <div className="guide-step-head">
            <div className="guide-step-num">1</div>
            <h3 className="guide-step-title">准备工作</h3>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-package" aria-hidden="true"></i> 1.1 你需要准备什么</h3>
            <ul>
              <li><strong>一台能上网的电脑</strong>（Windows 或 Mac 都行）</li>
              <li><strong>一个 AI 聊天工具的账号</strong>（推荐以下几个，选一个就行）：</li>
            </ul>
            <div className="guide-tool-grid">
              <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" className="guide-link-card">
                <div className="guide-link-icon"><i className="ti ti-brand-chatgpt"></i></div>
                <div className="guide-link-info">
                  <div className="guide-link-name">ChatGPT</div>
                  <div className="guide-link-url">chat.openai.com</div>
                  <div className="guide-link-desc">最主流，需要注册，免费版够用</div>
                </div>
              </a>
              <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="guide-link-card">
                <div className="guide-link-icon" style={{ background: "var(--an-teal-soft)", color: "var(--an-teal)" }}><i className="ti ti-robot"></i></div>
                <div className="guide-link-info">
                  <div className="guide-link-name">Claude</div>
                  <div className="guide-link-url">claude.ai</div>
                  <div className="guide-link-desc">写长文质量高，推荐</div>
                </div>
              </a>
              <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="guide-link-card">
                <div className="guide-link-icon" style={{ background: "rgba(124,109,235,0.1)", color: "#7c6deb" }}><i className="ti ti-sparkles"></i></div>
                <div className="guide-link-info">
                  <div className="guide-link-name">Gemini</div>
                  <div className="guide-link-url">gemini.google.com</div>
                  <div className="guide-link-desc">谷歌出品</div>
                </div>
              </a>
              <a href="https://kimi.moonshot.cn" target="_blank" rel="noopener noreferrer" className="guide-link-card">
                <div className="guide-link-icon" style={{ background: "rgba(200,120,200,0.1)", color: "#a060a0" }}><i className="ti ti-moon"></i></div>
                <div className="guide-link-info">
                  <div className="guide-link-name">Kimi</div>
                  <div className="guide-link-url">kimi.moonshot.cn</div>
                  <div className="guide-link-desc">国内直接用，推荐新手</div>
                </div>
              </a>
              <a href="https://chat.deepseek.com" target="_blank" rel="noopener noreferrer" className="guide-link-card">
                <div className="guide-link-icon" style={{ background: "rgba(60,130,246,0.1)", color: "#3c82f6" }}><i className="ti ti-device-desktop"></i></div>
                <div className="guide-link-info">
                  <div className="guide-link-name">DeepSeek</div>
                  <div className="guide-link-url">chat.deepseek.com</div>
                  <div className="guide-link-desc">国内直接用</div>
                </div>
              </a>
            </div>
            <ul style={{ marginTop: 12 }}>
              <li><strong>知更·Paper 工具</strong>（就是你现在打开的这个网页）</li>
            </ul>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-user-plus" aria-hidden="true"></i> 1.2 怎么注册 AI 聊天工具（以 Kimi 为例）</h3>
            <ol>
              <li>在浏览器地址栏输入 <code>kimi.moonshot.cn</code>，按<strong>回车键</strong></li>
              <li>点击右上角<strong>"注册"</strong>按钮</li>
              <li>输入手机号，点击"获取验证码"，把收到的验证码填进去</li>
              <li>设置密码，完成注册</li>
              <li>登录后你会看到一个聊天界面——底部有一个<strong>输入框</strong>，这就是你和 AI 对话的地方</li>
            </ol>
            <div className="tip-box">
              <i className="ti ti-lightbulb" aria-hidden="true"></i>
              <span>输入框通常在页面最底部，是一个长条形的文本区域，旁边有一个发送按钮（通常是箭头图标 ↑ 或 "发送"）。</span>
            </div>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-message" aria-hidden="true"></i> 1.3 什么是"提示词"</h3>
            <p><strong>简单说：提示词就是你给 AI 下的"指令"。</strong></p>
            <p>提示词写得好，AI 就能给你高质量的论文；写得差，AI 就会给你一堆废话。</p>
            <p>知更·Paper 的作用就是帮你<strong>自动生成高质量的提示词</strong>，你只需要复制粘贴。</p>
            <div className="tip-box">
              <i className="ti ti-lightbulb" aria-hidden="true"></i>
              <span>你可以把提示词理解成"给 AI 的考试大纲"——大纲越详细，AI 写出来的论文就越符合你的要求。</span>
            </div>
          </div>
        </section>

        {/* ═══ Step 2 ═══ */}
        <section className="guide-step" data-guide-step="1" id="guide-step-topic">
          <div className="guide-step-head">
            <div className="guide-step-num">2</div>
            <h3 className="guide-step-title">选题与文献收集</h3>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-bulb" aria-hidden="true"></i> 2.1 怎么确定选题</h3>
            <p>先想清楚你要写什么方向的论文（比如"人工智能在教育中的应用"）。</p>
            <p><strong>如果导师给了题目</strong>，直接用。</p>
            <p><strong>如果还没有题目</strong>，可以用 AI 帮你想：</p>
            <ol>
              <li>打开 Kimi / ChatGPT / Claude</li>
              <li>在输入框输入以下内容（把方括号里的替换成你自己的信息）：</li>
            </ol>
            <div className="code-block">我是[你的专业]的学生，需要写一篇[课程论文/毕业论文]，请帮我推荐5个选题方向，每个给一句话说明</div>
            <p>AI 会给你推荐选题，挑一个你觉得能写的。</p>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-book" aria-hidden="true"></i> 2.2 怎么收集参考文献</h3>
            <p><strong>方法一：知网搜索（最靠谱）</strong></p>
            <ol>
              <li>打开 <a href="https://www.cnki.net" target="_blank" rel="noopener noreferrer">cnki.net</a></li>
              <li>在搜索框输入你的关键词</li>
              <li>找到相关论文，点击下载 PDF（如果学校有知网账号可以免费下载）</li>
              <li>把下载的 PDF 文件放到一个文件夹里</li>
            </ol>
            <p style={{ marginTop: 12 }}><strong>方法二：让 AI 推荐（快但需核实）</strong></p>
            <div className="code-block">请推荐10篇关于[你的主题]的中文学术论文，给出作者、标题、发表年份和期刊名</div>
            <div className="warn-box">
              <i className="ti ti-alert-triangle" aria-hidden="true"></i>
              <span><strong>重要提醒：AI 推荐的文献可能是编造的！</strong>一定要去知网或 Google Scholar 每一篇核实是否真实存在。</span>
            </div>
            <p style={{ marginTop: 12 }}><strong>方法三：Google Scholar 搜索</strong></p>
            <ol>
              <li>打开 <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer">scholar.google.com</a></li>
              <li>搜索关键词，找到论文后下载</li>
            </ol>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-folder" aria-hidden="true"></i> 2.3 怎么保存文献信息</h3>
            <ol>
              <li>在电脑上新建一个文件夹，命名为<strong>"我的论文"</strong></li>
              <li>在这个文件夹里新建一个文本文件，命名为<strong>"文献清单.txt"</strong></li>
              <li>每找到一篇文献，就记下：<strong>作者、标题、年份、期刊</strong></li>
              <li>这些信息后面会用到</li>
            </ol>
          </div>
        </section>

        {/* ═══ Step 3 ═══ */}
        <section className="guide-step" data-guide-step="2" id="guide-step-params">
          <div className="guide-step-head">
            <div className="guide-step-num">3</div>
            <h3 className="guide-step-title">配置论文参数</h3>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-settings" aria-hidden="true"></i> 3.1 打开知更·Paper</h3>
            <p>在浏览器中打开知更·Paper 主页面。你会看到顶部有 <strong>5 个标签</strong>：</p>
            <div className="pill-row" style={{ margin: "8px 0" }}>
              <span className="pill selected" style={{ pointerEvents: "none" }}>论文参数</span>
              <span className="pill" style={{ pointerEvents: "none", opacity: 0.6 }}>大纲管理</span>
              <span className="pill" style={{ pointerEvents: "none", opacity: 0.6 }}>生成提示词</span>
              <span className="pill" style={{ pointerEvents: "none", opacity: 0.6 }}>论文审阅</span>
              <span className="pill" style={{ pointerEvents: "none", opacity: 0.6 }}>写作优化</span>
            </div>
            <p>点击<strong>"论文参数"</strong>标签（默认应该就在这个页面）。</p>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-edit" aria-hidden="true"></i> 3.2 填写基本信息</h3>
            <ul>
              <li><strong>论文题目</strong>：直接输入你的论文标题。如果还没定，先写"基于XXX的XXX研究"占位，后面可以改</li>
              <li><strong>提交场合</strong>：填"课程期末"/"毕业答辩"/"《XX期刊》投稿"等</li>
              <li><strong>论文类型</strong>：从下拉菜单选，有课程论文、毕业论文、期刊论文等。如果没有合适的，选"自定义"后手动输入</li>
              <li><strong>参考文献格式</strong>：问你的导师或看学校要求，一般本科论文用"GB/T 7714-2015"</li>
              <li><strong>写作版本</strong>：
                <ul>
                  <li><strong>版本 A</strong> —— 你自己有文献，AI 只能引用你提供的文献。<strong>推荐选这个</strong>，更安全</li>
                  <li><strong>版本 B</strong> —— 你没有文献，让 AI 基于知识库写。文献需要你自己核实真假</li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-users" aria-hidden="true"></i> 3.3 填写学科与受众</h3>
            <ul>
              <li><strong>学科领域</strong>：点击下面的标签选择（法学、经济学、计算机科学等），或者手动输入</li>
              <li><strong>研究方向</strong>：更细分的方向，比如"自然语言处理""教育技术"</li>
              <li><strong>目标读者</strong>：你的论文是给谁看的？一般选"课程任课教师"或"学位论文评审"</li>
            </ul>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-star" aria-hidden="true"></i> 3.4 填写核心内容（重要！）</h3>
            <ul>
              <li><strong>核心论点（必填）</strong>：用 2-3 句话概括你这篇论文要论证什么</li>
              <li><strong>研究问题</strong>：你想回答什么问题？</li>
              <li><strong>写作风格倾向</strong>：选一个最接近你需求的（理论推导、案例分析、数据实证等）</li>
              <li><strong>特殊约束</strong>：比如"不得使用第一人称""字数不超过 8000"</li>
            </ul>
            <div className="warn-box">
              <i className="ti ti-alert-triangle" aria-hidden="true"></i>
              <span>核心论点越具体，AI 写出来的论文质量越高。不要写"研究人工智能"这种太笼统的论点。</span>
            </div>
          </div>
        </section>

        {/* ═══ Step 4 ═══ */}
        <section className="guide-step" data-guide-step="3" id="guide-step-outline">
          <div className="guide-step-head">
            <div className="guide-step-num">4</div>
            <h3 className="guide-step-title">创建大纲</h3>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-list" aria-hidden="true"></i> 4.1 理解大纲管理页面</h3>
            <p>切换到<strong>"大纲管理"</strong>标签。你会看到：</p>
            <ul>
              <li>一个<strong>总字数滑块</strong>（默认 3000 字，可以拖动调整）</li>
              <li>下面是默认的章节列表：摘要、引言、研究背景与文献综述、研究方法、实验与结果、讨论、结论</li>
              <li>每个章节右侧有一个<strong>字数滑块</strong></li>
            </ul>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-arrows-maximize" aria-hidden="true"></i> 4.2 调整总字数</h3>
            <p>拖动顶部的滑块设置论文总字数。常见字数参考：</p>
            <div className="guide-ref-grid">
              <div className="guide-ref-item">
                <span className="guide-ref-label">课程论文</span>
                <span className="guide-ref-val">3,000 – 5,000 字</span>
              </div>
              <div className="guide-ref-item">
                <span className="guide-ref-label">本科毕业论文</span>
                <span className="guide-ref-val">8,000 – 15,000 字</span>
              </div>
              <div className="guide-ref-item">
                <span className="guide-ref-label">硕士学位论文</span>
                <span className="guide-ref-val">30,000 – 50,000 字</span>
              </div>
              <div className="guide-ref-item">
                <span className="guide-ref-label">期刊论文</span>
                <span className="guide-ref-val">5,000 – 8,000 字</span>
              </div>
            </div>
            <p>调整后，各章节的字数会按比例自动分配。</p>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-playlist-add" aria-hidden="true"></i> 4.3 自定义章节</h3>
            <ul>
              <li><strong>添加章节</strong>：点击底部的"+"按钮，输入章节名称，选择类型</li>
              <li><strong>删除章节</strong>：点击章节右侧的"×"按钮</li>
              <li><strong>调整顺序</strong>：拖动章节左侧的"⠿"图标</li>
              <li><strong>调整字数</strong>：每个章节的字数可以通过右侧滑块单独调整</li>
            </ul>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-layout-grid" aria-hidden="true"></i> 4.4 常见论文结构参考</h3>
            <div className="guide-structure-grid">
              <div className="guide-structure-item">
                <div className="guide-structure-label">课程论文</div>
                <div className="code-block">摘要 → 引言 → 正文（2-3 节）→ 结论 → 参考文献</div>
              </div>
              <div className="guide-structure-item">
                <div className="guide-structure-label">本科毕业论文</div>
                <div className="code-block">摘要 → 引言 → 文献综述 → 研究方法 → 结果与分析 → 讨论 → 结论</div>
              </div>
              <div className="guide-structure-item">
                <div className="guide-structure-label">期刊论文</div>
                <div className="code-block">Abstract → Introduction → Method → Results → Discussion → Conclusion</div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Step 5 ═══ */}
        <section className="guide-step" data-guide-step="4" id="guide-step-generate">
          <div className="guide-step-head">
            <div className="guide-step-num">5</div>
            <h3 className="guide-step-title">生成并使用写作提示词</h3>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-sparkles" aria-hidden="true"></i> 5.1 生成提示词</h3>
            <ol>
              <li>切换到<strong>"生成提示词"</strong>标签</li>
              <li>你会看到一个"配置检查"列表，显示你已经填了哪些信息、还缺哪些</li>
              <li>缺失的信息前面会有<strong>红色或黄色标记</strong>——回到对应的标签页补齐</li>
              <li>全部检查通过后，点击<strong>"生成提示词"</strong>按钮</li>
              <li>下方会出现一大段生成好的提示词文本</li>
            </ol>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-copy" aria-hidden="true"></i> 5.2 复制提示词</h3>
            <p>点击<strong>"复制全部"</strong>按钮，提示词会自动复制到剪贴板。</p>
            <p>如果复制不成功（有些浏览器会拦截），可以手动操作：</p>
            <ul>
              <li>用鼠标从头到尾<strong>选中</strong>输出框里的所有文字</li>
              <li>在选中的文字上点击鼠标<strong>右键</strong>，选择"复制"</li>
              <li>或者按键盘上的 <strong>Ctrl+C</strong>（Windows）/ <strong>Command+C</strong>（Mac）</li>
            </ul>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-send" aria-hidden="true"></i> 5.3 把提示词发给 AI（最关键的一步）</h3>
            <p><strong>以 Kimi 为例：</strong></p>
            <ol>
              <li>打开 Kimi 网页（<a href="https://kimi.moonshot.cn" target="_blank" rel="noopener noreferrer">kimi.moonshot.cn</a>），确保已经登录</li>
              <li>在底部的输入框里，点击鼠标<strong>右键</strong>，选择"粘贴"（或按 <strong>Ctrl+V</strong> / <strong>Command+V</strong>）</li>
              <li>提示词会出现在输入框里</li>
              <li>按<strong>回车键</strong>（Enter），或者点击发送按钮</li>
              <li>AI 开始工作，通常需要等待 30 秒到 2 分钟</li>
              <li>AI 会先给你"写前分析"，然后开始写论文</li>
            </ol>
            <p style={{ marginTop: 12 }}><strong>以 ChatGPT 为例：</strong></p>
            <ol>
              <li>打开 <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer">chat.openai.com</a></li>
              <li>在底部输入框粘贴提示词（Ctrl+V / Command+V）</li>
              <li>按 Enter 发送</li>
              <li>等待 AI 输出</li>
            </ol>
            <p style={{ marginTop: 12 }}><strong>以 Claude 为例：</strong></p>
            <ol>
              <li>打开 <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">claude.ai</a></li>
              <li>在输入框粘贴提示词</li>
              <li>按 Enter 发送</li>
            </ol>
            <div className="warn-box">
              <i className="ti ti-alert-triangle" aria-hidden="true"></i>
              <span>
                <strong>如果论文很长（10000 字以上）</strong>，AI 可能一次写不完，会输出到一半就停了。
                这时候直接在输入框输入<strong>"继续"</strong>，AI 就会接着写。
                如果 AI 输出的内容不满意，可以输入<strong>"请重新写第 X 节，要求……"</strong>来让 AI 修改。
              </span>
            </div>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-device-floppy" aria-hidden="true"></i> 5.4 保存 AI 的输出</h3>
            <ol>
              <li>AI 写完后，选中全部输出内容，复制</li>
              <li>打开你的"我的论文"文件夹，新建一个文本文件，命名为<strong>"初稿.txt"</strong></li>
              <li>粘贴进去，保存</li>
            </ol>
          </div>
        </section>

        {/* ═══ Step 6 ═══ */}
        <section className="guide-step" data-guide-step="5" id="guide-step-review">
          <div className="guide-step-head">
            <div className="guide-step-num">6</div>
            <h3 className="guide-step-title">审阅与修改</h3>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-search" aria-hidden="true"></i> 6.1 用知更·Paper 审阅</h3>
            <ol>
              <li>切换到<strong>"论文审阅"</strong>标签</li>
              <li>选择审阅维度（勾选你关心的方面，如逻辑结构、语言质量、AIGC 痕迹检测）</li>
              <li>选择审阅等级（本科/硕士/博士/期刊投稿）</li>
              <li>把 AI 写好的论文内容<strong>粘贴</strong>到"论文内容"输入框</li>
              <li>点击<strong>"生成审阅提示词"</strong></li>
              <li>复制生成的审阅提示词，发给 AI</li>
              <li>AI 会给出逐维度的诊断和改写建议</li>
            </ol>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-eye-check" aria-hidden="true"></i> 6.2 手动审阅要点</h3>
            <p>即使不用工具，也要检查这些：</p>
            <ul>
              <li>通读一遍，看是否通顺</li>
              <li>检查每个论点是否有文献支撑</li>
              <li>检查引用格式是否统一</li>
              <li>检查是否有错别字和语法错误</li>
              <li>检查章节之间的过渡是否自然</li>
            </ul>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-pencil" aria-hidden="true"></i> 6.3 让 AI 帮你改</h3>
            <p>在 AI 聊天工具中输入：</p>
            <div className="code-block">{"请帮我修改以下论文段落，要求：[具体要求]\n\n[粘贴需要修改的段落]"}</div>
            <div className="tip-box">
              <i className="ti ti-lightbulb" aria-hidden="true"></i>
              <span>可以分段修改，每次只改一小部分，效果更好。</span>
            </div>
          </div>
        </section>

        {/* ═══ Step 7 ═══ */}
        <section className="guide-step" data-guide-step="6" id="guide-step-humanize">
          <div className="guide-step-head">
            <div className="guide-step-num">7</div>
            <h3 className="guide-step-title">去 AI 味（写作优化）</h3>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-shield-check" aria-hidden="true"></i> 7.1 为什么要去 AI 味</h3>
            <ul>
              <li>很多学校和期刊会用 <strong>AIGC 检测工具</strong>检查论文</li>
              <li>如果 AI 味太重，可能会被判定为 AI 代写，<strong>后果严重</strong></li>
              <li>知更·Paper 的"写作优化"功能可以帮你生成去 AI 味的提示词</li>
            </ul>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-feather" aria-hidden="true"></i> 7.2 使用方法</h3>
            <ol>
              <li>切换到<strong>"写作优化"</strong>标签</li>
              <li>你会看到 24 个 AI 写作模式，默认全选</li>
              <li>下面可以调整：
                <ul>
                  <li><strong>优化强度</strong>：越高改得越狠，建议先用 7 试试</li>
                  <li><strong>目标语调</strong>：学术论文选"专业严谨"或"学术正式"</li>
                  <li><strong>文本类型</strong>：选"学术论文"</li>
                </ul>
              </li>
              <li>在"待处理文本"框里<strong>粘贴你的论文内容</strong></li>
              <li>点击<strong>"生成优化提示词"</strong></li>
              <li>复制提示词，发给 AI</li>
              <li>AI 会返回：改写后的文本 + 修改摘要 + 质量评分</li>
            </ol>
          </div>

          <div className="sub-card">
            <h3><i className="ti ti-refresh" aria-hidden="true"></i> 7.3 循环优化</h3>
            <ul>
              <li>如果第一次去 AI 味后效果还不够好，可以<strong>调高强度再做一次</strong></li>
              <li>建议：<strong>先改结构问题（第六步），再去 AI 味（第七步）</strong>，顺序不要反</li>
            </ul>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className="guide-step guide-step-faq" data-guide-step="7" id="guide-step-faq">
          <div className="guide-step-head">
            <div className="guide-step-num" style={{ background: "var(--an-teal)" }}>?</div>
            <h3 className="guide-step-title">常见问题 FAQ</h3>
          </div>

          <div className="sub-card">
            <div className="faq-grid">
              <div className="faq-item">
                <div className="faq-q">AI 写的论文会被查重吗？</div>
                <div className="faq-a">会。AI 生成的内容可能与其他 AI 生成的内容重复。建议在 AI 写完后，<strong>用自己的话改写至少 30%</strong> 的内容。</div>
              </div>
              <div className="faq-item">
                <div className="faq-q">AI 推荐的参考文献是真的吗？</div>
                <div className="faq-a">不一定。AI 经常编造不存在的文献。<strong>每一篇文献都要去知网或 Google Scholar 核实。</strong></div>
              </div>
              <div className="faq-item">
                <div className="faq-q">免费版的 AI 工具够用吗？</div>
                <div className="faq-a">对于课程论文和一般毕业论文，免费版完全够用。如果论文很长（2 万字以上），可能需要分多次对话完成。</div>
              </div>
              <div className="faq-item">
                <div className="faq-q">提示词可以反复使用吗？</div>
                <div className="faq-a">可以。同一个提示词发给不同的 AI 工具（比如先发给 ChatGPT，再发给 Claude），对比结果，选最好的。</div>
              </div>
              <div className="faq-item">
                <div className="faq-q">知更·Paper 需要付费吗？</div>
                <div className="faq-a">不需要。知更·Paper 是免费工具，所有功能本地运行，不需要联网。</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Nav Buttons ── */}
        <div className="guide-bottom-nav">
          <button className="btn guide-nav-btn" onClick={goPrev} disabled={currentStep <= 0}>
            <i className="ti ti-chevron-left" aria-hidden="true"></i> 上一步
          </button>
          <span className="guide-progress-text">
            {currentStep + 1} / {STEPS.length}
          </span>
          <button className="btn guide-nav-btn" onClick={goNext} disabled={currentStep >= STEPS.length - 1}>
            下一步 <i className="ti ti-chevron-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
