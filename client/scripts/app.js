var app = {};

app.server = 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages';


app.messages = [];

app.friends = [];

app.rooms = [];

app.init = function () {
  app.fetch();

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
        /*if (app.rooms.hasOwnProperty[message.roomname]){
         app.rooms[message.roomname].push(message);
        } else {
         app.rooms[message.roomname] = [];
         app.rooms[message.roomname].push(message);
        }*/
      });
    },
  });
};

app.prepend = function(text, username) {
  $('#chats').prepend(`<div class="messageWindow">${username}: ${text}</div>`);
};

$(document).ready(function() {




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