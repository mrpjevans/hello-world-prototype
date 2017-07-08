var socket;

// Open up 
function startSocket() {
  
    socket = io.connect(); 
  
    // On receiving a status change message, update the relevant user's status
    socket.on('statusChange', (data) => {
        $('span[data-userid=' + data.id + ']').html(data.status);
    });

    // On receiving a time broadcast, update the clock and date
    socket.on('time', (data) => {
        $('.mypanel-clock').html(data.time);
        $('.date-date').html(data.date);
        $('.date-month').html(data.month);
    });

}

// Attach a click event to the user's status panel
function initSetStatus(id) {
    $('li.set-status a').on('click', (e) => {
        // Get the newly selected status and update my panel
        const newStatus = $(e.target).html();
        $('#myStatus').html(newStatus);
        // Emit the new status to the server
        var payload = {'id': id, 'status': newStatus};
        socket.emit('statusChange', payload);
    });
}

// Call our weather resource and update the weather panel
function getWeather() {
    $.getJSON('/weather', (data) => {
        $('.mypanel-weather').html(`<img src="${data.current_observation.icon_url}"><p>${data.current_observation.weather}</p><p>${data.current_observation.temperature_string}</p>`);
    });
}
