let odai = [                                    //お題
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
    "消化器",
    "火星人",
    "リコーダー",
    "バイオリン",
    "腕時計",
    "砂時計",
    "都市伝説",
    "怖い話",
    "道路工事",
    "北斗七星",
    "梅雨前線",
    "防犯ブザー",
    "一円拾った",
    "労働基準法",
    "勉強しなさい!",

    "もも",
    "熊",
    "アジ",
    "穴",
    "鮎",
    "イカ",
    "石",
    "犬",
    "牛",
    "嘘",
    "ウニ",
    "梅",
    "エイ",
    "サバ",



];
let romaji = [                                  //ローマ字
    ["h", "o", "-", "m", "u", "p", "e", "-", "j", "i", "t", "u", "k", "u", "r", "i", "m", "a", "s", "i", "t", "a",],
    ["h", "a", "-", "d", "o", "d", "h", "i", "s", "u", "k", "u"],
    ["t", "a", "i", "m", "u", "m", "a", "s", "i", "-", "n"],
    ["s", "o", "t", "u", "g", "y", "o", "u", "s", "i", "k", "i"],
    ["m", "e", "-", "r", "u", "a", "d", "o", "r", "e", "s", "u"],
    ["h", "a", "n", "d", "o", "r", "u", "n", "e", "-", "m", "u"],
    ["s", "y", "o", "k", "u", "i", "n", "s", "i", "t", "u"],
    ["k", "i", "s", "y", "o", "u", "t", "e", "n", "k", "e", "t", "u"],
    ["k", "y", "o", "u", "d", "a", "i", "g", "e", "n", "k", "a"],
    ["h", "y", "a", "k", "u", "m", "a", "n", "b", "o", "r", "u", "t", "o"],
    ["t", "e", "n", "g", "o", "k", "u", "t", "o", "j", "i", "g", "o", "k", "u"],
    ["u", "n", "m", "o", "j", "i", "t", "u", "r", "y", "o", "k", "u", "n", "o", "u", "t", "i"],
    ["u", "n", "m", "e", "i", "n", "a", "n", "t", "e", "s", "i", "n", "j", "i", "n", "a", "i"],
    ["d", "a", "i", "h", "y", "o", "u", "t", "o", "r", "i", "s", "i", "m", "a", "r", "i", "y", "a", "k", "u"],
    ["g", "a", "-", "d", "e", "n", "i", "n", "g", "u", "g", "a", "s", "y", "u", "m", "i", "d", "e", "s", "u"],
    ["s", "y", "o", "u", "g", "a", "i", "b", "u", "t", "u", "k", "y", "o", "u", "s", "o", "u"],
    ["s", "y", "o", "u", "k", "a", "k", "i"],
    ["k", "a", "s", "e", "i", "j", "i", "n"],
    ["r", "i", "k", "o", "-", "d", "a", "-"],
    ["b", "a", "i", "o", "r", "i", "n"],
    ["u", "d", "e", "d", "o", "k", "e", "i"],
    ["s", "u", "n", "a", "d", "o", "k", "e", "i"],
    ["t", "o", "s", "i", "d", "e", "n", "s", "e", "t", "u"],
    ["k", "o", "w", "a", "i", "h", "a", "n", "a", "s", "i"],
    ["d", "o", "u", "r", "o", "k", "o", "u", "j", "i"],
    ["h", "o", "k", "u", "t", "o", "s", "i", "t", "i", "s", "e", "i"],
    ["b", "a", "i", "u", "z", "e", "n", "s", "e", "n"],
    ["b", "o", "u", "h", "a", "n", "b", "u", "z", "a", "-"],
    ["i", "t", "i", "e", "n", "h", "i", "r", "o", "t", "t", "a"],
    ["r", "o", "u", "d", "o", "u", "k", "i", "j", "u", "n", "h", "o", "u"],
    ["b", "e", "n", "k", "y", "o", "u", "s", "i", "n", "a", "s", "a", "i", "!"],

    ["m", "o", "m", "o"],
    ["k", "u", "m", "a"],
    ["a", "j", "i"],
    ["a", "n", "a"],
    ["a", "y", "u"],
    ["i", "k", "a"],
    ["i", "s", "i"],
    ["i", "n", "u"],
    ["u", "s", "i"],
    ["u", "s", "o"],
    ["u", "n", "i"],
    ["u", "m", "e"],
    ["e", "i"],
    ["s", "a", "b", "a"],


]

//FPS測定
let lastTime = 0;
let fps = 0;
let fpsTotal = 0;
let frameCountH = [];
let frameCountTotal = 0;

let averageFps = 0;
let minFps = 60;
let maxFps = 60;
let fpsTien = 60;

let tSushiX = 400;                              //タイトル画面の寿司
let tobiraX = 0                                 //画面が変わるときの扉
let now = "title"                               //今なんの画面か

let course = "普通"                             //難易度
let difficulty = "お勧め"                       //コース

let imanoyatu                              //今ローマ字どれくらい打ったか
let keys;                                       //次に打たないといけないキー
let i = 0;                                      //打った数
let romajiIndex = 0;                            //ローマ字の中央寄せするときに使う
let hajimete = true;                            //最初の入力する文字

//ゲームオーバー
let isOdaiShow = true;                          //ゲームオーバーの終了の文字を表示するときにfalseになる
let gameOverTien = 30;                          //終了の文字がでてから扉が閉じるまでの遅延
let gameOverResultTien = 0;                     //白い背景がでてから結果が出るまでの遅延
let isTimeShow = true;                          //ゲームオーバーの扉が閉まるとfalseになる


//settings
let isShowSetting = false                        //設定画面が表示されているかどうか
let isChangeFont = false                        //fontをNoto Sans JPに変更したかどうか
let isRomajiShow = true                         //ローマ字表示するか
let isBgm = false                                //BGMを流すか
let isSoundEffect = true                        //効果音を流すか
let isType = true                               //タイプ音を流すか

//images
let sushiImage;                                 //寿司の画像
let sushi_karaImage;                            //寿司の空の画像
let sushiImageSmall;                            //寿司の難易度選択で使う画像
let sushi_karaImageSmall;                       //寿司の空の難易度選択で使う画像
let barrage_arrowImage;                         //連打バーの矢印の画像
let settingsImage;                              //設定の画像
let settingsImageSmall;                              //設定の画像小さい
let check_boxImage;                             //チェックボックスだけの画像
let checkImage;                                 //チェックの画像

//sounds
let keySounds1;                                 //タイピング音
let keySounds2;                                 //タイピング音
let keySounds3;                                 //タイピング音
let keySound;                                   //random
let startSounds;                                //スタートの笛
let stopSounds;                                 //stopの笛
let isStopSounds = false;                               //stopの音を再生したかどうか

let result1Sounds;
let isResult1Sounds = false
let isResult2Sounds = false
let result2;
let isResult3Sounds = false

let bgmInput;                                   //bgmをインプット

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
