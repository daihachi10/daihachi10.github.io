const images = document.querySelectorAll('img');

images.forEach(image => {
    image.addEventListener('mouseenter', () => {
        document.addEventListener('mousemove', handleMouseMove);
    });

    image.addEventListener('mouseleave', () => {
        document.removeEventListener('mousemove', handleMouseMove);
        image.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });

    function handleMouseMove(e) {
        const { clientX: mouseX, clientY: mouseY } = e;
        const { width, height, left, top } = image.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;

        // ここで最大回転角度を変更します。例えば、40に設定すると効果が大きくなります。
        const maxRotation = 40;

        const rotateX = deltaY / height * maxRotation;
        const rotateY = -deltaX / width * maxRotation+10;

        image.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
});
