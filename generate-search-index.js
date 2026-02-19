/**
 * generate-search-index.js
 *
 * program/ ディレクトリ内の全 index.html をスキャンし、
 * search/text.js を自動生成するスクリプト。
 *
 * 各ページに <meta name="search-tags" content="タグ1, タグ2, ..."> を追加すると
 * 検索タグとして自動的に取り込まれます（ユーザーには表示されません）。
 *
 * 使い方: node generate-search-index.js
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = __dirname;
const PROGRAM_DIR = path.join(ROOT_DIR, "program");
const OUTPUT_FILE = path.join(ROOT_DIR, "search", "text.js");
const IMAGES_DIR = path.join(ROOT_DIR, "images", "program-img");
const BASE_URL = "https://daihachi10.github.io";

// ジェネリックなタイトル（スキップ対象）
const GENERIC_TITLES = [
  "program | daihachi official website",
  "redirecting...",
  "daihachi official website",
  "",
];

// ========== HTML パース用ヘルパー ==========

function extractTag(html, tag) {
  // <tag>...</tag> の中身を取得（最初のマッチ）
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = html.match(regex);
  return match ? match[1].trim() : "";
}

function extractMetaContent(html, name) {
  // <meta name="xxx" content="yyy"> の content を取得
  const regex = new RegExp(
    `<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["']`,
    "i",
  );
  const match = html.match(regex);
  if (match) return match[1].trim();

  // content が先に来るパターン
  const regex2 = new RegExp(
    `<meta\\s+content=["']([^"']*)["']\\s+name=["']${name}["']`,
    "i",
  );
  const match2 = html.match(regex2);
  return match2 ? match2[1].trim() : "";
}

function extractSearchTags(html) {
  // <meta name="search-tags" content="タグ1, タグ2, ..."> を取得
  const tags = extractMetaContent(html, "search-tags");
  return tags
    ? tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
}

function extractH1(html) {
  const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!match) return "";
  // HTMLタグを除去してテキストだけ取得
  return match[1].replace(/<[^>]+>/g, "").trim();
}

function extractFirstP(html) {
  // <main> 内の最初の <p> を探す、なければ body 内の最初の <p>
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const searchArea = mainMatch ? mainMatch[1] : html;

  const pMatch = searchArea.match(
    /<p[^>]*class=["']item-text["'][^>]*>([\s\S]*?)<\/p>/i,
  );
  if (pMatch) {
    return pMatch[1]
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // 通常の <p> タグ
  const pMatch2 = searchArea.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (pMatch2) {
    const text = pMatch2[1]
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length > 5) return text;
  }

  return "";
}

function extractBodyText(html) {
  // body内のすべてのテキストを抽出（検索用）
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return "";
  return bodyMatch[1]
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(text) {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ========== 画像検索 ==========

function findImage(programNum) {
  const num = programNum.replace(/^0+/, "") || "0";
  const paddedNum = programNum;

  // 画像ファイルの候補リスト
  const candidates = [
    `img-item${paddedNum}.webp`,
    `img-item${num}.webp`,
    `img-item${paddedNum}-02.webp`,
    `img-item${num}-02.webp`,
    `img-item${paddedNum}-beta.webp`,
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(IMAGES_DIR, candidate))) {
      return `../images/program-img/${candidate}`;
    }
  }

  // デフォルト画像
  return "../images/program-img/img-item.webp";
}

// ========== プログラムページをスキャン ==========

function scanProgramPages() {
  const entries = [];
  const dirs = fs.readdirSync(PROGRAM_DIR);

  for (const dir of dirs) {
    const dirPath = path.join(PROGRAM_DIR, dir);

    // ディレクトリかチェック
    if (!fs.statSync(dirPath).isDirectory()) continue;
    // "common" や "load" はスキップ
    if (dir === "common" || dir === "load") continue;

    const indexPath = path.join(dirPath, "index.html");
    if (!fs.existsSync(indexPath)) continue;

    const html = fs.readFileSync(indexPath, "utf-8");

    // タイトルを取得
    let title = extractTag(html, "title");
    const h1 = extractH1(html);

    // ジェネリックなタイトルの場合は h1 を使う
    if (GENERIC_TITLES.includes(title.toLowerCase()) || !title) {
      title = h1 || `Program ${dir}`;
    }

    // リダイレクトページはスキップ
    if (
      title.toLowerCase() === "redirecting..." ||
      title.toLowerCase().includes("redirecting")
    ) {
      continue;
    }

    // メタディスクリプション取得
    let description = extractMetaContent(html, "description");
    if (
      !description ||
      description === "daihachiのプログラムがプレイができるサイトです。"
    ) {
      // メタディスクリプションがジェネリックなら、ページ内容から抽出
      description = extractFirstP(html);
    }
    if (!description) {
      description = `${title}のページです。`;
    }
    // HTMLタグを除去
    description = stripHtml(description);
    // 長すぎる場合は切り詰め
    if (description.length > 100) {
      description = description.substring(0, 100) + "...";
    }

    // 画像を検出
    const img = findImage(dir);

    // 検索タグを取得
    const tags = extractSearchTags(html);

    // URL
    const url = `${BASE_URL}/program/${dir}/index.html`;

    // 検索用テキストを収集（bodyのテキスト全体 + タグ）
    const bodyText = extractBodyText(html);
    const tagsText = tags.join(" ");
    const searchableText = [title, h1, description, tagsText, bodyText]
      .filter(Boolean)
      .join(" ");

    entries.push({
      title: title,
      h1: h1 || title,
      url: url,
      description: description,
      img: img,
      tags: tags,
      searchText: searchableText.substring(0, 500), // 検索用テキスト（最大500文字）
    });
  }

  return entries;
}

// ========== トップレベルページをスキャン ==========

function scanTopLevelPages() {
  const entries = [];

  const pages = [
    { file: "index.html", defaultTitle: "ホーム" },
    { file: "program.html", defaultTitle: "プログラム一覧" },
    { file: "install.html", defaultTitle: "インストール" },
    { file: "contact.html", defaultTitle: "お問い合わせ" },
    { file: "en.html", defaultTitle: "English" },
  ];

  for (const page of pages) {
    const filePath = path.join(ROOT_DIR, page.file);
    if (!fs.existsSync(filePath)) continue;

    const html = fs.readFileSync(filePath, "utf-8");
    let title = extractTag(html, "title");

    // タイトルを読みやすく加工
    if (title.includes("|")) {
      title = title.split("|")[0].trim();
    }
    if (!title || GENERIC_TITLES.includes(title.toLowerCase())) {
      title = page.defaultTitle;
    }

    let description = extractMetaContent(html, "description");
    if (!description) {
      description = `${page.defaultTitle}のページです。`;
    }
    description = stripHtml(description);

    entries.push({
      title: title,
      h1: page.defaultTitle,
      url: `${BASE_URL}/${page.file}`,
      description: description,
      img: "../images/program-img/img-item.webp",
      searchText: [title, page.defaultTitle, description].join(" "),
    });
  }

  // ルーレットページ
  const roulettePath = path.join(ROOT_DIR, "roulette", "index.html");
  if (fs.existsSync(roulettePath)) {
    const html = fs.readFileSync(roulettePath, "utf-8");
    let title = extractTag(html, "title") || "ルーレット";
    if (title.includes("|")) title = title.split("|")[0].trim();
    let description =
      extractMetaContent(html, "description") || "ルーレットアプリです。";

    entries.push({
      title: title,
      h1: "ルーレット",
      url: `${BASE_URL}/roulette/index.html`,
      description: stripHtml(description),
      img: "../images/program-img/img-item.webp",
      searchText: [title, "ルーレット", description].join(" "),
    });
  }

  // カレンダーページ
  const calendarPath = path.join(ROOT_DIR, "calendar", "index.html");
  if (fs.existsSync(calendarPath)) {
    const html = fs.readFileSync(calendarPath, "utf-8");
    let title = extractTag(html, "title") || "カレンダー";
    if (title.includes("|")) title = title.split("|")[0].trim();
    let description =
      extractMetaContent(html, "description") || "カレンダーアプリです。";

    entries.push({
      title: title,
      h1: "カレンダー",
      url: `${BASE_URL}/calendar/index.html`,
      description: stripHtml(description),
      img: "../images/program-img/img-item.webp",
      searchText: [title, "カレンダー", description].join(" "),
    });
  }

  return entries;
}

// ========== text.js を生成 ==========

function generateTextJs(entries) {
  let output = "const data = [\n";

  for (const entry of entries) {
    // searchText 内の特殊文字をエスケープ
    const safeSearchText = entry.searchText
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, " ")
      .replace(/\r/g, "");
    const safeDescription = entry.description
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, " ")
      .replace(/\r/g, "");
    const safeTitle = entry.title
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, " ")
      .replace(/\r/g, "");

    const safeTags = (entry.tags || [])
      .map((t) => t.replace(/\\/g, "\\\\").replace(/"/g, '\\"'))
      .map((t) => `"${t}"`);

    output += `  {\n`;
    output += `    title: "${safeTitle}",\n`;
    output += `    url: "${entry.url}",\n`;
    output += `    description: "${safeDescription}",\n`;
    output += `    img: "${entry.img}",\n`;
    if (safeTags.length > 0) {
      output += `    tags: [${safeTags.join(", ")}],\n`;
    }
    output += `    searchText: "${safeSearchText}",\n`;
    output += `  },\n`;
  }

  output += "];\n\n";

  // imagelist はそのまま保持
  output += `const imagelist = [\n`;
  for (let i = 1; i <= 11; i++) {
    const num = String(i).padStart(2, "0");
    output += `  "../images/usericons/${num}.webp",\n`;
  }
  output += `];\n`;

  return output;
}

// ========== メイン処理 ==========

function main() {
  console.log("🔍 検索インデックスを生成しています...\n");

  // プログラムページをスキャン
  const programEntries = scanProgramPages();
  console.log(`📁 program/ から ${programEntries.length} 件のページを検出`);

  // トップレベルページをスキャン
  const topLevelEntries = scanTopLevelPages();
  console.log(`📄 トップレベルページから ${topLevelEntries.length} 件を検出`);

  const allEntries = [...programEntries, ...topLevelEntries];

  // URL で重複排除
  const seenUrls = new Set();
  const uniqueEntries = [];
  for (const entry of allEntries) {
    if (!seenUrls.has(entry.url)) {
      seenUrls.add(entry.url);
      uniqueEntries.push(entry);
    }
  }

  console.log(`\n✅ 合計 ${uniqueEntries.length} 件（重複排除後）\n`);

  // text.js を生成
  const content = generateTextJs(uniqueEntries);
  fs.writeFileSync(OUTPUT_FILE, content, "utf-8");

  console.log(`📝 ${OUTPUT_FILE} を生成しました。\n`);

  // 各エントリのログ
  let tagsCount = 0;
  for (const entry of uniqueEntries) {
    const tagStr =
      entry.tags && entry.tags.length > 0 ? ` [${entry.tags.join(", ")}]` : "";
    if (entry.tags && entry.tags.length > 0) tagsCount++;
    console.log(`  • ${entry.title}${tagStr}  →  ${entry.url}`);
  }
  if (tagsCount > 0) {
    console.log(`\n🏷️  ${tagsCount} 件のページに検索タグが設定されています`);
  }

  console.log(`\n🎉 完了！`);
}

main();
