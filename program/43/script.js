document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const apiKeyInput = document.getElementById('apiKey');
    const promptInput = document.getElementById('prompt');
    const geminiBtn = document.getElementById('geminiBtn');
    const geminiStatus = document.getElementById('geminiStatus');
    
    const inputText = document.getElementById('inputText');
    const generateBtn = document.getElementById('generateBtn');
    const outputText = document.getElementById('outputText');
    const probabilityOutput = document.getElementById('probabilityOutput');

    // --- Event Listeners ---

    // Gemini API Button
    geminiBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        const prompt = promptInput.value.trim();

        if (!apiKey || !prompt) {
            geminiStatus.textContent = 'APIキーとプロンプトの両方を入力してください。';
            geminiStatus.style.color = 'red';
            return;
        }

        geminiStatus.textContent = 'Geminiに問い合わせ中...';
        geminiStatus.style.color = '#333';

        fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { 
                    throw new Error(err.error ? err.error.message : 'APIからエラーが返されました'); 
                });
            }
            return response.json();
        })
        .then(data => {
            const generatedText = data.candidates[0].content.parts[0].text;
            inputText.value = generatedText;
            geminiStatus.textContent = '文章の取得に成功しました！ Step 2 に進んでください。';
            geminiStatus.style.color = 'green';
        })
        .catch(error => {
            console.error('Gemini API Error:', error);
            geminiStatus.textContent = `エラー: ${error.message}`;
            geminiStatus.style.color = 'red';
        });
    });

    // Markov Chain Button
    generateBtn.addEventListener('click', () => {
        const text = inputText.value.trim();
        if (text === '') {
            outputText.textContent = 'テキストを入力してください。';
            probabilityOutput.innerHTML = '';
            return;
        }

        const tokens = text.replace(/[\s　]+/g, ' ').split(' ').filter(Boolean);
        if (tokens.length < 3) {
            outputText.textContent = '文章が短すぎます。少なくとも3単語以上入力してください。';
            probabilityOutput.innerHTML = '';
            return;
        }

        const markovChain = buildMarkovChain(tokens);

        const generatedText = generateMarkovText(markovChain);
        outputText.textContent = generatedText;

        displayProbabilities(markovChain);
    });

    // --- Markov Chain Functions (Updated to Trigram Model) ---

    function buildMarkovChain(tokens) {
        const chain = {};
        for (let i = 0; i < tokens.length - 2; i++) {
            const prefix = tokens[i] + ' ' + tokens[i + 1];
            const suffix = tokens[i + 2];
            if (!chain[prefix]) {
                chain[prefix] = [];
            }
            chain[prefix].push(suffix);
        }
        return chain;
    }

    function generateMarkovText(markovChain) {
        const prefixes = Object.keys(markovChain);
        if (prefixes.length === 0) {
            return '文章を生成できませんでした。もっと長い文章を試してください。';
        }

        let currentPrefix = getRandomElement(prefixes);
        let result = currentPrefix.split(' ');

        for (let i = 0; i < 100; i++) {
            const nextWords = markovChain[currentPrefix];
            if (!nextWords || nextWords.length === 0) {
                break;
            }
            const nextWord = getRandomElement(nextWords);
            result.push(nextWord);
            currentPrefix = result[result.length - 2] + ' ' + result[result.length - 1];
        }

        return result.join(' ');
    }

    function displayProbabilities(chain) {
        probabilityOutput.innerHTML = '';
        const list = document.createElement('ul');

        for (const prefix in chain) {
            const nextWords = chain[prefix];
            const total = nextWords.length;
            const counts = {};

            nextWords.forEach(nextWord => {
                counts[nextWord] = (counts[nextWord] || 0) + 1;
            });

            const listItem = document.createElement('li');
            let probabilityText = `<strong>「${prefix}」</strong> の次: `;
            
            const probabilities = Object.keys(counts).map(nextWord => {
                const percentage = ((counts[nextWord] / total) * 100).toFixed(1);
                return `「${nextWord}」(${percentage}%)`;
            }).join(', ');

            listItem.innerHTML = probabilityText + probabilities;
            list.appendChild(listItem);
        }
        probabilityOutput.appendChild(list);
    }

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
});
