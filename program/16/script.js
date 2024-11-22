
const videos = document.getElementsByTagName('video');
const videoId = document.getElementById('firstvideo');
for (let i = 0; i < videos.length; i++) {
    videos[i].addEventListener('ended', function (event) {
        console.log('ended');
        videoId.classList.add('end');

    });
}


let lastScrollY = 0;
const defaultHeader = document.getElementById('default-header');
const animatedHeader = document.getElementById('animated-header');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // スクロールダウン: 通常ヘッダーを非表示、アニメーションヘッダーを表示
        defaultHeader.classList.add('hidden');
        animatedHeader.classList.add('visible');
    } else if (currentScrollY < lastScrollY && currentScrollY > 100) {
        // スクロールアップ: アニメーションヘッダーを表示
        animatedHeader.classList.add('visible');
    } else if (currentScrollY <= 100) {
        // 一番上に戻ったとき: 通常ヘッダーを表示、アニメーションヘッダーを非表示
        defaultHeader.classList.remove('hidden');
        animatedHeader.classList.remove('visible');
    }

    lastScrollY = currentScrollY;
});




const driver = window.driver.js.driver;
const driverObj = driver({
    steps: [
        { element: '#step1', popover: { title: 'ここから項目に飛ぶことができます。', description: '', side: "bottom", align: 'center' } },

        { element: '#step2', popover: { title: 'ABOUT', description: 'そもそも自作PCとはなにか、どんなメリットがあるかを簡単に説明しています。', side: "bottom", align: 'center' } },
        { element: '#step3', popover: { title: 'PARTS LIST', description: 'PCに必要な主要なパーツの一覧です。', side: "bottom", align: 'center' } },
        { element: '#step4', popover: { title: 'MOVIE', description: 'CPUの3DVCACHEという機能についての詳しい動画です。', side: "bottom", align: 'center' } },
        { element: '#step5', popover: { title: 'PICTURE', description: 'PCを組み立てているときの写真です。', side: "bottom", align: 'center' } },
        { element: '#step6', popover: { title: 'PERFORMANCE', description: '組み立てたPCの性能です。', side: "bottom", align: 'center' } },
        { element: '#step7', popover: { title: 'GO!', description: '', side: "top", align: 'center' } },
    ],

    nextBtnText: '次へ',
    prevBtnText: '戻る',
    doneBtnText: '閉じる',
    showProgress: true,
});



//loading処理
const loading = document.getElementById('loading');

window.onload = function () {
    loading.classList.add('loaded');


}


window.addEventListener('load', function () {
    if (!localStorage.getItem('disp_popup')) {
        localStorage.setItem('disp_popup', 'on');
        console.log("初回");
        setTimeout(function () {
            driverObj.drive();
        }, 4000);

    } else {
        console.log("初回ではない")
    }
}, false);


function reset() {
    loading.classList.remove('loaded');
    window.scrollTo({ top: 0 })
    localStorage.clear();
    location.reload();
}

function tetris() {
    loading.classList.remove('loaded');
}

function notTetris() {
    loading.classList.add('loaded');
}


//スクロール処理
function pageTop() { window.scrollTo({ top: 0, behavior: "smooth" }) }
function down() { window.scrollTo({ top: window.innerHeight - 200, behavior: "smooth" }) }
function about() { window.scrollTo({ top: window.innerHeight - 170, behavior: "smooth" }) }
function partslist() { window.scrollTo({ top: window.innerHeight + 430, behavior: "smooth" }) }
function movie() { window.scrollTo({ top: window.innerHeight + 1150 + 25, behavior: "smooth" }) }
function picture() { window.scrollTo({ top: window.innerHeight + 1705, behavior: "smooth" }) }
function performance() { window.scrollTo({ top: window.innerHeight + 2450, behavior: "smooth" }) }


//ページの名前上書き
let name = "HOME | BuildingPC Parts Introduction"
document.title = name

//スクロールされたら現在の位置を取得->ページの名前上書き
window.addEventListener("scroll", (event) => {
    var scrollY = window.scrollY
    console.log(scrollY)
    document.title = name

    if (scrollY > window.innerHeight + 1739) { name = "PICTURE | BuildingPC Parts Introduction" }
    else if (scrollY > window.innerHeight + 884) { name = "MOVIE | BuildingPC Parts Introduction" }
    else if (scrollY > window.innerHeight + 301) { name = "PARTS LIST | BuildingPC Parts Introduction" }
    else if (scrollY > window.innerHeight - 240) { name = "ABOUT | BuildingPC Parts Introduction" }
    else { name = "HOME | BuildingPC Parts Introduction" }
    /*
    ク
    ソ
    コ
    |
    ド
    */
})
// $('.slide-items').slick();

/*
  
  アニメーションパソコン室のパソコンは
  バージョンが古いから無理っぽい？
  (chrome・edge:var115~)
  
  https://caniuse.com/?search=animation-range
  
  
  */

//文字スライドイン
$(function () {
    $(".slideshow-fade li").css({
        position: "relative",
        overflow: "hidden",
    })
    $(".slideshow-fade li")
        .hide()
        .css({ position: "absolute", top: 0, left: 0 })
    $(".slideshow-fade li:first").addClass("fade").show()
    setInterval(function () {
        var $active = $(".slideshow-fade li.fade")
        var $next = $active.next("li").length
            ? $active.next("li")
            : $(".slideshow-fade li:first")
        $active.fadeOut(1000).removeClass("fade")
        $next.fadeIn(1000).addClass("fade")
    }, 2000)
})

//テキスト入力
$(function () {
    $(".Ttext").t({
        speed: 30,
        // speed_vary: true,//人間
        blink_perm: false, //常に点滅しない
        caret: "",
        pause_on_click: true,
    })
})

// $('.Ttext').t('pause'[true])
// subdirectory_arrow_rightshorthand: $('.Ttext').p([true])

$(function () {
    $("#Ttext2").t({
        delay: 3,
        speed: 60,
        speed_vary: true,//人間
        blink_perm: false, //常に点滅しない
        caret: "|"
    })
})

//スクロールでクラスのとこまで来たらアニメーションを再生
function addScrollAnimation(className) {
    window.addEventListener('scroll', function () {
        const elements = document.querySelectorAll(className);
        elements.forEach((el) => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0; //0

            if (isVisible) {
                el.classList.add('appear');
            }
        });
    });
}

addScrollAnimation('.text');
addScrollAnimation('.2text');

