// Main function that contains all other functions
function weatherForecast() {
    
    // Used to render the most recent city searched if local storage exists and render the previous search results
    function pageInit(){
        const previousCitiesStr = window.localStorage.getItem("previousCities") || "[]";
        const previousCities = JSON.parse(previousCitiesStr);
        const lastCity = previousCities[previousCities.length-1];
        searchRender()
        getCurrentDayWeather(lastCity)
    }
    pageInit();
    
    // Renders previous search results if they exist
    function searchRender(isRendered, userCity) {
        // If the previous search resulted in an error, there will be an error message still present. This removes the error message
        // -- Found how to remove an element at this site https://www.abeautifulsite.net/adding-and-removing-elements-on-the-fly-using-javascript
        if(document.getElementById('error-message')){
            const errorMessageEl = document.getElementById('error-message');
            errorMessageEl.parentNode.removeChild(errorMessageEl);
        }
        
        const sideNavEl = document.getElementById('slide-out');
        const previousCitiesStr = window.localStorage.getItem("previousCities") || "[]";
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
                    const userCity = event.path[0].innerText;
                    storeInLocalStorage(userCity);
                    searchRender(true, userCity);
                    getCurrentDayWeather(userCity);
                })
            }
    }
    searchRender(); 

    // Gets the city the user input, adds the search to the search history, and calls the function that gets the current weather
    function getUserCity() {
        const searchButtonEl = document.getElementById('search-city');
            const cityInputEl = document.getElementById('city-input');
            searchButtonEl.addEventListener('click', function(){
                // Form has default to refresh page if enter is hit. This prevents the refresh from occuring, while still allowing the enter key to cause the event to occur.
                event.preventDefault();
                // Stoes users inputted city
                const userCity = cityInputEl.value;
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
        let cities = JSON.parse(strCities);
        cities.push(cityToStore);
        // makes sure only a max of 5 cities are shown
        if(cities.length > 5){
            cities.splice(0, 1);
        }
        previousCities = JSON.stringify(cities);
        window.localStorage.setItem("previousCities", previousCities);
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
        // -- Found out how to handle errors using GitHub user "fgilio" helpful code https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
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
        })
        .catch(function(error){
            console.log("catch of axios has been triggered. An error has occurred")
            if (error.response){
                // console.log("Request was made, status code falls within 2xx: ", error.response)
                errorMessage(error.response.data.message)
            }
            else if (error.request){
                // console.log("Request was made, but no response: ", error.request)
                errorMessage(error.response.data.message)
            }
            else{
                // console.log("Request was not made, you done messed up", error.message)
                errorMessage(error.response.data.message)
            }
        });
    }
    
    function errorMessage(message) {
        if(document.getElementById('error-message')){
            // Do nothing, the last attempt was also an error
        } else{
            const slideOutEl = document.getElementById('slide-out');
            const errorMessageEl = document.createElement('div');
            errorMessageEl.setAttribute('class', 'center');
            errorMessageEl.setAttribute('id', 'error-message')
            errorMessageEl.innerText = message
            slideOutEl.prepend(errorMessageEl)
            // console.log(errorMessageEl)
        }
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
   
    // Changes the HTML to display all of the weather data
    function weatherRender(oneDayWeather, fiveDayWeather){
        // When the code is initially ran, the main display area is set to hidden. Changing it to initial makes the display type what ever the default value is.
        // -- See documentation I used here https://www.w3schools.com/cssref/pr_class_display.asp
        const firstVisitDisplayEl = document.getElementById('first-visit-display');
        firstVisitDisplayEl.style.display = "none";
        const mainDisplayAreaEl = document.getElementById('main-display-area');
        mainDisplayAreaEl.style.display = "initial";
        // Gets all the elements used for displaying the current weather
        const cityNameEl = document.getElementById('city')
        const oneDayTempEl = document.getElementById('temperature');
        const oneDayHumidityEl = document.getElementById('humidity');
        const oneDayWindSpeedEl = document.getElementById('wind-speed');
        const oneDayUvIndexEl = document.getElementById('uv-index');
        const oneDayImgEl = document.getElementById('one-day-img')
        // Updates the HTML to display the current day's weather
        // --https://stackoverflow.com/questions/39291156/javascriptoutput-symbols-and-special-characters
        cityNameEl.innerText = oneDayWeather.city+" "+oneDayWeather.date;
        oneDayTempEl.innerText = "Temperature: "+oneDayWeather.temp+" \u00b0"+"F";
        oneDayHumidityEl.innerText = "Humidity: "+oneDayWeather.humidity+" \u0025";
        oneDayWindSpeedEl.innerText = "Wind Speed: "+oneDayWeather.windSpeed+" MPH";
        oneDayUvIndexEl.innerHTML = "UV Index: <span class='white-text red z-depth-3'>"+oneDayWeather.uvIndex+"</span>";
        oneDayimgUrl = "http://openweathermap.org/img/wn/"+oneDayWeather.weatherIcon+"@2x.png";
        oneDayImgEl.setAttribute('src', oneDayimgUrl);
        
        // Gets the element where the 5 day forecast will be dispalyed
        const fiveDayRowEl = document.getElementById('five-day-row')
        // Used to erase anything currently in the display, otherwise it would continue appending 5 days every search.
        fiveDayRowEl.innerHTML="";
        // Array will be used to store the elements created for each day. This allows for using i to create unique ids and reference those unique ids in the loop
        let fiveDayEls = [];

        // Renders the five day forecast using a loop that iterates for the total number of days in the array fiveDayWeather
        for(i=0; i < fiveDayWeather.length; i++){
            // Creates a column element to append all of the elements to, eventually is appended to the row that displays all the days
            const fiveDayColEl = document.createElement('div');
            // space is not a materilize class. I added it to add margin around each day
            fiveDayColEl.setAttribute('class','col s2 z-depth-3 space')
            // Creates the html for each day in the five day forecast
            // -- Each p is assigned a unique id that is later used to get the element and update the inner text
            // -- Found how to make images responsive in this video https://www.youtube.com/watch?v=wGj3jxwSkIg
            fiveDayColEl.innerHTML = `
                        <div>
                            <div class="card-content small-font">
                                <p class="center" id="five-date`+i+`"></p>
                                <img id="five-img`+i+`" class="responsive-img" src="">
                                <p id="five-temp`+i+`">Temp</p>
                                <p id="five-humidity`+i+`">Humidity</p>
                            </div>
                        </div>`;
            fiveDayRowEl.append(fiveDayColEl);
            
            // Creates an object that contains all the elements created above to display each day in the five day forecast
            // -- day used for referencing the correct elements when updating the innerText 
            let day = "day"+i
            fiveDayEls[day]= {
                fiveDayImgEl: document.getElementById('five-img'+i),
                fiveDayDateEl: document.getElementById('five-date'+i),
                fiveDayTempEl: document.getElementById('five-temp'+i),
                fiveDayHumidityEl: document.getElementById('five-humidity'+i)
             }           
             
            // Updates the innerText of the elements created to display each day's forecast
            fiveDayEls[day].fiveDayImgEl.setAttribute('src','http://openweathermap.org/img/wn/'+fiveDayWeather[i].weatherIcon+'@2x.png')
            fiveDayEls[day].fiveDayDateEl.innerText = fiveDayWeather[i].date;
            fiveDayEls[day].fiveDayTempEl.innerText = fiveDayWeather[i].temp+" \u00b0"+"F";
            fiveDayEls[day].fiveDayHumidityEl.innerText = fiveDayWeather[i].humidity+" \u0025";
        }
    }

}
weatherForecast();

        
        
