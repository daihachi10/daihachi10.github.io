document.addEventListener("DOMContentLoaded", () => {
  // HTML要素の取得
  const body = document.body;
  const themeToggleButton = document.getElementById("theme-toggle-btn");
  const focusToggleButton = document.getElementById("focus-toggle-btn");
  const profileNameDisplay = document.getElementById("profile-name-display");
  const minNumInput = document.getElementById("min-number");
  const maxNumInput = document.getElementById("max-number");
  const noDuplicatesCheckbox = document.getElementById("no-duplicates");
  const startButton = document.getElementById("start-button");
  const resetButton = document.getElementById("reset-button");
  const historyList = document.getElementById("history-list");
  const resetLocalStorageBtn = document.getElementById(
    "reset-local-storage-btn"
  );
  const localReset = document.getElementById("local-reset-button");

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

  // 設定モーダル関連の要素
  const settingsBtn = document.getElementById("settings-btn");
  const settingsModal = document.getElementById("settings-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const volumeSlider = document.getElementById("volume-slider");

  // プロファイル関連の要素
  const profilesContainer = document.getElementById("profiles-container");
  const contextMenu = document.getElementById("profile-context-menu");

  // --- 状態管理 ---
  let profiles = [];
  let activeProfileId = null;
  let contextMenuVisible = false;
  let contextTargetProfileId = null;

  // 音声関連のセットアップ
  const sounds = {
    simpleTick: new Audio("./sounds/simple_tick.mp3"),
    simpleResult: new Audio("./sounds/simple_result.mp3"),
    rouletteTick: new Audio("./sounds/roulette_tick.mp3"),
    rouletteResult: new Audio("./sounds/roulette_result.mp3"),
    cardFlip: new Audio("./sounds/card_flip.mp3"),
  };

  Object.values(sounds).forEach((sound) => {
    sound.volume = 0.4;
  });

  resetLocalStorageBtn.addEventListener("click", () => {
    if (confirm("本当にすべての設定とプロファイルをリセットしますか？")) {
      localStorage.clear();
      window.location.reload();
    }
  });

  // --- 設定モーダルの処理 ---
  settingsBtn.addEventListener("click", () => {
    settingsModal.classList.remove("hidden");
  });

  closeModalBtn.addEventListener("click", () => {
    settingsModal.classList.add("hidden");
  });

  settingsModal.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.add("hidden");
    }
  });

  volumeSlider.addEventListener("input", (e) => {
    const newVolume = parseFloat(e.target.value);
    Object.values(sounds).forEach((sound) => {
      sound.volume = newVolume;
    });
  });

  // --- プロファイル処理 ---
  const MAX_PROFILES = 50;

  const saveProfiles = () => {
    localStorage.setItem("rouletteProfiles", JSON.stringify(profiles));
    localStorage.setItem("activeProfileId", activeProfileId);
  };

  const loadProfiles = () => {
    const savedProfiles = localStorage.getItem("rouletteProfiles");
    const savedActiveId = localStorage.getItem("activeProfileId");
    if (savedProfiles) {
      profiles = JSON.parse(savedProfiles);
      activeProfileId = savedActiveId
        ? parseInt(savedActiveId)
        : profiles.length > 0
        ? profiles[0].id
        : null;
    } else {
      // デフォルトプロファイル
      profiles = [{ id: 1, name: "デフォルト", min: 1, max: 35 }];
      activeProfileId = 1;
    }
    const activeProfile = profiles.find((p) => p.id === activeProfileId);
    if (activeProfile) {
      minNumInput.value = activeProfile.min;
      maxNumInput.value = activeProfile.max;
      noDuplicatesCheckbox.checked = activeProfile.noDuplicates || false;
    }
    renderProfiles();
    updateProfileNameDisplay();
  };

  const renderProfiles = () => {
    profilesContainer.innerHTML = "";
    profiles.forEach((profile) => {
      const profileEl = document.createElement("div");
      profileEl.className = `profile-item ${
        profile.id === activeProfileId ? "active" : ""
      }`;
      profileEl.dataset.id = profile.id;
      profileEl.innerHTML = `
        <span class="profile-name">${profile.name}</span>
        <button class="delete-profile-btn" data-id="${profile.id}">&times;</button>
      `;
      profileEl.addEventListener("click", () => switchProfile(profile.id));
      profileEl.addEventListener("contextmenu", (e) =>
        showContextMenu(e, profile.id)
      );
      profileEl
        .querySelector(".delete-profile-btn")
        .addEventListener("click", (e) => {
          e.stopPropagation(); // 親要素のクリックイベントを発火させない
          deleteProfile(profile.id);
        });
      profilesContainer.appendChild(profileEl);
    });

    if (profiles.length < MAX_PROFILES) {
      const addBtn = document.createElement("button");
      addBtn.id = "add-profile-btn";
      addBtn.textContent = "+ 追加";
      addBtn.addEventListener("click", addProfile);
      profilesContainer.appendChild(addBtn);
    }
  };

  const addProfile = () => {
    const newName = prompt(
      "新しいプロファイル名を入力してください:",
      `プロファイル ${profiles.length + 1}`
    );
    if (newName && newName.trim() !== "") {
      const newProfile = {
        id: Date.now(), // ユニークなIDを生成
        name: newName.trim(),
        min: parseInt(minNumInput.value),
        max: parseInt(maxNumInput.value),
<<<<<<< HEAD
=======
        noDuplicates: noDuplicatesCheckbox.checked,
>>>>>>> b453634fbb545d558d203ee973add78e3eec38b2
      };
      profiles.push(newProfile);
      activeProfileId = newProfile.id;
      saveProfiles();
      renderProfiles();
      switchProfile(newProfile.id);
    }
  };

  const deleteProfile = (id) => {
    if (profiles.length <= 1) {
      alert("最後のプロファイルは削除できません。");
      return;
    }
    if (confirm("本当にこのプロファイルを削除しますか？")) {
      profiles = profiles.filter((p) => p.id !== id);
      if (activeProfileId === id) {
        activeProfileId = profiles.length > 0 ? profiles[0].id : null;
        if (activeProfileId) {
          const activeProfile = profiles.find((p) => p.id === activeProfileId);
          minNumInput.value = activeProfile.min;
          maxNumInput.value = activeProfile.max;
          noDuplicatesCheckbox.checked = activeProfile.noDuplicates || false;
        }
      }
      saveProfiles();
      renderProfiles();
    }
  };

  const switchProfile = (id) => {
    activeProfileId = id;
    const profile = profiles.find((p) => p.id === id);
    if (profile) {
      minNumInput.value = profile.min;
      maxNumInput.value = profile.max;
      noDuplicatesCheckbox.checked = profile.noDuplicates || false;
      saveProfiles();
      renderProfiles();
      updateProfileNameDisplay();
      resetButton.click(); // プロファイル切り替え時にリセット
    }
  };

  minNumInput.addEventListener("change", updateActiveProfileRange);
  maxNumInput.addEventListener("change", updateActiveProfileRange);
<<<<<<< HEAD
=======
  noDuplicatesCheckbox.addEventListener("change", updateActiveProfileRange);
>>>>>>> b453634fbb545d558d203ee973add78e3eec38b2

  function updateActiveProfileRange() {
    const profile = profiles.find((p) => p.id === activeProfileId);
    if (profile) {
      profile.min = parseInt(minNumInput.value);
      profile.max = parseInt(maxNumInput.value);
      profile.noDuplicates = noDuplicatesCheckbox.checked;
      saveProfiles();
    }
  }

  // 初期化
  loadProfiles();

  // --- コンテキストメニュー処理 ---
  const showContextMenu = (e, profileId) => {
    e.preventDefault();
    contextTargetProfileId = profileId;
    contextMenu.style.top = `${e.clientY}px`;
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.classList.add("visible");
    contextMenuVisible = true;
  };

  const hideContextMenu = () => {
    if (contextMenuVisible) {
      contextMenu.classList.remove("visible");
      contextMenuVisible = false;
    }
  };

  const updateProfileNameDisplay = () => {
    const activeProfile = profiles.find((p) => p.id === activeProfileId);
    if (activeProfile) {
      profileNameDisplay.textContent = activeProfile.name;
    } else {
      profileNameDisplay.textContent = "";
    }
  };

  window.addEventListener("click", hideContextMenu);

  contextMenu.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    if (!action || !contextTargetProfileId) return;

    const profile = profiles.find((p) => p.id === contextTargetProfileId);
    if (!profile) return;

    switch (action) {
      case "load":
        switchProfile(contextTargetProfileId);
        break;
      case "save":
        profile.min = parseInt(minNumInput.value);
        profile.max = parseInt(maxNumInput.value);
        profile.noDuplicates = noDuplicatesCheckbox.checked;
        saveProfiles();
        alert(`プロファイル「${profile.name}」に現在の範囲を保存しました。`);
        break;
      case "rename":
        const newName = prompt(
          "新しいプロファイル名を入力してください:",
          profile.name
        );
        if (newName && newName.trim() !== "") {
          profile.name = newName.trim();
          saveProfiles();
          renderProfiles();
        }
        break;
    }
    hideContextMenu();
  });

  const playSound = (sound) => {
    const audio = sound.cloneNode();
    audio.volume = sound.volume;
    audio.play().catch((e) => console.error("音声の再生に失敗しました:", e));
  };

  const initAudio = () => {
    Object.values(sounds).forEach((sound) => {
      sound
        .play()
        .then(() => sound.pause())
        .catch(() => {});
    });
    document.body.removeEventListener("click", initAudio);
    document.body.removeEventListener("touchstart", initAudio);
  };
  document.body.addEventListener("click", initAudio, { once: true });
  document.body.addEventListener("touchstart", initAudio, { once: true });

  // 状態管理
  let currentMode = "simple";
  let drawnNumbers = [];
  let isSpinning = false;
  let rotationDegree = 0;
  let cardGameActive = false;
  let availableCards = [];
  let rouletteSpinTimeoutId = null;
  let currentRouletteResultNumber = null;
  let currentRouletteFinalTargetAngle = 0;

  // ★ ルーレット音声用の状態管理オブジェクト
  let rouletteAudioContext = {
    loopId: null,
    lastAngle: 0,
    angleSinceLastTick: 0,
    segmentAngle: 0,
    lastTickTimestamp: 0,
    minTimeBetweenTicks: 50, // 音を鳴らす最小間隔(ms)。50ms = 1秒間に最大20回
  };

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
      h = s = 0;
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
  applyTheme(themes[currentThemeIndex].color);

  focusToggleButton.addEventListener("click", () => {
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
    minNumInput.disabled = disabled;
    maxNumInput.disabled = disabled;
    noDuplicatesCheckbox.disabled = disabled;
  };

  // --- モード切り替え ---
  const setActiveMode = (mode) => {
    if (currentMode === mode) return;
    if (isSpinning && !cardGameActive) return;
    if (currentMode === "card" && cardGameActive) {
      cardGameActive = false;
      cardGrid.innerHTML = "";
      availableCards = [];
    }
    currentMode = mode;
    const activeButton = document.querySelector(
      `.mode-btn[data-mode="${mode}"]`
    );
    modeHighlight.style.width = `${activeButton.offsetWidth}px`;
    modeHighlight.style.transform = `translateX(${activeButton.offsetLeft}px)`;
    modeButtons.forEach((btn) => btn.classList.remove("active"));
    activeButton.classList.add("active");
    modeContents.forEach((content) => content.classList.remove("active"));
    document.getElementById(`${currentMode}-mode-area`).classList.add("active");
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

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => setActiveMode(btn.dataset.mode));
  });

  let isDragging = false,
    startX,
    currentDragMode;
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
      isDragging = false;
    } else if (walk < -buttonWidth / 2 && currentIndex > 0) {
      setActiveMode(modeOrder[currentIndex - 1]);
      isDragging = false;
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

  window.addEventListener("load", () => {
    setTimeout(() => {
      const activeButton = document.querySelector(".mode-btn.active");
      if (activeButton) {
        modeHighlight.style.width = `${activeButton.offsetWidth}px`;
        modeHighlight.style.transform = `translateX(${activeButton.offsetLeft}px)`;
      }
    }, 50);
  });

  // ★★★ ルーレット音声のループ処理本体 (ロジック修正) ★★★
  const rouletteAudioTick = () => {
    if (!isSpinning) {
      stopRouletteAudio();
      return;
    }

    const transform = window.getComputedStyle(rouletteWheel).transform;
    if (transform !== "none") {
      const matrix = new DOMMatrix(transform);
      const currentAngle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);

      let delta = currentAngle - rouletteAudioContext.lastAngle;
      if (delta < -270) {
        delta += 360;
      } else if (delta > 270) {
        delta -= 360;
      }

      rouletteAudioContext.angleSinceLastTick += Math.abs(delta);
      rouletteAudioContext.lastAngle = currentAngle;

      // 蓄積された角度がセグメントの角度を超える限りループ
      // (高速回転で1フレーム内に複数セグメントを通過した場合に対応)
      while (
        rouletteAudioContext.angleSinceLastTick >=
        rouletteAudioContext.segmentAngle
      ) {
        // 1セグメント通過したので、蓄積角度から減算
        rouletteAudioContext.angleSinceLastTick -=
          rouletteAudioContext.segmentAngle;

        const now = Date.now();
        // 前回の音から最小時間が経過しているかチェック
        if (
          now - rouletteAudioContext.lastTickTimestamp >
          rouletteAudioContext.minTimeBetweenTicks
        ) {
          playSound(sounds.rouletteTick);
          rouletteAudioContext.lastTickTimestamp = now; // 音を鳴らしたので時刻を更新
        }
        // 時間が経過していなければ、音はスキップされる（間引かれる）
      }
    }

    rouletteAudioContext.loopId = requestAnimationFrame(rouletteAudioTick);
  };

  // ★★★ ルーレット音声ループを開始する関数 ★★★
  const startRouletteAudio = (segmentAngle) => {
    stopRouletteAudio();

    const initialTransform = window.getComputedStyle(rouletteWheel).transform;
    const initialMatrix = new DOMMatrix(initialTransform);
    rouletteAudioContext = {
      ...rouletteAudioContext, // minTimeBetweenTicksを引き継ぐ
      loopId: null,
      lastAngle: Math.atan2(initialMatrix.b, initialMatrix.a) * (180 / Math.PI),
      angleSinceLastTick: 0,
      segmentAngle: segmentAngle,
      lastTickTimestamp: 0,
    };

    rouletteAudioContext.loopId = requestAnimationFrame(rouletteAudioTick);
  };

  // ★★★ ルーレット音声ループを停止する関数 ★★★
  const stopRouletteAudio = () => {
    if (rouletteAudioContext.loopId) {
      cancelAnimationFrame(rouletteAudioContext.loopId);
      rouletteAudioContext.loopId = null;
    }
  };

  // --- スタートボタン処理 ---
  startButton.addEventListener("click", () => {
    if (currentMode === "roulette" && isSpinning) {
      stopRouletteAudio();
      playSound(sounds.rouletteResult);

      clearTimeout(rouletteSpinTimeoutId);

      rouletteWheel.style.transition =
        "transform 1.5s cubic-bezier(0.2, 0.95, 0.3, 1)";
      rouletteWheel.style.transform = `rotate(${currentRouletteFinalTargetAngle}deg)`;

      setTimeout(() => {
        rouletteWheel.style.transition =
          "transform 5s cubic-bezier(0.1, 0.8, 0.2, 1)";
      }, 1500);

      showResultPopup(currentRouletteResultNumber);
      addToHistory(currentRouletteResultNumber);
      setControlsDisabled(false);
      startButton.textContent = "スタート！";
      startButton.disabled = false;
      rouletteSpinTimeoutId = null;
      return;
    }

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
  const startSimpleMode = (numbers) => {
    resultDisplay.classList.remove("zoom");
    // アニメーションを再トリガーするために少し待つ
    void resultDisplay.offsetWidth;

    const spinInterval = setInterval(() => {
      resultDisplay.textContent =
        numbers[Math.floor(Math.random() * numbers.length)];
      playSound(sounds.simpleTick);
    }, 50);

    setTimeout(() => {
      clearInterval(spinInterval);
      const resultNumber = numbers[Math.floor(Math.random() * numbers.length)];
      resultDisplay.textContent = resultNumber;
      resultDisplay.classList.add("zoom");
      playSound(sounds.simpleResult);
      addToHistory(resultNumber);
      setControlsDisabled(false);
    }, 2000);
  };

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
    // グラデーションの開始点をポインターの位置（真上）に合わせ、セグメントの中心に数字が来るように調整
    const gradientStartAngle = 270 - segmentAngle / 2;
    let gradient = `conic-gradient(from ${gradientStartAngle}deg, `;
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

    const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.75;
    const targetSegmentCenterAngle =
      resultIndex * segmentAngle + segmentAngle / 2;
    const finalTargetAngle = targetSegmentCenterAngle + randomOffset;

    currentRouletteResultNumber = resultNumber;
    currentRouletteFinalTargetAngle = finalTargetAngle;

    const targetViewAngle = (270 - finalTargetAngle + 360) % 360;
    let rotationNeeded = targetViewAngle - currentAngle;
    if (rotationNeeded < 0) rotationNeeded += 360;
    const fullRotations = 360 * (Math.floor(Math.random() * 4) + 5);
    const rotationAmount = fullRotations + rotationNeeded;
    rotationDegree += rotationAmount;
    rouletteWheel.style.transform = `rotate(${rotationDegree}deg)`;

    startRouletteAudio(segmentAngle);

    startButton.textContent = "スキップ";
    startButton.disabled = false;

    rouletteSpinTimeoutId = setTimeout(() => {
      playSound(sounds.rouletteResult);
      showResultPopup(resultNumber);
      addToHistory(resultNumber);
      setControlsDisabled(false);
      startButton.textContent = "スタート！";
      rouletteSpinTimeoutId = null;
    }, 5100);
  };

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
    startButton.disabled = false;
  };

  const handleCardClick = (e) => {
    const clickedCard = e.currentTarget;
    const resultNumber = parseInt(clickedCard.dataset.number);
    playSound(sounds.cardFlip);
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

    if (currentMode === "card") {
      const availableNumbers = getAvailableNumbers();
      if (availableNumbers && availableNumbers.length > 0) {
        startCardMode(availableNumbers);
      } else {
        cardMessage.textContent = "すべての数字を引き終えました！";
        setControlsDisabled(false);
      }
    }

    if (rouletteSpinTimeoutId) {
      clearTimeout(rouletteSpinTimeoutId);
      rouletteSpinTimeoutId = null;
    }

    stopRouletteAudio();
  });
});
