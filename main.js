import https from 'https';

const MILLISEC_TO_SEC = 1000;         

// Converts value to a string that is left padded with '0's to 2 characters
function to_str_zero_pad_2(value) {
    return value.toString().padStart(2, '0');
}


function get_time_str(date1) {
    let time =
    [
        to_str_zero_pad_2(date1.getUTCHours()),
        to_str_zero_pad_2(date1.getUTCDate()),
        to_str_zero_pad_2(date1.getUTCSeconds())
    ];
    
    return time.join(':');
}


function get_time_zone_prefix(time_zone) {
    // extract sign for given time zone
    return "UTC" + ((time_zone >= 0) ? "+" : "-");
}


// Convert a Unix time (seconds since 1 January 1970) to a 
// a string containing separated components of the time in the given time zone
function get_time(unix_seconds, time_zone=0) {
    const date1 = new Date((unix_seconds + time_zone) * MILLISEC_TO_SEC);
    var time_zone_str = get_time_zone_prefix(time_zone);
    time_zone = Math.abs(time_zone);
    var time_str = get_time_str(date1);
    time_str += ' ' + time_zone_str + to_str_zero_pad_2((time_zone/3600.0));
    
    return time_str;
}


let DIV_DEG = 360.0/16.0;           // 360 degrees/ 16 direction divisions
var HALF_DEV = DIV_DEG/2;
let NESW = ["N", "E", "S", "W"];


function append_directions(dir, quadrant) {
    dir += (quadrant==0 || quadrant==3) ? "N" : "S";
    dir += (quadrant==0 || quadrant==1) ? "E" : "W";
    return dir;
}


// convert a meteorological degree to a cardinal direction:
// N, E, S, W
// NE, SE, SW, NW
// NNE, ENE, ESE, SSE, SSW, WSW, WNW, NNW
function get_direction(degrees) {
    var quadrant = Math.trunc(degrees/90);
    var rem = degrees%90;
    var dir = "";
    
    // first 1.5 divisions of quadrant
    if (rem < DIV_DEG + HALF_DEV) {
        dir += NESW[quadrant%4];
    }

    // last 1.5 divisions of quadrant
    if (rem >= 2*DIV_DEG + HALF_DEV && rem < 90) {
        dir += NESW[(quadrant+1)%4];
    }
    
    // middle 3.0 divisions of quadrant
    if (rem >= HALF_DEV && rem < 3*DIV_DEG + HALF_DEV) {
        dir = append_directions(dir, quadrant);
    }
    return dir;
}


function get_response_obj(parsed_data, params, temp_unit) {
    var data =
     {
          "description":    parsed_data.weather[0].description,
          "temp":           {
                                "current": parsed_data.main.temp,
                                "perceived": parsed_data.main.feels_like,
                                "unit": temp_unit
                            },
          "pressure":       {
                                "value": parsed_data.main.pressure,
                                "unit": "hPa"
                            },
          "humidity":       {
                                "value": parsed_data.main.humidity,
                                "unit": "%"
                            },
          "visibility":     {
                                "value": parsed_data.visibility,
                                "unit": "m"
                            },
          "wind":           {
                                "speed": parsed_data.wind.speed,
                                "gust":  parsed_data.wind.gust,
                                "unit": ((params.units=="imperial") ? "mph" : "m/s")
                            },
          "wind_direction": {
                                "degrees": parsed_data.wind.deg,
                                "cardinal": get_direction(parsed_data.wind.deg)
                            },
          "cloud_cover":    {
                                "value": parsed_data.clouds.all,
                                "unit": "%"
                            },
          "sunrise":        get_time(parsed_data.sys.sunrise, parsed_data.timezone),
          "sunset":         get_time(parsed_data.sys.sunset, parsed_data.timezone)
      };
     return data;
}


function check_errors(res) {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];
    let error;
    if (statusCode !== 200) { error = new Error(`Status Code: ${statusCode}`); }
    if (error) {
      console.error(error.message);
      res.resume();
      return;
    }
}


function weather(url, params, temp_unit, ws) {
    var url_params = new URLSearchParams(params);
    url += url_params.toString();

    https.get(url, (res) => {
        check_errors(res); 
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                let data = get_response_obj(JSON.parse(rawData), params, temp_unit);
                console.log(data);
                ws.send(JSON.stringify(data));
            } catch (e) {
                console.error(e.message);
            }
        });
    }).on('error', (e) => {
        console.error(`Error: ${e.message}`);
    });
}

export default weather;
