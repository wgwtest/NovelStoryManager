import {
  dossierDesignGoals,
  dossierLinkPatterns,
  dossierObjectTypeCards,
  dossierPanelChecklist,
  dossierSpecEntries,
  dossierSpecPrinciples,
  getDossierObjectTypeSummary
} from "../lib/dossier-review.js";

type DossierReviewDeckProps = {
  onOpenSpec: () => void;
  onOpenWorkbench: () => void;
};

export function DossierReviewDeck(props: DossierReviewDeckProps) {
  return (
    <main className="dossier-review-layout">
      <section className="dossier-review-main">
        <article className="panel dossier-review-panel">
          <div className="dossier-panel-scroll">
            <div className="dossier-review-hero">
              <p className="dossier-review-kicker">Review First</p>
              <h2>卷宗设计思路</h2>
              <p className="dossier-review-intro">
                当前页先回答卷宗为什么存在、覆盖哪些对象、靠什么数据驱动，再进入交互验证。
                卷宗在这里被定义为“事实层读写混合工作面”，这样审阅时不会只看到一个能操作的页面，却不知道它为什么这样设计。
              </p>

              <div className="dossier-review-action-row">
                <button
                  className="toolbar-button toolbar-button-primary"
                  onClick={props.onOpenSpec}
                  type="button"
                >
                  打开样例数据规范
                </button>
                <button className="toolbar-button" onClick={props.onOpenWorkbench} type="button">
                  进入工作面验证
                </button>
              </div>
            </div>

            <section className="dossier-review-section">
              <div className="dossier-section-header">
                <h3>目标清单</h3>
                <span>当前优先围绕卷宗成立性</span>
              </div>

              <div className="dossier-review-card-grid">
                {dossierDesignGoals.map((item) => (
                  <article className="dossier-review-card" key={item.title}>
                    <h4>{item.title}</h4>
                    <p>{item.summary}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="dossier-review-section">
              <div className="dossier-section-header">
                <h3>页面清单</h3>
                <span>对象库 / 正文 / 检查器 / 审校队列</span>
              </div>

              <div className="dossier-review-card-grid">
                {dossierPanelChecklist.map((item) => (
                  <article className="dossier-review-card" key={item.title}>
                    <h4>{item.title}</h4>
                    <p>{item.summary}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </article>
      </section>

      <aside className="dossier-review-side">
        <article className="panel dossier-review-panel">
          <div className="dossier-panel-scroll">
            <div className="dossier-section-header">
              <h3>对象类型覆盖</h3>
              <span>{getDossierObjectTypeSummary()}</span>
            </div>

            <div className="dossier-review-object-grid">
              {dossierObjectTypeCards.map((item) => (
                <article className="dossier-review-object-card" key={item.objectType}>
                  <strong>{item.title}</strong>
                  <p>{item.reason}</p>
                </article>
              ))}
            </div>
          </div>
        </article>

        <article className="panel dossier-review-panel">
          <div className="dossier-panel-scroll">
            <div className="dossier-section-header">
              <h3>典型链接关系</h3>
              <span>从字段到卷宗跳转</span>
            </div>

            <div className="dossier-review-link-list">
              {dossierLinkPatterns.map((item) => (
                <article className="dossier-review-link-card" key={`${item.source}-${item.field}`}>
                  <strong>
                    {item.source} → {item.target}
                  </strong>
                  <p className="dossier-review-link-field">{item.field}</p>
                  <p>{item.reason}</p>
                </article>
              ))}
            </div>
          </div>
        </article>
      </aside>
    </main>
  );
}

export function DossierSpecDeck(props: DossierReviewDeckProps) {
  return (
    <main className="dossier-review-layout">
      <section className="dossier-review-main">
        <article className="panel dossier-review-panel">
          <div className="dossier-panel-scroll">
            <div className="dossier-review-hero dossier-review-hero-compact">
              <p className="dossier-review-kicker">Sample Contract</p>
              <h2>样例数据格式规范</h2>
              <p className="dossier-review-intro">
                这里直接展示卷宗独立验证页所依赖的样例 JSON 结构，方便审阅“页面能吃什么数据”。
              </p>

              <div className="dossier-review-action-row">
                <button className="toolbar-button" onClick={props.onOpenWorkbench} type="button">
                  切到工作面验证
                </button>
              </div>
            </div>

            <section className="dossier-review-section">
              <div className="dossier-section-header">
                <h3>规范口径</h3>
                <span>对象事实与视图状态分层</span>
              </div>

              <div className="dossier-review-card-grid">
                {dossierSpecPrinciples.map((item) => (
                  <article className="dossier-review-card" key={item.title}>
                    <h4>{item.title}</h4>
                    <p>{item.summary}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </article>
      </section>

      <aside className="dossier-review-side">
        {dossierSpecEntries.map((item) => (
          <article className="panel dossier-review-panel dossier-json-panel" key={item.path}>
            <div className="dossier-panel-scroll">
              <div className="dossier-section-header">
                <h3>{item.title}</h3>
              </div>
              <p className="dossier-json-path">{item.path}</p>
              <p className="dossier-json-description">{item.description}</p>
              <pre className="dossier-json-block">
                <code>{item.content}</code>
              </pre>
            </div>
          </article>
        ))}
      </aside>
    </main>
  );
}
