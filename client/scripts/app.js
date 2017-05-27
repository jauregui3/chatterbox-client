var app = {};

app.server = 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages';


app.messages = [];

app.friends = [];

app.rooms = [];

app.init = function () {
  app.fetch();
  app.handleSubmit();
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    // contentType: 'application/json',
    success: function(data) {
      data.results.forEach(function (message) {
        app.messages.push(message);
      });
    },
  });
};

app.renderMessage = function(text, username) {
  $('#chats').prepend(`<div class="messageWindow">${username}: ${text}</div>`);
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderRoom = function() {

};

app.handleUsernameClick = function() {

};

app.handleSubmit = function() {
  var message = {};

  var getQueryVariable = function(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] === variable){
        return pair[1];
      }
    }
    return false;
  };

  var form = document.querySelector("form");

  form.addEventListener("submit", function(event) {
    event.preventDefault();
    message.roomname = form.roomname.value;
    message.text = form.text.value;
    message.username = getQueryVariable('username');
    console.log(message);
    app.send(message);
    form.reset();

  });

};


$(document).ready(function() {

  app.init();

});

//Method to get messages from the server

//A way to refresh displayed messages

//Allow to users to select a name for themselves

//Allow users to send messages

//Allow users to create rooms and enter that room

//Display messages from a specific room

//Allow users to friend other users by clicking their user name

//Display all messages by friends sent in bold

//Add ability to clear all chat messages

/*  $("form").submit(function(){
    var text = $("form").getElementById('text');
    message = {
      username: newsearch,
      text: text,
      roomname: 'test'
    };
    console.log(message);*/