$(document).ready(function () {
  const searchInput = $("#search-input");
  const searchButton = $("#search-button");
  const resultsList = $("#results-list");
  const noResultsMessage = $("#no-results");
  const resultsContainer = $("#results-container");
  const suggestionsList = $("#search-input-suggestions");

  function performSearch(query) {
    resultsList.empty();
    let resultsFound = false;

    if (query.trim() === "") {
      noResultsMessage.hide();
      resultsContainer.show();
      suggestionsList.hide();
      return;
    }

    $.each(data, function (index, item) {
      if (
        item.title.toLowerCase().includes(query) ||
        item.url.toLowerCase().includes(query)
      ) {
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
        // listItem.on("click", function () {
        //   // リストアイテム全体をクリック可能にする
        //   window.location.href = item.url;
        // });
        resultsList.append(listItem);
        resultsFound = true;
      }
    });

    if (resultsFound) {
      noResultsMessage.hide();
      resultsContainer.show();
      suggestionsList.hide();
    } else {
      noResultsMessage.show();
      resultsContainer.hide();
      suggestionsList.hide();
    }
  }

  function updateSuggestions(query) {
    suggestionsList.empty();
    let suggestionsFound = false;
    let maxLength = 0;

    if (query.trim() === "") {
      suggestionsList.hide();
      return;
    }

    $.each(data, function (index, item) {
      if (item.title.toLowerCase().includes(query)) {
        const suggestionItem = $("<li>");
        suggestionItem.text(item.title);
        suggestionItem.on("click", function () {
          searchInput.val(item.title);
          performSearch(item.title.toLowerCase());
          suggestionsList.hide();
        });
        suggestionsList.append(suggestionItem);
        suggestionsFound = true;
        maxLength = Math.max(maxLength, item.title.length);
      }
    });

    if (suggestionsFound) {
      suggestionsList.show();
      suggestionsList.css("width", Math.min(maxLength * 10 + 30, 500));
    } else {
      suggestionsList.hide();
    }
  }

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
      query
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
