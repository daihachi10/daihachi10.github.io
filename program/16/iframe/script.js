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