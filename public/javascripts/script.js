function startClock() {

    const now = new Date();
    let d = now.getDate();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    m = padTime(m);
    s = padTime(s);
    
    $('.mypanel-clock').html(h + ":" + m + ":" + s);
    if($('.mypanel-date').html() != d) {
        $('.mypanel-date').html(d);
    }

    let t = setTimeout(startClock, 500);
}

function padTime(i) {
    if (i < 10) {
        i = "0" + i
    };
    return i;
}

function getWeather() {
    $.getJSON('/weather', function(data) {
        $('.mypanel-weather').html('<img src="' + data.current_observation.icon_url + '"><p>' + data.current_observation.weather + '</p><p>' + data.current_observation.temperature_string + '</p>');
    });
}