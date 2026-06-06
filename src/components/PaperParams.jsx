import { useSignal } from "@preact/signals";
import {
  paperTitle, paperVenue, paperType, paperTypeCustom, citationFmt,
  version, discipline, researchDir, audience, audienceCustom,
  coreArg, researchQ, writingStyle, constraint,
} from "../store.js";

const PAPER_TYPES = ["课程论文", "毕业论文", "期刊论文", "会议论文", "研究报告", "学位论文"];
const CITATION_FORMATS = ["GB/T 7714-2015", "APA 7th", "MLA 9th", "Chicago", "自定义"];
const DISCIPLINES = ["法学", "经济学", "教育学", "理学", "工学", "农学", "医学", "管理学", "文学", "历史学", "哲学", "计算机科学"];
const AUDIENCES = ["课程任课教师", "学位论文评审", "期刊审稿人", "学术会议", "基金评审"];
const STYLES = ["理论推导", "案例分析", "数据实证", "比较研究", "文献综述"];

function PillRow({ items, value, onChange }) {
  return (
    <div className="pill-row">
      {items.map((item) => (
        <button
          key={item}
          className={`pill${value === item ? " selected" : ""}`}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function PaperParams() {
  const versionVal = version.value;
  const paperTypeVal = paperType.value;
  const audienceVal = audience.value;
  const disciplineVal = discipline.value;
  const writingStyleVal = writingStyle.value;
  const isCustomType = paperTypeVal === "__custom__";
  const isCustomAudience = audienceVal === "__custom__";

  return (
    <div className="stagger">
      {/* Basic Info Card — primary */}
      <div className="card-primary">
        <div className="section-title">基本信息</div>

        <div className="field">
          <label>论文题目</label>
          <input
            type="text"
            placeholder="例：基于深度学习的医学影像分割方法研究"
            value={paperTitle.value}
            onInput={(e) => { paperTitle.value = e.target.value; }}
          />
        </div>

        <div className="field">
          <label>提交场合 / 投稿目标</label>
          <input
            type="text"
            placeholder="例：课程期末 / 《计算机学报》"
            value={paperVenue.value}
            onInput={(e) => { paperVenue.value = e.target.value; }}
          />
        </div>

        <div className="grid2">
          <div className="field">
            <label>论文类型</label>
            <select
              value={paperTypeVal}
              onChange={(e) => { paperType.value = e.target.value; }}
            >
              {PAPER_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
              <option value="__custom__">自定义</option>
            </select>
            {isCustomType && (
              <input
                type="text"
                style={{ marginTop: 8 }}
                placeholder="输入自定义类型"
                value={paperTypeCustom.value}
                onInput={(e) => { paperTypeCustom.value = e.target.value; }}
              />
            )}
          </div>

          <div className="field">
            <label>参考文献格式</label>
            <select
              value={citationFmt.value}
              onChange={(e) => { citationFmt.value = e.target.value; }}
            >
              {CITATION_FORMATS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label>写作版本</label>
          <div className="pill-row">
            <button
              className={`pill${versionVal === "A" ? " selected" : ""}`}
              onClick={() => { version.value = "A"; }}
            >
              版本 A — 自提供文献
            </button>
            <button
              className={`pill${versionVal === "B" ? " selected" : ""}`}
              onClick={() => { version.value = "B"; }}
            >
              版本 B — AI 知识写作
            </button>
          </div>
          {versionVal === "A" ? (
            <div className="version-hint version-hint-a">
              <i className="ti ti-info-circle" aria-hidden="true"></i>
              <span>版本 A 仅引用你提供的文献，不会虚构文献信息。适合已有文献库的场景。</span>
            </div>
          ) : (
            <div className="version-hint version-hint-b">
              <i className="ti ti-info-circle" aria-hidden="true"></i>
              <span>版本 B 使用 AI 训练知识写作，不确定的文献会标注免责说明。适合需要 AI 帮助构思框架的场景。</span>
            </div>
          )}
        </div>
      </div>

      {/* Discipline Card */}
      <div className="card">
        <div className="section-title">学科与受众</div>

        <div className="field">
          <label>学科领域</label>
          <PillRow
            items={DISCIPLINES}
            value={disciplineVal}
            onChange={(v) => { discipline.value = v; }}
          />
          <input
            type="text"
            style={{ marginTop: 8 }}
            placeholder="或手动输入学科"
            value={disciplineVal}
            onInput={(e) => { discipline.value = e.target.value; }}
          />
        </div>

        <div className="field">
          <label>研究方向</label>
          <input
            type="text"
            placeholder="例：自然语言处理 / 教育技术"
            value={researchDir.value}
            onInput={(e) => { researchDir.value = e.target.value; }}
          />
        </div>

        <div className="field">
          <label>目标读者</label>
          <select
            value={audienceVal}
            onChange={(e) => { audience.value = e.target.value; }}
          >
            {AUDIENCES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
            <option value="__custom__">自定义</option>
          </select>
          {isCustomAudience && (
            <input
              type="text"
              style={{ marginTop: 8 }}
              placeholder="输入目标读者"
              value={audienceCustom.value}
              onInput={(e) => { audienceCustom.value = e.target.value; }}
            />
          )}
        </div>
      </div>

      {/* Core Content Card — subtle */}
      <div className="card-subtle">
        <div className="section-title">核心内容</div>

        <div className="field">
          <label>核心论点 <span className="req">*</span></label>
          <textarea
            placeholder="用 2-3 句话概括你的核心论点"
            rows={3}
            value={coreArg.value}
            onInput={(e) => { coreArg.value = e.target.value; }}
          />
        </div>

        <div className="field">
          <label>研究问题</label>
          <textarea
            placeholder="你想回答的研究问题是什么？"
            rows={2}
            value={researchQ.value}
            onInput={(e) => { researchQ.value = e.target.value; }}
          />
        </div>

        <div className="field">
          <label>写作风格倾向</label>
          <PillRow
            items={STYLES}
            value={writingStyleVal}
            onChange={(v) => { writingStyle.value = v; }}
          />
        </div>

        <div className="field">
          <label>特殊约束</label>
          <input
            type="text"
            placeholder="例：不得使用第一人称 / 字数不超过 8000"
            value={constraint.value}
            onInput={(e) => { constraint.value = e.target.value; }}
          />
        </div>
      </div>
    </div>
  );
}
