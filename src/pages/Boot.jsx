function Boot({ gateState, staticMode = false }) {
  const isChecking = gateState.status === "checking";
  const badgeLabel = isChecking
    ? "\u4f4d\u7f6e\u68c0\u6d4b\u4e2d"
    : "\u6682\u4e0d\u53ef\u8fdb\u5165";
  const title = isChecking
    ? "\u6b63\u5728\u786e\u8ba4\u662f\u5426\u5df2\u7ecf\u5230\u8fbe\u7f8e\u56fd"
    : "\u5f53\u524d\u4e0d\u5728\u7f8e\u56fd\uff0c\u5165\u53e3\u6682\u4e0d\u5f00\u653e";
  const subtitle = staticMode
    ? "\u8fd9\u4e2a\u5165\u53e3\u73b0\u5728\u88ab\u56fa\u5b9a\u4e3a\u672a\u5f00\u653e\u72b6\u6001\uff0c\u7528\u6765\u8868\u8fbe\u53ea\u6709\u5230\u7f8e\u56fd\u540e\u624d\u80fd\u8fdb\u5165\u3002"
    : "\u8fd9\u4e2a\u5165\u53e3\u4f1a\u5148\u68c0\u6d4b\u5f53\u524d\u4f4d\u7f6e\u3002\u53ea\u6709\u786e\u8ba4\u5df2\u7ecf\u5230\u8fbe\u7f8e\u56fd\uff0c\u624d\u4f1a\u7ee7\u7eed\u6253\u5f00\u540e\u9762\u7684\u5185\u5bb9\u3002";

  return (
    <section className="boot-screen">
      <div className="boot-screen__backdrop" />
      <div className="boot-screen__window">
        <div className="boot-screen__traffic" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="boot-screen__content">
          <div className="boot-screen__intro">
            <p className="boot-screen__eyebrow">Faraway Supply Station</p>
            <h1 className="boot-screen__title">
              {"\u8fdc\u65b9\u8865\u7ed9\u7ad9"}
            </h1>
            <p className="boot-screen__subtitle">{subtitle}</p>
          </div>

          <section className="boot-screen__gate" aria-live="polite">
            <div className="boot-screen__gate-badge">{badgeLabel}</div>
            <h2 className="boot-screen__gate-title">{title}</h2>
            <p className="boot-screen__gate-text">{gateState.detail}</p>

            <div className="boot-screen__gate-meta">
              <div>
                <span>{"\u68c0\u6d4b\u7ed3\u679c"}</span>
                <strong>{gateState.locationLabel}</strong>
              </div>
              <div>
                <span>{"\u5750\u6807"}</span>
                <strong>{gateState.coordinates || "\u6682\u65e0"}</strong>
              </div>
            </div>
          </section>

          <section className="boot-screen__status">
            <div className="boot-screen__status-line">
              <span>{"\u5f53\u524d\u72b6\u6001"}</span>
              <strong>
                {staticMode
                  ? "\u9759\u6001\u9650\u5236\u4e2d"
                  : "\u7b49\u5f85\u91cd\u65b0\u68c0\u6d4b"}
              </strong>
            </div>
            <div className="boot-screen__progress" aria-hidden="true">
              <div className="boot-screen__progress-bar" style={{ width: "100%" }} />
            </div>
            <p className="boot-screen__status-text">
              {staticMode
                ? "\u8fd9\u91cc\u73b0\u5728\u662f\u9759\u6001\u9650\u5236\u5c55\u793a\uff0c\u4e0d\u4f1a\u7ee7\u7eed\u8fdb\u5165\u540e\u9762\u7684\u5185\u5bb9\u3002"
                : "\u5230\u8fbe\u7f8e\u56fd\u540e\u91cd\u65b0\u68c0\u6d4b\uff0c\u5c31\u53ef\u4ee5\u7ee7\u7eed\u8fdb\u5165\u3002"}
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}

export default Boot;
