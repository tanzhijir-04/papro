import { useRef, useCallback, useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { sections, totalWords, distributeWords, paintRange } from "../store.js";

const SECTION_TYPES = [
  { value: "body", label: "主体章节" },
  { value: "intro", label: "引言" },
  { value: "abstract", label: "摘要" },
  { value: "conclusion", label: "结论" },
];

const TYPE_LABELS = { abstract: "摘要", intro: "引言", body: "主体", conclusion: "结论" };

export function OutlineManager() {
  const total = totalWords.value;
  const secs = sections.value;
  const newSectionName = useSignal("");
  const newSectionType = useSignal("body");
  const dragSrcRef = useRef(null);
  const dragAllowedRef = useRef(false);

  const allocated = secs.reduce((sum, s) => sum + s.words, 0);
  const deviation = total > 0 ? Math.abs(allocated - total) / total : 0;
  const isWarning = deviation > 0.05;

  const updateWords = useCallback((id, val) => {
    sections.value = sections.value.map((s) =>
      s.id === id ? { ...s, words: parseInt(val) || 0 } : s
    );
  }, []);

  const removeSection = useCallback((id) => {
    sections.value = sections.value.filter((s) => s.id !== id);
  }, []);

  const addSection = useCallback(() => {
    const name = newSectionName.value.trim();
    if (!name) return;
    sections.value = [
      ...sections.value,
      { id: "s" + Date.now(), name, type: newSectionType.value, words: 500, locked: false },
    ];
    newSectionName.value = "";
  }, [newSectionName.value, newSectionType.value]);

  const handleDragStart = useCallback((e, idx) => {
    if (!dragAllowedRef.current) { e.preventDefault(); return; }
    dragSrcRef.current = idx;
    e.dataTransfer.effectAllowed = "move";
    e.target.classList.add("dragging");
    dragAllowedRef.current = false;
  }, []);

  const handleDragOver = useCallback((e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    e.currentTarget.classList.add("drag-over");
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.currentTarget.classList.remove("drag-over");
  }, []);

  const handleDrop = useCallback((e, toIdx) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    const fromIdx = dragSrcRef.current;
    if (fromIdx === null || fromIdx === toIdx) return;
    const newSecs = [...secs];
    const [moved] = newSecs.splice(fromIdx, 1);
    newSecs.splice(toIdx, 0, moved);
    sections.value = newSecs;
  }, [secs]);

  const handleDragEnd = useCallback((e) => {
    e.target.classList.remove("dragging");
    document.querySelectorAll(".outline-item").forEach((el) => el.classList.remove("drag-over"));
  }, []);

  const handleMouseDown = useCallback(() => { dragAllowedRef.current = true; }, []);

  return (
    <div className="stagger">
      {/* Word Count Planner */}
      <div className="card">
        <div className="section-title">字数规划</div>
        <div className="range-row">
          <input
            type="range"
            min="1000"
            max="15000"
            step="500"
            value={total}
            onInput={(e) => {
              totalWords.value = parseInt(e.target.value);
              distributeWords();
              paintRange(e.target);
            }}
            ref={(el) => { if (el) paintRange(el); }}
          />
          <span className="range-val">{total.toLocaleString()} 字</span>
        </div>
      </div>

      {/* Outline List */}
      <div className="card">
        <div className="section-title">大纲章节</div>
        <ul className="outline-list">
          {secs.map((s, i) => {
            const pct = total > 0 ? Math.min(100, Math.round((s.words / total) * 100)) : 0;
            return (
              <li
                key={s.id}
                className="outline-item"
                draggable
                onDragStart={(e) => handleDragStart(e, i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, i)}
                onDragEnd={handleDragEnd}
              >
                <span
                  className="drag-handle"
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleMouseDown}
                >
                  <i className="ti ti-grip-vertical" aria-hidden="true"></i>
                </span>
                <div className="item-body">
                  <div className="item-name">{s.name}</div>
                  <div className="item-meta">
                    <span className="type-tag">{TYPE_LABELS[s.type] || "章节"}</span>
                    <span>{s.words.toLocaleString()} 字（{pct}%）</span>
                  </div>
                  <div className="word-bar">
                    <div className="word-bar-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="range-row" style={{ marginTop: 8 }}>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="50"
                      value={s.words}
                      onInput={(e) => {
                        updateWords(s.id, e.target.value);
                        paintRange(e.target);
                      }}
                      ref={(el) => { if (el) paintRange(el); }}
                    />
                    <span className="range-val" style={{ minWidth: 48 }}>{s.words}</span>
                  </div>
                </div>
                <div className="item-actions">
                  <button className="act-btn" onClick={() => removeSection(s.id)} title="删除章节">
                    <i className="ti ti-trash" aria-hidden="true"></i>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Total Row */}
        <div className="total-row">
          <span>
            已分配 <strong className="total-num" style={{ color: isWarning ? "var(--an-warning)" : "var(--an-ink)" }}>
              {allocated.toLocaleString()}
            </strong> / {total.toLocaleString()} 字
          </span>
          {isWarning && <span className="warn">偏差超过 5%</span>}
        </div>

        {/* Add Section */}
        <div className="add-section">
          <input
            type="text"
            placeholder="新章节名称"
            value={newSectionName.value}
            onInput={(e) => { newSectionName.value = e.target.value; }}
            onKeyDown={(e) => { if (e.key === "Enter") addSection(); }}
          />
          <select
            value={newSectionType.value}
            onChange={(e) => { newSectionType.value = e.target.value; }}
          >
            {SECTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <button className="btn-primary btn-sm" onClick={addSection}>
            <i className="ti ti-plus" aria-hidden="true"></i> 添加
          </button>
        </div>
      </div>
    </div>
  );
}
