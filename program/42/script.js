document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatBox = document.getElementById('chat-box');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const chatForm = document.getElementById('chat-form');
    
    const settingsBtn = document.getElementById('settings-btn'); // Now in sidebar footer
    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const apiKeyInput = document.getElementById('api-key-input');
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');

    // Sidebar Elements
    const sidebar = document.getElementById('sidebar');
    const newChatBtn = document.getElementById('new-chat-btn');
    const chatList = document.getElementById('chat-list');
    const currentChatTitle = document.getElementById('current-chat-title');

    // Theme Toggle (now inside settings modal)
    const themeToggleBtn = document.getElementById('theme-toggle-btn');

    // App state
    let apiKey = localStorage.getItem('google-ai-api-key');
    let chatSessions = JSON.parse(localStorage.getItem('chat-sessions')) || [];
    let currentChatId = localStorage.getItem('current-chat-id');
    let conversationHistory = [];
    let isTyping = false;
    let currentTheme = localStorage.getItem('theme') || 'light'; // Default to light

    // --- Initialization ---
    applyTheme(currentTheme);

    if (chatSessions.length === 0 || !currentChatId || !chatSessions.some(chat => chat.id === currentChatId)) {
        createNewChat('新しいチャット');
    } else {
        loadChat(currentChatId);
    }
    updateChatListUI();

    // --- Event Listeners ---

    // New Chat Button
    newChatBtn.addEventListener('click', () => {
        createNewChat('新しいチャット');
    });

    // Chat List Click (for loading existing chats or deleting)
    chatList.addEventListener('click', (event) => {
        const clickedItem = event.target.closest('li');
        if (!clickedItem) return;

        const chatId = clickedItem.dataset.chatId;

        if (event.target.classList.contains('delete-chat-btn')) {
            // Delete chat
            if (confirm('このチャットを本当に削除しますか？')) {
                deleteChat(chatId);
            }
        } else {
            // Load chat
            loadChat(chatId);
        }
    });

    // Settings Modal
    settingsBtn.addEventListener('click', () => {
        if(isTyping) return;
        apiKeyInput.value = apiKey || '';
        settingsModal.style.display = 'flex';
    });
    closeModalBtn.addEventListener('click', () => settingsModal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target === settingsModal) settingsModal.style.display = 'none';
    });

    // Save API Key
    saveApiKeyBtn.addEventListener('click', () => {
        const newApiKey = apiKeyInput.value.trim();
        if (newApiKey) {
            apiKey = newApiKey;
            localStorage.setItem('google-ai-api-key', apiKey);
            settingsModal.style.display = 'none';
            addMessage('ai', 'APIキーを保存しました。');
        }
    });

    // Theme Toggle (now inside settings modal)
    themeToggleBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });

    // Send Message
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSendMessage();
    });
    
    sendBtn.addEventListener('click', handleSendMessage);

    // Enter to send, Shift+Enter for newline
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Shift+Enter: Newline
                // Allow default behavior (insert newline)
            } else {
                // Enter: Send message
                e.preventDefault(); // Prevent default newline
                handleSendMessage();
            }
        }
    });

    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = `${messageInput.scrollHeight}px`;
    });

    // --- Theme Functions ---
    function applyTheme(theme) {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(`${theme}-mode`);
        themeToggleBtn.querySelector('.material-symbols-outlined').textContent = 
            theme === 'light' ? 'dark_mode' : 'light_mode';
    }

    // --- Chat Session Management Functions ---

    function generateUniqueId() {
        return 'chat-' + Date.now() + Math.random().toString(36).substr(2, 9);
    }

    function saveChatSessions() {
        localStorage.setItem('chat-sessions', JSON.stringify(chatSessions));
        localStorage.setItem('current-chat-id', currentChatId);
    }

    function createNewChat(title) {
        // Save current chat before creating a new one
        if (currentChatId) {
            const currentChat = chatSessions.find(chat => chat.id === currentChatId);
            if (currentChat) {
                currentChat.history = conversationHistory;
                // Update title if it's still default and history exists
                if (currentChat.title === '新しいチャット' && conversationHistory.length > 0) {
                    currentChat.title = conversationHistory[0].parts[0].text.substring(0, 30) + '...';
                }
            }
        }

        const newChat = {
            id: generateUniqueId(),
            title: title,
            history: []
        };
        chatSessions.push(newChat);
        currentChatId = newChat.id;
        conversationHistory = [];
        chatBox.innerHTML = '';
        addMessage('ai', '新しいチャットを開始しました。');
        saveChatSessions();
        updateChatListUI();
        currentChatTitle.textContent = newChat.title;
    }

    function loadChat(chatId) {
        // Save current chat before loading another
        if (currentChatId) {
            const currentChat = chatSessions.find(chat => chat.id === currentChatId);
            if (currentChat) {
                currentChat.history = conversationHistory;
                // Update title if it's still default and history exists
                if (currentChat.title === '新しいチャット' && conversationHistory.length > 0) {
                    currentChat.title = conversationHistory[0].parts[0].text.substring(0, 30) + '...';
                }
            }
        }

        const chatToLoad = chatSessions.find(chat => chat.id === chatId);
        if (chatToLoad) {
            currentChatId = chatToLoad.id;
            conversationHistory = chatToLoad.history;
            chatBox.innerHTML = '';
            conversationHistory.forEach(msg => {
                addMessage(msg.role, msg.parts[0].text);
            });
            saveChatSessions();
            updateChatListUI();
            currentChatTitle.textContent = chatToLoad.title;
        }
    }

    function deleteChat(chatId) {
        chatSessions = chatSessions.filter(chat => chat.id !== chatId);
        if (currentChatId === chatId) {
            // If current chat is deleted, create a new one
            createNewChat('新しいチャット');
        }
        saveChatSessions();
        updateChatListUI();
    }

    function updateChatListUI() {
        chatList.innerHTML = '';
        chatSessions.forEach(chat => {
            const listItem = document.createElement('li');
            listItem.dataset.chatId = chat.id;
            listItem.textContent = chat.title;
            if (chat.id === currentChatId) {
                listItem.classList.add('active');
            }
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-chat-btn');
            deleteBtn.innerHTML = '<span class="material-symbols-outlined">delete</span>';
            listItem.appendChild(deleteBtn);
            chatList.appendChild(listItem);
        });
    }

    // --- Core Chat Functions (modified to use current chat history) ---

    function handleSendMessage() {
        if(isTyping) return;
        const messageText = messageInput.value.trim();
        if (!messageText) return;

        if (!apiKey) {
            addMessage('ai', 'APIキーが設定されていません。右上の設定ボタンからAPIキーを設定してください。');
            return;
        }

        addMessage('user', messageText);
        conversationHistory.push({ role: 'user', parts: [{ text: messageText }] });
        
        // Update chat title if it's still default
        const currentChat = chatSessions.find(chat => chat.id === currentChatId);
        if (currentChat && currentChat.title === '新しいチャット') {
            currentChat.title = messageText.substring(0, 30) + (messageText.length > 30 ? '...' : '');
            currentChatTitle.textContent = currentChat.title;
            updateChatListUI();
        }
        saveChatSessions(); // Save after user message
        
        messageInput.value = '';
        messageInput.style.height = 'auto';
        
        fetchAiResponse();
    }

    function parseMarkdown(text) {
        // Escape basic HTML to prevent injection
        let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // Headings (# ...)
        html = html.replace(/^(#+)\s+(.*)/gm, (match, hashes, content) => {
            const level = hashes.length;
            return `<h${level}>${content}</h${level}>`;
        });

        // Code blocks (```...```)
        html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
            // Add a copy button to the pre tag
            return `<pre><button class="copy-btn icon-btn" data-code="${encodeURIComponent(code.trim())}"><span class="material-symbols-outlined">content_copy</span></button><code>${code.trim()}</code></pre>`;
        });

        // Inline code (`...`)
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Bold (**...**)
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Newlines to <br> (but not after heading or pre tags)
        html = html.replace(/\n/g, '<br>');
        html = html.replace(/<\/(h[1-6]|pre)><br>/g, '<\/$1>');

        return html;
    }

    function addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        
        const textElement = document.createElement('p');
        textElement.classList.add('text');
        
        if (sender === 'ai') {
            textElement.innerHTML = parseMarkdown(text);
        } else {
            textElement.textContent = text;
        }
        
        messageElement.appendChild(textElement);
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.classList.add('message', 'ai-message', 'typing-indicator');
        typingElement.innerHTML = `
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        `;
        typingElement.id = 'typing-indicator';
        chatBox.appendChild(typingElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    function addAnimatedMessage(sender, text) {
        return new Promise(resolve => {
            isTyping = true;
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', `${sender}-message`);
            
            const textElement = document.createElement('p');
            textElement.classList.add('text');
            
            messageElement.appendChild(textElement);
            chatBox.appendChild(messageElement);
            chatBox.scrollTop = chatBox.scrollHeight;

            let i = 0;
            const plainText = text; // Keep original plain text for typing
            
            const intervalId = setInterval(() => {
                textElement.textContent += plainText.charAt(i);
                chatBox.scrollTop = chatBox.scrollHeight;
                i++;
                if (i >= plainText.length) {
                    clearInterval(intervalId);
                    // Once typing is done, parse and render the final HTML
                    textElement.innerHTML = parseMarkdown(plainText);
                    isTyping = false;
                    resolve();
                }
            }, 30);
        });
    }

    async function fetchAiResponse() {
        showTypingIndicator();

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: conversationHistory
                }),
            });

            removeTypingIndicator();

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                addMessage('ai', `エラーが発生しました: ${errorData.error.message}`);
                conversationHistory.pop();
                saveChatSessions(); // Save after error
                return;
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates.length > 0) {
                const aiText = data.candidates[0].content.parts[0].text;
                await addAnimatedMessage('ai', aiText);
                conversationHistory.push({ role: 'model', parts: [{ text: aiText }] });
                saveChatSessions(); // Save after AI message
            } else {
                 addMessage('ai', '有効な応答をAIから受信できませんでした。');
                 conversationHistory.pop();
                 saveChatSessions(); // Save after error
            }

        } catch (error) {
            removeTypingIndicator();
            console.error('Fetch Error:', error);
            addMessage('ai', 'ネットワークエラーまたはリクエストの送信中に問題が発生しました。');
            conversationHistory.pop();
            saveChatSessions(); // Save after error
        }
    }
});