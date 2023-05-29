const socket = io('http://localhost:8000');

const form = document.getElementById('send_content');
const messageInput = document.getElementById('message_send');
const messageContainer = document.querySelector('.convo');
const btn=document.querySelector(".btn");

const append = (message, position) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

const name = prompt("Enter your name to join LetsChat");
socket.emit('new-user-joined', name);

socket.on('user-joined', name => {
  append(`${name} joined the chat`, 'left');
});

socket.on('receive', data => {
  append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
  append(`${name} left the chat`, 'left');
});

btn.addEventListener('click', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, 'right');
  socket.emit('send', message);
  messageInput.value = '';
});
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, 'right');
  socket.emit('send', message);
  messageInput.value = '';
});