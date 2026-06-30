export const missionGroups = [
  {
    id: "starter",
    title: "新手任务线",
    label: "Landing",
    state: "主线",
    description: "刚落地那几天，先确认你真的平安上线了。",
    missions: [
      {
        id: "sky",
        code: "Q-001",
        title: "落地后拍一张天空",
        objective: "给国内朋友一个最简单的平安信号。",
        reward: "解锁全员放心 20%",
        difficulty: "低风险",
        status: "进行中",
        hint: "不用找完美构图，只要让大家知道你平安到站。",
        report:
          "【任务 001 已完成】本人已顺利抵达美国。天空已拍，人还活着，请组织放心。",
      },
      {
        id: "meal",
        code: "Q-002",
        title: "拍下第一顿饭",
        objective: "记录第一餐，证明生存系统已经启动。",
        reward: "解锁群友审判席",
        difficulty: "基础任务",
        status: "待接取",
        hint: "哪怕只是简简单单一顿，也算正式开局。",
        report:
          "【任务 002 已完成】美国第一顿饭已记录，味道暂不评价，等待群友远程审判。",
      },
    ],
  },
  {
    id: "adapt",
    title: "适应期任务线",
    label: "Map",
    state: "探索",
    description: "开始建立坐标感，让陌生环境慢慢变得可描述。",
    missions: [
      {
        id: "campus",
        code: "Q-003",
        title: "拍一张校园照片",
        objective: "留下一张你确实来过这里的证据。",
        reward: "地图熟悉度 +1",
        difficulty: "探索任务",
        status: "待接取",
        hint: "这类任务的重点不是好看，是把环境变成你的地盘。",
        report:
          "【任务 003 已完成】校园照片已上传。各位可以开始假装自己也来过这里了。",
      },
      {
        id: "restaurant",
        code: "Q-004",
        title: "找到一家能吃的餐馆",
        objective: "建立可持续补给点，不再靠运气进食。",
        reward: "补给站坐标已存档",
        difficulty: "中等",
        status: "可完成",
        hint: "找到之后记住名字和路线，后面会救你很多次。",
        report:
          "【任务 004 已完成】已在异国他乡找到可持续生存餐厅一间，允许我进行短暂庆祝。",
      },
    ],
  },
  {
    id: "emotion",
    title: "情绪支线",
    label: "Signal",
    state: "支线",
    description: "情绪不是隐藏关卡，发出信号本身就是任务完成。",
    missions: [
      {
        id: "homesick",
        code: "Q-005",
        title: "想家的时候主动发一次消息",
        objective: "不等崩溃再汇报，先让朋友知道你在想家。",
        reward: "联机援助开启",
        difficulty: "高勇气",
        status: "隐藏奖励",
        hint: "这类任务最难的不是发什么，而是先按下发送。",
        report:
          "【任务 005 已完成】本人已按规定发送想家报备，请朋友系统立刻接收。",
      },
      {
        id: "happy",
        code: "Q-006",
        title: "开心的时候别藏着",
        objective: "有好消息就同步，不要只在难过时出现。",
        reward: "快乐同步权限",
        difficulty: "隐藏奖励",
        status: "支线进行中",
        hint: "快乐也值得存档，不要只给朋友看崩溃现场。",
        report:
          "【任务 006 已完成】现有一条快乐消息需要同步，请群里做好接收准备。",
      },
    ],
  },
];
