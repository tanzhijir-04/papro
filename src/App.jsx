import { useRef, useCallback, useEffect } from "preact/hooks";
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

const MIN_W = 320;
const MAX_W = 700;
const DEFAULT_W = 420;

function initGuideW() {
  try {
    const v = parseInt(localStorage.getItem("guide-w"), 10);
    return v >= MIN_W && v <= MAX_W ? v : DEFAULT_W;
  } catch { return DEFAULT_W; }
}

export function App() {
  const tab = currentTab.value;
  const TabComponent = TAB_COMPONENTS[tab];
  const layoutRef = useRef(null);
  const dragging = useRef(false);
  const guideW = useRef(initGuideW());

  // Apply width to CSS variable
  const applyW = useCallback((w) => {
    guideW.current = w;
    if (layoutRef.current) {
      layoutRef.current.style.setProperty("--guide-w", w + "px");
    }
  }, []);

  // Initialize on mount
  useEffect(() => { applyW(guideW.current); }, []);

  // Drag handlers
  const onDown = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const startW = guideW.current;

    const onMove = (ev) => {
      if (!dragging.current) return;
      const cx = ev.clientX ?? ev.touches?.[0]?.clientX ?? 0;
      const delta = startX - cx; // dragging left = wider guide
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
  }, [applyW]);

  return (
    <div className="app-layout" ref={layoutRef} style={{ "--guide-w": DEFAULT_W + "px" }}>
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
        </div>
      </main>

      {/* ── Resize Handle ── */}
      <div className="app-resize" onMouseDown={onDown} onTouchStart={onDown}>
        <div className="app-resize-line"></div>
      </div>

      {/* ── Guide Sidebar ── */}
      <aside className="app-guide">
        <WritingGuide />
      </aside>
    </div>
  );
}
