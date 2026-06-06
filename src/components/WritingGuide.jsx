import { useEffect, useRef } from "preact/hooks";
import { guideProgress } from "../store.js";

const STEPS = [
  { id: "prep", num: 1, title: "准备" },
  { id: "topic", num: 2, title: "选题文献" },
  { id: "params", num: 3, title: "配置参数" },
  { id: "outline", num: 4, title: "创建大纲" },
  { id: "generate", num: 5, title: "生成提示词" },
  { id: "review", num: 6, title: "审阅修改" },
  { id: "humanize", num: 7, title: "去AI味" },
  { id: "faq", num: "?", title: "FAQ" },
];

function scrollToStep(id) {
  const el = document.getElementById(`gs-${id}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function WritingGuide() {
  const scrollRef = useRef(null);
  const cur = guideProgress.value;

  useEffect(() => {
    const c = scrollRef.current;
    if (!c) return;
    const onScroll = () => {
      let closest = 0;
      c.querySelectorAll("[data-gs]").forEach((sec) => {
        if (sec.getBoundingClientRect().top - c.getBoundingClientRect().top <= 80) {
          closest = parseInt(sec.dataset.gs, 10);
        }
      });
      if (closest !== guideProgress.value) guideProgress.value = closest;
    };
    c.addEventListener("scroll", onScroll, { passive: true });
    return () => c.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="gs">
      {/* Header */}
      <div className="gs-head">
        <div className="gs-head-icon"><i className="ti ti-book-2" aria-hidden="true"></i></div>
        <div>
          <div className="gs-head-title">写作指南</div>
          <div className="gs-head-sub">从零开始写出高质量论文</div>
        </div>
      </div>

      {/* Pill nav */}
      <nav className="gs-nav">
        {STEPS.map((s, i) => (
          <button key={s.id} className={`gs-pill${i === cur ? " on" : ""}`} onClick={() => scrollToStep(s.id)}>
            <span className="gs-pill-n">{s.num}</span>{s.title}
          </button>
        ))}
      </nav>

      {/* Scrollable content */}
      <div className="gs-body" ref={scrollRef}>

        {/* ═══ 1. 准备工作 ═══ */}
        <section className="gs-step" data-gs="0" id="gs-prep">
          <h4 className="gs-st"><span className="gs-st-n">1</span>准备工作</h4>
          <div className="gs-card">
            <h5><i className="ti ti-package" aria-hidden="true"></i> 你需要准备什么</h5>
            <ul>
              <li><strong>一台能上网的电脑</strong></li>
              <li><strong>一个 AI 聊天工具的账号</strong>：</li>
            </ul>
            <div className="gs-tools">
              <a href="https://kimi.moonshot.cn" target="_blank" rel="noopener noreferrer" className="gs-tool">
                <i className="ti ti-moon" style={{ color: "#a060a0" }}></i>
                <div><strong>Kimi</strong><span>国内直接用，推荐新手</span></div>
              </a>
              <a href="https://chat.deepseek.com" target="_blank" rel="noopener noreferrer" className="gs-tool">
                <i className="ti ti-device-desktop" style={{ color: "#3c82f6" }}></i>
                <div><strong>DeepSeek</strong><span>国内直接用</span></div>
              </a>
              <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" className="gs-tool">
                <svg className="gs-tool-svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>
                <div><strong>ChatGPT</strong><span>最主流，免费版够用</span></div>
              </a>
              <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="gs-tool">
                <svg className="gs-tool-svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M4.709 15.955l4.72-2.793c.498-.296.804-.836.804-1.419v-5.02a.847.847 0 0 0-.845-.843H7.57a.848.848 0 0 0-.846.843v4.053L4.02 13.159a1.672 1.672 0 0 0-.844 1.448v1.76c0 .388.213.75.562.934l.556.29c.34.184.696.184 1.037.042l-.326-.678zM19.291 15.955l-4.72-2.793c-.498-.296-.804-.836-.804-1.419v-5.02c0-.466.38-.843.845-.843h1.809c.466 0 .845.377.845.843v4.053l2.509 1.506a1.672 1.672 0 0 1 .844 1.448v1.76c0 .388-.213.75-.562.934l-.556.29c-.34.184-.696.184-1.037.042l.326-.678z"/></svg>
                <div><strong>Claude</strong><span>写长文质量高</span></div>
              </a>
            </div>
          </div>
          <div className="gs-card">
            <h5><i className="ti ti-message" aria-hidden="true"></i> 什么是"提示词"</h5>
            <p><strong>提示词就是你给 AI 下的"指令"。</strong>写得好，AI 给你高质量论文；写得差，给你一堆废话。</p>
            <p>知更·Paper 帮你<strong>自动生成高质量提示词</strong>，你只需复制粘贴。</p>
            <div className="gs-tip"><i className="ti ti-lightbulb"></i>提示词就像"给 AI 的考试大纲"——越详细，论文越符合要求。</div>
          </div>
        </section>

        {/* ═══ 2. 选题与文献 ═══ */}
        <section className="gs-step" data-gs="1" id="gs-topic">
          <h4 className="gs-st"><span className="gs-st-n">2</span>选题与文献</h4>
          <div className="gs-card">
            <h5><i className="ti ti-bulb" aria-hidden="true"></i> 怎么确定选题</h5>
            <p>导师给了题目直接用。没有的话用 AI 帮你想：</p>
            <div className="gs-code">我是[你的专业]的学生，需要写一篇[课程论文/毕业论文]，请推荐5个选题方向</div>
          </div>
          <div className="gs-card">
            <h5><i className="ti ti-book" aria-hidden="true"></i> 收集参考文献</h5>
            <p><strong>方法一：知网搜索</strong>（最靠谱）— 打开 cnki.net 搜索下载</p>
            <p><strong>方法二：AI 推荐</strong>（快但需核实）</p>
            <div className="gs-code">请推荐10篇关于[主题]的中文学术论文，给出作者、标题、年份和期刊名</div>
            <div className="gs-warn"><i className="ti ti-alert-triangle"></i><span><strong>AI 推荐的文献可能是编造的！</strong>务必去知网核实。</span></div>
          </div>
        </section>

        {/* ═══ 3. 配置参数 ═══ */}
        <section className="gs-step" data-gs="2" id="gs-params">
          <h4 className="gs-st"><span className="gs-st-n">3</span>配置参数</h4>
          <div className="gs-card">
            <h5><i className="ti ti-settings" aria-hidden="true"></i> 填写论文参数</h5>
            <ul>
              <li><strong>论文题目</strong>：没定先写占位，后面可改</li>
              <li><strong>论文类型</strong>：课程论文/毕业论文/期刊论文</li>
              <li><strong>写作版本</strong>：<strong>推荐版本A</strong>（你自己提供文献，更安全）</li>
            </ul>
          </div>
          <div className="gs-card">
            <h5><i className="ti ti-star" aria-hidden="true"></i> 核心内容（重要！）</h5>
            <ul>
              <li><strong>核心论点（必填）</strong>：2-3句话概括要论证什么</li>
              <li><strong>研究问题</strong>：你想回答什么问题</li>
              <li><strong>写作风格</strong>：理论推导/案例分析/数据实证等</li>
            </ul>
            <div className="gs-warn"><i className="ti ti-alert-triangle"></i><span>核心论点越具体，论文质量越高。不要写"研究人工智能"这种太笼统的。</span></div>
          </div>
        </section>

        {/* ═══ 4. 创建大纲 ═══ */}
        <section className="gs-step" data-gs="3" id="gs-outline">
          <h4 className="gs-st"><span className="gs-st-n">4</span>创建大纲</h4>
          <div className="gs-card">
            <h5><i className="ti ti-list" aria-hidden="true"></i> 大纲管理</h5>
            <p>切换到<strong>"大纲管理"</strong>标签，拖动滑块设置总字数，各章节按比例自动分配。</p>
            <div className="gs-ref-row">
              <div className="gs-ref"><span>课程论文</span><strong>3k–5k</strong></div>
              <div className="gs-ref"><span>本科毕业</span><strong>8k–15k</strong></div>
              <div className="gs-ref"><span>期刊论文</span><strong>5k–8k</strong></div>
              <div className="gs-ref"><span>硕士论文</span><strong>30k–50k</strong></div>
            </div>
          </div>
          <div className="gs-card">
            <h5><i className="ti ti-playlist-add" aria-hidden="true"></i> 自定义章节</h5>
            <ul>
              <li>点击"+"<strong>添加</strong>章节</li>
              <li>点击"×"<strong>删除</strong>章节</li>
              <li>拖动"⠿"图标<strong>调整顺序</strong></li>
              <li>滑块<strong>调整字数</strong></li>
            </ul>
          </div>
        </section>

        {/* ═══ 5. 生成提示词 ═══ */}
        <section className="gs-step" data-gs="4" id="gs-generate">
          <h4 className="gs-st"><span className="gs-st-n">5</span>生成提示词</h4>
          <div className="gs-card">
            <h5><i className="ti ti-sparkles" aria-hidden="true"></i> 生成 & 使用</h5>
            <ol>
              <li>切换到<strong>"生成提示词"</strong>标签</li>
              <li>检查配置是否齐全，缺的回去补齐</li>
              <li>点击<strong>"生成提示词"</strong></li>
              <li>点击<strong>"复制全部"</strong></li>
              <li>打开 AI 工具，<strong>粘贴</strong>到输入框，按 Enter</li>
            </ol>
            <div className="gs-warn"><i className="ti ti-alert-triangle"></i><span>论文超过 10000 字 AI 可能写不完，输入<strong>"继续"</strong>即可。</span></div>
          </div>
        </section>

        {/* ═══ 6. 审阅修改 ═══ */}
        <section className="gs-step" data-gs="5" id="gs-review">
          <h4 className="gs-st"><span className="gs-st-n">6</span>审阅修改</h4>
          <div className="gs-card">
            <h5><i className="ti ti-search" aria-hidden="true"></i> 审阅要点</h5>
            <ul>
              <li>用<strong>"论文审阅"</strong>标签生成审阅提示词</li>
              <li>检查论点是否有文献支撑</li>
              <li>检查引用格式是否统一</li>
              <li>检查章节过渡是否自然</li>
            </ul>
            <div className="gs-tip"><i className="ti ti-lightbulb"></i>让 AI 改时<strong>分段修改</strong>，每次只改一小部分效果更好。</div>
          </div>
        </section>

        {/* ═══ 7. 去AI味 ═══ */}
        <section className="gs-step" data-gs="6" id="gs-humanize">
          <h4 className="gs-st"><span className="gs-st-n">7</span>去 AI 味</h4>
          <div className="gs-card">
            <h5><i className="ti ti-shield-check" aria-hidden="true"></i> 写作优化</h5>
            <ul>
              <li>切换到<strong>"写作优化"</strong>标签</li>
              <li>24 个 AI 写作模式，默认全选</li>
              <li>优化强度建议先用 <strong>7</strong></li>
              <li>粘贴论文内容，生成优化提示词</li>
            </ul>
            <div className="gs-tip"><i className="ti ti-lightbulb"></i><strong>先改结构（第六步），再去 AI 味（第七步）</strong>，顺序不要反。</div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className="gs-step" data-gs="7" id="gs-faq">
          <h4 className="gs-st"><span className="gs-st-n gs-st-q">?</span>常见问题</h4>
          <div className="gs-card">
            <div className="gs-faq">
              <div className="gs-faq-q">AI 论文会被查重吗？</div>
              <div className="gs-faq-a">会。建议用自己的话改写至少 30%。</div>
            </div>
            <div className="gs-faq">
              <div className="gs-faq-q">AI 推荐的文献是真的吗？</div>
              <div className="gs-faq-a">不一定，务必去知网核实。</div>
            </div>
            <div className="gs-faq">
              <div className="gs-faq-q">免费版 AI 够用吗？</div>
              <div className="gs-faq-a">课程论文和一般毕业论文完全够用。</div>
            </div>
            <div className="gs-faq">
              <div className="gs-faq-q">知更·Paper 收费吗？</div>
              <div className="gs-faq-a">不收费，所有功能本地运行。</div>
            </div>
          </div>
        </section>

        {/* Bottom nav */}
        <div className="gs-bottom">
          <button className="gs-bbtn" onClick={() => cur > 0 && scrollToStep(STEPS[cur - 1].id)} disabled={cur <= 0}>
            <i className="ti ti-chevron-left"></i>上一步
          </button>
          <span className="gs-prog">{cur + 1}/{STEPS.length}</span>
          <button className="gs-bbtn" onClick={() => cur < STEPS.length - 1 && scrollToStep(STEPS[cur + 1].id)} disabled={cur >= STEPS.length - 1}>
            下一步<i className="ti ti-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
