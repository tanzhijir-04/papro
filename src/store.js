// Global State Management using Preact Signals
import { signal, computed } from "@preact/signals";

// ── Tab State ──
export const currentTab = signal("params");

// ── Paper Parameters (shared across tabs) ──
export const paperTitle = signal("");
export const paperVenue = signal("");
export const paperType = signal("课程论文");
export const paperTypeCustom = signal("");
export const citationFmt = signal("GB/T 7714-2015");
export const version = signal("A");
export const discipline = signal("");
export const researchDir = signal("");
export const audience = signal("课程任课教师");
export const audienceCustom = signal("");
export const coreArg = signal("");
export const researchQ = signal("");
export const writingStyle = signal("");
export const constraint = signal("");
export const totalWords = signal(3000);

// ── Outline Sections ──
export const DEFAULT_SECTIONS = [
  { id: "s1", name: "摘要", type: "abstract", words: 240, locked: false },
  { id: "s2", name: "引言", type: "intro", words: 390, locked: false },
  { id: "s3", name: "研究背景与文献综述", type: "body", words: 600, locked: false },
  { id: "s4", name: "研究方法", type: "body", words: 600, locked: false },
  { id: "s5", name: "实验与结果", type: "body", words: 600, locked: false },
  { id: "s6", name: "讨论", type: "body", words: 600, locked: false },
  { id: "s7", name: "结论", type: "conclusion", words: 270, locked: false },
];

export const sections = signal(
  DEFAULT_SECTIONS.map(s => ({ ...s }))
);

// ── Humanizer State ──
export const hzSelected = signal(
  new Set(Array.from({ length: 24 }, (_, i) => i + 1))
);
export const hzIntensity = signal(7);
export const hzTone = signal("neutral");
export const hzLang = signal("zh-CN");
export const hzType = signal("general");
export const hzExtra = signal("");
export const hzCurrentCat = signal("all");

// ── Template Library State ──
export const tplCurrentCat = signal("all");
export const tplSelected = signal(null);
export const tplView = signal("browse");
export const tplFavorites = signal(
  JSON.parse(localStorage.getItem("tpl-favorites") || "[]")
);
export const tplHistory = signal(
  JSON.parse(localStorage.getItem("tpl-history") || "[]")
);

// ── Template→Humanizer Linkage ──
export const pendingText = signal("");

// ── Theme ──
function initTheme() {
  const saved = localStorage.getItem("an-theme");
  if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  }
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("an-theme", isDark ? "dark" : "light");
}

// Initialize theme on load
if (typeof document !== "undefined") {
  initTheme();
}

// ── Utility Functions ──
export function showToast(msg) {
  let t = document.getElementById("app-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "app-toast";
    t.className = "app-toast";
    document.body.appendChild(t);
  }
  // Reset animation
  t.classList.remove("show", "hide");
  t.textContent = msg;
  // Force reflow then animate in
  void t.offsetWidth;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.classList.remove("show");
    t.classList.add("hide");
  }, 2200);
}

export function paintRange(el) {
  if (!el) return;
  const min = parseFloat(el.min);
  const max = parseFloat(el.max);
  const val = parseFloat(el.value);
  const pct = ((val - min) / (max - min)) * 100;
  el.style.background = `linear-gradient(to right, var(--an-primary) ${pct}%, var(--an-surface-3) ${pct}%)`;
}

// ── Word Distribution ──
export function distributeWords() {
  const total = totalWords.value;
  const ratios = { abstract: 0.08, intro: 0.13, body: 0.6, conclusion: 0.09 };
  const bodyCount = sections.value.filter((s) => s.type === "body").length || 1;
  sections.value = sections.value.map((s) => {
    if (s.type === "body") return { ...s, words: Math.round((total * ratios.body) / bodyCount) };
    return { ...s, words: Math.round(total * (ratios[s.type] || 0.1)) };
  });
}
