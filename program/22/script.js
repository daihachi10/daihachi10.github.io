let x = 0;
let y = 0;
let locations = 0;
const c00 = document.querySelector('.c00');
const c01 = document.querySelector('.c01');
const c02 = document.querySelector('.c02');
const c03 = document.querySelector('.c03');
const c04 = document.querySelector('.c04');

const c10 = document.querySelector('.c10');
const c11 = document.querySelector('.c11');
const c12 = document.querySelector('.c12');
const c13 = document.querySelector('.c13');
const c14 = document.querySelector('.c14');

const c20 = document.querySelector('.c20');
const c21 = document.querySelector('.c21');
const c22 = document.querySelector('.c22');
const c23 = document.querySelector('.c23');
const c24 = document.querySelector('.c24');


// キーが押されたときのイベントリスナー
document.addEventListener('keydown', function (event) {
    // 押されたキーに基づいて処理を分岐
    switch (event.key.toLowerCase()) { // 小文字に変換して判定
        case '1':
            window.location.href = 'https://google.com';
            break;

        case '2':
            window.location.href = 'https://youtube.com';
            break;

        case '3':
            window.location.href = 'https://x.com';
            break;

        case '4':
            window.location.href = 'https://mail.google.com';
            break;

        case '5':
            window.location.href = 'https://deepl.com';
            break;

        case '6':
            window.location.href = 'https://github.com';
            break;

        case '7':
            window.location.href = 'https://www.youtube.com/@SakuraMiko';
            break;

        case '8':
            window.location.href = 'https://www.youtube.com/@HoshimachiSuisei';
            break;

        case '9':
            window.location.href = 'https://www.youtube.com/@OozoraSubaru';
            break;


        case 'q':
            window.location.href = 'https://mail.google.com';
            break;

        case 'w':
            window.location.href = 'https://deepl.com';
            break;

        case 'e':
            window.location.href = 'https://github.com';
            break;

        case 'a':
            window.location.href = 'https://www.youtube.com/@SakuraMiko';
            break;

        case 's':
            window.location.href = 'https://www.youtube.com/@HoshimachiSuisei';
            break;

        case 'd':
            window.location.href = 'https://www.youtube.com/@OozoraSubaru';
            break;

        case 'z':
            window.location.href = 'https://www.youtube.com/@InugamiKorone';
            break;

        case 'x':
            window.location.href = 'https://www.youtube.com/@shinomiyaruna';
            break;

        case 'c':
            window.location.href = 'https://www.youtube.com/@Lunlun_nijisanji';
            break;

        case 'arrowdown':
            if (y < 4) {
                y++;
                reset();
                kyoutu();
                c00.id = "now";
            }
            break;

        case 'arrowright':
            if (x < 2) {
                x++;
                reset();
                kyoutu();
            }

            break;

        case 'arrowup':
            if (y > 0) {
                y--;
                reset();
                kyoutu();
            }
            break;

        case 'arrowleft':
            if (x > 0) {
                x--;
                reset();
                kyoutu();
            }
            break;

        case 'enter' :
            switch (x) {
                case 0:
                    switch (y) {
                        case 0:
                            window.location.href = 'https://google.com';
                            break;

                        case 1:
                            window.location.href = 'https://mail.google.com';
                            break;

                        case 2:
                            window.location.href = 'https://www.youtube.com/@SakuraMiko';
                            break;
                        case 3:
                            window.location.href = 'https://www.youtube.com/@InugamiKorone';
                            break;
                        case 4:
                            window.location.href = 'https://www.youtube.com/@ui_shig';
                            break;
                    }
                    break;

                case 1:
                    switch (y) {
                        case 0:
                            window.location.href = 'https://youtube.com';
                            break;

                        case 1:
                            window.location.href = 'https://deepl.com';
                            break;

                        case 2:
                            window.location.href = 'https://www.youtube.com/@HoshimachiSuisei';
                            break;
                        case 3:
                            window.location.href = 'https://www.youtube.com/@TodorokiHajime';
                            break;
                        case 4:
                            window.location.href = 'https://www.youtube.com/@shinomiyaruna';
                            break;
                    }
                    break;

                case 2:
                    switch (y) {
                        case 0:
                            window.location.href = 'https://x.com';
                            break;

                        case 1:
                            window.location.href = 'https://github.com/daihachi10/daihachi10.github.io';
                            break;

                        case 2:
                            window.location.href = 'https://www.youtube.com/@OozoraSubaru';
                            break;
                        case 3:
                            window.location.href = 'https://www.youtube.com/@hololive';
                            break;
                        case 4:
                            window.location.href = 'https://www.youtube.com/@Lunlun_nijisanji';
                            break;
                    }
                    break;

            }


            break;

        default:
            console.log(`押されたキー: ${event.key}`);
            break;
    }
});

function reset() {
    c00.id = '';
    c01.id = '';
    c02.id = '';
    c03.id = '';
    c04.id = '';
    c10.id = '';
    c11.id = '';
    c12.id = '';
    c13.id = '';
    c14.id = '';
    c20.id = '';
    c21.id = '';
    c22.id = '';
    c23.id = '';
    c24.id = '';
}

function kyoutu() {
    locations = x + "" + y;
    console.log(locations);
    // locations.id = "nowselect"

    switch (locations) {
        case 0o0:
            c00.id = "now";
            break;
        case 0o1:
            c01.id = "now";
            break
        case 0o2:
            c02.id = "now";


    }

}