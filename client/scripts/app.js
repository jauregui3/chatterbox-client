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
  app.$roomSelect.on('change', app.handleRoomChange);

  setInterval(function() {
    app.fetch();
  }, 3000);
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
      app.fetch();
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

      app.messages = data.results;

      var mostRecentMessage = data.results[data.results.length - 1];

      if (mostRecentMessage.objectId !== app.lastMessageId) {
        app.renderRoomList(data.results);
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
      return message.roomname === app.roomname || app.roomname === 'lobby' && !message.roomname;
    }).forEach(app.renderMessage);
  }
};

app.clearMessages = function() {
  app.$chats.html('');
};

app.renderRoom = function(room) {
  var $option = $('<option/>').val(room).text(room);
  app.$roomSelect.append($option);
};

app.renderRoomList = function(messages) {
  app.$roomSelect.html('<option value="__newRoom">New room...</option>');

  if (messages) {
    var rooms = {};
    messages.forEach(function(message) {
      var roomname = message.roomname;
      if (roomname && !rooms[roomname]) {
        app.renderRoom(roomname);
        rooms[roomname] = true;
      }
    });
  }
  app.$roomSelect.val(app.roomname);
};

app.handleRoomChange = function(event) {
  var selectIndex = app.$roomSelect.prop('selectedIndex');

  if (selectIndex === 0) {
    var roomname = prompt('Enter room name please');
    if (roomname) {
      app.roomname = roomname;
      app.renderRoom(roomname);
      app.$roomSelect.val(roomname);
    }
  } else {
    app.roomname = app.$roomSelect.val();
  }
  app.renderMessages(app.messages);
};

app.handleUsernameClick = function(event) {
  var username = $(event.target).data('username');

  if (username !== undefined) {
    app.friends[username] = !app.friends[username];

    var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';

    var $usernames = $(selector).toggleClass('friend');
  }
};

app.handleSubmit = function() {
  var message = {};

  var form = document.querySelector('form');

  form.addEventListener('submit', function(event) {
    message.roomname = app.roomname || 'lobby';
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