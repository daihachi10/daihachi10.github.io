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
