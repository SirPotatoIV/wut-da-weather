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
                console.log('You searched for this city: ',userCity);
                searchForCityWeather(userCity);
            });
            
    }
    getUserCity();
        
    // Function will be used to perform request to the weather API
    function searchForCityWeather(userCity){
        // Currently AyDy's key for the weather API.
        const apiKey = "14148f20140310fac55bc379dbdb7119";
        let lat = "";
        let lon = "";
        // let cityName = userCity;
        let cityName = userCity;
        const oneDayWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q="+cityName+"&APPID="+apiKey;
        const uvIndexURL = "http://api.openweathermap.org/data/2.5/uvi?appid="+apiKey+"&lat="+lat+"&lon="+lon;
        const oneDayWeather = {
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
            
            
            oneDayWeather.temp = response.data.main.temp;
            oneDayWeather.humidity = response.data.main.humidity;
            oneDayWeather.windSpeed = response.data.wind.speed;
            oneDayWeather.lat = response.data.coord["lat"];
            oneDayWeather.lon = response.data.coord["lon"];
            console.log(oneDayWeather);
        });
        

    }
            
}
weatherForecast();

        
        
