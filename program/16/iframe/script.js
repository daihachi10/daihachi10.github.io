// 現在のURLからパラメーターを取得
const theme = new URLSearchParams(window.location.search);

// 特定の値に応じてクラスを追加する例
if (theme.get('theme') === 'dark') {
    document.body.classList.add('dark');
} else if (theme.get('theme') === 'light') {
    document.body.classList.remove('dark');
} else {
    document.body.classList.remove('dark');
}

//loading処理
const loading = document.getElementById('loading');

window.onload = function () {
    loading.classList.add('loaded');
}

document.addEventListener('DOMContentLoaded', function () {
    new Splide('#image-slider', {
        type: 'loop',
        perPage: 1,
        padding: '6rem',
        drag: 'free',
        snap: true,
        lazyLoad: 'sequential',
        Keyboard: true,
        // wheel: true,
    }).mount();
});
