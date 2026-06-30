import { useEffect, useMemo, useState } from "react";
import { letters } from "../data/mailbox";

function isUnlocked(unlockDate) {
  const today = new Date();
  const target = new Date(`${unlockDate}T00:00:00`);
  return today >= target;
}

function formatDate(unlockDate) {
  const target = new Date(`${unlockDate}T00:00:00`);
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  }).format(target);
}

function Mailbox() {
  const mailboxItems = useMemo(
    () =>
      letters.map((letter) => ({
        ...letter,
        unlocked: isUnlocked(letter.unlockDate),
      })),
    [],
  );
  const [activeLetterId, setActiveLetterId] = useState(mailboxItems[0]?.id ?? "");
  const [isCompact, setIsCompact] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  const openLetters = mailboxItems.filter((letter) => letter.unlocked);
  const futureLetters = mailboxItems.filter((letter) => !letter.unlocked);

  const activeLetter =
    mailboxItems.find((letter) => letter.id === activeLetterId) || mailboxItems[0];

  useEffect(() => {
    const media = window.matchMedia("(max-width: 759px)");

    const syncCompact = () => {
      setIsCompact(media.matches);
      if (!media.matches) {
        setShowMobileDetail(false);
      }
    };

    syncCompact();
    media.addEventListener("change", syncCompact);

    return () => {
      media.removeEventListener("change", syncCompact);
    };
  }, []);

  const openLetter = (letterId) => {
    setActiveLetterId(letterId);

    if (isCompact) {
      setShowMobileDetail(true);
    }
  };

  return (
    <section className="mailbox-screen">
      <div
        className={
          showMobileDetail
            ? "mailbox-app mailbox-app--detail-open"
            : "mailbox-app"
        }
      >
        {(!isCompact || !showMobileDetail) && (
          <header className="mailbox-app__topbar">
            <div>
              <p className="mailbox-app__eyebrow">未来邮箱</p>
              <h1>收件箱</h1>
            </div>
            <div className="mailbox-app__status">
              <span>{mailboxItems.length} 封来信</span>
              <strong>{mailboxItems.filter((letter) => letter.unlocked).length} 封可读</strong>
            </div>
          </header>
        )}

        <div className="mailbox-app__window">
          {(!isCompact || !showMobileDetail) && (
            <aside className="mailbox-sidebar">
              <div className="mailbox-sidebar__head">
                <strong>更早</strong>
                <span>按时间投递</span>
              </div>

              <div className="mailbox-sidebar__list">
                <section className="mailbox-sidebar__group">
                  <div className="mailbox-sidebar__group-head">
                    <strong>现在可拆</strong>
                    <span>{openLetters.length}</span>
                  </div>
                  {openLetters.map((letter) => (
                    <button
                      key={letter.id}
                      className={
                        letter.id === activeLetterId
                          ? "mailbox-sidebar__item mailbox-sidebar__item--active"
                          : "mailbox-sidebar__item"
                      }
                      onClick={() => openLetter(letter.id)}
                      type="button"
                    >
                      <span className="mailbox-sidebar__marker mailbox-sidebar__marker--open" aria-hidden="true" />
                      <div className="mailbox-sidebar__row">
                        <strong>{letter.from}</strong>
                        <span>{formatDate(letter.unlockDate)}</span>
                      </div>
                      <p>
                        <span className="mailbox-sidebar__subject">{letter.title}</span>
                        <span className="mailbox-sidebar__snippet">{` ${letter.content}`}</span>
                      </p>
                    </button>
                  ))}
                </section>

                <section className="mailbox-sidebar__group">
                  <div className="mailbox-sidebar__group-head">
                    <strong>未来可拆</strong>
                    <span>{futureLetters.length}</span>
                  </div>
                  {futureLetters.map((letter) => (
                    <button
                      key={letter.id}
                      className={
                        letter.id === activeLetterId
                          ? "mailbox-sidebar__item mailbox-sidebar__item--active mailbox-sidebar__item--locked"
                          : "mailbox-sidebar__item mailbox-sidebar__item--locked"
                      }
                      onClick={() => openLetter(letter.id)}
                      type="button"
                    >
                      <span className="mailbox-sidebar__marker mailbox-sidebar__marker--locked" aria-hidden="true" />
                      <div className="mailbox-sidebar__row">
                        <strong>{letter.from}</strong>
                        <span>{formatDate(letter.unlockDate)}</span>
                      </div>
                      <p>
                        <span className="mailbox-sidebar__subject">{letter.title}</span>
                        <span className="mailbox-sidebar__snippet">
                          {` 这封信将在 ${formatDate(letter.unlockDate)} 后送达`}
                        </span>
                      </p>
                    </button>
                  ))}
                </section>
              </div>
            </aside>
          )}

          {(!isCompact || showMobileDetail) && (
            <article className="mailbox-reader">
            <div className="mailbox-reader__mobilebar">
              <button
                className="mailbox-reader__nav-btn"
                onClick={() => setShowMobileDetail(false)}
                type="button"
              >
                返回
              </button>
              <div className="mailbox-reader__mobile-actions" aria-hidden="true">
                <span>⌃</span>
                <span>⌄</span>
              </div>
            </div>

            <div className="mailbox-reader__head">
              <h2>{activeLetter.title}</h2>
              <button className="mailbox-reader__collapse" type="button">
                隐藏
              </button>
            </div>

            <div className="mailbox-reader__info">
              <div className="mailbox-reader__info-row">
                <span>发件人：</span>
                <div>
                  <strong>{activeLetter.from}</strong>
                  <small>{activeLetter.unlocked ? "hi@friend-mail.local" : "future@friend-mail.local"}</small>
                </div>
              </div>
              <div className="mailbox-reader__info-row">
                <span>收件人：</span>
                <div>
                  <strong>张希骋</strong>
                  <small>faraway.mailbox@local</small>
                </div>
              </div>
              <div className="mailbox-reader__info-row">
                <span>时间：</span>
                <div>
                  <strong>{activeLetter.unlockDate}</strong>
                  <small>{activeLetter.unlocked ? "已送达" : "未来投递"}</small>
                </div>
              </div>
            </div>

            <div className="mailbox-reader__toolbar">
              <span>{activeLetter.unlocked ? "已送达" : "等待投递"}</span>
              <span>{activeLetter.unlocked ? "朋友邮件" : "未来信件"}</span>
            </div>

            <div
              className={
                activeLetter.unlocked
                  ? "mailbox-reader__body"
                  : "mailbox-reader__body mailbox-reader__body--locked"
              }
            >
              {activeLetter.unlocked
                ? activeLetter.content
                : `这封信还在路上，请在 ${formatDate(activeLetter.unlockDate)} 之后回来拆开。`}
            </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}

export default Mailbox;
