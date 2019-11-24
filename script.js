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
                // console.log('You searched for this city: ',city);
                searchForCityWeather(userCity);
            });
            
    }
    getUserCity();
        
    // Function will be used to perform request to the weather API
    function searchForCityWeather(userCity){
        // Currently AyDy's key for the weather API.
        const APIKey = "947af45bc8d7b63be4d0d313320202fb";
        let cityName = userCity;
        const queryURL = "http://api.openweathermap.org/data/2.5/weather?q="+cityName+"&APPID="+APIKey;

        // Performs request to the weather API with get
        axios.get(queryURL) 
            .then(function(response) {

                const temp = response.data.main.temp;
                const  humidity = response.data.main.humidity;
                const windSpeed = response.data.wind.speed;
                const lat = response.data.coord["lat"];
                const log = response.data.coord["lon"];
            });
        

    }
            
}
weatherForecast();

        
        
