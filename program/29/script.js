const birthdayText = document.getElementById('birthday-text');
const message = "Happy Birthday!";
let index = 0;

function typeWriter() {
    if (index < message.length) {
        birthdayText.innerHTML += message.charAt(index);
        index++;
        setTimeout(typeWriter, 150); // タイピング速度
    } else {
        setTimeout(createBalloons, 2000); // 2秒後に風船を生成
    }
}

function createBalloons() {
    for (let i = 0; i < message.length; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.style.left = `${(i / message.length) * 100}%`; // 配置を均等に
        balloon.style.backgroundColor = getRandomColor(); // 色をランダムに
        balloon.style.animationDelay = `${i * 0.5}s`; // アニメーションの開始をずらす
        document.querySelector('.container').appendChild(balloon);
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

typeWriter();