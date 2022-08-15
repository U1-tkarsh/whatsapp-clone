const socket = io('http://localhost:8000');

//Get DOM elements in respective 2s variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');

const messageContainer = document.querySelector(".container");

//Audio that will play on recieving messages
var audio = new Audio('/javascript/chatApp/audio/Ting.mp3')


//function which will append event into the container
const append =(message, position)=>{
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

//Ask new user for his name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

//if the new user joins, receive his name from the server
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'right');
})
 
//if server send the message, receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left');
})

//if a user leaves the chat. append the info into the container
socket.on('left', name =>{
    append(`${name}: left the chat`, 'left');
})

//if the form gets submitted, send server the message
form.addEventListener('submit',(e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})