var app = {};

app.server = 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages';

app.username = 'anonymous';

app.roomname = 'lobby';

app.messages = [];

app.friends = {};

app.lastMessageId = 0;

app.init = function () {
  app.username = window.location.search.substr(10);

  app.$message = $('#message');
  app.$chats = $('#chats');
  app.$roomSelect = $('#roomSelect');
  app.$send = $('#send');

  app.$chats.on('click', '.username', app.handleUsernameClick);

  app.fetch();
  app.handleSubmit();

  /*setInterval(function(){
    app.fetch();
  }, 3000);*/
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
    contentType: 'application/json',
    data: {order: '-createdAt'},
    success: function(data) {
      if (!data.results || !data.results.length) {
        return;
      }

      var mostRecentMessage = data.results[data.results.length-1];

      if (mostRecentMessage.objectId !== app.lastMessageId) {
        app.renderMessages(data.results);
        app.lastMessageId = mostRecentMessage.objectId;
      }

    },
    error: function(error) {
      console.error('chatterbox: Failed to fetch messages', error);
    }
  });
};

app.renderMessage = function(message) {

  if (!message.roomname) {
    message.roomname = 'lobby';
  }

  var $chat = $('<div class="chat"/>');
  var $username = $('<span class="username"/>');

  $username.text(message.username + ': ').attr('data-roomname', message.roomname).attr('data-username', message.username).appendTo($chat);

  if (app.friends[message.username] === true) {
    $username.addClass('friend');
  }

  var $message = $('<br><span/>');
  $message.text(message.text).appendTo($chat);

  app.$chats.append($chat);
};

app.renderMessages = function(messages) {
  app.clearMessages();

  if (Array.isArray(messages)) {
    messages.filter(function(message) {
      return (message.roomname === app.roomname) || (app.roomname === 'lobby' && !message.roomname);
    }).forEach(app.renderMessage);
  }
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderRoom = function(room) {
//  var form = document.querySelector("form");
  var $option = $(`<option/>`).val(room).text(room);
  app.$roomSelect.append($option);
  //form.reset();
};

app.renderRoomList = function() {

};

app.handleUsernameClick = function() {

};

app.handleSubmit = function() {
  var message = {};

  var form = document.querySelector("form");

  form.addEventListener("submit", function(event) {
    message.roomname = form.roomname.value;
    message.text = form.text.value;
    message.username = app.username;
    app.send(message);
    form.reset();
    app.fetch();
    event.preventDefault();
  });

};


$(document).ready(function() {

  app.init();

});