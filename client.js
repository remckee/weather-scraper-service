var zmq = require('zeromq');

// socket to talk to server
console.log("Connecting to server...");
var requester = zmq.socket('req');

// process response
requester.on("message", function(reply) {
    console.log("Received reply : [", reply.toString(), ']');
    requester.close();
    process.exit(0);
});

requester.connect("tcp://localhost:5555");

// get command line arguments for location
var loc = ["", "", ""];
process.argv.forEach((val, index) => {
    if (index > 1) {
        loc[index-2] = val;
    }
});

// send request
console.log("Sending request...");
var req = 
{
    "request": 
    {
        "city":       loc[0],
        "state":      loc[1],
        "country":    loc[2],
        "temp_unit":  "F"
    }
};

requester.send( JSON.stringify(req) );

process.on('SIGINT', function() {
  requester.close();
});
