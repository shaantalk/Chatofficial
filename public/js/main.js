const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages')
// Get username from url
const {username} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

// Join chat
socket.emit('joinRoom', {username});

// Message from other users ------------------------------------------------------------------------------------------------------
socket.on('message', message => {
    outputMessage(message)

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('alert','alert-dark','my-2','ml-2','mr-5')
    div.innerHTML = `<div class="row">
                        <div class="col"><span><strong>${message.username} </strong>at ${message.time}</span></div>
                    </div>
                    <p style="font-size: smaller;">${message.text}</p>`

    document.getElementById('chat-messages').appendChild(div);
}

// Events from server ------------------------------------------------------------------------------------------------------
socket.on('event', message => {
    outputEvent(message)

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Output message to DOM
function outputEvent(event) {
    const div = document.createElement('div')
    div.classList.add('alert','alert-danger','my-2','mr-2','ml-2')
    div.innerHTML = `<div class="row">
                        <div class="col"><p style="font-size: smaller;"><strong>Info : </strong>${event.text} at ${event.time}</p></div>
                    </div>`

    document.getElementById('chat-messages').appendChild(div);
}

// Events from server ------------------------------------------------------------------------------------------------------
socket.on('ownMessage', message => {
    outputOwnMessage(message)

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Output message to DOM
function outputOwnMessage(message) {
    const div = document.createElement('div')
    div.classList.add('alert','alert-success','my-2','mr-2','ml-5')
    div.innerHTML = `<div class="row">
                        <div class="col"><span><strong>${message.username} </strong>at ${message.time}</span></div>
                    </div>
                    <p style="font-size: smaller;">${message.text}</p>`

    document.getElementById('chat-messages').appendChild(div);
}

// Message submit ------------------------------------------------------------------------------------------------------
chatForm.addEventListener('submit', (e)=> {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emiting a message to the server
    socket.emit('chatMessage', msg)

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

})

