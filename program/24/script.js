function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
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

