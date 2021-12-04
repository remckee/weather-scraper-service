import WebSocket from 'ws';
const port = 5524;
const host = "localhost";   // change to "flip1.engr.oregonstate.edu" 
                            // to run on flip servers

// You will likely need to replace the portion 
// of the code between START and END. For more details about request and
// response formats and using this client program, see the README.

//**** START

var req = {};

// Process command line arguments into an object. See README for more info.
process.argv.forEach((val, index) => {
    if (index > 1) {
        const args = val.split('=');
        req[`${args[0]}`] = args[1];
    }
});

//**** END

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

