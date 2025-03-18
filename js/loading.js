window.addEventListener('load', function () {
    // ページが完全に読み込まれたらローディング画面を非表示にしてコンテンツを表示
    setTimeout(function(){
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';

    },4000);

});
