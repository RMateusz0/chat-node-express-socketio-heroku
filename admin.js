const socket = io();
socket.emit('new-user', 'admin');

socket.on('message', (data) => {
    createOrUpdateChatWindow(data.socketId, data.msg, false);
});

socket.on('user-disconnected', (socketId) => {
    const chatWindow = document.getElementById(`chat-${socketId}`);
    if (chatWindow) {
        const messages = chatWindow.querySelector('.messages');
        messages.innerHTML += '<p><em>User has disconnected.</em></p>';
        disableChatControls(socketId);
        addRemoveButton(chatWindow);
    }
});

function sendMessage(socketId) {
    const input = document.getElementById(`input-${socketId}`);
    const message = input.value.trim();

    if (message.length === 0) {
        return;
    }

    input.value = '';

    socket.emit('message', { msg: message, socketId: socketId });
    createOrUpdateChatWindow(socketId, message, true);
}

function createOrUpdateChatWindow(socketId, msg, isAdmin) {
    let chatWindow = document.getElementById(`chat-${socketId}`);
    if (!chatWindow) {
        chatWindow = createChatWindow(socketId);
    }

    const messages = chatWindow.querySelector('.messages');
    messages.innerHTML += `<p>${isAdmin ? '<b>Specialist:</b> ' : '<b>Client:</b> '}${msg}</p>`;
    // socketId
}

function createChatWindow(socketId) {
    const chatWindows = document.getElementById('chatWindows');
    
    const chatWindow = document.createElement('div');
    chatWindow.id = `chat-${socketId}`;
    chatWindow.classList.add('chat-window');

    const messages = document.createElement('div');
    messages.classList.add('messages');
    chatWindow.appendChild(messages);

    const input = document.createElement('textarea');
    input.id = `input-${socketId}`;
    input.rows = '10';
    input.placeholder = 'Wpisz wiadomość...';
    chatWindow.appendChild(input);



    const button = document.createElement('button');
    button.innerText = 'Send';
    button.onclick = () => sendMessage(socketId);

    window.addEventListener("keydown", (event) => {
        if (event.key === 'Enter') { sendMessage(socketId) }
    })

    chatWindow.appendChild(button);



    chatWindows.appendChild(chatWindow);

    messages.innerHTML += `<p><b>Specialist: </b>Hello! How can I help you?</p>`;

    return chatWindow;
}

function disableChatControls(socketId) {
    const input = document.getElementById(`input-${socketId}`);
    input.disabled = true;
    
    const button = document.querySelector(`#chat-${socketId} button`);
    button.disabled = true;
}

function addRemoveButton(chatWindow) {
    const removeButton = document.createElement('button');
    removeButton.innerText = 'Delete chat';
    removeButton.onclick = () => chatWindow.remove();
    chatWindow.appendChild(removeButton);
}

