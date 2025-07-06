// DOM Elements
const body = document.body;
const wordsContainer = document.getElementById("words-container");
const hiddenInput = document.getElementById("hidden-input");
const statsEl = document.getElementById("stats");
const timerEl = document.getElementById("timer");
const wpmEl = document.getElementById("wpm");
const resultsEl = document.getElementById("results");
const resultWpmEl = document.getElementById("result-wpm");
const resultAccuracyEl = document.getElementById("result-accuracy");
const themeSelect = document.getElementById("theme-select");
const footerEl = document.getElementById("footer");
const zenButton = document.getElementById("zen-button");

// Word List
const wordList = [
  "the",
  "be",
  "to",
  "of",
  "and",
  "a",
  "in",
  "that",
  "have",
  "I",
  "it",
  "for",
  "not",
  "on",
  "with",
  "he",
  "as",
  "you",
  "do",
  "at",
  "this",
  "but",
  "his",
  "by",
  "from",
  "they",
  "we",
  "say",
  "her",
  "she",
  "or",
  "an",
  "will",
  "my",
  "one",
  "all",
  "would",
  "there",
  "their",
  "what",
  "so",
  "up",
  "out",
  "if",
  "about",
  "who",
  "get",
  "which",
  "go",
  "me",
  "when",
  "make",
  "can",
  "like",
  "time",
  "no",
  "just",
  "him",
  "know",
  "take",
  "people",
  "into",
  "year",
  "your",
  "good",
  "some",
  "could",
  "them",
  "see",
  "other",
  "than",
  "then",
  "now",
  "look",
  "only",
  "come",
  "its",
  "over",
  "think",
  "also",
  "back",
  "after",
  "use",
  "two",
  "how",
  "our",
  "work",
  "first",
  "well",
  "way",
  "even",
  "new",
  "want",
  "because",
  "any",
  "these",
  "give",
  "day",
  "most",
  "us",
];

// State
let words = [];
let wordIndex = 0;
let letterIndex = 0;
let startTime;
let timerInterval;
let errors = 0;
let totalTyped = 0;
let gameActive = false;
let isZenMode = false;
const testDuration = 30;
let remainingTime = testDuration;

// --- Initialization ---
function initializeTest() {
  gameActive = false;
  body.classList.remove("typing");

  wordIndex = 0;
  letterIndex = 0;
  errors = 0;
  totalTyped = 0;

  resultsEl.classList.add("hidden");
  wordsContainer.classList.remove("hidden");
  footerEl.classList.remove("hidden");

  clearInterval(timerInterval);

  if (!isZenMode) {
    statsEl.classList.add("hidden");
    remainingTime = testDuration;
    timerEl.textContent = remainingTime;
  }

  words = [];
  wordsContainer.innerHTML = "";
  wordsContainer.scrollTop = 0;

  addMoreWords(300);

  updateCursor();
  hiddenInput.value = "";
  hiddenInput.focus();
  wordsContainer.classList.remove("unfocused");
}

function addMoreWords(count) {
  for (let i = 0; i < count; i++) {
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    words.push(word);

    const wordEl = document.createElement("div");
    wordEl.className = "word";
    word.split("").forEach((char) => {
      const letterEl = document.createElement("span");
      letterEl.className = "letter";
      letterEl.textContent = char;
      wordEl.appendChild(letterEl);
    });
    wordsContainer.appendChild(wordEl);
  }
}

// --- Cursor and Input Handling ---
function updateCursor() {
  document
    .querySelectorAll(".letter.active")
    .forEach((el) => el.classList.remove("active"));
  if (wordIndex < words.length && letterIndex >= 0) {
    const wordEl = wordsContainer.children[wordIndex];
    const letterEl = wordEl.children[letterIndex];
    if (letterEl) {
      letterEl.classList.add("active");
    } else {
      const lastLetter = wordEl.children[letterIndex - 1];
      if (lastLetter) {
        lastLetter.classList.add("active");
      }
    }
  }
}

hiddenInput.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    initializeTest();
    return;
  }

  if (!gameActive && e.key.length === 1 && e.key !== " ") {
    startGame();
  }
  if (!gameActive || !resultsEl.classList.contains("hidden")) return;

  if (e.key === "Backspace") {
    e.preventDefault();
    handleBackspace();
  } else if (e.key === " ") {
    e.preventDefault();
    handleSpace();
  } else if (e.key.length === 1 && e.key.match(/^[a-zA-Z]$/)) {
    const currentLetterEl =
      wordsContainer.children[wordIndex]?.children[letterIndex];
    handleCharacter(e.key, currentLetterEl);
  }
  updateCursor();
});

function handleBackspace() {
  if (letterIndex > 0) {
    letterIndex--;
    const letterEl = wordsContainer.children[wordIndex].children[letterIndex];
    letterEl.classList.remove("correct", "incorrect");
  } else if (wordIndex > 0) {
    wordIndex--;
    letterIndex = words[wordIndex].length;
    wordsContainer.children[wordIndex].classList.remove("incorrect-space");
  }
}

function handleSpace() {
  if (letterIndex === 0) return;

  if (letterIndex < words[wordIndex].length) {
    wordsContainer.children[wordIndex].classList.add("incorrect-space");
    errors += words[wordIndex].length - letterIndex;
  }

  wordIndex++;
  letterIndex = 0;

  if (isZenMode && wordIndex > words.length - 50) {
    addMoreWords(100);
  }

  checkScroll();
}

function handleCharacter(key, letterEl) {
  if (!letterEl) return;

  totalTyped++;
  if (key === letterEl.textContent) {
    letterEl.classList.add("correct");
  } else {
    letterEl.classList.add("incorrect");
    errors++;
  }
  letterIndex++;
}

// --- Game Logic ---
function startGame() {
  gameActive = true;
  body.classList.add("typing");

  if (!isZenMode) {
    statsEl.classList.remove("hidden");
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
  }
}

function updateTimer() {
  remainingTime--;
  timerEl.textContent = remainingTime;

  const elapsedTime = (Date.now() - startTime) / 1000 / 60;
  if (elapsedTime > 0) {
    const grossWPM = totalTyped / 5 / elapsedTime;
    wpmEl.textContent = `wpm ${Math.round(grossWPM) || 0}`;
  }

  if (remainingTime <= 0) {
    endGame();
  }
}

function endGame() {
  if (isZenMode) return;

  gameActive = false;
  clearInterval(timerInterval);
  hiddenInput.blur();

  statsEl.classList.add("hidden");
  wordsContainer.classList.add("hidden");
  resultsEl.classList.remove("hidden");
  footerEl.classList.add("hidden");

  const elapsedTimeInMinutes = testDuration / 60;
  const grossWPM = totalTyped / 5 / elapsedTimeInMinutes;
  const accuracy =
    totalTyped > 0 ? ((totalTyped - errors) / totalTyped) * 100 : 0;

  resultWpmEl.textContent = Math.round(grossWPM) || 0;
  resultAccuracyEl.textContent = `${accuracy.toFixed(1)}%`;
}

// --- Utilities & Settings ---
function checkScroll() {
  const activeWordEl = wordsContainer.children[wordIndex];
  if (!activeWordEl) return;

  const wordRect = activeWordEl.getBoundingClientRect();
  const containerRect = wordsContainer.getBoundingClientRect();

  if (wordRect.top > containerRect.top + containerRect.height / 2) {
    wordsContainer.scrollTop += wordRect.height;
  }
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("typingTheme", theme);
  themeSelect.value = theme;
}

function toggleZenMode() {
  isZenMode = !isZenMode;
  zenButton.classList.toggle("active", isZenMode);
  body.dataset.mode = isZenMode ? "zen" : "time";
  initializeTest();
}

function loadSettings() {
  const savedTheme = localStorage.getItem("typingTheme") || "olivia";
  applyTheme(savedTheme);
}

// --- Event Listeners ---
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") initializeTest();
});
wordsContainer.addEventListener("click", () => hiddenInput.focus());
hiddenInput.addEventListener("blur", () =>
  wordsContainer.classList.add("unfocused")
);
hiddenInput.addEventListener("focus", () =>
  wordsContainer.classList.remove("unfocused")
);
themeSelect.addEventListener("change", (e) => {
  applyTheme(e.target.value);
  hiddenInput.focus();
});
zenButton.addEventListener("click", toggleZenMode);

// --- Initial Load ---
loadSettings();
initializeTest();
