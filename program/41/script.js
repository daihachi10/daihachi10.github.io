document.addEventListener("DOMContentLoaded", () => {
  // HTML要素の取得
  const body = document.body;
  const themeToggleButton = document.getElementById("theme-toggle-btn");
  const focusToggleButton = document.getElementById("focus-toggle-btn");
  const minNumInput = document.getElementById("min-number");
  const maxNumInput = document.getElementById("max-number");
  const noDuplicatesCheckbox = document.getElementById("no-duplicates");
  const startButton = document.getElementById("start-button");
  const resetButton = document.getElementById("reset-button");
  const historyList = document.getElementById("history-list");

  // モード関連の要素
  const modeSelector = document.querySelector(".mode-selector");
  const modeHighlight = document.querySelector(".mode-highlight");
  const modeButtons = document.querySelectorAll(".mode-btn");
  const modeContents = document.querySelectorAll(".mode-content");
  const resultDisplay = document.getElementById("result-display");
  const rouletteWheel = document.querySelector(".roulette-wheel");
  const cardGrid = document.querySelector(".card-grid");
  const cardMessage = document.getElementById("card-message");
  const resultOverlay = document.getElementById("result-overlay");
  const resultPopup = document.getElementById("result-popup");

  // 状態管理
  let currentMode = "simple";
  let drawnNumbers = [];
  let isSpinning = false;
  let rotationDegree = 0;
  let cardGameActive = false;
  let availableCards = [];

  // --- テーマ切り替え処理 ---
  const themes = [
    { name: "Blue", color: "#1a73e8" },
    { name: "Green", color: "#1e8e3e" },
    { name: "Red", color: "#d93025" },
    { name: "Purple", color: "#8e44ad" },
    { name: "Orange", color: "#f0932b" },
  ];
  let currentThemeIndex = 0;

  const hexToHsl = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0,
      g = 0,
      b = 0;
    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }
    r = Math.round((r + m) * 255)
      .toString(16)
      .padStart(2, "0");
    g = Math.round((g + m) * 255)
      .toString(16)
      .padStart(2, "0");
    b = Math.round((b + m) * 255)
      .toString(16)
      .padStart(2, "0");
    return `#${r}${g}${b}`;
  };

  const applyTheme = (color) => {
    const hsl = hexToHsl(color);
    const root = document.documentElement;

    root.style.setProperty("--color-primary", color);
    root.style.setProperty(
      "--color-primary-dark",
      hslToHex(hsl.h, hsl.s, hsl.l - 10)
    );
    root.style.setProperty(
      "--color-primary-light",
      hslToHex(hsl.h, hsl.s, hsl.l + 85)
    );
    root.style.setProperty(
      "--color-primary-disabled",
      hslToHex(hsl.h, hsl.s, hsl.l + 30)
    );
  };

  themeToggleButton.addEventListener("click", () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme(themes[currentThemeIndex].color);
  });

  // 初期テーマを適用
  applyTheme(themes[currentThemeIndex].color);

  // ★★★ フォーカスモード切り替え処理 ★★★
  focusToggleButton.addEventListener("click", () => {
    // if (isSpinning) return; // 抽選中は切り替え不可
    body.classList.toggle("focus-mode-on");
    body.classList.toggle("focus-mode-off");
  });

  // --- 共通関数 ---
  const getAvailableNumbers = () => {
    const min = parseInt(minNumInput.value);
    const max = parseInt(maxNumInput.value);
    if (isNaN(min) || isNaN(max) || min >= max) {
      alert("有効な範囲を正しく入力してください（最小値 < 最大値）。");
      return null;
    }
    const available = [];
    for (let i = min; i <= max; i++) {
      if (!noDuplicatesCheckbox.checked || !drawnNumbers.includes(i)) {
        available.push(i);
      }
    }
    return available;
  };

  const addToHistory = (number) => {
    drawnNumbers.push(number);
    const historyItem = document.createElement("li");
    historyItem.textContent = number;
    historyList.prepend(historyItem);
  };

  const showResultPopup = (number) => {
    resultPopup.textContent = number;
    resultOverlay.classList.remove("hidden");
    setTimeout(() => {
      resultOverlay.classList.add("hidden");
    }, 1500);
  };

  const setControlsDisabled = (disabled) => {
    isSpinning = disabled;
    startButton.disabled = disabled;
    minNumInput.disabled = disabled;
    maxNumInput.disabled = disabled;
    noDuplicatesCheckbox.disabled = disabled;
    // ★★★ 抽選中はフォーカスボタンとテーマボタンも無効化 ★★★
    // focusToggleButton.disabled = disabled;
    // themeToggleButton.disabled = disabled;
  };

  // --- モード切り替え ---
  // --- モード切り替え ---
  const setActiveMode = (mode) => {
    if (currentMode === mode) return;

    // スピンアニメーション中は切り替え不可。ただしカードゲーム中は許可
    if (isSpinning && !cardGameActive) {
      return;
    }

    // カード選択の途中でモードを切り替えた場合、カードゲームの状態をリセット
    if (currentMode === "card" && cardGameActive) {
      cardGameActive = false;
      cardGrid.innerHTML = "";
      availableCards = [];
    }

    currentMode = mode;

    // ハイライトの位置を更新
    const activeButton = document.querySelector(
      `.mode-btn[data-mode="${mode}"]`
    );
    modeHighlight.style.width = `${activeButton.offsetWidth}px`;
    modeHighlight.style.transform = `translateX(${activeButton.offsetLeft}px)`;

    // ボタンのアクティブ状態を更新
    modeButtons.forEach((btn) => btn.classList.remove("active"));
    activeButton.classList.add("active");

    // コンテンツの表示を切り替え
    modeContents.forEach((content) => content.classList.remove("active"));
    document.getElementById(`${currentMode}-mode-area`).classList.add("active");

    // モードに応じた処理
    if (currentMode === "card") {
      const availableNumbers = getAvailableNumbers();
      if (availableNumbers && availableNumbers.length > 0) {
        startCardMode(availableNumbers);
      } else {
        cardMessage.textContent = "すべての数字を引き終えました！";
        setControlsDisabled(false);
      }
    } else {
      startButton.textContent = "スタート！";
      setControlsDisabled(false);
    }
  };

  // クリックでモード切替
  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => setActiveMode(btn.dataset.mode));
  });

  // ドラッグでモード切替
  let isDragging = false;
  let startX;
  let currentDragMode;

  const handleDragStart = (e) => {
    isDragging = true;
    startX = e.pageX || e.touches[0].pageX;
    currentDragMode = currentMode;
    modeSelector.style.cursor = "grabbing";
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX || e.touches[0].pageX;
    const walk = x - startX;
    const buttonWidth = modeButtons[0].offsetWidth;

    const modeOrder = Array.from(modeButtons).map((btn) => btn.dataset.mode);
    const currentIndex = modeOrder.indexOf(currentDragMode);

    if (walk > buttonWidth / 2 && currentIndex < modeOrder.length - 1) {
      setActiveMode(modeOrder[currentIndex + 1]);
      isDragging = false; // 1回のドラッグで1回だけ切り替え
    } else if (walk < -buttonWidth / 2 && currentIndex > 0) {
      setActiveMode(modeOrder[currentIndex - 1]);
      isDragging = false; // 1回のドラッグで1回だけ切り替え
    }
  };

  const handleDragEnd = () => {
    isDragging = false;
    modeSelector.style.cursor = "grab";
  };

  modeSelector.addEventListener("mousedown", handleDragStart);
  modeSelector.addEventListener("touchstart", handleDragStart);
  modeSelector.addEventListener("mousemove", handleDragMove);
  modeSelector.addEventListener("touchmove", handleDragMove);
  modeSelector.addEventListener("mouseup", handleDragEnd);
  modeSelector.addEventListener("touchend", handleDragEnd);
  modeSelector.addEventListener("mouseleave", handleDragEnd);

  // 初期ハイライト位置を設定
  window.addEventListener("load", () => {
    setTimeout(() => {
      const activeButton = document.querySelector(".mode-btn.active");
      if (activeButton) {
        modeHighlight.style.width = `${activeButton.offsetWidth}px`;
        modeHighlight.style.transform = `translateX(${activeButton.offsetLeft}px)`;
      }
    }, 50); // DOM描画が安定するのを待つ
  });

  // --- スタートボタン処理 ---
  startButton.addEventListener("click", () => {
    if (isSpinning) return;
    const availableNumbers = getAvailableNumbers();
    if (!availableNumbers) return;
    if (availableNumbers.length === 0) {
      alert("すべての数字を引き終えました！リセットしてください。");
      return;
    }
    setControlsDisabled(true);
    switch (currentMode) {
      case "simple":
        startSimpleMode(availableNumbers);
        break;
      case "roulette":
        startRouletteMode(availableNumbers);
        break;
    }
    body.classList.add("focus-mode-on");
    body.classList.remove("focus-mode-off");
  });

  // --- 各モードの実行関数 ---
  // 1. シンプルモード
  const startSimpleMode = (numbers) => {
    resultDisplay.classList.remove("zoom");
    const spinInterval = setInterval(() => {
      resultDisplay.textContent =
        numbers[Math.floor(Math.random() * numbers.length)];
    }, 50);

    setTimeout(() => {
      clearInterval(spinInterval);
      const resultNumber = numbers[Math.floor(Math.random() * numbers.length)];
      resultDisplay.textContent = resultNumber;
      resultDisplay.classList.add("zoom");
      addToHistory(resultNumber);
      setControlsDisabled(false);
    }, 2000);
  };

  // 2. ルーレットモード
  const startRouletteMode = (numbers) => {
    const min = parseInt(minNumInput.value);
    const max = parseInt(maxNumInput.value);
    const totalNumbers = max - min + 1;
    const segmentAngle = 360 / totalNumbers;

    const colors = [
      "#ffadad",
      "#ffd6a5",
      "#fdffb6",
      "#caffbf",
      "#9bf6ff",
      "#a0c4ff",
      "#bdb2ff",
      "#ffc6ff",
    ];
    // --- カラーパレットの提案 ---
    // 1. ビタミンカラー: ["#ff9f43", "#ffdd59", "#ff6348", "#a0de5c", "#48dbfb", "#ff7979", "#feca57", "#1dd1a1"]
    // 2. パステルカラー: ["#f3a683", "#f7d794", "#77dd77", "#82a0c2", "#b19cd9", "#ffb3de", "#f8c291", "#6a89cc"]
    // 3. 海の色: ["#00a8ff", "#9c88ff", "#fbc531", "#4cd137", "#487eb0", "#e84118", "#7f8fa6", "#273c75"]
    // 4. 大地の色: ["#ccae62", "#a47e3b", "#644536", "#b79492", "#846c5b", "#ad8a64", "#d4ac6e", "#e5c593"]
    // 5. レインボー: ["#ff4757", "#ff7f50", "#ffff55", "#53ff53", "#5353ff", "#ad53ad", "#ff53ad", "#53adff"]
    // 6. クールな青系: ["#0984e3", "#74b9ff", "#a29bfe", "#dfe6e9", "#00cec9", "#6c5ce7", "#55efc4", "#81ecec"]
    // 7. 暖かい赤系: ["#d63031", "#e17055", "#ff7675", "#fab1a0", "#fd79a8", "#e84393", "#fdcb6e", "#f0932b"]
    // 8. モノクローム: ["#2d3436", "#636e72", "#b2bec3", "#dfe6e9", "#57606f", "#a4b0be", "#ced6e0", "#f1f2f6"]
    // 9. 自然な緑系: ["#00b894", "#55efc4", "#81ecec", "#78e08f", "#00d2d3", "#4834d4", "#341f97", "#10ac84"]
    // 10. エレガント: ["#2c3e50", "#34495e", "#95a5a6", "#bdc3c7", "#7f8c8d", "#ecf0f1", "#8e44ad", "#9b59b6"]
    let gradient = "conic-gradient(";
    rouletteWheel.innerHTML = "";

    for (let i = 0; i < totalNumbers; i++) {
      const num = i + min;
      gradient += `${colors[i % colors.length]} ${i * segmentAngle}deg ${
        (i + 1) * segmentAngle
      }deg`;
      if (i < totalNumbers - 1) gradient += ", ";
      const numberDiv = document.createElement("div");
      numberDiv.className = "number";
      numberDiv.style.transform = `rotate(${
        i * segmentAngle + segmentAngle / 2
      }deg)`;
      if (noDuplicatesCheckbox.checked && drawnNumbers.includes(num)) {
        numberDiv.classList.add("drawn");
      }
      const span = document.createElement("span");
      span.textContent = num;
      numberDiv.appendChild(span);
      rouletteWheel.appendChild(numberDiv);
    }
    gradient += ")";
    rouletteWheel.style.background = gradient;

    const currentAngle = ((rotationDegree % 360) + 360) % 360;
    const resultNumber = numbers[Math.floor(Math.random() * numbers.length)];
    const resultIndex = resultNumber - min;

    // どこに止まるかをランダムにするためのオフセット計算
    // セグメントの幅内でランダムなオフセットを生成します（振れ幅を少し抑える）
    const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.75;
    const targetSegmentCenterAngle =
      resultIndex * segmentAngle + segmentAngle / 2;
    const finalTargetAngle = targetSegmentCenterAngle + randomOffset;

    const targetViewAngle = (270 - finalTargetAngle + 360) % 360;
    let rotationNeeded = targetViewAngle - currentAngle;
    if (rotationNeeded < 0) rotationNeeded += 360;
    const fullRotations = 360 * (Math.floor(Math.random() * 4) + 5);
    const rotationAmount = fullRotations + rotationNeeded;
    rotationDegree += rotationAmount;
    rouletteWheel.style.transform = `rotate(${rotationDegree}deg)`;

    setTimeout(() => {
      showResultPopup(resultNumber);
      addToHistory(resultNumber);
      setControlsDisabled(false);
    }, 5100);
  };

  // 3. カードモード
  const startCardMode = (numbers) => {
    availableCards = [...numbers];
    cardGrid.innerHTML = "";
    cardMessage.textContent = "好きなカードを1枚選んでください";
    for (let i = availableCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableCards[i], availableCards[j]] = [
        availableCards[j],
        availableCards[i],
      ];
    }
    availableCards.forEach((num) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.number = num;
      card.innerHTML = `<div class="card-inner"><div class="card-front"></div><div class="card-back">${num}</div></div>`;
      card.addEventListener("click", handleCardClick, { once: true });
      cardGrid.appendChild(card);
    });
    cardGameActive = true;
    setControlsDisabled(true);
  };

  const handleCardClick = (e) => {
    const clickedCard = e.currentTarget;
    const resultNumber = parseInt(clickedCard.dataset.number);
    clickedCard.classList.add("flipped");
    addToHistory(resultNumber);
    availableCards.splice(availableCards.indexOf(resultNumber), 1);
    if (availableCards.length === 0) {
      cardMessage.textContent = "すべてのカードを引きました！";
      cardGameActive = false;
      setControlsDisabled(false);
    }
  };

  // --- リセットボタン処理 ---
  resetButton.addEventListener("click", () => {
    drawnNumbers = [];
    historyList.innerHTML = "";
    setControlsDisabled(false);
    cardGameActive = false;
    resultDisplay.textContent = "?";
    resultDisplay.classList.remove("zoom");
    rouletteWheel.style.transition = "none";
    rotationDegree = 0;
    rouletteWheel.style.transform = `rotate(${rotationDegree}deg)`;
    rouletteWheel.innerHTML = "";
    rouletteWheel.style.background = "none";
    setTimeout(() => {
      rouletteWheel.style.transition =
        "transform 5s cubic-bezier(0.1, 0.8, 0.2, 1)";
    }, 50);
    cardGrid.innerHTML = "";
    cardMessage.textContent = "スタートボタンを押してカードを準備";
    availableCards = [];
    startButton.textContent =
      currentMode === "card" ? "カードを準備" : "スタート！";
  });
});

$(function () {
  $(".footer").load("https://daihachi10.github.io/common/footer.html");
  $("#loading").load("https://daihachi10.github.io/common/loading.html");
  $(".header").load("https://daihachi10.github.io/common/header.html");
  $(".header").load("./common/header.html");

  // $("#login").load("./account/iframe.html");

  $.get("https://daihachi10.github.io/common/color.html", function (data) {
    $("body").prepend(data); // 先頭に追加する場合
    // $("body").append(data); // 末尾に追加する場合は、こちらを使用
  });
});
