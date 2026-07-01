import Boot from "./pages/Boot";

const staticGateState = {
  status: "blocked",
  detail:
    "当前入口已设为静态限制模式。检测结果为非法IP，因此暂时无法进入后续内容；等你到美国后，此网站即切换为开放状态。",
  locationLabel: "中国 / 未到美国",
  coordinates: "静态限制中",
};

function App() {
  return <Boot gateState={staticGateState} />;
}

export default App;
