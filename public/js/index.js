var socket = io();

function scrollToBottom() {
  var messages = jQuery('#messages');
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessage = messages.children('li:last-child');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessgaeHeight = newMessage.prev().innerHeight();//como estaba en lastchild me mueve a uno antes de lastchild
  
  if(clientHeight + scrollTop +  newMessageHeight + lastMessgaeHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
};


socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();//html devuelve el tag que contiene message-template
  var html = Mustache.render(template,{
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  }); 

  jQuery('#messages').append(html);
  scrollToBottom();
  
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    let messageText = jQuery('[name=message]')
    socket.emit('createMessage', {
        from: 'User',
        text: messageText.val()
    }, function(){
      messageText.val('');
    });
});

