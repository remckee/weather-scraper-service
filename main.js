var https = require('https');

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

