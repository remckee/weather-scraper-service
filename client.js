import WebSocket from 'ws';
const port = 5524;
const host = "localhost";   // change to "flip1.engr.oregonstate.edu" 
                            // to run on flip servers

// You will likely need to replace the portion 
// of the code between START and END.
// The request will be sent using the req variable, so you need to
// fill req with the correctly formatted parameters of your
// request. For example, the following would be equivalent
// to using the example command line args shown after START:
// var req = {
//        "city": "Portland",
//        "state": "or",
//        "country": "us",
//        "unit": "C"
// };

//**** START

// Process command line arguments into an object.
// example of command line args:
// city=Portland state=or country=us unit=C

// For names with spaces, include double quotes around the name:
// city="San Francisco" state=ca country=us

var req = {};

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

