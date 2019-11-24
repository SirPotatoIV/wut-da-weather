
// const queryURL = ""
// // const city = 

// // Here we are building the URL we need to query the database


const APIKey = "947af45bc8d7b63be4d0d313320202fb";
let cityName = "minneapolis";
// // Here we are building the URL we need to query the database
const queryURL = "http://api.openweathermap.org/data/2.5/weather?q="+cityName+"&APPID="+APIKey;


// const city = "Bujumbura,Burundi"
    
    // Here we are building the URL we need to query the database
    

    // We then created an AJAX call
    axios.get(queryURL)
    
        .then(function(response) {
        // Create CODE HERE to Log the queryURL
        console.log("response:", response)
        });

    function getUserInput() {
        const searchButtonEl = document.getElementById('search-city');
        console.log(searchButtonEl);
        const cityInputEl = document.getElementById('city-input');
        searchButtonEl.addEventListener('click', function(){
            let city = cityInputEl.value; 
            console.log('You searched for this city: ',city);
        });
        
    }
    getUserInput();




  
