import { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import { emotionSupplies, randomSupplyPool } from "../data/supplies";

function Supply({ onOpenPage }) {
  const [activeId, setActiveId] = useState(emotionSupplies[0].id);
  const [randomText, setRandomText] = useState("");

  const activeSupply =
    emotionSupplies.find((item) => item.id === activeId) || emotionSupplies[0];

  const pickRandomSupply = () => {
    const next =
      randomSupplyPool[Math.floor(Math.random() * randomSupplyPool.length)];
    setRandomText(next);
  };

  return (
    <section className="page">
      <SectionHeader badge="今日补给" title="今日补给" />

      <div className="chip-row">
        {emotionSupplies.map((item) => (
          <button
            key={item.id}
            className={item.id === activeId ? "chip chip--active" : "chip"}
            onClick={() => setActiveId(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      <article className="content-panel">
        <h2>{activeSupply.title}</h2>
        <p>{activeSupply.body}</p>
        {activeSupply.id === "voices" && (
          <button
            className="inline-action"
            onClick={() => onOpenPage("radio")}
            type="button"
          >
            直接前往朋友电台
          </button>
        )}
      </article>

      <section className="content-panel content-panel--accent">
        <div className="panel-heading">
          <h2>随机补给包</h2>
          <button className="inline-action" onClick={pickRandomSupply} type="button">
            抽一个
          </button>
        </div>
        <p>
          {randomText || "今天还没有抽取补给，按一下看看朋友系统会掉落什么。"}
        </p>
      </section>
    </section>
  );
}

export default Supply;
