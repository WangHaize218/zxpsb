import { useEffect, useState } from "react";
import AppShell from "./components/AppShell";
import Boot from "./pages/Boot";
import Finale from "./pages/Finale";
import Home from "./pages/Home";
import Mailbox from "./pages/Mailbox";
import Manual from "./pages/Manual";
import Missions from "./pages/Missions";
import Radio from "./pages/Radio";
import Supply from "./pages/Supply";

const navItems = [
  { id: "home", label: "首页" },
  { id: "supply", label: "补给" },
  { id: "radio", label: "电台" },
  { id: "mailbox", label: "邮箱" },
  { id: "manual", label: "手册" },
  { id: "missions", label: "任务" },
];

function App() {
  const [activePage, setActivePage] = useState("home");
  const [showBoot, setShowBoot] = useState(true);
  const [bootExiting, setBootExiting] = useState(false);
  const [appEntering, setAppEntering] = useState(false);

  const finishBoot = () => {
    setBootExiting(true);
  };

  useEffect(() => {
    if (!bootExiting) {
      return undefined;
    }

    const hideBootTimer = window.setTimeout(() => {
      setShowBoot(false);
      setAppEntering(true);
    }, 420);

    const settleTimer = window.setTimeout(() => {
      setAppEntering(false);
    }, 1120);

    return () => {
      window.clearTimeout(hideBootTimer);
      window.clearTimeout(settleTimer);
    };
  }, [bootExiting]);

  if (showBoot) {
    return <Boot isExiting={bootExiting} onEnter={finishBoot} />;
  }

  if (activePage === "finale") {
    return <Finale onBackHome={() => setActivePage("home")} />;
  }

  return (
    <AppShell
      activePage={activePage}
      entering={appEntering}
      navItems={navItems}
      onNavigate={setActivePage}
    >
      {activePage === "home" && (
        <Home
          onOpenPage={setActivePage}
          onOpenFinale={() => setActivePage("finale")}
        />
      )}
      {activePage === "supply" && <Supply onOpenPage={setActivePage} />}
      {activePage === "radio" && <Radio onBack={() => setActivePage("home")} />}
      {activePage === "mailbox" && <Mailbox />}
      {activePage === "manual" && <Manual />}
      {activePage === "missions" && <Missions />}
    </AppShell>
  );
}

export default App;
