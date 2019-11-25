function weatherForecast() {
    
    // let cityName = "minneapolis";
    // // Here we are building the URL we need to query the database
    
    
    // const city = "Bujumbura,Burundi"
    
    // Here we are building the URL we need to query the database
    
    
    // We then created an AJAX call
    // Function will be used to get the city the user wants to search for
    function getUserCity() {
            const searchButtonEl = document.getElementById('search-city');
            console.log(searchButtonEl);
            const cityInputEl = document.getElementById('city-input');
            searchButtonEl.addEventListener('click', function(){
                event.preventDefault();
                
                // let userCity = cityInputEl.value;
                let userCity = "minneapolis"; 
                // console.log('You searched for this city: ',userCity);
                searchForCityWeather(userCity);
            });
            
    }
    getUserCity();
        
    // Function will be used to perform request to the weather API
    function searchForCityWeather(userCity){
        // Jake's apiKey
        const apiKey = "14148f20140310fac55bc379dbdb7119";
        // let cityName = userCity;
        let cityName = userCity;
        const oneDayWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q="+cityName+"&APPID="+apiKey;
        let oneDayWeather = {
            weather: "",
            weatherDescription: "",
            weatherIcon:"",
            temp: "",
            humidity: "",
            windSpeed: "",
            lat: "",
            lon: "",
            uvIndex: ""
        };

        // Performs request to the weather API with get
        axios.get(oneDayWeatherURL) 
        .then(function(response) {
            oneDayWeather.weather = response.data.weather[0].main;
            oneDayWeather.weatherDescription = response.data.weather[0].description;
            oneDayWeather.weatherIcon = response.data.weather[0].icon;
            oneDayWeather.temp = response.data.main.temp;
            oneDayWeather.humidity = response.data.main.humidity;
            oneDayWeather.windSpeed = response.data.wind.speed;
            oneDayWeather.lat = response.data.coord["lat"];
            oneDayWeather.lon = response.data.coord["lon"];
            // Takes values recieved from this get and passess them on to requestUVIndex. 
            // Tried setting oneDayWeather.uvIndex in this function, but it would set the value before the function call completed.
            requestUVIndex(oneDayWeather, apiKey)
        });
    }
    
    function requestUVIndex(oneDayWeather, apiKey){
        
        const uvIndexURL = "http://api.openweathermap.org/data/2.5/uvi?appid="+apiKey+"&lat="+oneDayWeather.lat+"&lon="+oneDayWeather.lon;
        
        axios.get(uvIndexURL) 
        .then(function(response) {
            
            oneDayWeather.uvIndex = response.data.value;
            console.log(oneDayWeather);
            oneDayRender(oneDayWeather);
        
        });  
    }

    function oneDayRender(oneDayWeather){
        imgUrl = 'http://openweathermap.org/img/wn/'+oneDayWeather.weatherIcon+'@2x.png'
        console.log(imgUrl);
    }
            
}
weatherForecast();

        
        
