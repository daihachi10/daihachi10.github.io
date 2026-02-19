$(document).ready(function () {
  const searchInput = $("#search-input");
  const searchButton = $("#search-button");
  const resultsList = $("#results-list");
  const noResultsMessage = $("#no-results");
  const resultsContainer = $("#results-container");
  const suggestionsList = $("#search-input-suggestions");

  // ========== あいまい検索ユーティリティ ==========

  /**
   * 2つの文字列間の類似度を計算 (0〜1)
   * レーベンシュタイン距離ベース
   */
  function similarity(s1, s2) {
    if (s1 === s2) return 1;
    if (!s1 || !s2) return 0;

    const len1 = s1.length;
    const len2 = s2.length;
    const maxLen = Math.max(len1, len2);
    if (maxLen === 0) return 1;

    // 短い文字列の場合は部分一致を優先
    if (len1 <= 2 || len2 <= 2) {
      if (s2.includes(s1) || s1.includes(s2)) return 0.8;
      return 0;
    }

    // レーベンシュタイン距離
    const matrix = [];
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost,
        );
      }
    }
    const distance = matrix[len1][len2];
    return 1 - distance / maxLen;
  }

  /**
   * クエリがテキスト内の単語にあいまい一致するかスコアを計算
   */
  function fuzzyScore(query, text) {
    if (!text || !query) return 0;

    const q = query.toLowerCase();
    const t = text.toLowerCase();

    // 完全一致
    if (t === q) return 100;

    // タイトルとして完全一致（先頭）
    if (t.startsWith(q)) return 90;

    // 部分一致（含まれている）
    if (t.includes(q)) {
      // 一致率に基づくスコア
      return 60 + (q.length / t.length) * 30;
    }

    // 単語レベルでの一致チェック
    const words = t.split(/[\s\u3000、。・,.\-_|/\\()（）]/);
    let bestWordScore = 0;
    for (const word of words) {
      if (!word) continue;
      // 単語の先頭一致
      if (word.startsWith(q)) {
        bestWordScore = Math.max(bestWordScore, 70);
        continue;
      }
      // 単語に含まれる
      if (word.includes(q)) {
        bestWordScore = Math.max(bestWordScore, 50);
        continue;
      }
      // あいまい一致（レーベンシュタイン距離）
      const sim = similarity(q, word);
      if (sim > 0.6) {
        bestWordScore = Math.max(bestWordScore, sim * 40);
      }
    }

    if (bestWordScore > 0) return bestWordScore;

    // テキスト全体とのあいまい一致
    const overallSim = similarity(q, t.substring(0, q.length + 5));
    if (overallSim > 0.5) return overallSim * 30;

    return 0;
  }

  /**
   * 各エントリのスコアを計算
   */
  function calculateScore(query, item) {
    const q = query.toLowerCase();

    // 各フィールドにスコアを計算（重み付き）
    const titleScore = fuzzyScore(q, item.title) * 3.0;
    const descScore = fuzzyScore(q, item.description) * 1.5;
    const urlScore = fuzzyScore(q, item.url) * 1.0;
    const searchTextScore = fuzzyScore(q, item.searchText) * 0.5;

    // タグフィールドのスコア（タグ一致は高い重み）
    let tagsScore = 0;
    if (item.tags && item.tags.length > 0) {
      for (const tag of item.tags) {
        tagsScore = Math.max(tagsScore, fuzzyScore(q, tag) * 2.5);
      }
    }

    return Math.max(
      titleScore,
      descScore,
      urlScore,
      searchTextScore,
      tagsScore,
    );
  }

  // ========== 検索実行 ==========

  function performSearch(query) {
    resultsList.empty();

    if (query.trim() === "") {
      noResultsMessage.hide();
      resultsContainer.show();
      suggestionsList.hide();
      return;
    }

    // 各エントリのスコアを計算
    const scoredResults = [];
    $.each(data, function (index, item) {
      const score = calculateScore(query, item);
      if (score > 10) {
        // 最低閾値
        scoredResults.push({ item, score });
      }
    });

    // スコア順にソート
    scoredResults.sort((a, b) => b.score - a.score);

    if (scoredResults.length > 0) {
      for (const result of scoredResults) {
        const item = result.item;
        const listItem = $("<li>");
        listItem.html(`
          <a class="link" href="${item.url}">
          <img class="author-icon" src="../assets/img/icon-192x192.png">
          <span class="user">daihachi</span>
          <br>
          <span class="url">${item.url}</span>
          <br>
          <img class="image" src="${item.img}">
          <span class="title">${item.title}</span></a>
          <p class= "description">${item.description}</p>
          `);
        resultsList.append(listItem);
      }
      noResultsMessage.hide();
      resultsContainer.show();
      suggestionsList.hide();
    } else {
      noResultsMessage.show();
      resultsContainer.hide();
      suggestionsList.hide();
    }
  }

  // ========== サジェスション ==========

  function updateSuggestions(query) {
    suggestionsList.empty();

    if (query.trim() === "") {
      suggestionsList.hide();
      return;
    }

    // スコア付きサジェスション
    const scoredSuggestions = [];
    $.each(data, function (index, item) {
      const score = calculateScore(query, item);
      if (score > 15) {
        scoredSuggestions.push({ item, score });
      }
    });

    // スコア順にソート＆上位8件
    scoredSuggestions.sort((a, b) => b.score - a.score);
    const topSuggestions = scoredSuggestions.slice(0, 8);

    if (topSuggestions.length > 0) {
      let maxLength = 0;
      for (const suggestion of topSuggestions) {
        const suggestionItem = $("<li>");
        suggestionItem.text(suggestion.item.title);
        suggestionItem.on("click", function () {
          searchInput.val(suggestion.item.title);
          performSearch(suggestion.item.title.toLowerCase());
          suggestionsList.hide();
        });
        suggestionsList.append(suggestionItem);
        maxLength = Math.max(maxLength, suggestion.item.title.length);
      }
      suggestionsList.show();
      suggestionsList.css("width", Math.min(maxLength * 10 + 30, 500));
    } else {
      suggestionsList.hide();
    }
  }

  // ========== イベントハンドラ ==========

  searchInput.on("input", function () {
    const query = $(this).val().toLowerCase();
    updateSuggestions(query);
  });

  searchButton.on("click", function () {
    const query = searchInput.val().toLowerCase();
    performSearch(query);
  });

  searchInput.on("keydown", function (event) {
    if (event.key === "Enter") {
      const query = searchInput.val().toLowerCase();
      performSearch(query);
      window.location.href = `./result.html?query=${query}`;
    }
  });

  // URLクエリパラメータから検索キーワードを取得
  const urlParams = new URLSearchParams(window.location.search);
  const queryParam = urlParams.get("query");
  if (queryParam) {
    searchInput.val(queryParam);
    performSearch(queryParam.toLowerCase());
  }
});

$(document).ready(function () {
  // URLパラメータから 'query' の値を取得
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("query");

  if (query) {
    // Wikipedia API の URL を構築
    const apiUrl = `https://ja.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${encodeURIComponent(
      query,
    )}&exintro=true&origin=*`;

    // Wikipedia API にリクエストを送信
    $.ajax({
      url: apiUrl,
      dataType: "json",
      success: function (data) {
        const pages = data.query.pages;
        for (const pageId in pages) {
          const extract = pages[pageId].extract;
          if (extract) {
            // 取得した情報を特定の ID を持つ <p> タグに出力
            $("#wiki-info").html(extract + "wikipedia");
            $(".wiki-box").addClass("show");
          } else {
            $(".wiki-box").addClass("hidden");
          }
          return; // 最初のページの結果のみを表示
        }
      },
      error: function () {
        $("#wiki-info").text("情報の取得に失敗しました。");
      },
    });
  } else {
    $("#wiki-info").text("URLにクエリパラメータがありません。");
  }
});
