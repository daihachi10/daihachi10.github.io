document.addEventListener("DOMContentLoaded", function () {
  // ---- 初期設定 ----
  const calendarEl = document.getElementById("calendar");
  const taskPrice = 50; // お手伝い1回あたりの金額

  // ブラウザに保存されているお手伝いの履歴と種類を取得します。なければ空のリストを使います。
  let history = JSON.parse(localStorage.getItem("okozukai_history")) || [];
  let tasks = JSON.parse(localStorage.getItem("okozukai_tasks")) || [];

  // カレンダーの設定
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth", // 月表示カレンダー
    locale: "ja", // 日本語化
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "",
    },
    events: getCalendarEvents(), // カレンダーに表示するイベント（お手伝い履歴）を取得
  });

  // ---- 関数定義 ----

  // お手伝いの履歴をカレンダーが表示できる形式に変換する関数
  function getCalendarEvents() {
    return history.map((item) => ({
      title: item.task,
      start: item.date,
      allDay: true,
    }));
  }

  // 合計金額を計算して表示する関数
  function updateTotal() {
    const currentMonthTotal = document.getElementById("current-month-total");
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const total =
      history.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate.getFullYear() === year && itemDate.getMonth() === month;
      }).length * taskPrice;

    currentMonthTotal.textContent = total;
  }

  // お手伝いボタンを画面に表示する関数
  function renderTaskButtons() {
    const buttonsContainer = document.getElementById("task-buttons");
    buttonsContainer.innerHTML = ""; // 一旦空にする
    tasks.forEach((taskName) => {
      const button = document.createElement("button");
      button.textContent = taskName;
      button.onclick = function () {
        // ISO形式(YYYY-MM-DD)で日付を取得
        const today = new Date().toISOString().slice(0, 10);

        // 履歴に追加
        history.push({ task: taskName, date: today });

        // ブラウザに保存
        localStorage.setItem("okozukai_history", JSON.stringify(history));

        // 画面を更新
        calendar.refetchEvents(); // カレンダーを再描画
        updateTotal(); // 合計金額を更新
        alert(`「${taskName}」を記録しました！`);
      };
      buttonsContainer.appendChild(button);
    });
  }

  // ---- グローバル関数（HTMLから呼び出すため）----

  // 新しいお手伝いを追加する関数
  window.addTask = function () {
    const newTaskNameInput = document.getElementById("new-task-name");
    const newTaskName = newTaskNameInput.value.trim(); // 入力値の前後の空白を削除

    if (newTaskName && !tasks.includes(newTaskName)) {
      tasks.push(newTaskName);
      localStorage.setItem("okozukai_tasks", JSON.stringify(tasks));
      renderTaskButtons(); // ボタンを再描画
      newTaskNameInput.value = ""; // 入力欄を空にする
    } else if (!newTaskName) {
      alert("お手伝いの名前を入力してください。");
    } else {
      alert("そのお手伝いはすでに追加されています。");
    }
  };

  // ---- 初期化処理 ----
  renderTaskButtons(); // 最初にボタンを表示
  updateTotal(); // 最初に合計金額を計算
  calendar.render(); // カレンダーを描画
});
