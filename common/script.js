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

(function () {
  // 画像のみを対象とする簡潔なローダー
  const images = Array.from(document.querySelectorAll("img"));
  const totalImages = images.length;
  let loadedImages = 0;

  // 進捗更新関数
  function updateProgress(percent, message) {
    document.getElementById("progress").style.width = percent + "%";
    document.getElementById("percent").textContent = percent + "%";

    if (message) {
      document.getElementById("status").textContent = message;
    }

    if (percent === 100) {
      document.getElementById("status").textContent =
        "すべてのリソースの読み込みが完了しました";
    }
  }

  // 初期状態表示
  updateProgress(0, `画像リソース: ${totalImages}件を読み込み中...`);

  // 画像の読み込み状態を処理
  images.forEach((img, index) => {
    if (img.complete) {
      // 既に読み込み済み
      loadedImages++;
      updateProgress(
        Math.round((loadedImages / totalImages) * 100),
        `画像を読み込み済み (${loadedImages}/${totalImages})`
      );
    } else {
      // 読み込み待ち
      img.addEventListener("load", () => {
        loadedImages++;
        const percent = Math.round((loadedImages / totalImages) * 100);
        updateProgress(
          percent,
          `画像を読み込み中: ${img.src
            .split("/")
            .pop()} (${loadedImages}/${totalImages})`
        );
      });

      img.addEventListener("error", () => {
        loadedImages++;
        const percent = Math.round((loadedImages / totalImages) * 100);
        updateProgress(
          percent,
          `画像読み込みエラー: ${img.src
            .split("/")
            .pop()} (${loadedImages}/${totalImages})`
        );
      });
    }
  });

  // 全画像が既に読み込み済みの場合の対応
  if (loadedImages === totalImages) {
    updateProgress(100, "すべての画像の読み込みが完了しました");
  }

  // 安全機構: 一定時間後に読み込み状態を再確認
  setTimeout(() => {
    // 再度読み込み状態を確認
    const actuallyLoaded = images.filter((img) => img.complete).length;
    if (actuallyLoaded === totalImages && loadedImages !== totalImages) {
      // 実際には全て読み込まれているが、カウントが合わない場合は強制的に完了
      loadedImages = totalImages;
      updateProgress(100, "すべての画像の読み込みが完了しました");
    }
  }, 3000);
})();

document.addEventListener("click", function (event) {
  // クリックされたときの処理
  console.log("クリックされました！", event.clientX, event.clientY);
  // AOS.init(); aosここ解除したらできる
});
window.addEventListener("load", function () {
  for (let i = 0; i < 500; i++) {
    setTimeout(function () {
      // AOS.init(); aosここ解除したらできる
    }, 600);
  }
});

window.onload = function () {
  for (let i = 0; i < 500; i++) {
    setTimeout(function () {
      // AOS.init(); aosここ解除したらできる
    }, 600);
  }
};

window.onload = function () {
  window.addEventListener("keydown", keydownfunc, true);
};

var keydownfunc = function (event) {
  var code = event.keyCode;
  switch (code) {
    case 32:
    case 37: // ←
    case 38: // ↑
    case 39: // →
    case 40: // ↓
      event.preventDefault();
    // console.log(code);
  }
};

document.addEventListener("keydown", function (event) {
  // 上矢印キー（38）または下矢印キー（40）が押された場合
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
  }
});

// function goToSearchPage() {
//   // テキストボックスの値を取得
//   var query = document.getElementById("header-searchQuery").value;

//   // 値が空でないか確認
//   if (query.trim() !== "") {
//     // 新しいURLを生成
//     var newUrl =
//       "https://daihachi10.github.io/result.html?query=" +
//       encodeURIComponent(query);

//     // 新しいURLに移動
//     window.location.href = newUrl;
//   } else {
//     alert("検索する文字を入力してください。"); // 空の場合は警告を表示
//   }
// }

const imagelist = [
  "https://daihachi10.github.io/images/usericons/01.webp",
  "https://daihachi10.github.io/images/usericons/02.webp",
  "https://daihachi10.github.io/images/usericons/03.webp",
  "https://daihachi10.github.io/images/usericons/04.webp",
  "https://daihachi10.github.io/images/usericons/05.webp",
  "https://daihachi10.github.io/images/usericons/06.webp",
  "https://daihachi10.github.io/images/usericons/07.webp",
  "https://daihachi10.github.io/images/usericons/08.webp",
  "https://daihachi10.github.io/images/usericons/09.webp",
  "https://daihachi10.github.io/images/usericons/10.webp",
  "https://daihachi10.github.io/images/usericons/11.webp",
];

const icon = $("#icon-box");

const randomIndex = Math.floor(Math.random() * imagelist.length);
const randomImage = imagelist[randomIndex];
icon.html(`<img class="icon" src="${randomImage}" />`);
