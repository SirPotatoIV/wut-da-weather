function weatherForecast() {
    
    function getUserCity() {
            const searchButtonEl = document.getElementById('search-city');
            console.log(searchButtonEl);
            const cityInputEl = document.getElementById('city-input');
            searchButtonEl.addEventListener('click', function(){
                // event.preventDefault();
                
                const userCity = cityInputEl.value;
                console.log('You searched for this city: ',userCity);
                storeInLocalStorage(userCity);
                searchForCityWeather(userCity);
            });
            
    }
    getUserCity();
    
    function storeInLocalStorage(userCity) {
        const cityToStore = userCity;
        let strCities = window.localStorage.getItem("strCities") || "[]";
        console.log(strCities);
        const cities = JSON.parse(strCities);
        cities.push(cityToStore);
        strCities = JSON.stringify(cities);
        console.log("Local Storage: ", strCities)
    }

    // Function will be used to perform request to the weather API
    function searchForCityWeather(userCity){
        // Jake's apiKey
        const apiKey = "14148f20140310fac55bc379dbdb7119";
        const cityName = userCity;
        const units = "imperial";
        const oneDayWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units="+units+"&APPID="+apiKey;
        let oneDayWeather = {
            city: "",
            date:"",
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
            oneDayWeather.city = response.data.name;
            oneDayWeather.date = moment((response.data.dt).toString(), "X").format("MM/DD/YYYY")
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
            getFiveDayForecast(oneDayWeather);
        
        });  
    }

    function oneDayRender(oneDayWeather){
        imgUrl = 'http://openweathermap.org/img/wn/'+oneDayWeather.weatherIcon+'@2x.png'
        console.log(imgUrl);
    }
            
    function getFiveDayForecast(oneDayWeather){
      
        const apiKey = "14148f20140310fac55bc379dbdb7119";
        const cityName = oneDayWeather.city;
        const units = "imperial";
        const fiveDayForecastURL = "http://api.openweathermap.org/data/2.5/forecast?q="+cityName+"&units="+units+"&APPID="+apiKey;
        let fiveDayWeather = [];
        
        axios.get(fiveDayForecastURL) 
        .then(function(response) {
            
            for(let i=0; i < response.data.list.length; i++){
                
                const timeUNIX = response.data.list[i].dt;
                const stringTime = timeUNIX.toString();
                const dateFormatted = moment(stringTime, "X").format("MM/DD/YYYY")
                const timeFormatted = moment(stringTime, "X").format("HH:mm")

                if(timeFormatted === "12:00"){
                    const dayWeather = {
                        date: dateFormatted,
                        time: timeFormatted,
                        weatherDescription: response.data.list[i].weather[0].description,
                        weatherIcon: response.data.list[i].weather[0].icon,
                        temp: response.data.list[i].main.temp,
                        humidity: response.data.list[i].main.humidity
                    }

                    console.log("Day Weather: ", i, dayWeather)
                    fiveDayWeather.push(dayWeather);
                }
            }
            console.log(fiveDayWeather)
        });
    }
    // getFiveDayForecast();

}
weatherForecast();

        
        
