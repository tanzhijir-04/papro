import { currentTab } from "../store.js";

const TABS = [
  { id: "params", icon: "ti-settings", label: "论文参数" },
  { id: "outline", icon: "ti-list", label: "大纲管理" },
  { id: "output", icon: "ti-code", label: "生成提示词" },
  { id: "review", icon: "ti-search", label: "论文审阅" },
  { id: "humanizer", icon: "ti-feather", label: "写作优化" },
];

export function TabBar() {
  const active = currentTab.value;

  return (
    <div className="tabs">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`tab${active === t.id ? " active" : ""}`}
          onClick={() => { currentTab.value = t.id; }}
          title={t.label}
        >
          <i className={`ti ${t.icon}`} aria-hidden="true"></i>
          <span className="tab-label">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
