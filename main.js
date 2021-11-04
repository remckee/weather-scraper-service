var https = require('https');

let MI_TO_M = 1609.344;     // number of meters in a mile

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

    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

