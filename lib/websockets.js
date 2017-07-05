const path = require('path');
const models = require(path.join(__dirname,'..','models/index'));
const User = models.User;

module.exports = (server) => {

    // Create a socket instance
    var wsIo = require('socket.io')(server);

    // Set up events
    wsIo.on('connection', (socket) => {
        
        // Handle an incoming status change
        socket.on('statusChange', function (data) {
          
          User.update(
                {status: data.status},
                {where: {id: data.id}}
            ).then(() => {
                socket.broadcast.emit('statusChange', data);
            });

        });

    });

    setInterval(() => {

        const now = new Date();
        let d = now.getDate();
        let h = now.getHours();
        let m = now.getMinutes();
        let s = now.getSeconds();
        m = padTime(m);
        s = padTime(s);
    
        const payload = {time: h + ":" + m + ":" + s, date: d}

        wsIo.sockets.emit('time', payload);

    }, 500)
    
    function padTime(i) {
        if (i < 10) {
            i = "0" + i
        };
        return i;
    }

}
