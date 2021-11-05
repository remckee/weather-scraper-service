var https = require('https');

const MI_TO_M = 1609.344;     // number of meters in a mile
const MS_TO_S = 1000;         

// Convert the given value in meters to miles, rounded to the 
// same number of sig figs.
function get_miles(meters) {
    var meters_string = meters.toString();
    var sig_figs = 0;
    
    // For each character of the string version of meters, increment
    // sig figs if the character is a numeric value.
    const regex = new RegExp('[0-9]');
    for (const ch of meters_string) {
        sig_figs += (regex.test(ch)) ? 1 : 0;
    }
    return Number.parseFloat((meters/MI_TO_M).toPrecision(sig_figs));
}


// Convert a Unix time (seconds since 1 January 1970) to a 
// an object containing separated components of the date and time
// for the given value in the given time zone
function get_full_date(unix_seconds, time_zone=0) {
    const date1 = new Date((unix_seconds + time_zone) * MS_TO_S);
    
    // extract sign for given time zone
    var time_zone_str = "UTC";
    time_zone_str += (time_zone >= 0) ? "+" : "-";
    time_zone = Math.abs(time_zone);
    
    let time =
    {
        "year":   date1.getUTCFullYear().toString().padStart(4, '0'),
        "month":  (date1.getUTCMonth()+1).toString().padStart(2, '0'),
        "day":    date1.getUTCDate().toString().padStart(2, '0'),
        "hour":   date1.getUTCHours().toString().padStart(2, '0'),
        "minute": date1.getUTCDate().toString().padStart(2, '0'),
        "second": date1.getUTCSeconds().toString().padStart(2, '0'),
        "time_zone": time_zone_str + (time_zone/3600.0).toString().padStart(2, '0')
    };
    
    console.log(time);
    return time;
}


// Convert a Unix time (seconds since 1 January 1970) to a 
// an object containing separated components of the date and time
// for the given value in the given time zone
function get_time(unix_seconds, time_zone=0) {
    const date1 = new Date((unix_seconds + time_zone) * MS_TO_S);
    
    // extract sign for given time zone
    var time_zone_str = "UTC";
    time_zone_str += (time_zone >= 0) ? "+" : "-";
    time_zone = Math.abs(time_zone);
    
    let time =
    [
        date1.getUTCHours().toString().padStart(2, '0'),
        date1.getUTCDate().toString().padStart(2, '0'),
        date1.getUTCSeconds().toString().padStart(2, '0')
    ];
    
    var time_str = time.join(':');
    time_str += ' ' + time_zone_str + (time_zone/3600.0).toString().padStart(2, '0');
    
    return time_str;
}


let DIV_DEG = 360.0/16.0;           // number of degrees per direction division
let NESW = ["N", "E", "S", "W"];


// convert a meteorological degree to a cardinal direction:
// N, E, S, W
// NE, SE, SW, NW
// NNE, ENE, ESE, SSE, SSW, WSW, WNW, NNW
function get_direction(degrees) {
    var quadrant = Math.trunc(degrees/90);
    var rem = degrees%90;
    var dir = "";
    var half_dev = DIV_DEG/2;
    if (rem < half_dev) {
        dir = NESW[quadrant%4];
    } else if (rem < DIV_DEG + half_dev) {
        dir += NESW[quadrant%4];
        dir += (quadrant==0 || quadrant==3) ? "N" : "S";
        dir += (quadrant==0 || quadrant==1) ? "E" : "W";
    } else if (rem < 2*DIV_DEG + half_dev) {
        dir += (quadrant==0 || quadrant==3) ? "N" : "S";
        dir += (quadrant==0 || quadrant==1) ? "E" : "W";
    } else if (rem < 3*DIV_DEG + half_dev) {
        dir += NESW[(quadrant+1)%4];
        dir += (quadrant==0 || quadrant==3) ? "N" : "S";
        dir += (quadrant==0 || quadrant==1) ? "E" : "W";
    } else if (rem < 90) {
        dir = NESW[(quadrant+1)%4];
    }
    return dir;
}


var url = "https://api.openweathermap.org/data/2.5/weather?";
let params =
{
    "q": "San Antonio,tx,us",
    "appid": "",
    "units": "imperial"
};

Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

https.get(url, (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];
    let error;

    if (statusCode !== 200) {
      error = new Error(`Status Code: ${statusCode}`);
    }

    if (error) {
      console.error(error.message);
      res.resume();
      return;
    }

    //res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        console.log(parsedData);
        let temp_unit = "F";
        let wind_unit = "miles/hour";
        
        let sunrise = get_time(parsedData.sys.sunrise, parsedData.timezone);
        let sunset  = get_time(parsedData.sys.sunset, parsedData.timezone);

        let data = 
        {
            "response": 
            {
                description:      parsedData.weather[0].description,
                temp:             {
                                      value: parsedData.main.temp,
                                      unit: temp_unit
                                  },
                temp_perceived:   {
                                      value: parsedData.main.feels_like,
                                      unit: temp_unit
                                  },
                pressure:         {
                                      value: parsedData.main.pressure,
                                      unit: "hPa"
                                  },
                humidity:         {
                                      value: parsedData.main.humidity,
                                      unit: "%"
                                  },
                visibility:       {
                                      value: get_miles(parsedData.visibility),
                                      unit: "miles"
                                  },
                wind:             {
                                      speed: parsedData.wind.speed,
                                      gust:  parsedData.wind.gust,
                                      wind_unit
                                  },
                wind_direction:   {
                                      degrees: parsedData.wind.deg,
                                      cardinal: get_direction(parsedData.wind.deg)
                                  },
                cloud_cover:      {
                                      value: parsedData.clouds.all,
                                      unit: "%"
                                  },
                sunrise:          sunrise,
                sunset:           sunset
            }
        };

      console.log(data);

      } catch (e) {
        console.error(e.message);
      }
    });
}).on('error', (e) => {
    console.error(`Error: ${e.message}`);
});

