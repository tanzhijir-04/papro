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
                <svg className="gs-tool-svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M23.748 4.651c-.254-.124-.364.113-.512.233-.051.04-.094.09-.137.137-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.155-.708-.311-.955-.65-.172-.24-.219-.509-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.094.172.187.129.323-.082.28-.18.553-.266.833-.055.179-.137.218-.328.14a5.5 5.5 0 0 1-1.737-1.179c-.857-.828-1.631-1.743-2.597-2.46a12 12 0 0 0-.689-.47c-.985-.957.13-1.743.387-1.836.27-.098.094-.433-.778-.428-.872.003-1.67.295-2.687.685a3 3 0 0 1-.465.136 9.6 9.6 0 0 0-2.883-.101c-1.885.21-3.39 1.1-4.497 2.622C.082 8.776-.231 10.854.152 13.02c.403 2.284 1.568 4.175 3.36 5.653 1.857 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.132-.284 4.994-1.86.47.234.962.328 1.78.398.629.058 1.235-.031 1.705-.129.735-.155.684-.836.418-.961-2.155-1.004-1.682-.595-2.112-.926 1.095-1.295 2.768-3.598 3.284-6.733.05-.346.115-.834.108-1.114-.004-.171.035-.238.23-.257a4.2 4.2 0 0 0 1.545-.475c1.397-.763 1.96-2.016 2.093-3.517.02-.23-.004-.467-.247-.588M11.58 18.168c-2.088-1.642-3.101-2.183-3.52-2.16-.39.024-.32.472-.234.763.09.288.207.487.371.74.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.168-1.361-.801-2.5-1.86-3.301-3.306-.775-1.393-1.225-2.888-1.299-4.482-.02-.385.094-.522.477-.592a4.7 4.7 0 0 1 1.53-.038c2.131.311 3.946 1.264 5.467 2.774.868.86 1.525 1.887 2.202 2.89.72 1.066 1.494 2.082 2.48 2.915.348.291.626.513.892.677-.802.09-2.14.109-3.055-.615zm1.001-6.44a.306.306 0 0 1 .415-.287.3.3 0 0 1 .113.074.3.3 0 0 1 .086.214c0 .17-.136.307-.308.307a.303.303 0 0 1-.306-.307m3.11 1.596c-.2.081-.4.151-.591.16a1.25 1.25 0 0 1-.798-.254c-.274-.23-.47-.358-.551-.758a1.7 1.7 0 0 1 .015-.588c.07-.327-.007-.537-.238-.727-.188-.156-.426-.199-.689-.199a.6.6 0 0 1-.254-.078.253.253 0 0 1-.114-.358 1 1 0 0 1 .192-.21c.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.392.451.462.576.685.915.176.264.336.536.446.848.066.194-.02.353-.25.45"/></svg>
                <div><strong>DeepSeek</strong><span>国内直接用</span></div>
              </a>
              <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" className="gs-tool">
                <svg className="gs-tool-svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997z"/></svg>
                <div><strong>ChatGPT</strong><span>最主流，免费版够用</span></div>
              </a>
              <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="gs-tool">
                <svg className="gs-tool-svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z"/></svg>
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
