import ModuleCard from "../components/ModuleCard";
import SectionHeader from "../components/SectionHeader";

const modules = [
  {
    id: "supply",
    eyebrow: "今日状态",
    title: "今日补给",
    description: "按现在的心情，先拿一点刚刚好的陪伴和支撑。",
    buttonLabel: "打开补给",
  },
  {
    id: "radio",
    eyebrow: "声音档案",
    title: "朋友电台",
    description: "把语音、视频和寄语整理成频道，随时回来听见我们。",
    buttonLabel: "进入电台",
  },
  {
    id: "mailbox",
    eyebrow: "时间投递",
    title: "未来邮箱",
    description: "有些话不放在今天说，而是留给以后某一个你。",
    buttonLabel: "开始拆信",
  },
  {
    id: "manual",
    eyebrow: "生活指南",
    title: "生存手册",
    description: "不一定专业，但尽量在你需要的时候有用，也有点好笑。",
    buttonLabel: "查看手册",
  },
  {
    id: "missions",
    eyebrow: "持续联机",
    title: "支线任务",
    description: "把未来的互动留下来，让这份礼物不只被看一次。",
    buttonLabel: "接收任务",
  },
];

const statusItems = [
  ["当前用户", "张希骋"],
  ["当前位置", "美国"],
  ["好友连接", "永久在线"],
  ["系统口号", "允许出国，不许失联"],
];

function Home({ onOpenPage }) {
  return (
    <section className="page page--home">
      <SectionHeader
        badge="远方补给站"
        title="张希骋 美国留学朋友支持系统"
        description="这不是回忆录。这里是你到了美国以后，随时可以回来补一点能量的朋友基地。"
        size="hero"
      />

      <section className="home-hero">
        <div className="home-hero__main">
          <div className="hero-strip">
            <span>好友权限永久有效</span>
            <span>跨时区联机中</span>
            <span>适合半夜打开</span>
          </div>

          <div className="status-panel">
            {statusItems.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong className={label === "好友连接" ? "status-online" : ""}>
                  {value}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="module-grid">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            {...module}
            onClick={() => onOpenPage(module.id)}
          />
        ))}
      </section>
    </section>
  );
}

export default Home;
