import { useEffect, useMemo, useState } from "react";

const bootSteps = [
  {
    id: "handshake",
    title: "连接朋友节点",
    detail: "正在确认国内朋友频道可用",
  },
  {
    id: "identity",
    title: "验证访客身份",
    detail: "已识别为 张希骋",
  },
  {
    id: "messages",
    title: "装载留言档案",
    detail: "视频、语音和未来信件准备中",
  },
  {
    id: "channel",
    title: "同步远方状态",
    detail: "美国线路已建立",
  },
  {
    id: "ready",
    title: "启动完成",
    detail: "正在打开补给站",
  },
];

function getTypedParts(step, typedChars) {
  const titleLength = step.title.length;
  const detailLength = step.detail.length;

  if (typedChars <= titleLength) {
    return {
      title: step.title.slice(0, typedChars),
      detail: "",
      titleDone: typedChars >= titleLength,
      detailDone: false,
    };
  }

  const detailChars = Math.min(typedChars - titleLength, detailLength);

  return {
    title: step.title,
    detail: step.detail.slice(0, detailChars),
    titleDone: true,
    detailDone: detailChars >= detailLength,
  };
}

function Boot({ isExiting = false, onEnter }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [typedChars, setTypedChars] = useState(0);

  const activeStep = bootSteps[Math.min(activeIndex, bootSteps.length - 1)];
  const activeTotalChars = activeStep.title.length + activeStep.detail.length;
  const isReady = activeIndex === bootSteps.length - 1 && typedChars >= activeTotalChars;

  useEffect(() => {
    if (isReady) {
      return undefined;
    }

    if (typedChars < activeTotalChars) {
      const typingTimer = window.setTimeout(() => {
        setTypedChars((current) => current + 1);
      }, typedChars < activeStep.title.length ? 48 : 34);

      return () => {
        window.clearTimeout(typingTimer);
      };
    }

    const nextStepTimer = window.setTimeout(() => {
      setActiveIndex((current) => current + 1);
      setTypedChars(0);
    }, 220);

    return () => {
      window.clearTimeout(nextStepTimer);
    };
  }, [activeStep.title.length, activeTotalChars, isReady, typedChars]);

  const progressValue = useMemo(() => {
    const base = activeIndex / bootSteps.length;
    const currentProgress =
      activeTotalChars === 0
        ? 0
        : Math.min(typedChars / activeTotalChars, 1) / bootSteps.length;

    return Math.round((base + currentProgress) * 100);
  }, [activeIndex, activeTotalChars, typedChars]);

  return (
    <section
      className={isExiting ? "boot-screen boot-screen--exit" : "boot-screen"}
    >
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
            <h1 className="boot-screen__title">远方补给站</h1>
            <p className="boot-screen__subtitle">
              正在打开张希骋的远方补给入口。系统正在按顺序检查通道状态。
            </p>
          </div>

          <section className="boot-screen__console" aria-live="polite">
            <div className="boot-screen__console-top">
              <span>startup.log</span>
              <span>{String(progressValue).padStart(3, "0")}%</span>
            </div>

            <div className="boot-screen__steps">
              {bootSteps.map((step, index) => {
                const isVisible = index < activeIndex;
                const isActive = index === activeIndex;
                const parts = isVisible
                  ? {
                      title: step.title,
                      detail: step.detail,
                      titleDone: true,
                      detailDone: true,
                    }
                  : isActive
                    ? getTypedParts(step, typedChars)
                    : {
                        title: "",
                        detail: "",
                        titleDone: false,
                        detailDone: false,
                      };

                return (
                  <div
                    key={step.id}
                    className={
                      isVisible
                        ? "boot-screen__step boot-screen__step--visible"
                        : isActive
                          ? "boot-screen__step boot-screen__step--active"
                          : "boot-screen__step"
                    }
                  >
                    <span className="boot-screen__step-mark">
                      {isVisible ? "done" : isActive ? "run" : "wait"}
                    </span>
                    <div className="boot-screen__step-copy">
                      <strong
                        className={
                          isActive && !parts.titleDone
                            ? "boot-screen__step-title boot-screen__step-title--typing"
                            : "boot-screen__step-title"
                        }
                      >
                        {parts.title}
                        {isActive && !parts.titleDone ? (
                          <span className="boot-screen__typing-cursor" aria-hidden="true" />
                        ) : null}
                      </strong>
                      <p
                        className={
                          isActive && parts.titleDone && !parts.detailDone
                            ? "boot-screen__step-detail boot-screen__step-detail--typing"
                            : "boot-screen__step-detail"
                        }
                      >
                        {parts.detail}
                        {isActive && parts.titleDone && !parts.detailDone ? (
                          <span className="boot-screen__typing-cursor" aria-hidden="true" />
                        ) : null}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="boot-screen__status">
            <div className="boot-screen__status-line">
              <span>当前任务</span>
              <strong>{activeStep.title}</strong>
            </div>
            <div className="boot-screen__progress" aria-hidden="true">
              <div
                className="boot-screen__progress-bar"
                style={{ width: `${progressValue}%` }}
              />
            </div>
            <p className="boot-screen__status-text">
              {isReady ? "点击即可进入远方补给站" : activeStep.detail}
            </p>
          </section>

          <button
            className="boot-screen__button"
            disabled={!isReady}
            onClick={onEnter}
            type="button"
          >
            进入补给站
          </button>
        </div>
      </div>
    </section>
  );
}

export default Boot;
