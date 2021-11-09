import WebSocket from 'ws';
const port = 5524;
const host = "flip1.engr.oregonstate.edu";

// process command line arguments into an object
// if the command line args are:
// portland or us F
var req = {};

process.argv.forEach((val, index) => {
    if (index > 1) {
        const args = val.split('=');
        req[`${args[0]}`] = args[1];
    }
});

// connect to server
const ws = new WebSocket(`ws://${host}:${port}`);
console.log("Connecting to server...");

// send request
ws.on('open', function open() {
    console.log('Sending request: \n%s', req);
    ws.send( JSON.stringify(req) );
});

// read reply
ws.on('message', function message(data) {
    console.log('Received reply: \n%s', data);
});

