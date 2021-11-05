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
function get_time(unix_seconds, time_zone=0) {
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
    //padStart(
}

get_time(1636067033, -18000);
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

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        console.log(parsedData);
        let temp_unit = "F";
        let wind_unit = "miles/hour";
        
        let data = 
        {
            "response": 
            {
                description:      parsedData.weather[0].description,
                temp:             parsedData.main.temp,
                temp_perceived:   parsedData.main.feels_like,
                temp_min:         parsedData.main.temp_min,
                temp_max:         parsedData.main.temp_max,
                temp_units:       temp_unit,
                pressure:         parsedData.main.pressure,
                pressure_unit:    "hPa",
                humidity:         parsedData.main.humidity,
                humidity_unit:    "%",
                visibility:       get_miles(parsedData.visibility),
                visibility_unit:  "miles",
                wind_speed:       parsedData.wind.speed,
                wind_gust:        parsedData.wind.gust,
                wind_unit:        wind_unit,
                wind_deg:         parsedData.wind.deg,
                wind_direction_unit: "degrees (meteorological)",
                cloud_cover:      parsedData.clouds.all,
                cloud_cover_unit: "%"
            }
            
            
        };
        
        
        
      console.log(data);
      
      get_time(parsedData.dt);

      } catch (e) {
        console.error(e.message);
      }
    });
}).on('error', (e) => {
    console.error(`Error: ${e.message}`);
});

