
// Make connection
var socket = io.connect('http://localhost:1234/?token='+getCookie("token"));
//var socket = io.connect('https://6ed6db0b.ngrok.io/?token='+getCookie("token"));
const username = getCookie("userName");


// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback')
      onlineUsers = document.getElementById('online-users'),
      windowChat = document.getElementById('chat-window'),
      usernamelabel = document.getElementById('usernameuser');

usernamelabel.innerHTML = username;
     

// Emit chat event with the message
btn.addEventListener('click', function(){
    if(message.value != "") {
        socket.emit('chat', {
            message: message.value,
            handle: username
        });
        message.value = "";
    }
});

// Emit to the server typing event
message.addEventListener('keypress', function(e) {
    
    if(e.keyCode == 13) {
        btn.click();
    } else {
        socket.emit('typing', username);
    } 
});

// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong >' + data.handle + ': </strong>' + data.message + '</p>';
    // Slide to end
    windowChat.scrollTop = windowChat.scrollHeight;
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
    // Slide to end
    windowChat.scrollTop = windowChat.scrollHeight;
});


socket.on('userOnline', function(data){
    onlineUsers.innerHTML += '<p class="w3-bar-item w3-button" name="'+data+'">'+ data + '</p>';
});

socket.on('userOffline', function(data){
    console.log(data);
    var parent = document.getElementById('online-users'); 
    console.log(parent);
    var child = document.getElementsByName(data)[0];
    parent.removeChild(child);
});


/**
    * 
    *
    * @param  JS
*/
socket.on('onlineUsers', function(onlineUsersArr){
    console.log(onlineUsersArr[0]);
    for (let i = 0; i < onlineUsersArr.length; i++) {
        
        onlineUsers.innerHTML += '<p class="w3-bar-item w3-button" name="'+onlineUsersArr[i]+'">'+ onlineUsersArr[i] + '</p>';
        
    }
});


/**
    * 
    *
    * @param  JS
*/
socket.on('prevChat', function(messages){
    console.log(messages);

    const data = JSON.parse(messages);
    data.forEach(element => {
        output.innerHTML += '<p><strong >' + element.userName + ': </strong>' + element.message + '</p>';
    
    });
    // Slide to end
    windowChat.scrollTop = windowChat.scrollHeight;
});



/**
    * Gets the value of a cookie specifiec by name
    *
    * @param  {cname} name of the cookie
*/
function getCookie (cname) {
    
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(cname) == 0) {
          
        return c.substring(cname.length+1, c.length);
      }
    }
    return "";
  }


