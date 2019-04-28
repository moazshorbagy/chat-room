// Make connection
var socket = io.connect('http://localhost:4000?token='+getCookie("token"));
const username = getCookie("username");

// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback')
      onlineUsers = document.getElementById('online-users');

// Emit events
btn.addEventListener('click', function(){
    if(message.value != "") {
        socket.emit('chat', {
            message: message.value,
            handle: username
        });
        message.value = "";
    }
});

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
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});


socket.on('userOnline', function(data){
    onlineUsers.innerHTML += '<p class="w3-bar-item w3-button">'+ data + '</p>';
});

socket.on('userOffline', function(data){
    var parent = document.getElementById('online-users');
    var child = getElementByInnerText(data);
    parent.removeChild(child);
});


/**
    * 
    *
    * @param  JS
*/
socket.on('onlineUsers', function(onlineUsersArr){
    console.log("hi");
    onlineUsersArr.forEach(element => {
        onlineUsers.innerHTML += '<p class="w3-bar-item w3-button">'+ element + '</p>';
   });
});



/**
    * Gets the value of a cookie specifiec by name
    *
    * @param  {cname} name of the cookie
*/
function getCookie (cname) {
    return "hi";
    var name = "";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


/**
    * Returns the DOM element specified by the inner text
    *
    * @param  {text} inner text of the element
*/
function getElementByInnerText(text){
    var xpath = "//a[text()='"+text+"']";
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }
