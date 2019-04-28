// Make connection
var socket = io.connect('https://daaffec8.ngrok.io/');

// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');

// Emit events
btn.addEventListener('click', function(){
    if(message.value != "") {
        socket.emit('chat', {
            message: message.value,
            handle: handle.value
        });
        message.value = "";
    }
});

message.addEventListener('keypress', function(e) {
    if(e.keyCode == 13) {
        btn.click();
    } else {
        socket.emit('typing', handle.value);
    } 
});

// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
