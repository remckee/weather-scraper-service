import weather from './main.js';
import https from 'https';
import { WebSocketServer } from 'ws';

'use strict';

const url = 'https://api.openweathermap.org/data/2.5/weather?';
const port = 5524;
const wss = new WebSocketServer({ port: port });
console.log(`Listening on ${port}...`);


function get_units(temp_unit) {
    var units = {};
    if (temp_unit == 'C') {
        units.unit = temp_unit;
        units.system = "metric";
    } else  {
        units.unit = 'F';
        units.system = "imperial";
    }
    return units;
}


wss.on('connection', function connection(ws) {
    console.log(`Client connected on port ${port}`);
    
    ws.on('message', (request) => {
        console.log('received request: \n%s', request);
        var req = JSON.parse(request.toString());

        var units = get_units(req.unit);
        var params = {};
        
        if (req.zip) {
            params.zip = req.zip;
        } else {
            var loc = [req.city, req.state, req.country];
            params.q = loc.join(',');
        }
        
        // To obtain the value for appid, create an account at
        // https://home.openweathermap.org/users/sign_up
        params.appid = "";
        params.units = units.system;

        console.log(params);
        weather(url, params, units.unit, ws);
    });
    
    ws.on('close', () => {
        console.log('Client has disconnected');
    });
});

