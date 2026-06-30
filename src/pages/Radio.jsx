import { useEffect, useRef, useState } from "react";
import { radioEpisodes } from "../data/radio";

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) {
    return "00:00";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function Radio({ onBack }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [coverFailed, setCoverFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [wheelPadding, setWheelPadding] = useState(0);
  const [isWheelDragging, setIsWheelDragging] = useState(false);
  const videoRef = useRef(null);
  const wheelRef = useRef(null);
  const wheelItemRefs = useRef([]);
  const wheelScrollTimeoutRef = useRef(null);
  const activeIndexRef = useRef(0);
  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });

  const activeEpisode = radioEpisodes[activeIndex];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const video = videoRef.current;

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setCoverFailed(false);
    setVideoReady(false);

    if (!video) {
      return undefined;
    }

    video.pause();
    video.load();

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
      setVideoReady(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      video.currentTime = 0;
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [activeEpisode.id]);

  const centerWheelOnIndex = (index, behavior = "smooth") => {
    const wheel = wheelRef.current;
    const item = wheelItemRefs.current[index];

    if (!wheel || !item) {
      return;
    }

    const targetLeft =
      item.offsetLeft - wheel.clientWidth / 2 + item.clientWidth / 2;

    wheel.scrollTo({
      left: Math.max(0, targetLeft),
      behavior,
    });
  };

  useEffect(() => {
    centerWheelOnIndex(activeIndex, "smooth");
  }, [activeIndex]);

  useEffect(() => {
    const updateWheelPadding = () => {
      const wheel = wheelRef.current;
      const firstItem = wheelItemRefs.current[0];

      if (!wheel || !firstItem) {
        return;
      }

      const nextPadding = Math.max(0, wheel.clientWidth / 2 - firstItem.clientWidth / 2);
      setWheelPadding(nextPadding);
    };

    updateWheelPadding();
    window.addEventListener("resize", updateWheelPadding);

    return () => {
      window.removeEventListener("resize", updateWheelPadding);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (wheelScrollTimeoutRef.current) {
        clearTimeout(wheelScrollTimeoutRef.current);
      }
    };
  }, []);

  const togglePlayback = async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }

      return;
    }

    video.pause();
    setIsPlaying(false);
  };

  const stepEpisode = (direction) => {
    setActiveIndex((current) => {
      const next = current + direction;

      if (next < 0) {
        return radioEpisodes.length - 1;
      }

      if (next >= radioEpisodes.length) {
        return 0;
      }

      return next;
    });
  };

  const handleSeek = (event) => {
    const video = videoRef.current;

    if (!video || !duration) {
      return;
    }

    const nextTime = Number(event.target.value);
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const syncEpisodeFromWheel = () => {
    const wheel = wheelRef.current;

    if (!wheel || !wheelItemRefs.current.length) {
      return;
    }

    const center = wheel.scrollLeft + wheel.clientWidth / 2;
    let nextIndex = activeIndexRef.current;
    let nearestDistance = Number.POSITIVE_INFINITY;

    wheelItemRefs.current.forEach((item, index) => {
      if (!item) {
        return;
      }

      const itemCenter = item.offsetLeft + item.clientWidth / 2;
      const distance = Math.abs(itemCenter - center);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nextIndex = index;
      }
    });

    if (nextIndex !== activeIndexRef.current) {
      setActiveIndex(nextIndex);
    }

    centerWheelOnIndex(nextIndex, "smooth");
  };

  const handleWheelScroll = () => {
    if (wheelScrollTimeoutRef.current) {
      clearTimeout(wheelScrollTimeoutRef.current);
    }

    wheelScrollTimeoutRef.current = setTimeout(() => {
      syncEpisodeFromWheel();
    }, 110);
  };

  const handlePointerDown = (event) => {
    const wheel = wheelRef.current;

    if (!wheel) {
      return;
    }

    dragStateRef.current = {
      isDragging: true,
      startX: event.clientX,
      startScrollLeft: wheel.scrollLeft,
      moved: false,
    };
    setIsWheelDragging(true);

    wheel.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const wheel = wheelRef.current;
    const dragState = dragStateRef.current;

    if (!wheel || !dragState.isDragging) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;

    if (Math.abs(deltaX) > 6) {
      dragStateRef.current.moved = true;
    }

    wheel.scrollLeft = dragState.startScrollLeft - deltaX * 0.72;
  };

  const finishPointerDrag = (event) => {
    const wheel = wheelRef.current;
    const dragState = dragStateRef.current;

    if (!wheel || !dragState.isDragging) {
      return;
    }

    dragStateRef.current.isDragging = false;
    setIsWheelDragging(false);
    wheel.releasePointerCapture?.(event.pointerId);
    syncEpisodeFromWheel();
  };

  const handleWheelInput = (event) => {
    const wheel = wheelRef.current;

    if (!wheel) {
      return;
    }

    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

    if (!delta) {
      return;
    }

    event.preventDefault();
    wheel.scrollBy({
      left: delta * 0.78,
      behavior: "auto",
    });
  };

  const handleSelectorItemClick = (index) => {
    if (dragStateRef.current.moved) {
      dragStateRef.current.moved = false;
      return;
    }

    setActiveIndex(index);
  };

  return (
    <section className="radio-screen">
      <header className="radio-player__topbar">
        <button className="radio-player__top-action" onClick={onBack} type="button">
          ∨
        </button>
        <div className="radio-player__top-copy">
          <p>播客</p>
        </div>
        <span className="radio-player__top-action" aria-hidden="true">
          ↗
        </span>
      </header>

      <div className="radio-player">
        <div className="radio-player__artwork">
          {coverFailed ? (
            <div className="radio-player__cover radio-player__cover--fallback">
              <span>封面占位</span>
              <strong>{activeEpisode.title}</strong>
            </div>
          ) : (
            <img
              className="radio-player__cover"
              src={activeEpisode.cover}
              alt={`${activeEpisode.title} 封面`}
              onError={() => setCoverFailed(true)}
            />
          )}

          <video
            ref={videoRef}
            className="radio-player__video"
            preload="metadata"
            playsInline
          >
            <source src={activeEpisode.video} type="video/mp4" />
          </video>
        </div>

        <div className="radio-player__meta">
          <p className="radio-player__host">{activeEpisode.host}</p>
          <h1 className="radio-player__title">{activeEpisode.title}</h1>
          <p className="radio-player__subtitle">{activeEpisode.subtitle}</p>
        </div>

        <div className="radio-player__social">
          <button className="radio-player__ghost" type="button">
            赞 {activeEpisode.likes}
          </button>
          <button className="radio-player__ghost" type="button">
            留言
          </button>
          <button className="radio-player__ghost" type="button">
            更多
          </button>
        </div>

        <div className="radio-player__progress-wrap">
          <div className="radio-player__time-row">
            <span>{formatTime(currentTime)}</span>
            <span>{videoReady ? formatTime(duration) : "--:--"}</span>
          </div>
          <input
            className="radio-player__progress"
            type="range"
            min="0"
            max={duration || 1}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            style={{ "--progress": `${progress}%` }}
          />
        </div>

        <div className="radio-player__controls">
          <button
            className="radio-player__nav-btn"
            aria-label="上一条"
            onClick={() => stepEpisode(-1)}
            type="button"
          >
            <span className="radio-player__skip radio-player__skip--prev" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
          <button
            aria-label={isPlaying ? "暂停" : "播放"}
            className={isPlaying ? "radio-player__play-btn radio-player__play-btn--paused" : "radio-player__play-btn"}
            onClick={togglePlayback}
            type="button"
          >
            <span
              className={
                isPlaying
                  ? "radio-player__play-icon radio-player__play-icon--pause"
                  : "radio-player__play-icon radio-player__play-icon--play"
              }
              aria-hidden="true"
            >
              {isPlaying ? (
                <>
                  <span />
                  <span />
                </>
              ) : (
                <span />
              )}
            </span>
          </button>
          <button
            className="radio-player__nav-btn"
            aria-label="下一条"
            onClick={() => stepEpisode(1)}
            type="button"
          >
            <span className="radio-player__skip radio-player__skip--next" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>

        <div className="radio-player__selector">
          <div className="radio-player__selector-window">
            <div className="radio-player__selector-indicator" aria-hidden="true" />
            <div
              ref={wheelRef}
              className="radio-player__selector-scroll"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={finishPointerDrag}
              onPointerCancel={finishPointerDrag}
              onPointerLeave={finishPointerDrag}
              onScroll={handleWheelScroll}
              onWheel={handleWheelInput}
              style={{
                paddingLeft: `${wheelPadding}px`,
                paddingRight: `${wheelPadding}px`,
              }}
            >
              {radioEpisodes.map((episode, index) => (
                <button
                  key={episode.id}
                  ref={(node) => {
                    wheelItemRefs.current[index] = node;
                  }}
                  className={
                    index === activeIndex
                      ? "radio-player__selector-item radio-player__selector-item--active"
                      : "radio-player__selector-item"
                  }
                  onClick={() => handleSelectorItemClick(index)}
                  style={{
                    transform:
                      index === activeIndex
                        ? isWheelDragging
                          ? "scale(1.12)"
                          : "scale(1.16)"
                        : Math.abs(index - activeIndex) === 1
                          ? "scale(0.94)"
                          : "scale(0.88)",
                  }}
                  type="button"
                >
                  <span className="radio-player__selector-scale" aria-hidden="true">
                    <span className="radio-player__selector-tick radio-player__selector-tick--minor" />
                    <span className="radio-player__selector-tick radio-player__selector-tick--minor" />
                    <span className="radio-player__selector-tick radio-player__selector-tick--minor" />
                    <span
                      className={
                        index === activeIndex
                          ? "radio-player__selector-tick radio-player__selector-tick--major"
                          : "radio-player__selector-tick"
                      }
                    />
                    <span className="radio-player__selector-tick radio-player__selector-tick--minor" />
                    <span className="radio-player__selector-tick radio-player__selector-tick--minor" />
                    <span className="radio-player__selector-tick radio-player__selector-tick--minor" />
                  </span>
                  <span className="radio-player__selector-label">{episode.host}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="radio-player__queue">
          <div className="radio-player__queue-head">
            <p>节目列表</p>
            <span>{activeIndex + 1} / {radioEpisodes.length}</span>
          </div>

          <div className="radio-player__queue-list">
            {radioEpisodes.map((episode, index) => (
              <button
                key={episode.id}
                className={
                  index === activeIndex
                    ? "radio-player__queue-item radio-player__queue-item--active"
                    : "radio-player__queue-item"
                }
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <span className="radio-player__queue-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="radio-player__queue-copy">
                  <strong>{episode.title}</strong>
                  <small>{episode.host}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Radio;
