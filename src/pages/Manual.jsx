import { useEffect, useMemo, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import { manualSections } from "../data/manual";

function renderPageLabel(page, index) {
  if (!page) {
    return "";
  }

  return page.type === "chapter" ? `Chapter ${page.chapter}` : page.eyebrow;
}

function ManualPageFace({ page, index, side = "right" }) {
  if (!page) {
    return (
      <div
        className={`manual-book__spread-face manual-book__spread-face--empty manual-book__spread-face--${side}`}
      />
    );
  }

  return (
    <div
      className={`manual-book__spread-face manual-book__spread-face--${page.type} manual-book__spread-face--${side}`}
    >
      <div className="manual-book__front-top">
        <span>{renderPageLabel(page, index)}</span>
        <small>{String(index + 1).padStart(2, "0")}</small>
      </div>

      <div className="manual-book__front-body">
        <h2>{page.title}</h2>
        <p>{page.body}</p>
      </div>

      <div className="manual-book__front-foot">
        <span>{page.type === "chapter" ? "来自朋友批注" : "留学生朋友频道"}</span>
      </div>
    </div>
  );
}

function Manual() {
  const pages = useMemo(
    () => [
      {
        id: "cover",
        type: "cover",
        eyebrow: "朋友特别供给",
        title: "张希骋\n美国生存手册",
        body:
          "这不是规定动作，是给你随时翻开的朋友版本说明书。先稳住生活，再慢慢适应。",
        note: "朋友守则",
      },
      ...manualSections.map((section, index) => ({
        ...section,
        type: "chapter",
        chapter: String(index + 1).padStart(2, "0"),
        note: "翻到这里，先别一个人扛。",
      })),
      {
        id: "back-cover",
        type: "ending",
        eyebrow: "最后一页",
        title: "这本手册的\n默认结论",
        body:
          "遇到事情先联系朋友，不需要等到整理好情绪再开口。你不是一个人在过这一关。",
        note: "合上书，也别失联。",
      },
    ],
    [],
  );

  const [activePage, setActivePage] = useState(1);
  const [flipState, setFlipState] = useState(null);

  useEffect(() => {
    if (!flipState) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setFlipState(null);
    }, 820);

    return () => {
      window.clearTimeout(timer);
    };
  }, [flipState]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        setActivePage((value) => {
          if (value >= pages.length - 1) {
            return value;
          }

          setFlipState({
            direction: "next",
            leavingIndex: value,
            enteringIndex: value + 1,
          });

          return value + 1;
        });
      }

      if (event.key === "ArrowLeft") {
        setActivePage((value) => {
          if (value <= 1) {
            return value;
          }

          setFlipState({
            direction: "prev",
            leavingIndex: value - 1,
            enteringIndex: value,
          });

          return value - 1;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [pages.length]);

  const leftIndex = Math.max(activePage - 1, 0);
  const rightIndex = activePage;
  const leftPage = pages[leftIndex];
  const rightPage = pages[rightIndex];

  const goPrev = () => {
    setActivePage((value) => {
      if (value <= 1) {
        return value;
      }

      setFlipState({
        direction: "prev",
        leavingIndex: value - 1,
        enteringIndex: value,
      });

      return value - 1;
    });
  };

  const goNext = () => {
    setActivePage((value) => {
      if (value >= pages.length - 1) {
        return value;
      }

      setFlipState({
        direction: "next",
        leavingIndex: value,
        enteringIndex: value + 1,
      });

      return value + 1;
    });
  };

  return (
    <section className="page manual-page">
      <SectionHeader badge="朋友特别供给" title="张希骋 美国生存手册" />

      <div className="manual-bookcase">
        <div className="manual-bookstage">
          <div
            className="manual-book manual-book--spread"
            onClick={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect();
              const offsetX = event.clientX - bounds.left;

              if (offsetX > bounds.width * 0.56) {
                goNext();
              } else if (offsetX < bounds.width * 0.44) {
                goPrev();
              }
            }}
            role="presentation"
          >
            <div className="manual-book__stack manual-book__stack--left" aria-hidden="true" />
            <div className="manual-book__stack manual-book__stack--right" aria-hidden="true" />

            <div className="manual-book__spread">
              <ManualPageFace page={leftPage} index={leftIndex} side="left" />
              <ManualPageFace page={rightPage} index={rightIndex} side="right" />
            </div>

            {flipState ? (
              <article
                className={
                  flipState.direction === "next"
                    ? "manual-book__flip manual-book__flip--next"
                    : "manual-book__flip manual-book__flip--prev"
                }
              >
                <div className="manual-book__sheet">
                  <div className="manual-book__face manual-book__face--front">
                    <div className="manual-book__front-top">
                      <span>
                        {renderPageLabel(
                          pages[flipState.leavingIndex],
                          flipState.leavingIndex,
                        )}
                      </span>
                      <small>{String(flipState.leavingIndex + 1).padStart(2, "0")}</small>
                    </div>

                    <div className="manual-book__front-body">
                      <h2>{pages[flipState.leavingIndex]?.title}</h2>
                      <p>{pages[flipState.leavingIndex]?.body}</p>
                    </div>

                    <div className="manual-book__front-foot">
                      <span>
                        {pages[flipState.leavingIndex]?.type === "chapter"
                          ? "来自朋友批注"
                          : "留学生朋友频道"}
                      </span>
                    </div>
                  </div>

                  <div className="manual-book__face manual-book__face--back">
                    <div className="manual-book__back-mark">
                      <span>{String(flipState.enteringIndex + 1).padStart(2, "0")}</span>
                    </div>
                    <p>{pages[flipState.enteringIndex]?.note}</p>
                  </div>
                </div>
              </article>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Manual;
