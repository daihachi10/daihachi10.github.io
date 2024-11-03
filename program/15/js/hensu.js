let odai = [                                    //お題
    "グアムとサイパンは近い",
    "ホームページ作りました",
    "ハードディスク",
    "タイムマシーン",
    "卒業式",
    "メールアドレス",
    "ハンドルネーム",
    "職員室",
    "起承転結",
    "兄弟げんか",
    "百万ボルト",
    "天国と地獄",
    "運も実力の内",
    "運命なんて信じない",
    "代表取締役",
    "ガーデニングが趣味です",
    "障害物競走",
];
let romaji = [                                  //ローマ字
    ["g", "u", "a", "m", "u", "t", "o", "s", "a", "i", "p", "a", "n", "h", "a", "t", "i", "k", "a", "i",],
    ["h", "o", "-", "m", "u", "p", "e", "-", "j", "i", "t", "u", "k", "u", "r", "i", "m", "a", "s", "i", "t", "a",],
    ["h", "a", "-", "d", "o", "d", "h", "i", "s", "u", "k", "u"],
    ["t", "a", "i", "m", "u", "m", "a", "s", "i", "-", "n"],
    ["s", "o", "t", "u", "g", "y", "o", "u", "s", "i", "k", "i"],
    ["m", "e", "-", "r", "u", "a", "d", "o", "r", "e", "s", "u"],
    ["h", "a", "n", "d", "o", "r", "u", "n", "e", "-", "m", "u"],
    ["s", "h", "o", "k", "u", "i", "n", "s", "i", "t", "u"],
    ["k", "i", "s", "h", "o", "u", "t", "e", "n", "k", "e", "t", "u"],
    ["k", "y", "o", "u", "d", "a", "i", "g", "e", "n", "k", "a"],
    ["h", "y", "a", "k", "u", "m", "a", "n", "b", "o", "r", "u", "t", "o"],
    ["t", "e", "n", "g", "o", "k", "u", "t", "o", "j", "i", "g", "o", "k", "u"],
    ["u", "n", "m", "o", "j", "i", "t", "u", "r", "y", "o", "k", "u", "n", "o", "u", "t", "i"],
    ["u", "n", "m", "e", "i", "n", "a", "n", "t", "e", "s", "i", "n", "j", "i", "n", "a", "i"],
    ["d", "a", "i", "h", "y", "o", "u", "t", "o", "r", "i", "s", "i", "m", "a", "r", "i", "y", "a", "k", "u"],
    ["g", "a", "-", "d", "e", "n", "i", "n", "g", "u", "g", "a", "s", "h", "u", "m", "i", "d", "e", "s", "u"],
    ["s", "h", "o", "u", "g", "a", "i", "b", "u", "t", "u", "k", "y", "o", "u", "s", "o", "u"],

]

let tSushiX = 400;                              //タイトル画面の寿司
let tobiraX = 0                                 //画面が変わるときの扉

let course = "普通"                             //難易度
let difficulty = "お勧め"                       //コース
let now = "title"                               //今なんの画面か

let imanoyatu = 0;                              //今ローマ字どれくらい打ったか
let keys;                                       //次に打たないといけないキー
let i = 0;                                      //打った数
let romajiIndex = 0;                            //ローマ字の中央寄せするときに使う

//ゲームオーバー
let isOdaiShow = true;                          //ゲームオーバーの終了の文字を表示するときにfalseになる
let gameOverTien = 30;                          //終了の文字がでてから扉が閉じるまでの遅延
let gameOverResultTien = 60;                    //白い背景がでてから結果が出るまでの遅延
let isTimeShow = true;                          //ゲームオーバーの扉が閉まるとfalseになる

//images
let sushiImage;                                 //寿司の画像
let sushi_karaImage;                            //寿司の空の画像
let sushiImageSmall;                            //寿司の難易度選択で使う画像
let sushi_karaImageSmall;                       //寿司の空の難易度選択で使う画像
let barrage_arrowImage;                         //連打バーの矢印の画像

//timers
let countUpTimer = 0;                           //カウントアップタイマー
let countDownTimer;                             //カウントダウンタイマー
let time = 90;                                  //残りの時間設定

//流れる寿司
let sushiX = -103;                              //X
let sushiY = 0;                                 //Y
let sushiSpeed = 1;                             //基本のスピード
let sushiKasokudo = 0.03;                       //1つ終わる事にどれくらい加速するか

let score = 0;                                  //score
let nedan = 0;                                  //nedan
//皿
let kekka = 0;                                  //払った値段を引いた値段
let sara = 0;                                   //皿の数
let juunokuraiSara = 0;                         //十の位の皿の数

let tien = 0;                                   //次のに行ったら遅延

//連打メーター
let barrrage = 0;                               //連打の数
let barrrageSpeed = 1.35;                       //連打する事の数
let barrrageX = 0;                              //連打のバーの数

//追加カウント
let isAdd1Sec1 = false;                         //1秒1回目
let isAdd1Sec2 = false;                         //1秒2回目
let isAdd2Sec = false;                          //2秒
let isAdd3Sec = false;                          //3秒

//連打メーター表示されたかどうか
let isShowAdd1Sec1 = false;                     //1秒1回目
let isShowAdd1Sec2 = false;                     //1秒2回目
let isShowAdd2Sec = false;                      //2秒
let isShowAdd3Sec = false;                      //3秒

//連打メーター表示されたかどうかの時間
let defaultShowBarrageTime = 80;                //基準
let showBarrageTime = defaultShowBarrageTime;   //最初にリセット
