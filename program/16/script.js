
//youtubeビデオ
const youtubeId = document.getElementById('youtubeVideo');

// クラスを付与
function youtubeHide() {
    youtubeId.classList.add('hide');
}

function youtubeNotHide() {
    youtubeId.classList.remove('hide');
}



//戻ってきた場合は動画を表示しない
const params = new URLSearchParams(window.location.search);
const isVideoPlay = params.get('v');

const videos = document.getElementsByTagName('video');
const videoId = document.getElementById('firstvideo');
for (let i = 0; i < videos.length; i++) {
    videos[i].addEventListener('ended', function (event) {
        console.log('video end');
        videoId.classList.add('end');

    });
}

if (isVideoPlay == true) {
    videoId.classList.add('end');
    console.log('video end');

}

document.addEventListener('keydown', event => {
    videoId.classList.add('end');
    console.log("video Skip")
});

const videoParams = new URLSearchParams(window.location.search);

if (videoParams.get('video') === 'skip') {
    videoId.classList.add('end');
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


function down() {
    if (window.innerWidth > 800) {
        window.scrollTo({ top: window.innerHeight - 200, behavior: "smooth" })
    } else {
        window.scrollTo({ top: window.innerHeight - 500, behavior: "smooth" })
    }
}
function pageTop() { window.scrollTo({ top: 0, behavior: "smooth" }) }
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
// $(function () {
//     $(".Ttext").t({
//         speed: 30,
//         // speed_vary: true,//人間
//         blink_perm: false, //常に点滅しない
//         caret: "",
//         pause_on_click: true,
//     })
// })

// $('.Ttext').t('pause'[true])
// subdirectory_arrow_rightshorthand: $('.Ttext').p([true])

//t.js
$(function () {
    $("#Ttext2").t({
        delay: 3,
        speed: 60,
        speed_vary: false,//人間
        blink_perm: false, //常に点滅しない
        caret: "●"
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

//音再生するかどうか
let isSound = false;
function sound() {
    isSound = !isSound; //???
}

const click = new Audio('https://daihachi10.github.io/program/16/click.mp3');

// 音を再生

document.addEventListener('click', function (event) {
    // console.log("click")
    // clickSound.play();
    // notOther();
    if (isSound) {
        click.play();
    }
});

    var $menu = document.querySelector('.header-site-menu');
window.addEventListener('load', function () {
    var $button = document.querySelector('.toggle-menu-button');
    $button.addEventListener('click', function () {
        if ($menu.classList.contains('is-show')) {
            $menu.classList.remove('is-show');
        }
        else {
            $menu.classList.add('is-show');
        }
    });


});


document.addEventListener('DOMContentLoaded', function () {
    new Splide('#image-slider', {
        type: 'loop',
        perPage: 1,
        autoplay: true,
        interval: 3000,
        padding: '5rem',
        drag: 'free',
        snap: true,
        lazyLoad: 'sequential',
        Keyboard: true,
        // wheel: true,
    }).mount();
});


//cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

function animateFollower() {
    const speed = 0.2; // 遅延速度
    followerX += (mouseX - followerX) * speed;
    followerY += (mouseY - followerY) * speed;

    cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(animateFollower);
}

animateFollower();

if (localStorage.getItem('isDarkMode') === 'true') {
    document.body.classList.add('dark');
}

function theme() {
    document.body.classList.toggle('dark');
    //darkmode localstoreage
    if (document.body.classList.contains('dark')) {
        console.log('ダークモード');
        localStorage.setItem('isDarkMode', 'true');
    } else {
        console.log('ライトモード');
        localStorage.setItem('isDarkMode', 'false');
    }
}

//ダブルタップで拡大しない
document.addEventListener("dblclick", function(e){ e.preventDefault();}, { passive: false });


//other表示
const otherboxid = document.getElementById('otherbox');
function other() {

    setTimeout(function(){
        otherboxid.classList.toggle('otherdisplay');
    },1);
}

function notOther() {
    otherboxid.classList.remove('otherdisplay');
}

const siteMenu = document.getElementById('header-site-menu');
function siteMenuTojiru() {
    siteMenu.classList.remove('is-show');
}