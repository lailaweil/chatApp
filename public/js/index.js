var socket = io();
socket.emit('renderRooms');

socket.on('updateRooms', function(rooms) {
  jQuery('.rooms').remove();
  
  if(jQuery.isEmptyObject(rooms)){
    $('#roomsSelect').prop( "disabled", true );
  }else{
    $('#roomsSelect').prop( "disabled", false );
  }
  rooms.forEach( (room) => {
    var template = jQuery('#rooms-template').html();
    var html = Mustache.render(template, {
      room: room
    });
    jQuery('#roomsSelect').append(html);
  });
});


