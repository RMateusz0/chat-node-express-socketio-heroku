const socket = io();
socket.emit('new-user', 'client');

const messages = document.getElementById('messages');
messages.innerHTML += `<p><b>Specialist: </b>Hello! How can I help you?</p>`;

socket.on('message', (msg) => {
    
    messages.innerHTML += `<p><b>Specialist:</b> ${msg}</p>`;
});

window.addEventListener("keydown", (event) => {
  if (event.key === 'Enter') { sendMessage() }
})

function sendMessage() {
    const input = document.getElementById('input');
    const message = input.value;

    if (message.length === 0) {
      return;
  }

    messages.innerHTML += `<p><b>You: </b>${message}</p>`;
    input.value = '';

    socket.emit('message', message);



}