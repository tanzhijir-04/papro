import { useSignal } from "@preact/signals";
import { useState, useEffect } from "preact/hooks";
import {
  tplCurrentCat, tplSelected, tplView, tplFavorites, tplHistory,
  pendingText, currentTab, showToast,
} from "../store.js";
import { templates, tplCategories, tplCatColors } from "../data/templates.js";
import { tplConfigs } from "../data/tplConfigs.js";

function TemplateCard({ t, isSelected, isFav, onSelect, onToggleFav }) {
  const catColor = tplCatColors[t.cat] || "var(--an-primary)";
  const catName = tplCategories.find((c) => c.id === t.cat)?.name || t.cat;

  return (
    <div
      className={`tpl-card${isSelected ? " selected" : ""}`}
      onClick={() => onSelect(t.id)}
    >
      <div className="tpl-card-head">
        <div>
          <div className="tpl-card-name">{t.name}</div>
          <div className="tpl-card-cat" style={{ color: catColor }}>{catName}</div>
        </div>
        <button
          className={`tpl-fav-btn${isFav ? " active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onToggleFav(t.id); }}
          title={isFav ? "取消收藏" : "收藏"}
        >
          {isFav ? "♥" : "♡"}
        </button>
      </div>
      <div className="tpl-card-desc">{t.desc}</div>
      <div className="tpl-card-tags">
        {t.tags.map((tag) => <span key={tag} className="tpl-tag">{tag}</span>)}
      </div>
    </div>
  );
}

function ConfigPanel({ template, onGenerate }) {
  const cfg = tplConfigs[template.id];
  const [values, setValues] = useState({});
  const isFav = tplFavorites.value.includes(template.id);

  const catColor = tplCatColors[template.cat] || "var(--an-primary)";
  const catName = tplCategories.find((c) => c.id === template.cat)?.name || template.cat;

  const updateField = (id, val) => {
    setValues((prev) => ({ ...prev, [id]: val }));
  };

  const handleToggleFav = () => {
    const favs = [...tplFavorites.value];
    const idx = favs.indexOf(template.id);
    if (idx >= 0) favs.splice(idx, 1);
    else favs.push(template.id);
    tplFavorites.value = favs;
    localStorage.setItem("tpl-favorites", JSON.stringify(favs));
  };

  return (
    <div className="tpl-config-panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <span style={{ fontSize: 10, fontWeight: 700, color: catColor, letterSpacing: "0.5px", textTransform: "uppercase" }}>{catName}</span>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--an-ink)", marginTop: 2 }}>{template.name}</div>
        </div>
        <button
          className={`tpl-fav-btn${isFav ? " active" : ""}`}
          onClick={handleToggleFav}
          title={isFav ? "取消收藏" : "收藏"}
          style={{ fontSize: 18 }}
        >
          {isFav ? "♥" : "♡"}
        </button>
      </div>

      {cfg.fields.map((f) => (
        <div key={f.id} className="field">
          <label>{f.label}{f.required === false ? "" : " *"}</label>
          {f.type === "textarea" ? (
            <textarea
              placeholder={f.placeholder || ""}
              rows={4}
              value={values[f.id] || ""}
              onInput={(e) => updateField(f.id, e.target.value)}
            />
          ) : f.type === "select" ? (
            <select
              value={values[f.id] || f.def || ""}
              onChange={(e) => updateField(f.id, e.target.value)}
            >
              {!f.def && <option value="">请选择</option>}
              {f.options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder={f.placeholder || ""}
              value={values[f.id] || ""}
              onInput={(e) => updateField(f.id, e.target.value)}
            />
          )}
        </div>
      ))}

      <button className="btn-primary" onClick={() => onGenerate(template, values)}>
        <i className="ti ti-sparkles" aria-hidden="true"></i> 生成提示词
      </button>
    </div>
  );
}

export function TemplateLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [outputText, setOutputText] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const selected = tplSelected.value;
  const view = tplView.value;

  const filteredTemplates = templates.filter((t) => {
    const catMatch = tplCurrentCat.value === "all" || t.cat === tplCurrentCat.value;
    const q = searchQuery.toLowerCase();
    const qMatch = !q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q));
    return catMatch && qMatch;
  });

  const handleGenerate = (template, values) => {
    const cfg = tplConfigs[template.id];
    if (!cfg) return;
    const prompt = cfg.buildPrompt(values);
    setOutputText(prompt);
    setShowOutput(true);

    // Save to history
    const entry = { id: template.id, name: template.name, time: Date.now(), prompt };
    const newHistory = [entry, ...tplHistory.value.filter((h) => h.id !== template.id)].slice(0, 20);
    tplHistory.value = newHistory;
    localStorage.setItem("tpl-history", JSON.stringify(newHistory));
  };

  const handleSendToHumanizer = () => {
    pendingText.value = outputText;
    currentTab.value = "humanizer";
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText).then(() => {
      showToast("已复制到剪贴板");
    });
  };

  const handleToggleFav = (id) => {
    const favs = [...tplFavorites.value];
    const idx = favs.indexOf(id);
    if (idx >= 0) favs.splice(idx, 1);
    else favs.push(id);
    tplFavorites.value = favs;
    localStorage.setItem("tpl-favorites", JSON.stringify(favs));
  };

  const selectedTemplate = selected ? templates.find((t) => t.id === selected) : null;

  return (
    <div className="stagger">
      {/* Sub-tabs */}
      <div className="tpl-section-tabs">
        <button
          className={`tpl-section-tab${view === "browse" ? " active" : ""}`}
          onClick={() => { tplView.value = "browse"; }}
        >
          模板浏览
        </button>
        <button
          className={`tpl-section-tab${view === "favorites" ? " active" : ""}`}
          onClick={() => { tplView.value = "favorites"; }}
        >
          我的收藏
        </button>
        <button
          className={`tpl-section-tab${view === "history" ? " active" : ""}`}
          onClick={() => { tplView.value = "history"; }}
        >
          生成历史
        </button>
      </div>

      {/* Browse View */}
      {view === "browse" && (
        <div>
          {/* Search */}
          <div className="tpl-search-wrap">
            <i className="ti ti-search" aria-hidden="true"></i>
            <input
              type="text"
              className="tpl-search"
              placeholder="搜索模板..."
              value={searchQuery}
              onInput={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="tpl-cat-row">
            {tplCategories.map((c) => (
              <button
                key={c.id}
                className={`tpl-cat-pill${tplCurrentCat.value === c.id ? " selected" : ""}`}
                onClick={() => { tplCurrentCat.value = c.id; }}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Template Grid */}
          <div className="tpl-grid">
            {filteredTemplates.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><i className="ti ti-template-off"></i></div>
                <div className="empty-state-text">没有找到匹配的模板</div>
                <div className="empty-state-hint">尝试其他关键词或分类</div>
              </div>
            ) : (
              filteredTemplates.map((t) => (
                <TemplateCard
                  key={t.id}
                  t={t}
                  isSelected={selected === t.id}
                  isFav={tplFavorites.value.includes(t.id)}
                  onSelect={(id) => {
                    tplSelected.value = id;
                    setShowOutput(false);
                  }}
                  onToggleFav={handleToggleFav}
                />
              ))
            )}
          </div>

          {/* Config Panel */}
          {selectedTemplate && (
            <ConfigPanel
              template={selectedTemplate}
              onGenerate={handleGenerate}
            />
          )}
        </div>
      )}

      {/* Favorites View */}
      {view === "favorites" && (
        <div>
          {tplFavorites.value.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><i className="ti ti-heart"></i></div>
              <div className="empty-state-text">还没有收藏的模板</div>
              <div className="empty-state-hint">去模板浏览中点击 ♡ 收藏吧</div>
            </div>
          ) : (
            tplFavorites.value.map((id) => {
              const t = templates.find((x) => x.id === id);
              if (!t) return null;
              const catColor = tplCatColors[t.cat] || "var(--an-primary)";
              const catName = tplCategories.find((c) => c.id === t.cat)?.name || t.cat;
              return (
                <div
                  key={id}
                  className="tpl-history-row"
                  onClick={() => {
                    tplView.value = "browse";
                    tplSelected.value = id;
                    setShowOutput(false);
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="tpl-history-name">{t.name}</div>
                    <div style={{ fontSize: 12, color: catColor, marginTop: 2 }}>{catName} · {t.desc}</div>
                  </div>
                  <button
                    className="tpl-fav-btn active"
                    onClick={(e) => { e.stopPropagation(); handleToggleFav(id); }}
                    title="取消收藏"
                  >
                    ♥
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* History View */}
      {view === "history" && (
        <div>
          {tplHistory.value.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><i className="ti ti-clock"></i></div>
              <div className="empty-state-text">还没有生成历史</div>
              <div className="empty-state-hint">生成提示词后会自动记录在这里</div>
            </div>
          ) : (
            tplHistory.value.map((h) => {
              const t = templates.find((x) => x.id === h.id);
              const timeStr = new Date(h.time).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
              return (
                <div
                  key={h.time}
                  className="tpl-history-row"
                  onClick={() => {
                    tplView.value = "browse";
                    tplSelected.value = h.id;
                    setOutputText(h.prompt);
                    setShowOutput(true);
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="tpl-history-name">{h.name}</div>
                    <div style={{ fontSize: 12, color: "var(--an-muted)", marginTop: 2 }}>{timeStr}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Output */}
      {showOutput && (
        <div className="tpl-output-area">
          <div className="output-box">{outputText}</div>
          <div className="copy-row">
            <button className="btn" onClick={handleCopy}>
              <i className="ti ti-copy" aria-hidden="true"></i> 复制全部
            </button>
            <button className="btn" onClick={handleSendToHumanizer} style={{ color: "var(--an-primary)", borderColor: "var(--an-primary)" }}>
              <i className="ti ti-feather" aria-hidden="true"></i> 发送到写作优化
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
