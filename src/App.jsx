import { useRef, useCallback, useEffect } from "preact/hooks";
import { currentTab, toggleTheme, guideOpen } from "./store.js";
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

const MIN_W = 320;
const MAX_W = 700;
const EXPANDED_W = 420;
const COLLAPSED_W = 56;

function readGuideW() {
  try {
    const v = parseInt(localStorage.getItem("guide-w"), 10);
    return v >= MIN_W && v <= MAX_W ? v : EXPANDED_W;
  } catch { return EXPANDED_W; }
}

export function App() {
  const tab = currentTab.value;
  const TabComponent = TAB_COMPONENTS[tab];
  const isOpen = guideOpen.value;
  const layoutRef = useRef(null);
  const dragging = useRef(false);
  const guideW = useRef(isOpen ? readGuideW() : COLLAPSED_W);

  const applyW = useCallback((w) => {
    guideW.current = w;
    if (layoutRef.current) {
      layoutRef.current.style.setProperty("--guide-w", w + "px");
    }
  }, []);

  useEffect(() => { applyW(guideW.current); }, []);

  // Toggle collapse/expand
  const toggleGuide = useCallback(() => {
    const next = !guideOpen.value;
    guideOpen.value = next;
    if (next) {
      const w = readGuideW();
      applyW(w);
    } else {
      applyW(COLLAPSED_W);
    }
  }, [applyW]);

  // Drag handler
  const onDown = useCallback((e) => {
    if (!guideOpen.value) return;
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const startW = guideW.current;

    const onMove = (ev) => {
      if (!dragging.current) return;
      const cx = ev.clientX ?? ev.touches?.[0]?.clientX ?? 0;
      const delta = startX - cx;
      const newW = Math.round(Math.min(MAX_W, Math.max(MIN_W, startW + delta)));
      applyW(newW);
    };

    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      try { localStorage.setItem("guide-w", guideW.current); } catch {}
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onUp);
  }, [applyW, isOpen]);

  return (
    <div
      className={`app-layout${isOpen ? "" : " guide-closed"}`}
      ref={layoutRef}
      style={{ "--guide-w": (isOpen ? EXPANDED_W : COLLAPSED_W) + "px" }}
    >
      {/* ── Main Content ── */}
      <main className="app-main">
        <div className="app-shell" style={{ padding: "24px 0" }}>
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
              <a href="https://ifdian.net/a/tanz666/plan" target="_blank" rel="noopener noreferrer" className="sponsor-btn">
                <i className="ti ti-heart-filled" aria-hidden="true"></i>赞助
              </a>
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
            {" · "}
            <a href="https://ifdian.net/a/tanz666/plan" target="_blank" rel="noopener noreferrer" className="sponsor-link">
              <i className="ti ti-heart" aria-hidden="true"></i>赞助
            </a>
          </div>
        </div>
      </main>

      {/* ── Resize Handle ── */}
      {isOpen && (
        <div className="app-resize" onMouseDown={onDown} onTouchStart={onDown}>
          <div className="app-resize-line"></div>
        </div>
      )}

      {/* ── Guide Sidebar ── */}
      <aside className="app-guide">
        {isOpen ? (
          <WritingGuide />
        ) : (
          <div className="gs-collapsed">
            <button className="gs-expand-btn" onClick={toggleGuide} title="展开写作指南" aria-label="展开写作指南">
              <i className="ti ti-book-2" aria-hidden="true"></i>
            </button>
          </div>
        )}
      </aside>

      {/* ── Floating toggle (always visible) ── */}
      <button
        className={`guide-toggle${isOpen ? " open" : ""}`}
        onClick={toggleGuide}
        title={isOpen ? "收起指南" : "展开指南"}
        aria-label={isOpen ? "收起指南" : "展开指南"}
      >
        <i className={`ti ti-book-2`} aria-hidden="true"></i>
        <i className={`ti ti-chevron-${isOpen ? "right" : "left"}`} aria-hidden="true"></i>
      </button>
    </div>
  );
}
