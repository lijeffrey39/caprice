const server = require('http').createServer();
const io = require('socket.io')(server);

var yo = [];

var total = 0;
var count = 0;

io.on('connection', client => {
    client.on('button press', data => { 
        dt = new Date();
        // console.log(data[0])
        if (JSON.stringify(data[0]) != JSON.stringify(yo)) {
            // console.log("new")
            // console.log(dt.getTime() - data[1]);
            yo = data[0];
            count += 1;
            total += dt.getTime() - data[1];
            console.log(total / count)
        }
    });
});
server.listen(5000);
