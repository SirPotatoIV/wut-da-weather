function weatherForecast() {
    
    function pageInit(){
        const previousCitiesStr = window.localStorage.getItem("previousCities") || "[]";
        const previousCities = JSON.parse(previousCitiesStr);
        const lastCity = previousCities[previousCities.length-1];
        console.log(lastCity);
        searchRender()
        getCurrentDayWeather(lastCity)
    }
    pageInit();
    
    // Renders previous search results if they exist
    function searchRender(isRendered, userCity) {
        const sideNavEl = document.getElementById('slide-out');
        const previousCitiesStr = window.localStorage.getItem("previousCities") || "[]";
        // console.log(previousCities)
        const previousCities = JSON.parse(previousCitiesStr);
      
        const searchSectionEl = document.getElementById('previous-search-list');                
            searchSectionEl.innerHTML = "";
            for(i=0; i < previousCities.length; i++){
                const previousSearchEl = document.createElement('li');
                const previousSearchButtonEl = document.createElement('button');
                previousSearchButtonEl.setAttribute("class", "btn")
                previousSearchButtonEl.innerText = previousCities[previousCities.length-i-1];
                previousSearchEl.append(previousSearchButtonEl)
                searchSectionEl.append(previousSearchEl);
                // Adds event listener to each previous search
                previousSearchButtonEl.addEventListener("click", function(){
                    // console.log("previous search clicked");
                    const userCity = event.path[0].innerText;
                    console.log(userCity);
                    getCurrentDayWeather(userCity);
                })
            }
    }
    searchRender(); 

    function getUserCity() {
        const searchButtonEl = document.getElementById('search-city');
        console.log(searchButtonEl);
            const cityInputEl = document.getElementById('city-input');
            searchButtonEl.addEventListener('click', function(){
                event.preventDefault();
                
                const userCity = cityInputEl.value;
                // console.log('You searched for this city: ',userCity);
                storeInLocalStorage(userCity);
                searchRender(true, userCity)
                getCurrentDayWeather(userCity);
                
            });
            
        }
        getUserCity();

    
    // Updates local storage of previously searched cities. Set to store up to five and then erase the oldest.
    function storeInLocalStorage(userCity) {
        const cityToStore = userCity;
        let strCities = window.localStorage.getItem("previousCities") || "[]";
        console.log("strCities:",strCities);
        let cities = JSON.parse(strCities);
        cities.push(cityToStore);
        // makes sure only a max of 5 cities are shown
        if(cities.length > 5){
            cities.splice(0, 1);
        }
        console.log("cities:", cities)
        previousCities = JSON.stringify(cities);
        window.localStorage.setItem("previousCities", previousCities);
        console.log("Local Storage: ", previousCities)
        // initialRender();
    }
    
    // Function gets the users input and then calls the function that will get the weather data from the API
    function getCurrentDayWeather(userCity){
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
    
    // Function does a second call to get the UV Index. Weather api requires a separate get for the uv index.
    function requestUVIndex(oneDayWeather, apiKey){
        
        const uvIndexURL = "http://api.openweathermap.org/data/2.5/uvi?appid="+apiKey+"&lat="+oneDayWeather.lat+"&lon="+oneDayWeather.lon;
        
        axios.get(uvIndexURL) 
        .then(function(response) {
            
            oneDayWeather.uvIndex = response.data.value;
            getFiveDayForecast(oneDayWeather);
            
        });  
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
                const dateFormatted = moment(stringTime, "X").format("MM/DD/YY")
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

                    fiveDayWeather.push(dayWeather);
                }
            }
           
            weatherRender(oneDayWeather, fiveDayWeather);
        });
    }
   
    
    function weatherRender(oneDayWeather, fiveDayWeather){

        const cityNameEl = document.getElementById('city')
        const oneDayTempEl = document.getElementById('temperature');
        const oneDayHumidityEl = document.getElementById('humidity');
        const oneDayWindSpeedEl = document.getElementById('wind-speed');
        const oneDayUvIndexEl = document.getElementById('uv-index');
        const oneDayImgEl = document.getElementById('one-day-img')

        // https://stackoverflow.com/questions/39291156/javascriptoutput-symbols-and-special-characters
        cityNameEl.innerText = oneDayWeather.city+" "+oneDayWeather.date;
        oneDayTempEl.innerText = "Temperature: "+oneDayWeather.temp+" \u00b0"+"F";
        oneDayHumidityEl.innerText = "Humidity: "+oneDayWeather.humidity+" \u0025";
        oneDayWindSpeedEl.innerText = "Wind Speed: "+oneDayWeather.windSpeed+" MPH";
        oneDayUvIndexEl.innerHTML = "UV Index: <span class='white-text red z-depth-3'>"+oneDayWeather.uvIndex+"</span>";
        oneDayimgUrl = "http://openweathermap.org/img/wn/"+oneDayWeather.weatherIcon+"@2x.png";
        oneDayImgEl.setAttribute('src', oneDayimgUrl);
        const fiveDayRowEl = document.getElementById('five-day-row')
        // Used to erase anything currently in the display, otherwise it would continue appending 5 days every search.
        fiveDayRowEl.innerHTML="";
        let fiveDayEls = [];

        // Renders the five day forecast
        for(i=0; i < fiveDayWeather.length; i++){
            const fiveDayColEl = document.createElement('div');
            fiveDayColEl.setAttribute('class','col s2 z-depth-3 space')
            // https://www.youtube.com/watch?v=wGj3jxwSkIg
            fiveDayColEl.innerHTML = `
                        <div>
                            <div class="card-content small-font">
                                <p class="center" id="five-date`+i+`"></p>
                                <img id="five-img`+i+`" class="responsive-img" src="http://placehold.it/50x50">
                                <p id="five-temp`+i+`">Temp</p>
                                <p id="five-humidity`+i+`">Humidity</p>
                            </div>
                        </div>`;
            console.log("fiveDayCol element: ", fiveDayColEl)
            fiveDayRowEl.append(fiveDayColEl);
            let day = "day"+i
            console.log("day:", day)
             fiveDayEls[day]= {
                fiveDayImgEl: document.getElementById('five-img'+i),
                // console.log(fiveDayImgEl);
                fiveDayDateEl: document.getElementById('five-date'+i),
                fiveDayTempEl: document.getElementById('five-temp'+i),
                fiveDayHumidityEl: document.getElementById('five-humidity'+i)
             }           
             
            fiveDayEls[day].fiveDayImgEl.setAttribute('src','http://openweathermap.org/img/wn/'+fiveDayWeather[i].weatherIcon+'@2x.png')
            fiveDayEls[day].fiveDayDateEl.innerText = fiveDayWeather[i].date;
            console.log(fiveDayWeather[i].date);
            fiveDayEls[day].fiveDayTempEl.innerText = fiveDayWeather[i].temp+" \u00b0"+"F";
            fiveDayEls[day].fiveDayHumidityEl.innerText = fiveDayWeather[i].humidity+" \u0025";
            

        }
    }

}
weatherForecast();

        
        
