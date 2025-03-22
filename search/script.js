$(document).ready(function() {


    const searchInput = $('#search-input');
    const searchButton = $('#search-button');
    const resultsList = $('#results-list');
    const noResultsMessage = $('#no-results');
    const resultsContainer = $('#results-container');
    const suggestionsList = $('#search-input-suggestions');

    function performSearch(query) {
        resultsList.empty();
        let resultsFound = false;

        if (query.trim() === "") {
            noResultsMessage.hide();
            resultsContainer.show();
            suggestionsList.hide();
            return;
        }

        $.each(data, function(index, item) {
            if (item.title.toLowerCase().includes(query) || item.url.toLowerCase().includes(query)) {
                const listItem = $('<li>');
                listItem.html(`<a href="${item.url}">${item.title}</a>`);
                listItem.on('click', function() {  // リストアイテム全体をクリック可能にする
                    window.location.href = item.url;
                });
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

        $.each(data, function(index, item) {
            if (item.title.toLowerCase().includes(query)) {
                const suggestionItem = $('<li>');
                suggestionItem.text(item.title);
                suggestionItem.on('click', function() {
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
            suggestionsList.css('width', Math.min(maxLength * 10 + 30, 500));
        } else {
            suggestionsList.hide();
        }
    }

    searchInput.on('input', function() {
        const query = $(this).val().toLowerCase();
        updateSuggestions(query);
    });

    searchButton.on('click', function() {
        const query = searchInput.val().toLowerCase();
        performSearch(query);
    });

    searchInput.on('keydown', function(event) {
        if (event.key === 'Enter') {
            const query = searchInput.val().toLowerCase();
            performSearch(query);
        }
    });

    // URLクエリパラメータから検索キーワードを取得
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('query');
    if (queryParam) {
        searchInput.val(queryParam);
        performSearch(queryParam.toLowerCase());
    }
});