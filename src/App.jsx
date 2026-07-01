import Boot from "./pages/Boot";

const staticGateState = {
  status: "blocked",
  detail:
    "当前入口已设为静态限制模式。检测结果固定为未到美国，因此暂时无法进入后续内容；等你到美国后，再把这里切换成开放状态即可。",
  locationLabel: "中国 / 未到美国",
  coordinates: "静态限制中",
};

function App() {
  return <Boot gateState={staticGateState} />;
}

export default App;
