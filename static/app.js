document.addEventListener('DOMContentLoaded', () => {
    // ---- View Switching ----
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update nav active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Hide all views, show target view
            const targetId = item.getAttribute('data-target');
            viewSections.forEach(section => {
                section.style.display = section.id === targetId ? 'flex' : 'none';
            });

            // If switching to drive view, refresh drive contents
            if (targetId === 'view-drive') {
                loadDriveFiles();
            }
        });
    });

    // ---- Chat Logic ----
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatHistory = document.getElementById('chat-history');
    const sendBtn = document.getElementById('send-btn');

    marked.setOptions({ breaks: true, gfm: true });

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;
        appendMessage('user', message, false);
        userInput.value = '';
        userInput.disabled = true;
        sendBtn.disabled = true;
        const loadingId = appendMessage('bot', '<div class="loading-dots"><span></span><span></span><span></span></div>', true);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            const loadingElem = document.getElementById(loadingId);
            if (loadingElem) loadingElem.remove();
            
            if (data.response) {
                appendMessage('bot', marked.parse(data.response), true);
            } else {
                appendMessage('bot', 'Error: No response.', false);
            }
        } catch (error) {
            const loadingElem = document.getElementById(loadingId);
            if (loadingElem) loadingElem.remove();
            appendMessage('bot', `Connection error: ${error.message}`, false);
        } finally {
            userInput.disabled = false;
            sendBtn.disabled = false;
            userInput.focus();
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    });

    let msgCounter = 0;
    function appendMessage(sender, content, isHtml = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        const id = `msg-${Date.now()}-${msgCounter++}`;
        messageDiv.id = id;
        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('message-bubble');
        if (isHtml) bubbleDiv.innerHTML = content;
        else bubbleDiv.textContent = content;
        messageDiv.appendChild(bubbleDiv);
        chatHistory.appendChild(messageDiv);
        return id;
    }

    // ---- Drive Logic ----
    async function loadDriveFiles() {
        const container = document.getElementById('drive-container');
        container.innerHTML = '<p style="padding: 20px;">Loading drive...</p>';
        try {
            const res = await fetch('/api/files');
            const data = await res.json();
            container.innerHTML = '';
            
            if (!data.files || data.files.length === 0) {
                container.innerHTML = '<p style="padding: 20px;">Drive is empty.</p>';
                return;
            }

            data.files.forEach(file => {
                const card = document.createElement('div');
                card.classList.add('drive-card');
                card.innerHTML = `
                    <div class="file-icon">📄</div>
                    <div class="file-name">${file.name}</div>
                `;
                card.addEventListener('click', () => {
                    document.getElementById('modal-title').textContent = file.name;
                    document.getElementById('modal-content').textContent = file.content;
                    document.getElementById('file-modal').style.display = 'flex';
                });
                container.appendChild(card);
            });
        } catch (err) {
            container.innerHTML = '<p style="padding: 20px; color: red;">Error loading files.</p>';
        }
    }

    // Modal Close
    const fileModal = document.getElementById('file-modal');
    document.getElementById('modal-close').addEventListener('click', () => {
        fileModal.style.display = 'none';
    });
    fileModal.addEventListener('click', (e) => {
        if (e.target === fileModal) fileModal.style.display = 'none';
    });

    // ---- Email Simulation & Reset ----
    document.getElementById('btn-save-attachment').addEventListener('click', async (e) => {
        const btn = e.target;
        btn.disabled = true;
        btn.textContent = 'Saving...';
        
        try {
            await fetch('/api/upload-payload', { method: 'POST' });
            btn.textContent = 'Saved to Corporate Drive!';
            btn.style.backgroundColor = 'var(--color-vibrant-violet)';
        } catch (err) {
            console.error(err);
            btn.textContent = 'Failed';
        }
    });

    document.getElementById('btn-reset').addEventListener('click', async (e) => {
        const btn = e.target;
        btn.disabled = true;
        btn.textContent = 'Resetting...';
        try {
            await fetch('/api/reset', { method: 'POST' });
            // reset email UI
            const saveBtn = document.getElementById('btn-save-attachment');
            saveBtn.textContent = 'Save to Corporate Drive';
            saveBtn.style.backgroundColor = '';
            saveBtn.disabled = false;
            
            // clear chat history visually except greeting
            chatHistory.innerHTML = `
                <div class="message bot">
                    <div class="message-bubble">
                        Hello! I am SecurePilot, your enterprise assistant. The demo has been completely reset. How can I help you?
                    </div>
                </div>
            `;
            
            btn.textContent = 'Demo Reset!';
            setTimeout(() => { btn.textContent = 'Reset Demo'; btn.disabled = false; }, 2000);
        } catch (err) {
            btn.textContent = 'Error';
            setTimeout(() => { btn.textContent = 'Reset Demo'; btn.disabled = false; }, 2000);
        }
    });
});
