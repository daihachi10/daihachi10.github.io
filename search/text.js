const data = [
    { title: "ヘビゲーム", url: "https://daihachi10.github.io/program/33/index.html", description: "ヘビゲームの再現をしました。りんごを食べると体が伸び、<br>自分の身体に触れるとゲームオーバーです。" },
    { title: "snake", url: "https://daihachi10.github.io/program/33/index.html", description: "ヘビゲームの再現をしました。りんごを食べると体が伸び、<br>自分の身体に触れるとゲームオーバーです。" },
    { title: "スネークゲーム", url: "https://daihachi10.github.io/program/33/index.html", description: "ヘビゲームの再現をしました。りんごを食べると体が伸び、<br>自分の身体に触れるとゲームオーバーです。" },

    { title: "2Dシューティングゲーム", url: "https://daihachi10.github.io/program/25/index.html", description: "2Dのシューティングゲームです。<br>コインをためて銃を強化していくゲームです。" },
    { title: "シューティングゲーム", url: "https://daihachi10.github.io/program/25/index.html", description: "2Dのシューティングゲームです。<br>コインをためて銃を強化していくゲームです。" },

    { title: "TETRIS", url: "https://daihachi10.github.io/program/20/index.html", description: "シンプルなテトリス風のゲームです。<br>ENTERキーまたはスタートボタンでスタート" },
    { title: "テトリス", url: "https://daihachi10.github.io/program/20/index.html", description: "シンプルなテトリス風のゲームです。<br>ENTERキーまたはスタートボタンでスタート" },
    { title: "落ち物パズル", url: "https://daihachi10.github.io/program/20/index.html", description: "シンプルなテトリス風のゲームです。<br>ENTERキーまたはスタートボタンでスタート" },

    { title: "パックマン", url: "https://daihachi10.github.io/program/21/index.html", description: "パックマンを再現しました。" },
    { title: "PAC-MAN", url: "https://daihachi10.github.io/program/21/index.html", description: "パックマンを再現しました。" },

    { title: "LASERS || PLATFORMER", url: "https://daihachi10.github.io/program/09/index.html", description: "WASD、矢印キー、タップで移動<br>レーザーに当たらないようにクリアしよう<br>Rキー、RESETボタンを押すとステージがリセットされます" },
    { title: "レーザープラットフォーマー", url: "https://daihachi10.github.io/program/09/index.html", description: "WASD、矢印キー、タップで移動<br>レーザーに当たらないようにクリアしよう<br>Rキー、RESETボタンを押すとステージがリセットされます" },

    { title: "Geometry Dash2", url: "https://daihachi10.github.io/program/08/index.html", description: "ジオメトリーダッシュのマイクラ版2！ <br>矢印上・スペースキー・タップで操作できます（ジャンプ）" },
    { title: "ジオメトリダッシュ2", url: "https://daihachi10.github.io/program/08/index.html", description: "ジオメトリーダッシュのマイクラ版2！ <br>矢印上・スペースキー・タップで操作できます（ジャンプ）" },
    { title: "幾何学ダッシュ2", url: "https://daihachi10.github.io/program/08/index.html", description: "ジオメトリーダッシュのマイクラ版2！ <br>矢印上・スペースキー・タップで操作できます（ジャンプ）" },

    { title: "Geometry Dash", url: "https://daihachi10.github.io/program/07/index.html", description: "ジオメトリーダッシュのマイクラ版！ <br>矢印上・スペースキー・タップで操作できます（ジャンプ）" },
    { title: "ジオメトリダッシュ", url: "https://daihachi10.github.io/program/07/index.html", description: "ジオメトリーダッシュのマイクラ版！ <br>矢印上・スペースキー・タップで操作できます（ジャンプ）" },
    { title: "幾何学ダッシュ", url: "https://daihachi10.github.io/program/07/index.html", description: "ジオメトリーダッシュのマイクラ版！ <br>矢印上・スペースキー・タップで操作できます（ジャンプ）" },

    { title: "PLATFORMER MAKER", url: "https://daihachi10.github.io/program/06/index.html", description: "スクロールプラットフォーマーを作ってみよう！<br>キー(0-9)でブロック選択<br>モバイルの設定をクリック(左上)..." },
    { title: "プラットフォーマーメーカー", url: "https://daihachi10.github.io/program/06/index.html", description: "スクロールプラットフォーマーを作ってみよう！<br>キー(0-9)でブロック選択<br>モバイルの設定をクリック(左上)..." },

    { title: "BALL PICKING GAME", url: "https://daihachi10.github.io/program/03/index.html", description: "ボール拾いゲーム。スコアが増えるごとにボールのスピードが早くなる。<br>ラッキーボールやアンラッキーボールも。" },
    { title: "ボール拾いゲーム", url: "https://daihachi10.github.io/program/03/index.html", description: "ボール拾いゲーム。スコアが増えるごとにボールのスピードが早くなる。<br>ラッキーボールやアンラッキーボールも。" },
    { title: "ボールキャッチゲーム", url: "https://daihachi10.github.io/program/03/index.html", description: "ボール拾いゲーム。スコアが増えるごとにボールのスピードが早くなる。<br>ラッキーボールやアンラッキーボールも。" },

    { title: "BATTLE ROYAL", url: "https://daihachi10.github.io/program/13/index.html", description: "大乱闘!スペースキーを押しながらジョンの冒険を押すと…" },
    { title: "バトルロイヤル", url: "https://daihachi10.github.io/program/13/index.html", description: "大乱闘!スペースキーを押しながらジョンの冒険を押すと…" },
    { title: "大乱闘", url: "https://daihachi10.github.io/program/13/index.html", description: "大乱闘!スペースキーを押しながらジョンの冒険を押すと…" },

    { title: "Many reCAPTCHA", url: "https://daihachi10.github.io/program/31/index.html", description: "たくさんreCAPTCHA" },
    { title: "リキャプチャ", url: "https://daihachi10.github.io/program/31/index.html", description: "たくさんreCAPTCHA" },
    { title: "reCAPTCHA", url: "https://daihachi10.github.io/program/31/index.html", description: "たくさんreCAPTCHA" },

    { title: "Youtube Video Player", url: "https://daihachi10.github.io/program/17/index.html", description: "YouTube Video Player<br>Enter a YouTube URL to display the video:" },
    { title: "ユーチューブ", url: "https://daihachi10.github.io/program/17/index.html", description: "YouTube Video Player<br>Enter a YouTube URL to display the video:" },
    { title: "YouTubeプレイヤー", url: "https://daihachi10.github.io/program/17/index.html", description: "YouTube Video Player<br>Enter a YouTube URL to display the video:" },

    { title: "NOTEPAD", url: "https://daihachi10.github.io/program/14/index.html", description: "シンプルなメモ帳です。" },
    { title: "メモ帳", url: "https://daihachi10.github.io/program/14/index.html", description: "シンプルなメモ帳です。" },
    { title: "テキストエディタ", url: "https://daihachi10.github.io/program/14/index.html", description: "シンプルなメモ帳です。" },

    { title: "QR CODE GENERATOR", url: "https://daihachi10.github.io/program/05/index.html", description: "QRコード®を生成します。このサイトのURLが指定されています。<br>サイトを共有するときに使えるかもしれません。" },
    { title: "QRコード生成", url: "https://daihachi10.github.io/program/05/index.html", description: "QRコード®を生成します。このサイトのURLが指定されています。<br>サイトを共有するときに使えるかもしれません。" },

    { title: "EMOJI GENERATOR", url: "https://daihachi10.github.io/program/04/index.html", description: "絵文字生成機です。ランダムで100行絵文字を生成します。<br>友達にLINE®を送信するときに使えるかもしれませんね。" },
    { title: "絵文字ジェネレーター", url: "https://daihachi10.github.io/program/04/index.html", description: "絵文字生成機です。ランダムで100行絵文字を生成します。<br>友達にLINE®を送信するときに使えるかもしれませんね。" },
    { title: "絵文字メーカー", url: "https://daihachi10.github.io/program/04/index.html", description: "絵文字生成機です。ランダムで100行絵文字を生成します。<br>友達にLINE®を送信するときに使えるかもしれませんね。" },

    { title: "PASSWORD GENERATOR", url: "https://daihachi10.github.io/program/02/index.html", description: "ランダムなパスワードを生成するツールです。(AI生成)" },
    { title: "パスワードジェネレーター", url: "https://daihachi10.github.io/program/02/index.html", description: "ランダムなパスワードを生成するツールです。(AI生成)" },
    { title: "パスワード生成", url: "https://daihachi10.github.io/program/02/index.html", description: "ランダムなパスワードを生成するツールです。(AI生成)" },

    { title: "変換TYPING", url: "https://daihachi10.github.io/program/26/index.html", description: "日本語の変換を練習するためのタイピングゲームです。(AI生成)" },
    { title: "変換タイピング", url: "https://daihachi10.github.io/program/26/index.html", description: "日本語の変換を練習するためのタイピングゲームです。(AI生成)" },
    { title: "変換練習", url: "https://daihachi10.github.io/program/26/index.html", description: "日本語の変換を練習するためのタイピングゲームです。(AI生成)" },

    { title: "SUSHITYPING", url: "https://daihachi10.github.io/program/15/index.html", description: "流れてくるお寿司の文字をタイピングするゲームです。(AI生成)" },
    { title: "寿司打", url: "https://daihachi10.github.io/program/15/index.html", description: "流れてくるお寿司の文字をタイピングするゲームです。(AI生成)" },
    { title: "寿司タイピング", url: "https://daihachi10.github.io/program/15/index.html", description: "流れてくるお寿司の文字をタイピングするゲームです。(AI生成)" },

    { title: "TYPING", url: "https://daihachi10.github.io/program/01/index.html", description: "キーボードのタイピングを練習するためのゲームです。(AI生成)" },
    { title: "タイピング", url: "https://daihachi10.github.io/program/01/index.html", description: "キーボードのタイピングを練習するためのゲームです。(AI生成)" },
    { title: "タイピング練習", url: "https://daihachi10.github.io/program/01/index.html", description: "キーボードのタイピングを練習するためのゲームです。(AI生成)" },

    { title: "INFINITE LOADING", url: "https://daihachi10.github.io/program/32/index.html", description: "無限に続くローディングアニメーションのデモです。(AI生成)" },
    { title: "無限ローディング", url: "https://daihachi10.github.io/program/32/index.html", description: "無限に続くローディングアニメーションのデモです。(AI生成)" },

    { title: "REPRODUCED IN FIGMA", url: "https://daihachi10.github.io/program/30/index.html", description: "Figmaで再現されたデザインのデモです。(AI生成)" },
    { title: "Figma再現", url: "https://daihachi10.github.io/program/30/index.html", description: "Figmaで再現されたデザインのデモです。(AI生成)" },

    { title: "P5 ANIMATION 02", url: "https://daihachi10.github.io/program/10/index.html", description: "p5.jsで作成されたアニメーションのデモです。(AI生成)" },
    { title: "P5アニメーション02", url: "https://daihachi10.github.io/program/10/index.html", description: "p5.jsで作成されたアニメーションのデモです。(AI生成)" },

    { title: "P5 ANIMATION 01", url: "https://daihachi10.github.io/program/11/index.html", description: "p5.jsで作成されたアニメーションのデモです。(AI生成)" },
    { title: "P5アニメーション01", url: "https://daihachi10.github.io/program/11/index.html", description: "p5.jsで作成されたアニメーションのデモです。(AI生成)" },

    { title: "P5 ANIMATION 03", url: "https://daihachi10.github.io/program/12/index.html", description: "p5.jsで作成されたアニメーションのデモです。(AI生成)" },
    { title: "P5アニメーション03", url: "https://daihachi10.github.io/program/12/index.html", description: "p5.jsで作成されたアニメーションのデモです。(AI生成)" },

    { title: "Build pc parts introduce", url: "https://daihachi10.github.io/program/16/index.html", description: "自作PCのパーツ構成を紹介するページです。(AI生成)" },
    { title: "自作PCパーツ紹介", url: "https://daihachi10.github.io/program/16/index.html", description: "自作PCのパーツ構成を紹介するページです。(AI生成)" },

    { title: "使用パーツ一覧(PDF)", url: "https://daihachi10.github.io/program/19/index.html", description: "使用しているPCパーツの一覧をPDFで確認できます。(AI生成)" },
    { title: "パーツリスト", url: "https://daihachi10.github.io/program/19/index.html", description: "使用しているPCパーツの一覧をPDFで確認できます。(AI生成)" },

    { title: "プログラム", url: "https://daihachi10.github.io/program.html", description: "作成したプログラムの一覧ページです。(AI生成)" },
    { title: "作品一覧", url: "https://daihachi10.github.io/program.html", description: "作成したプログラムの一覧ページです。(AI生成)" },

    { title: "インストール", url: "https://daihachi10.github.io/install.html", description: "このサイトのインストール方法を説明するページです。(AI生成)" },
    { title: "導入", url: "https://daihachi10.github.io/install.html", description: "このサイトのインストール方法を説明するページです。(AI生成)" },

    { title: "ホーム", url: "https://daihachi10.github.io/", description: "このサイトのトップページです。(AI生成)" },
    { title: "トップ", url: "https://daihachi10.github.io/", description: "このサイトのトップページです。(AI生成)" }

];
