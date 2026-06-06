import { currentTab, toggleTheme } from "./store.js";
import { TabBar } from "./components/TabBar.jsx";
import { PaperParams } from "./components/PaperParams.jsx";
import { OutlineManager } from "./components/OutlineManager.jsx";
import { GeneratePrompt } from "./components/GeneratePrompt.jsx";
import { PaperReview } from "./components/PaperReview.jsx";
import { Humanizer } from "./components/Humanizer.jsx";
import { WritingGuide } from "./components/WritingGuide.jsx";

const TAB_COMPONENTS = {
  params: PaperParams,
  outline: OutlineManager,
  output: GeneratePrompt,
  review: PaperReview,
  humanizer: Humanizer,
};

export function App() {
  const tab = currentTab.value;
  const TabComponent = TAB_COMPONENTS[tab];

  return (
    <div className="app-shell" style={{ padding: "24px 0", maxWidth: 680, margin: "0 auto" }}>
      {/* Header */}
      <div className="anim-fade-up header-row" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
            知更·Paper
            <span style={{ fontSize: 12, fontWeight: 400, color: "var(--an-muted-soft)", fontFamily: "var(--an-sans)", letterSpacing: "0.02em" }}>
              学术论文智能写作助手
            </span>
          </h2>
        </div>
        <div className="header-badges" style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span className="badge badge-a">
            <i className="ti ti-file-text" aria-hidden="true"></i>版本 A
          </span>
          <span className="badge badge-b">
            <i className="ti ti-file" aria-hidden="true"></i>版本 B
          </span>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title="切换深色/浅色模式"
            aria-label="切换深色模式"
          >
            <i className="ti ti-moon icon-moon" aria-hidden="true"></i>
            <i className="ti ti-sun icon-sun" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="anim-fade-up" style={{ animationDelay: "60ms" }}>
        <TabBar />
      </div>

      {/* Tab Content */}
      <div key={tab} className="tab-panel">
        {TabComponent && <TabComponent />}
      </div>

      {/* Footer */}
      <div className="dev-footer">
        Designed & built by{" "}
        <span className="dev-name">tanzhijir-04</span>{" "}
        · <a href="https://github.com/tanzhijir-04/papro" target="_blank" rel="noopener noreferrer">GitHub</a>
        {" · "}
        <span style={{ color: "var(--an-muted-soft)" }}>知更·Paper</span>
      </div>

      {/* ── Writing Guide (full-width below) ── */}
      <div className="guide-section">
        <div className="guide-section-header">
          <div className="guide-section-icon">
            <i className="ti ti-book-2" aria-hidden="true"></i>
          </div>
          <div>
            <h2 className="guide-section-title">论文写作完全指南</h2>
            <p className="guide-section-sub">从零开始，用 AI 工具写出高质量学术论文 — 适用于课程论文、毕业论文、期刊投稿等各类中文学术写作场景</p>
          </div>
        </div>
        <WritingGuide />
      </div>
    </div>
  );
}
