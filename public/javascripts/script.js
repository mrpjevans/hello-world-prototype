var socket;

function startSocket() {
  
  socket = io.connect(); 
  
  socket.on('statusChange', function(data) {
    $('span[data-userid=' + data.id + ']').html(data.status);
  });

  socket.on('time', function(data) {
    $('.mypanel-clock').html(data.time);
    $('.mypanel-date').html(data.date);
  })

}
function initSetStatus(id) {
    $('li.set-status a').on('click', function(e) {
        var newStatus = $(e.target).html();
        $('#myStatus').html(newStatus);
        var payload = {'id': id, 'status': newStatus};
        socket.emit('statusChange', payload);
    });
}

function getWeather() {
    $.getJSON('/weather', function(data) {
        $('.mypanel-weather').html('<img src="' + data.current_observation.icon_url + '"><p>' + data.current_observation.weather + '</p><p>' + data.current_observation.temperature_string + '</p>');
    });
}
