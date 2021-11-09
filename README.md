Weather Scaper Service
=======

Obtains weather data for a location from OpenWeatherMap API.


Installing and running the server
=======

To install, navigate to the folder where you saved the files, and run

    npm install

to install the required modules. To start the server, run

    node server.js

Using the provided client
=======

The provided client can be used to test out the program on the command line and as an example client program. You will likely need to modify it for use in your application or use an entirely different client program.

To use the provided client, start the server first and then open a second terminal. If the server is not running on localhost, be sure to update the value of `host` at the top of `client.js` to the appropriate host. You will include the parameters described in the Requests section in the form of command line arguments, and the client program will convert that to the required JSON request format and send the request to the server.

To get the weather for San Francisco, California and specify `C` (Celsius) as the temperture unit:

    node client.js city="San Francisco" state=ca country=us unit=C

Note that double quotes are required around city names that include spaces.

Requests
=======

Requests can be formatted using either a city name or a zip code. For either format, you can optionally include a parameter for the desired temperature unit. If it is not included, `F` (Fahrenheit) is the default.

For city name, you can include the [state](https://www.iso.org/obp/ui/#iso:code:3166:US) and [country](https://www.iso.org/obp/ui/#search) codes. Note that states should only be included for US locations. State and country are optional but highly recommended to ensure the correct result.

To get the weather for San Francisco, California and specify `C` (Celsius) as the temperture unit:

    {
        "city": "San Francisco", 
        "state": "ca", 
        "country": "us",
        "unit": "C"
    }


For zip code, the country code must be included for non-US locations. US is the default if the country code is not included.

    {
        "zip": "77777", 
        "country": "uk",
        "unit": "C"
    }

Responses
=======

The temperature unit can be either `C` or `F`. If the temperature unit is `F`, wind unit will be in mph, but the other units are the same in both. 
    
    {
        description: 'mist',
        temp: 
        {
            current: 11.92, 
            perceived: 11.57, 
            unit: 'C'
        },
        pressure:
        {
            value: 1015, 
            unit: 'hPa'
        },
        humidity:
        {
            value: 92, 
            unit: '%'
        },
        visibility: 
        { 
            value: 4023, 
            unit: 'm' 
        },
        wind: 
        { 
            speed: 0.89, 
            gust: 2.68, 
            unit: 'm/s' 
        },
        wind_direction: 
        { 
            degrees: 155, 
            cardinal: 'SSE'
        },
        cloud_cover:
        {
            value: 90, 
            unit: '%' 
        },
        sunrise: '06:09:56 UTC-08',
        sunset: '17:09:14 UTC-08'
    }

