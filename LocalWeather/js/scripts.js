function weather(){
    //Private
    _Lat = "";
    _Lon = "";
    _Town = "";
    _Temp = "";
    _TempType = "c";
    _WeatherDescription = "";
    _Wind = "";
    _Humidity = "";
    
    getMyWeather = function(){
        //First check if we have a cookie
        console.log("Checking for cookie");
        var weatherCookie = document.cookie;
        if (weatherCookie == ""){ //cookie does not exist
            console.log('Cookie not found');
            FindLocation();
        }
        else{//read cookie
            console.log("Cookie found");
            GetCookie();
            DisplayInfo();
        }
    }
    
    FindLocation = function (){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(LocSuccess,LocError);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
        
    }

    LocSuccess = function(pos){
        _Lat = pos.coords.latitude;
        _Lon = pos.coords.longitude;
        GetLocalWeather();
    }

    LocError = function(err){
        console.warn('ERROR In location:('+err.code+'): '+err.message);
    }

    GetLat = function (){ return _Lat; }

    GetLon = function (){ return _Lon; }

    GetTown = function (){ return _Town; }

    GetWeatherDescription = function (){ return _WeatherDescription; }

    GetWind = function (){ return _Wind; }

    GetHumidity = function (){ return _Humidity; }

    GetTemp = function(){ return _Temp; }

    GetLocalWeather = function(){
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather?lat="+GetLat()+"&lon="+GetLon()+"&units=metric&APPID=ea5522a94c7807da294433cf1dc9e692",
        }).done(function(data) {
            console.log(data);
            _Town = data.name;
            _Temp = data.main.temp;
            _WeatherDescription = data.weather[0].description;
            _Wind = data.wind.speed * 1.609344;
            _Humidity = data.main.humidity; 

            SetCookie();
            DisplayInfo();
        });
    }

    SetCookie = function(){
        var d = new Date();
        d.setTime(d.getTime() + 600000);
        var expires = "expires="+d.toUTCString();
        document.cookie = "town=" + _Town + ";"+expires + ";path=/";
        document.cookie = "temp=" + _Temp + ";"+expires + ";path=/";
        document.cookie = "desc="+_WeatherDescription+";"+expires + ";path=/";
        document.cookie = "wind="+_Wind+";"+expires + ";path=/";
        document.cookie = "humidity="+_Humidity+";" + expires + ";path=/";
        console.log('Cookie set');
    }
    
    GetCookie = function(){
        var ca = document.cookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            var kv = c.split('=');
            switch (kv[0]){
            case "town":
                _Town = kv[1]
                break;
            case " temp":
                _Temp = kv[1]
                break;
            case " desc":
                _WeatherDescription = kv[1]
                break;
            case " wind":
                _Wind = kv[1]
                break;
            case " humidity":
                _Humidity = kv[1]
                break;
            }
        }
    }

    DisplayInfo = function(){
        $("#tempLevel").html(Math.floor(_Temp));
        $("#desc").html(_WeatherDescription);
        $("#wind").html(Math.floor(_Wind)+ (_TempType == 'c' ? " km/h": " mph"));
        $("#hum").html(_Humidity+"%");
    }
    
    ConvertTemp = function(){
        if (_TempType === 'c'){
            _TempType = 'f';
            _Temp = _Temp * 9/5 +32;
            _Wind = _Wind / 1.609344;
        }
        else{
            _TempType = 'c';
            _Temp = (_Temp - 32) * .5556;
            _Wind = _Wind * 1.609344;
        }
        DisplayInfo();
    }

    return {
        getMyWeather: getMyWeather,
        getTemp: GetTemp,
        
        convertTemp: ConvertTemp
    }
}





$(document).ready(function(){
    var myWeather = new weather();
    myWeather.getMyWeather();
    
    $("#tempValue").click(function(){
        var tempType = $("#tempLevel").attr('data-type');
        $("#tempLevel").html( myWeather.convertTemp() );
        $("#tempLevel").attr('data-type', (tempType == 'c' ? 'f' : 'c') );
        $("#tempValue").html ( (tempType == 'c' ? '&#8457' : '&#8451') );
    });
})
