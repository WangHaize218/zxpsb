import { useMemo, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import { missionGroups } from "../data/missions";

function Missions() {
  const [activeGroupId, setActiveGroupId] = useState(missionGroups[0]?.id ?? "");
  const currentGroup =
    missionGroups.find((group) => group.id === activeGroupId) || missionGroups[0];
  const [activeMissionId, setActiveMissionId] = useState(
    currentGroup?.missions[0]?.id ?? "",
  );
  const [reportText, setReportText] = useState("");

  const currentMissions = currentGroup?.missions ?? [];
  const activeMission =
    currentMissions.find((mission) => mission.id === activeMissionId) ||
    currentMissions[0];

  const completedLikeCount = useMemo(
    () =>
      missionGroups
        .flatMap((group) => group.missions)
        .filter((mission) => mission.status.includes("完成") || mission.status.includes("可")).length,
    [],
  );

  return (
    <section className="page quest-page quest-page--game">
      <SectionHeader
        badge="美国支线任务系统"
        title="美国支线任务系统"
        description="分线路看任务，点一条看详情，再决定今天先推进哪一件。"
      />

      <div className="quest-game">
        <div className="quest-game__tabs" role="tablist" aria-label="任务类型">
          {missionGroups.map((group) => (
            <button
              key={group.id}
              className={
                group.id === activeGroupId
                  ? "quest-game__tab quest-game__tab--active"
                  : "quest-game__tab"
              }
              onClick={() => {
                setActiveGroupId(group.id);
                setActiveMissionId(group.missions[0]?.id ?? "");
              }}
              type="button"
            >
              <span>{group.label}</span>
              <strong>{group.title}</strong>
            </button>
          ))}
        </div>

        <div className="quest-game__frame">
          <section className="quest-game__board">
            <div className="quest-game__board-top">
              <div className="quest-game__board-copy">
                <span>当前线路</span>
                <strong>{currentGroup?.title}</strong>
                <p>{currentGroup?.description}</p>
              </div>
              <div className="quest-game__board-stats" aria-label="任务概况">
                <div>
                  <span>线路类型</span>
                  <strong>{currentGroup?.state}</strong>
                </div>
                <div>
                  <span>任务数量</span>
                  <strong>{String(currentMissions.length).padStart(2, "0")}</strong>
                </div>
              </div>
            </div>

            <div className="quest-game__section-head">
              <span>任务列表</span>
              <strong>点一条任务，下方会显示详细说明</strong>
            </div>

            <div className="quest-game__list">
              {currentMissions.map((mission) => {
                const isActive = mission.id === activeMissionId;
                const isClaimable =
                  mission.status.includes("完成") || mission.status.includes("可");

                return (
                  <button
                    key={mission.id}
                    className={
                      isActive
                        ? "quest-row quest-row--active"
                        : "quest-row"
                    }
                    onClick={() => setActiveMissionId(mission.id)}
                    type="button"
                  >
                    <div className="quest-row__check" aria-hidden="true">
                      <span />
                    </div>

                    <div className="quest-row__copy">
                      <small>
                        {mission.code} · {mission.difficulty}
                      </small>
                      <strong>{mission.title}</strong>
                      <p>{mission.objective}</p>
                      <em>{mission.reward}</em>
                    </div>

                    <div className="quest-row__action">
                      <span>{mission.status}</span>
                      <strong>{isClaimable ? "可推进" : "查看中"}</strong>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <section className="quest-report">
          <div className="quest-report__header">
            <div>
              <span>当前任务详情</span>
              <strong>{activeMission?.title}</strong>
            </div>
            <b>{String(completedLikeCount).padStart(2, "0")} 条可推进</b>
          </div>

          <div className="quest-report__body">
            <div className="quest-report__brief">
              <strong className="quest-report__label">任务提示</strong>
              <p>{activeMission?.hint}</p>
              <div className="quest-report__chips">
                <span>{activeMission?.status}</span>
                <span>{activeMission?.difficulty}</span>
                <span>{activeMission?.reward}</span>
              </div>
            </div>

            <div className="quest-report__output">
              <strong className="quest-report__label">可直接发给朋友的汇报</strong>
              <p>
                {reportText ||
                  "选中一项任务后生成汇报，系统会给你一段可以直接发给朋友的任务播报。"}
              </p>
              <button
                className="quest-report__button"
                onClick={() => setReportText(activeMission?.report ?? "")}
                type="button"
              >
                生成任务播报
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Missions;
