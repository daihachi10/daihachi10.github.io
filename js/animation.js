// 画面が読み込まれた時、is-slideを外し、アニメーションさせる
$(window).on('load', function () {
    $('body').removeClass('is-slide');
});

$(function () {
    // ハッシュリンク(#)と別ウィンドウでページを開く場合は実行しない

    $('a:not([href^="#"]):not([target])').on('click', function (e) {
        e.preventDefault();         // ページ遷移を一旦キャンセル
        url = $(this).attr('href'); // 遷移先のURLを取得

        if (url !== '') {
            $('body').addClass('is-slide-in'); // 画面遷移前のアニメーション is-slide-in

            setTimeout(function () {
                window.location = url;  // 0.7秒後に取得したURLに遷移
            }, 700);
        }
        return false;
    });

});
