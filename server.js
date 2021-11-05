let zmq = require('zeromq');
let weather = require('./main.js');
let url = "https://api.openweathermap.org/data/2.5/weather?";

// socket to talk to clients
var responder = zmq.socket('rep');

responder.on('message', function(request) {
    console.log("Received request: [", request.toString(), "]");
    var req = JSON.parse(request.toString());
    
    console.log(req.request.city);
    var units = "";
    var temp_unit = req.request.temp_unit;
    var loc = [req.request.city, req.request.state, req.request.country];

    if (temp_unit == "F") {
        units = "imperial";
    } else if (temp_unit == "C") {
        units = "metric";
    }

    
    let params =
    {
        "q": loc.join(','),
        "appid": "",
        "units": units
    };
    console.log(params.q);
    
    setTimeout(function() {
        weather.get_weather(url, params, "F", responder);
    }, 1000);
});

responder.bind('tcp://*:5555', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on 5555...");
  }
});

process.on('SIGINT', function() {
  responder.close();
});
