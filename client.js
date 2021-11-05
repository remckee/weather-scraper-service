// Hello World client
// Connects REQ socket to tcp://localhost:5555
// Sends "Hello" to server.

var zmq = require('zeromq');

// socket to talk to server
console.log("Connecting to server...");
var requester = zmq.socket('req');

var x = 0;
requester.on("message", function(reply) {
  console.log("Received reply", x, ": [", reply.toString(), ']');
  x += 1;
  if (x === 10) {
    requester.close();
    process.exit(0);
  }
});

requester.connect("tcp://localhost:5555");

for (var i = 0; i < 1; i++) {
    console.log("Sending request", i, '...');
    var req = 
    {
        "request": 
        {
            "city": "Portland",
            "state": "Oregon",
            "country": "us",
            "temp_unit": "F"
        }
    };
    
    var msg = JSON.stringify(req);
    
    requester.send(msg);
}

process.on('SIGINT', function() {
  requester.close();
});
