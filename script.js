// ==========================================
// WEATHER DASHBOARD
// Author: Sejal Oli
// ==========================================

// =========================
// API KEY
// =========================

const API_KEY = "da5cc509bc967933cf9f957a7a06eb9b";


// =========================
// ELEMENTS
// =========================

const cityInput = document.getElementById("cityInput");
const loader = document.getElementById("loader");
const body = document.getElementById("body");


// =========================
// ENTER KEY SEARCH
// =========================

cityInput.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        getWeather();

    }

});


// =========================
// DEFAULT CITY
// =========================

window.onload = function(){

    getWeather("Kathmandu");

};


// =========================
// GET WEATHER
// =========================

async function getWeather(defaultCity=""){

    const city = defaultCity || cityInput.value.trim();

    if(city===""){

        alert("Please enter a city name.");

        return;

    }

    loader.classList.remove("hidden");

    try{

        // Current Weather

        const weatherURL =
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(weatherURL);

        const data = await response.json();

        if(data.cod != 200){

            throw new Error(data.message);

        }

        updateCurrentWeather(data);

        // Forecast

        getForecast(city);

    }

    catch(error){

        alert("❌ " + error.message);

    }

    finally{

        loader.classList.add("hidden");

    }

}
// =========================
// UPDATE CURRENT WEATHER
// =========================

function updateCurrentWeather(data){

    // City

    document.getElementById("cityName").innerHTML =
        `${data.name}, ${data.sys.country}`;

    // Date

    document.getElementById("todayDate").innerHTML =
        new Date().toDateString();

    // Temperature

    document.getElementById("temperature").innerHTML =
        `${Math.round(data.main.temp)}°C`;

    // Weather Condition

    document.getElementById("condition").innerHTML =
        capitalize(data.weather[0].description);

    // Feels Like

    document.getElementById("feelsLike").innerHTML =
        `${Math.round(data.main.feels_like)}°C`;

    // Humidity

    document.getElementById("humidity").innerHTML =
        `${data.main.humidity}%`;

    // Wind Speed

    document.getElementById("wind").innerHTML =
        `${Math.round(data.wind.speed * 3.6)} km/h`;

    // Pressure

    document.getElementById("pressure").innerHTML =
        `${data.main.pressure} hPa`;

    // Minimum Temperature

    document.getElementById("minTemp").innerHTML =
        `${Math.round(data.main.temp_min)}°C`;

    // Maximum Temperature

    document.getElementById("maxTemp").innerHTML =
        `${Math.round(data.main.temp_max)}°C`;

    // Visibility

    document.getElementById("visibility").innerHTML =
        `${(data.visibility / 1000).toFixed(1)} km`;

    // Sunrise

    document.getElementById("sunrise").innerHTML =
        formatTime(data.sys.sunrise, data.timezone);

    // Sunset

    document.getElementById("sunset").innerHTML =
        formatTime(data.sys.sunset, data.timezone);

    // Weather Icon

    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    // Weather Quality Flag

    updateFlag(data.main.temp);

    // Background Theme

    changeTheme(

        data.weather[0].main,

        data.wind.speed,

        data.weather[0].icon

    );

}
// =========================
// GET 5-DAY FORECAST
// =========================

async function getForecast(city){

    try{

        const forecastURL =
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(forecastURL);

        const data = await response.json();

        if(data.cod != "200"){

            throw new Error("Forecast not found");

        }

        const forecast = document.getElementById("forecast");

        forecast.innerHTML = "";

        // Get one forecast per day (around 12 PM)

        const dailyForecast = data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

        dailyForecast.forEach(day=>{

            const date = new Date(day.dt * 1000);

            const dayName = date.toLocaleDateString(
                "en-US",
                {
                    weekday:"short"
                }
            );

            const card = `

            <div class="forecast-card">

                <h3>${dayName}</h3>

                <img
                src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
                alt="Weather Icon">

                <h2>${Math.round(day.main.temp)}°C</h2>

                <p>${capitalize(day.weather[0].description)}</p>

            </div>

            `;

            forecast.innerHTML += card;

        });

    }

    catch(error){

        console.error(error);

    }

}

// =========================
// WEATHER STATUS FLAG
// =========================

function updateFlag(temp){

    const flag = document.getElementById("flag");

    const weather =
        document.getElementById("condition")
        .innerText
        .toLowerCase();

    // Thunderstorm

    if(weather.includes("thunder")){

        flag.innerHTML = "⛈️ Storm Alert";

        flag.style.background = "#c0392b";

        return;

    }

    // Rain

    if(weather.includes("rain")){

        flag.innerHTML = "🌧️ Rainy";

        flag.style.background = "#3498db";

        return;

    }

    // Snow

    if(weather.includes("snow")){

        flag.innerHTML = "❄️ Snow";

        flag.style.background = "#5dade2";

        return;

    }

    // Mist / Fog

    if(

        weather.includes("mist") ||

        weather.includes("fog") ||

        weather.includes("haze")

    ){

        flag.innerHTML = "🌫️ Foggy";

        flag.style.background = "#7f8c8d";

        return;

    }

    // Clouds

    if(weather.includes("cloud")){

        flag.innerHTML = "☁️ Cloudy";

        flag.style.background = "#6c757d";

        return;

    }

    // Clear Sky

    if(weather.includes("clear")){

        flag.innerHTML = "☀️ Sunny";

        flag.style.background = "#f39c12";

        return;

    }

    // Temperature Rating

    if(temp >=20 && temp<=28){

        flag.innerHTML = "🟢 Excellent";

        flag.style.background = "#27ae60";

    }

    else if(temp>=15){

        flag.innerHTML = "🟢 Good";

        flag.style.background = "#16a085";

    }

    else if(temp>=5){

        flag.innerHTML = "🟡 Cold";

        flag.style.background = "#2980b9";

    }

    else{

        flag.innerHTML = "🔴 Extreme";

        flag.style.background = "#e74c3c";

    }

}
// =========================
// CHANGE BACKGROUND THEME
// =========================

function changeTheme(weather, windSpeed, icon){

    // Remove previous theme

    body.className = "";

    // Keep body id

    body.id = "body";

    // Night Theme

    const isNight = icon.includes("n");

    if(isNight){

        body.classList.add("night-theme");

        return;

    }

    // Windy Theme

    if(windSpeed >= 8){

        body.classList.add("windy-theme");

        return;

    }

    // Weather Theme

    switch(weather.toLowerCase()){

        case "clear":

            body.classList.add("sunny-theme");

            break;

        case "clouds":

            body.classList.add("cloud-theme");

            break;

        case "rainy":

        case "drizzle":

            body.classList.add("rain-theme");

            break;

        case "thunderstorm":

            body.classList.add("storm-theme");

            break;

        case "snow":

            body.classList.add("snow-theme");

            break;

        case "mist":

        case "fog":

        case "haze":

        case "smoke":

            body.classList.add("mist-theme");

            break;

        default:

            body.classList.add("default-theme");

    }

}
// =========================
// CAPITALIZE FIRST LETTER
// =========================

function capitalize(text){

    return text

        .split(" ")

        .map(word =>

            word.charAt(0).toUpperCase() +

            word.slice(1)

        )

        .join(" ");

}



// =========================
// FORMAT SUNRISE / SUNSET
// =========================

function formatTime(unixTime, timezone){

    const date = new Date((unixTime + timezone) * 1000);

    return date.toLocaleTimeString("en-US",{

        hour:"2-digit",

        minute:"2-digit",

        hour12:true,

        timeZone:"UTC"

    });

}



// =========================
// FORMAT TODAY'S DATE
// =========================

function formatDate(){

    const options={

        weekday:"long",

        year:"numeric",

        month:"long",

        day:"numeric"

    };

    return new Date().toLocaleDateString("en-US",options);

}



// =========================
// AUTO UPDATE DATE
// =========================

window.addEventListener("load",()=>{

    const dateElement=document.getElementById("todayDate");

    if(dateElement){

        dateElement.innerHTML=formatDate();

    }

});



// =========================
// CLEAR SEARCH AFTER SEARCH
// =========================

function clearInput(){

    cityInput.value="";

}



// =========================
// OPTIONAL:
// CLEAR SEARCH AFTER SUCCESS
// =========================

// Call clearInput() inside
// getWeather() after updateCurrentWeather(data)
//
// Example:
//
// updateCurrentWeather(data);
// clearInput();
// getForecast(city);
//
// This keeps the search box empty
// after every successful search.