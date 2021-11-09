import WebSocket from 'ws';
const port = 5524;

// get command line arguments
var req = {};

process.argv.forEach((val, index) => {
    if (index > 1) {
        const args = val.split('=');
        req[`${args[0]}`] = args[1];
    }
});


const ws = new WebSocket(`ws://localhost:${port}`);
console.log("Connecting to server...");

ws.on('open', function open() {
    console.log('Sending request: \n%s', req);
    ws.send( JSON.stringify(req) );
});

ws.on('message', function message(data) {
    console.log('Received reply: \n%s', data);
});

