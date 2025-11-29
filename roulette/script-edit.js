if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        // 登録成功
        console.log('ServiceWorker registered');
      }, (err) => {
        // 登録失敗
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

document.addEventListener("DOMContentLoaded", () => {
        // HTML要素の取得
        const body = document.body;
        const themeToggleButton = document.getElementById("theme-toggle-btn");
        const focusToggleButton = document.getElementById("focus-toggle-btn");
        const minNumInput = document.getElementById("min-number");
        const maxNumInput = document.getElementById("max-number");
        const excludeNumbersInput = document.getElementById("exclude-numbers");
        const noDuplicatesCheckbox = document.getElementById("no-duplicates");
        const startButton = document.getElementById("start-button");
        const resetButton = document.getElementById("reset-button");
        const historyList = document.getElementById("history-list");
        const profileNameDisplay = document.getElementById(
          "profile-name-display"
        );

        // --- 新しく追加した要素 ---
        const useNamesCheckbox = document.getElementById("use-names-checkbox");
        const namesListInput = document.getElementById("names-list");
        const numberSettingsContainer = document.getElementById(
          "number-settings-container"
        );
        const nameSettingsContainer = document.getElementById(
          "name-settings-container"
        );

        // インポート関連の要素
        const importProfileBtn = document.getElementById("import-profile-btn");
        const importFileInput = document.getElementById("import-file-input");

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
        const resultTimerDisplay = document.getElementById(
          "result-timer-display"
        );

        // タイマーモード関連の要素
        const timerMinutesInput = document.getElementById("timer-minutes");
        const timerSecondsInput = document.getElementById("timer-seconds");
        const timerDisplayMode = document.getElementById("timer-display-mode");
        const timerStartBtn = document.getElementById("timer-start-btn");
        const timerPauseBtn = document.getElementById("timer-pause-btn");
        const timerResetBtn = document.getElementById("timer-reset-btn");

        // 設定モーダル関連の要素
        const settingsBtn = document.getElementById("settings-btn");
        const settingsModal = document.getElementById("settings-modal");
        const closeModalBtn = document.getElementById("close-modal-btn");
        const volumeSlider = document.getElementById("volume-slider");

        // プロファイル関連の要素 (New)
        const profilesContainer = document.getElementById("profiles-container");
        const contextMenu = document.getElementById("profile-context-menu");
        const addBtnTrigger = document.getElementById("add-btn-trigger");
        const addDropdown = document.getElementById("add-dropdown");

        // ad
        const adCloseBtn = document.getElementById("close-ad-btn");
        const adBanner = document.getElementById("adbox");

        adCloseBtn.addEventListener("click", () => {
          adBanner.classList.add("hidden");
        });

        // --- 設定画面の表示切り替えロジック ---
        const toggleSettingsDisplay = () => {
          if (useNamesCheckbox.checked) {
            // 名前モードON: 数値設定を隠し、名前入力エリアを表示
            numberSettingsContainer.style.display = "none";
            nameSettingsContainer.style.display = "block";
          } else {
            // 名前モードOFF: 数値設定を表示し、名前入力エリアを隠す
            numberSettingsContainer.style.display = "block";
            nameSettingsContainer.style.display = "none";
          }
        };

        // --- 状態管理 ---
        let items = []; // プロファイルとフォルダの統合リスト
        let activeProfileId = null;
        let contextTargetId = null; // コンテキストメニューの対象ID
        let draggingId = null; // DnD中のアイテムID

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

        // ============================================
        // プロファイル・フォルダ管理ロジック (統合)
        // ============================================

        const saveItems = () => {
          localStorage.setItem("rouletteItems", JSON.stringify(items));
          localStorage.setItem("activeProfileId", activeProfileId);
        };

        const loadItems = () => {
          const savedItems = localStorage.getItem("rouletteItems");
          // 古い形式からの移行用
          const savedOldProfiles = localStorage.getItem("rouletteProfiles");
          const savedActiveId = localStorage.getItem("activeProfileId");

          if (savedItems) {
            try {
              let parsed = JSON.parse(savedItems);
              // データ整合性チェック・補完
              items = parsed.map((item) => {
                if (!item.type) item.type = "profile"; // デフォルト
                if (item.parentId === undefined) item.parentId = null;
                if (item.type === "folder" && item.isCollapsed === undefined)
                  item.isCollapsed = false;
                return item;
              });
            } catch (e) {
              console.error("Data Load Error", e);
              items = [];
            }
          } else if (savedOldProfiles) {
            // 古いデータ形式(単なるプロファイル配列)からの移行
            try {
              const oldProfiles = JSON.parse(savedOldProfiles);
              items = oldProfiles.map((p) => ({
                ...p,
                type: "profile",
                parentId: null,
              }));
              localStorage.removeItem("rouletteProfiles"); // 移行後は削除
            } catch (e) {
              items = [];
            }
          }

          // データが無い場合のデフォルト
          if (items.length === 0) {
            items = [
              {
                id: Date.now(),
                type: "profile",
                name: "デフォルト",
                min: 1,
                max: 35,
                exclude: "",
                useNames: false,
                names: "",
                parentId: null,
              },
            ];
          }

          if (savedActiveId) {
            activeProfileId = parseInt(savedActiveId);
            // 存在確認
            if (
              !items.find(
                (i) => i.id === activeProfileId && i.type === "profile"
              )
            ) {
              const firstProfile = items.find((i) => i.type === "profile");
              activeProfileId = firstProfile ? firstProfile.id : null;
            }
          } else {
            const firstProfile = items.find((i) => i.type === "profile");
            activeProfileId = firstProfile ? firstProfile.id : null;
          }

          applyActiveProfileToInputs();
          renderTree();
        };

        const applyActiveProfileToInputs = () => {
          const profile = items.find((p) => p.id === activeProfileId);
          if (profile) {
            minNumInput.value = profile.min;
            maxNumInput.value = profile.max;
            excludeNumbersInput.value = profile.exclude || "";
            useNamesCheckbox.checked = profile.useNames === true;
            namesListInput.value = profile.names || "";
            profileNameDisplay.textContent = profile.name;
          }
          toggleSettingsDisplay();
        };

        const updateActiveProfileData = () => {
          const profile = items.find((p) => p.id === activeProfileId);
          if (profile) {
            profile.min = parseInt(minNumInput.value);
            profile.max = parseInt(maxNumInput.value);
            profile.exclude = excludeNumbersInput.value;
            profile.useNames = useNamesCheckbox.checked;
            profile.names = namesListInput.value;
            saveItems();
          }
          toggleSettingsDisplay();
        };

        // イベントリスナー (入力変更時即保存)
        minNumInput.addEventListener("change", updateActiveProfileData);
        maxNumInput.addEventListener("change", updateActiveProfileData);
        excludeNumbersInput.addEventListener("change", updateActiveProfileData);
        useNamesCheckbox.addEventListener("change", updateActiveProfileData);
        namesListInput.addEventListener("input", updateActiveProfileData);

        // --- ツリー描画ロジック ---

        // 親IDに基づいてアイテムをフィルタリング
        const getChildren = (parentId) => {
          return items.filter((item) => item.parentId === parentId);
        };

        // アイテム作成（再帰的）
        const createTreeItemElement = (item) => {
          const el = document.createElement("div");
          el.className = "tree-item";
          el.draggable = true;
          el.dataset.id = item.id;
          el.dataset.type = item.type;

          // Drag & Drop Events
          el.addEventListener("dragstart", handleDragStart);
          el.addEventListener("dragover", handleDragOver);
          el.addEventListener("dragleave", handleDragLeave);
          el.addEventListener("drop", handleDrop);
          el.addEventListener("dragend", handleDragEnd);

          if (item.type === "folder") {
            el.classList.add("folder-item");

            const arrowIcon = item.isCollapsed
              ? `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M400-280v-400l200 200-200 200Z"/></svg>`
              : `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-360 280-560h400L480-360Z"/></svg>`;

            // ヘッダー
            const header = document.createElement("div");
            header.className = "folder-header";
            header.innerHTML = `
              <span class="folder-arrow">${arrowIcon}</span>
              <svg class="icon-folder" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/></svg>
              <span class="folder-name">${item.name}</span>
            `;

            // アクションボタン
            const actions = document.createElement("div");
            actions.className = "item-actions";
            // MOREアイコン
            actions.innerHTML = `<button class="action-btn menu-btn" title="メニュー" aria-label="その他"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg></button>`;
            header.appendChild(actions);

            // コンテキストメニュー用イベント
            header.addEventListener("contextmenu", (e) =>
              showContextMenu(e, item.id)
            );
            actions
              .querySelector(".menu-btn")
              .addEventListener("click", (e) => {
                e.stopPropagation();
                const rect = e.target.getBoundingClientRect();
                showContextMenu(
                  {
                    clientX: rect.left,
                    clientY: rect.bottom,
                    preventDefault: () => {},
                  },
                  item.id
                );
              });

            // フォルダ開閉クリック
            header.addEventListener("click", (e) => {
              if (e.target.closest(".action-btn")) return;
              item.isCollapsed = !item.isCollapsed;
              saveItems();
              renderTree();
            });

            el.appendChild(header);

            // コンテンツエリア（子要素）
            const content = document.createElement("div");
            content.className = `folder-content ${
              item.isCollapsed ? "collapsed" : ""
            }`;
            content.dataset.folderId = item.id; // ドロップ判定用

            const children = getChildren(item.id);
            children.forEach((child) => {
              content.appendChild(createTreeItemElement(child));
            });
            el.appendChild(content);
          } else {
            // プロファイル
            el.classList.add("profile-item");
            if (item.id === activeProfileId) el.classList.add("active");

            el.innerHTML = `
              <svg class="icon-profile" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg>
              <span class="profile-name" style="flex-grow:1">${item.name}</span>
              <div class="item-actions">
                <button class="action-btn menu-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg></button>
              </div>
            `;

            el.addEventListener("click", () => switchProfile(item.id));
            el.addEventListener("contextmenu", (e) =>
              showContextMenu(e, item.id)
            );
            el.querySelector(".menu-btn").addEventListener("click", (e) => {
              e.stopPropagation();
              const rect = e.target.getBoundingClientRect();
              showContextMenu(
                {
                  clientX: rect.left,
                  clientY: rect.bottom,
                  preventDefault: () => {},
                },
                item.id
              );
            });
          }

          return el;
        };

        const renderTree = () => {
          profilesContainer.innerHTML = "";
          // ルート要素（parentId が null）を取得
          const roots = getChildren(null);
          roots.forEach((item) => {
            profilesContainer.appendChild(createTreeItemElement(item));
          });
        };

        // --- Drag & Drop Handlers ---

        function handleDragStart(e) {
          e.stopPropagation(); // 親要素のドラッグ発火を防ぐ
          draggingId = parseInt(this.dataset.id);
          this.classList.add("dragging");
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", draggingId);
        }

        function handleDragOver(e) {
          e.preventDefault(); // ドロップを許可
          e.stopPropagation();
          e.dataTransfer.dropEffect = "move";

          const targetEl = e.currentTarget; // イベントハンドラが設定されている要素（tree-item）
          const targetId = parseInt(targetEl.dataset.id);
          const targetType = targetEl.dataset.type;

          // 自分自身へのドロップは無視
          if (draggingId === targetId) return;

          const rect = targetEl.getBoundingClientRect();
          const relY = e.clientY - rect.top;
          const height = rect.height;

          // 初期化
          targetEl.classList.remove(
            "drag-over-top",
            "drag-over-bottom",
            "drag-over-folder"
          );

          // フォルダへの格納判定 (フォルダの上部・下部以外の中央付近、かつフォルダが開いているかターゲット自体)
          if (targetType === "folder") {
            // フォルダのヘッダー部分に乗っているか、中身か
            if (relY < 10) {
              targetEl.classList.add("drag-over-top"); // 並べ替え（上）
            } else if (
              relY > height - 10 &&
              targetEl.classList.contains("folder-item") &&
              targetEl
                .querySelector(".folder-content")
                .classList.contains("collapsed")
            ) {
              // 折りたたまれているフォルダの下側
              targetEl.classList.add("drag-over-bottom");
            } else {
              // フォルダの中に入れる
              targetEl.classList.add("drag-over-folder");
            }
          } else {
            // プロファイルの場合は上下のみ
            if (relY < height / 2) {
              targetEl.classList.add("drag-over-top");
            } else {
              targetEl.classList.add("drag-over-bottom");
            }
          }
        }

        function handleDragLeave(e) {
          e.currentTarget.classList.remove(
            "drag-over-top",
            "drag-over-bottom",
            "drag-over-folder"
          );
        }

        function handleDrop(e) {
          e.preventDefault();
          e.stopPropagation();
          const targetEl = e.currentTarget;
          targetEl.classList.remove(
            "drag-over-top",
            "drag-over-bottom",
            "drag-over-folder"
          );

          const targetId = parseInt(targetEl.dataset.id);
          if (draggingId === targetId) return;

          const draggingItem = items.find((i) => i.id === draggingId);
          const targetItem = items.find((i) => i.id === targetId);
          if (!draggingItem || !targetItem) return;

          const rect = targetEl.getBoundingClientRect();
          const relY = e.clientY - rect.top;

          let newParentId = targetItem.parentId;

          // 現在の配列からドラッグ項目を一時削除（後で挿入）
          const currentIndex = items.findIndex((i) => i.id === draggingId);
          items.splice(currentIndex, 1);

          // ターゲットの位置を再計算
          let targetIndex = items.findIndex((i) => i.id === targetId);

          if (
            targetItem.type === "folder" &&
            relY >= 10 &&
            !(relY > rect.height - 10 && items[targetIndex].isCollapsed)
          ) {
            // フォルダの中に入れる
            draggingItem.parentId = targetItem.id;
            targetItem.isCollapsed = false;
            // フォルダの直後に挿入 (配列上)
            items.splice(targetIndex + 1, 0, draggingItem);
          } else {
            // 並べ替え（同じ階層）
            draggingItem.parentId = targetItem.parentId;

            if (relY < rect.height / 2) {
              // 上に挿入
              items.splice(targetIndex, 0, draggingItem);
            } else {
              // 下に挿入
              items.splice(targetIndex + 1, 0, draggingItem);
            }
          }

          saveItems();
          renderTree();
        }

        function handleDragEnd(e) {
          this.classList.remove("dragging");
          document.querySelectorAll(".tree-item").forEach((el) => {
            el.classList.remove(
              "drag-over-top",
              "drag-over-bottom",
              "drag-over-folder"
            );
          });
          draggingId = null;
        }

        // ルートエリアへのドロップ（フォルダから出す）
        profilesContainer.addEventListener("dragover", (e) => {
          e.preventDefault();
        });
        profilesContainer.addEventListener("drop", (e) => {
          // コンテナ自体にドロップされた場合（アイテム上ではない）
          if (e.target === profilesContainer && draggingId) {
            e.preventDefault();
            const itemIndex = items.findIndex((i) => i.id === draggingId);
            if (itemIndex > -1) {
              const item = items[itemIndex];
              item.parentId = null; // ルートへ
              items.splice(itemIndex, 1);
              items.push(item); // 末尾へ
              saveItems();
              renderTree();
            }
          }
        });

        // --- 追加メニュー ---
        addBtnTrigger.addEventListener("click", (e) => {
          e.stopPropagation();
          addDropdown.classList.toggle("visible");
        });
        window.addEventListener("click", () => {
          addDropdown.classList.remove("visible");
          if (contextMenu.classList.contains("visible")) {
            contextMenu.classList.remove("visible");
            contextTargetId = null;
          }
        });

        addDropdown.addEventListener("click", (e) => {
          const action = e.target.closest(".add-option")?.dataset.action;
          if (action === "add-profile") {
            addNewItem("profile");
          } else if (action === "add-folder") {
            addNewItem("folder");
          }
        });

        const addNewItem = (type) => {
          const name = prompt(
            type === "profile" ? "プロファイル名:" : "フォルダ名:",
            type === "profile" ? "新規プロファイル" : "新規フォルダ"
          );
          if (!name || name.trim() === "") return;

          const newItem = {
            id: Date.now(),
            type: type,
            name: name.trim(),
            parentId: null, // ルートに追加
          };

          if (type === "profile") {
            newItem.min = 1;
            newItem.max = 35;
            newItem.exclude = "";
            newItem.useNames = false;
            newItem.names = "";
          } else {
            newItem.isCollapsed = false;
          }

          items.push(newItem);
          if (type === "profile") {
            activeProfileId = newItem.id;
            applyActiveProfileToInputs();
          }
          saveItems();
          renderTree();
        };

        const switchProfile = (id) => {
          activeProfileId = id;
          applyActiveProfileToInputs();
          saveItems();
          renderTree(); // ハイライト更新
          resetButton.click(); // プロファイル切り替え時にリセット
        };

        // --- コンテキストメニュー処理 ---
        const showContextMenu = (e, id) => {
          e.preventDefault();
          contextTargetId = id;
          const item = items.find((i) => i.id === id);
          if (!item) return;

          // メニュー項目の表示制御
          const loadBtn = contextMenu.querySelector('[data-action="load"]');
          const saveBtn = contextMenu.querySelector('[data-action="save"]');
          const exportBtn = contextMenu.querySelector('[data-action="export"]');

          if (item.type === "folder") {
            loadBtn.style.display = "none";
            saveBtn.style.display = "none";
            exportBtn.style.display = "none"; // フォルダのエクスポートは未実装
          } else {
            loadBtn.style.display = "flex";
            saveBtn.style.display = "flex";
            exportBtn.style.display = "flex";
          }

          contextMenu.style.top = `${e.clientY}px`;
          contextMenu.style.left = `${e.clientX}px`;
          contextMenu.classList.add("visible");
        };

        contextMenu.addEventListener("click", (e) => {
          const action = e.target.closest(".context-menu-item")?.dataset.action;
          if (!action || !contextTargetId) return;

          const item = items.find((i) => i.id === contextTargetId);
          if (!item) return;

          if (action === "load") {
            switchProfile(item.id);
          } else if (action === "save") {
            updateActiveProfileData(); // 現在の入力を保存
            item.min = parseInt(minNumInput.value);
            item.max = parseInt(maxNumInput.value);
            item.exclude = excludeNumbersInput.value;
            item.useNames = useNamesCheckbox.checked;
            item.names = namesListInput.value;
            saveItems();
            alert(`${item.name} に現在の設定を保存しました。`);
          } else if (action === "rename") {
            const newName = prompt("新しい名前:", item.name);
            if (newName && newName.trim() !== "") {
              item.name = newName.trim();
              if (item.id === activeProfileId)
                profileNameDisplay.textContent = item.name;
              saveItems();
              renderTree();
            }
          } else if (action === "export") {
            const exportData = JSON.stringify(item, null, 2);
            const blob = new Blob([exportData], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${item.name}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          } else if (action === "delete") {
            if (
              confirm(
                `本当に「${item.name}」を削除しますか？\n(フォルダの場合、中身も削除されます)`
              )
            ) {
              // 再帰的に削除対象IDを収集
              const idsToDelete = [item.id];
              if (item.type === "folder") {
                const collectChildren = (pid) => {
                  const children = items.filter((i) => i.parentId === pid);
                  children.forEach((c) => {
                    idsToDelete.push(c.id);
                    if (c.type === "folder") collectChildren(c.id);
                  });
                };
                collectChildren(item.id);
              }

              items = items.filter((i) => !idsToDelete.includes(i.id));

              // アクティブなものが消えた場合
              if (idsToDelete.includes(activeProfileId)) {
                const next = items.find((i) => i.type === "profile");
                activeProfileId = next ? next.id : null;
                if (activeProfileId) switchProfile(activeProfileId);
                else {
                  // 全部消えたらデフォルト作成
                  loadItems();
                }
              }
              saveItems();
              renderTree();
            }
          }
        });

        // インポート処理
        importProfileBtn.addEventListener("click", () =>
          importFileInput.click()
        );
        importFileInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            try {
              const data = JSON.parse(ev.target.result);
              if (!data.name) throw new Error("Invalid format");

              // ID衝突回避
              data.id = Date.now();
              data.parentId = null; // ルートにインポート
              // 名前重複回避
              let baseName = data.name;
              let c = 1;
              while (items.some((i) => i.name === data.name)) {
                data.name = `${baseName} (${c++})`;
              }

              items.push(data);
              saveItems();
              renderTree();

              if (data.type === "profile") {
                switchProfile(data.id);
              }
              alert(`インポートしました: ${data.name}`);
            } catch (err) {
              console.error(err);
              alert("読み込みに失敗しました。");
            }
            importFileInput.value = "";
          };
          reader.readAsText(file);
        });

        // 初期化
        loadItems();

        // ============================================
        // ゲームロジック (既存維持・バグ修正)
        // ============================================

        const playSound = (sound) => {
          const audio = sound.cloneNode();
          audio.volume = sound.volume;
          audio
            .play()
            .catch((e) => console.error("音声の再生に失敗しました:", e));
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
        let timerModeInterval = null;
        let timerModeTimeLeft = 0;
        let timerModeIsRunning = false;

        // ルーレット音声用の状態管理
        let rouletteAudioContext = {
          loopId: null,
          lastAngle: 0,
          angleSinceLastTick: 0,
          segmentAngle: 0,
          lastTickTimestamp: 0,
          minTimeBetweenTicks: 100,
        };

        // --- テーマ切り替え処理 (復活) ---
        const themes = [
          { name: "Blue", color: "#1a73e8" },
          { name: "Pink", color: "#ff007b" },
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

        // --- フォーカスモード切り替え (復活) ---
        focusToggleButton.addEventListener("click", () => {
          body.classList.toggle("focus-mode-on");
          body.classList.toggle("focus-mode-off");
        });

        // --- 共通関数 ---
        const getAvailableNumbers = () => {
          // 名前モードが有効なら名前リストを返す
          if (useNamesCheckbox.checked) {
            const raw = namesListInput.value || "";
            // カンマまたは改行で分割してトリム、空白を除去
            const names = raw
              .split(/,|\n/)
              .map((s) => s.trim())
              .filter((s) => s !== "");
            // 一意化
            const uniqueNames = Array.from(new Set(names));
            // 重複なしが有効でかつ既に引かれているものは除外
            const available = uniqueNames.filter((name) => {
              if (noDuplicatesCheckbox.checked && drawnNumbers.includes(name)) {
                return false;
              }
              return true;
            });
            if (available.length === 0) {
              return [];
            }
            return available;
          }

          // 数値モード
          const min = parseInt(minNumInput.value);
          const max = parseInt(maxNumInput.value);
          if (isNaN(min) || isNaN(max) || min >= max) {
            alert("有効な範囲を正しく入力してください（最小値 < 最大値）。");
            return null;
          }

          const excludeString = excludeNumbersInput.value;
          const excludedNumbers = excludeString
            .split(",")
            .map((n) => parseInt(n.trim()))
            .filter((n) => !isNaN(n));

          const available = [];
          for (let i = min; i <= max; i++) {
            if (
              (!noDuplicatesCheckbox.checked || !drawnNumbers.includes(i)) &&
              !excludedNumbers.includes(i) // 除外リストチェック
            ) {
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

        const showResultPopup = (number, duration = 1.5) => {
          resultPopup.textContent = number;
          resultOverlay.classList.remove("hidden");
          setTimeout(() => {
            resultOverlay.classList.add("hidden");
          }, duration * 1000);
        };

        const setControlsDisabled = (disabled) => {
          isSpinning = disabled;
          minNumInput.disabled = disabled;
          maxNumInput.disabled = disabled;
          excludeNumbersInput.disabled = disabled;
          noDuplicatesCheckbox.disabled = disabled;
          startButton.disabled = disabled;
          useNamesCheckbox.disabled = disabled;
          namesListInput.disabled = disabled;
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

          const gameButtons = document.querySelector(".buttons");
          if (mode === "timer") {
            gameButtons.style.display = "none";
            timerMinutesInput.value = 0;
            timerSecondsInput.value = 0;
            timerModeTimeLeft = 0;
            updateTimerDisplay();
            timerPauseBtn.disabled = true;
            timerResetBtn.disabled = true;
            timerMinutesInput.disabled = false;
            timerSecondsInput.disabled = false;
            timerStartBtn.textContent = "スタート";
            clearInterval(timerModeInterval);
            timerModeIsRunning = false;
          } else {
            gameButtons.style.display = "flex";
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
          document
            .getElementById(`${currentMode}-mode-area`)
            .classList.add("active");
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

        // モード選択のスワイプ/ドラッグロジック
        let isDraggingMode = false,
          startX,
          currentDragMode;
        const handleModeDragStart = (e) => {
          isDraggingMode = true;
          startX = e.pageX || e.touches[0].pageX;
          currentDragMode = currentMode;
          modeSelector.style.cursor = "grabbing";
        };
        const handleModeDragMove = (e) => {
          if (!isDraggingMode) return;
          // e.preventDefault(); // ツリーのDnDと競合する可能性があるので一旦コメントアウト
          const x = e.pageX || e.touches[0].pageX;
          const walk = x - startX;
          const buttonWidth = modeButtons[0].offsetWidth;
          const modeOrder = Array.from(modeButtons).map(
            (btn) => btn.dataset.mode
          );
          const currentIndex = modeOrder.indexOf(currentDragMode);
          if (walk > buttonWidth / 2 && currentIndex < modeOrder.length - 1) {
            setActiveMode(modeOrder[currentIndex + 1]);
            isDraggingMode = false;
          } else if (walk < -buttonWidth / 2 && currentIndex > 0) {
            setActiveMode(modeOrder[currentIndex - 1]);
            isDraggingMode = false;
          }
        };
        const handleModeDragEnd = () => {
          isDraggingMode = false;
          modeSelector.style.cursor = "grab";
        };
        modeSelector.addEventListener("mousedown", handleModeDragStart);
        modeSelector.addEventListener("touchstart", handleModeDragStart);
        modeSelector.addEventListener("mousemove", handleModeDragMove);
        modeSelector.addEventListener("touchmove", handleModeDragMove);
        modeSelector.addEventListener("mouseup", handleModeDragEnd);
        modeSelector.addEventListener("touchend", handleModeDragEnd);
        modeSelector.addEventListener("mouseleave", handleModeDragEnd);

        window.addEventListener("load", () => {
          setTimeout(() => {
            const activeButton = document.querySelector(".mode-btn.active");
            if (activeButton) {
              modeHighlight.style.width = `${activeButton.offsetWidth}px`;
              modeHighlight.style.transform = `translateX(${activeButton.offsetLeft}px)`;
            }
          }, 50);
        });

        // ルーレット音声のループ処理
        const rouletteAudioTick = () => {
          if (!isSpinning) {
            stopRouletteAudio();
            return;
          }

          const transform = window.getComputedStyle(rouletteWheel).transform;
          if (transform !== "none") {
            const matrix = new DOMMatrix(transform);
            const currentAngle =
              Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);

            let delta = currentAngle - rouletteAudioContext.lastAngle;
            if (delta < -270) {
              delta += 360;
            } else if (delta > 270) {
              delta -= 360;
            }

            rouletteAudioContext.angleSinceLastTick += Math.abs(delta);
            rouletteAudioContext.lastAngle = currentAngle;

            while (
              rouletteAudioContext.angleSinceLastTick >=
              rouletteAudioContext.segmentAngle
            ) {
              rouletteAudioContext.angleSinceLastTick -=
                rouletteAudioContext.segmentAngle;

              const now = Date.now();
              if (
                now - rouletteAudioContext.lastTickTimestamp >
                rouletteAudioContext.minTimeBetweenTicks
              ) {
                playSound(sounds.rouletteTick);
                rouletteAudioContext.lastTickTimestamp = now;
              }
            }
          }

          rouletteAudioContext.loopId =
            requestAnimationFrame(rouletteAudioTick);
        };

        const startRouletteAudio = (segmentAngle) => {
          stopRouletteAudio();

          const initialTransform =
            window.getComputedStyle(rouletteWheel).transform;
          const initialMatrix = new DOMMatrix(initialTransform);
          rouletteAudioContext = {
            ...rouletteAudioContext,
            loopId: null,
            lastAngle:
              Math.atan2(initialMatrix.b, initialMatrix.a) * (180 / Math.PI),
            angleSinceLastTick: 0,
            segmentAngle: segmentAngle,
            lastTickTimestamp: 0,
          };

          rouletteAudioContext.loopId =
            requestAnimationFrame(rouletteAudioTick);
        };

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

            showResultPopup(currentRouletteResultNumber, 3);
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
          body.classList.add("focus-mode-on");
          body.classList.remove("focus-mode-off");

          switch (currentMode) {
            case "simple":
              startSimpleMode(availableNumbers);
              break;
            case "roulette":
              startRouletteMode(availableNumbers);
              break;
            case "card":
              startCardMode(availableNumbers);
              break;
          }
        });

        // --- 各モードの実行関数 ---
        const startSimpleMode = (numbers) => {
          resultDisplay.classList.remove("zoom");
          void resultDisplay.offsetWidth;

          const spinInterval = setInterval(() => {
            resultDisplay.textContent =
              numbers[Math.floor(Math.random() * numbers.length)];
            playSound(sounds.simpleTick);
          }, 50);

          setTimeout(() => {
            clearInterval(spinInterval);
            const resultNumber =
              numbers[Math.floor(Math.random() * numbers.length)];
            resultDisplay.textContent = resultNumber;
            resultDisplay.classList.add("zoom");
            playSound(sounds.simpleResult);
            addToHistory(resultNumber);
            setControlsDisabled(false);
          }, 2000);
        };

        const startRouletteMode = (numbers) => {
          const totalNumbersOnWheel = numbers.length;
          const segmentAngle = 360 / totalNumbersOnWheel;

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
          const gradientStartAngle = 270 - segmentAngle / 2;
          let gradient = `conic-gradient(from ${gradientStartAngle}deg, `;
          rouletteWheel.innerHTML = "";

          for (let i = 0; i < totalNumbersOnWheel; i++) {
            const label = numbers[i];
            gradient += `${colors[i % colors.length]} ${i * segmentAngle}deg ${
              (i + 1) * segmentAngle
            }deg`;
            if (i < totalNumbersOnWheel - 1) gradient += ", ";

            const numberDiv = document.createElement("div");
            numberDiv.className = "number";
            numberDiv.style.transform = `rotate(${
              i * segmentAngle + segmentAngle / 2
            }deg)`;

            if (noDuplicatesCheckbox.checked && drawnNumbers.includes(label)) {
              numberDiv.classList.add("drawn");
            }

            const span = document.createElement("span");
            span.textContent = label;

            // ★★★ 文字数に応じてフォントサイズを調整 ★★★
            const length = String(label).length;
            if (length > 10) {
              span.style.fontSize = "0.5rem";
            } else if (length > 7) {
              span.style.fontSize = "0.7rem";
            } else if (length > 5) {
              span.style.fontSize = "0.85rem";
            } else {
              span.style.fontSize = "1.1rem"; // デフォルト（短い文字用）
            }
            // 長い名前が改行されないようにする
            span.style.whiteSpace = "nowrap";

            numberDiv.appendChild(span);
            rouletteWheel.appendChild(numberDiv);
          }
          gradient += ")";
          rouletteWheel.style.background = gradient;

          const currentAngle = ((rotationDegree % 360) + 360) % 360;
          const resultNumber =
            numbers[Math.floor(Math.random() * numbers.length)];
          const resultIndexOnWheel = numbers.indexOf(resultNumber);

          const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.75;
          const targetSegmentCenterAngle =
            resultIndexOnWheel * segmentAngle + segmentAngle / 2;
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
          const resultValue = isNaN(resultNumber)
            ? clickedCard.dataset.number
            : resultNumber;
          addToHistory(resultValue);
          const idx = availableCards.indexOf(resultValue);
          if (idx !== -1) availableCards.splice(idx, 1);
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
          body.classList.remove("focus-mode-on");
        });

        // タイマーモードのロジック
        const updateTimerDisplay = () => {
          const minutes = Math.floor(timerModeTimeLeft / 60);
          const seconds = timerModeTimeLeft % 60;
          timerDisplayMode.textContent = `${String(minutes).padStart(
            2,
            "0"
          )}:${String(seconds).padStart(2, "0")}`;
        };

        const startTimerMode = () => {
          if (timerModeIsRunning) return;
          if (timerModeTimeLeft <= 0) {
            timerModeTimeLeft =
              parseInt(timerMinutesInput.value || "0") * 60 +
              parseInt(timerSecondsInput.value || "0");
            if (timerModeTimeLeft <= 0) return;
          }
          timerModeIsRunning = true;
          timerStartBtn.textContent = "再開";
          timerPauseBtn.disabled = false;
          timerResetBtn.disabled = false;
          timerMinutesInput.disabled = true;
          timerSecondsInput.disabled = true;

          timerModeInterval = setInterval(() => {
            if (timerModeTimeLeft <= 0) {
              clearInterval(timerModeInterval);
              timerModeIsRunning = false;
              timerStartBtn.textContent = "スタート";
              timerPauseBtn.disabled = true;
              alert("時間になりました！");
            } else {
              timerModeTimeLeft--;
              updateTimerDisplay();
            }
          }, 1000);
        };

        const pauseTimerMode = () => {
          clearInterval(timerModeInterval);
          timerModeIsRunning = false;
          timerStartBtn.textContent = "再開";
        };

        const resetTimerMode = () => {
          clearInterval(timerModeInterval);
          timerModeIsRunning = false;
          timerModeTimeLeft =
            parseInt(timerMinutesInput.value || "0") * 60 +
            parseInt(timerSecondsInput.value || "0");
          updateTimerDisplay();
          timerStartBtn.textContent = "スタート";
          timerPauseBtn.disabled = true;
          timerResetBtn.disabled = true;
          timerMinutesInput.disabled = false;
          timerSecondsInput.disabled = false;
        };

        const updateTimerFromInput = () => {
          if (!timerModeIsRunning) {
            timerModeTimeLeft =
              parseInt(timerMinutesInput.value || "0") * 60 +
              parseInt(timerSecondsInput.value || "0");
            updateTimerDisplay();
          }
        };
        timerMinutesInput.addEventListener("input", updateTimerFromInput);
        timerSecondsInput.addEventListener("input", updateTimerFromInput);
        timerStartBtn.addEventListener("click", startTimerMode);
        timerPauseBtn.addEventListener("click", pauseTimerMode);
        timerResetBtn.addEventListener("click", resetTimerMode);

        updateTimerFromInput();
      });

      let lastTouchEnd = 0;
      document.addEventListener(
        "touchend",
        function (event) {
          const now = new Date().getTime();
          if (now - lastTouchEnd <= 300) {
            event.preventDefault();
          }
          lastTouchEnd = now;
        },
        false
      );