// ===========================
// OpenWeather API Key
// ===========================

const API_KEY = "da5cc509bc967933cf9f957a7a06eb9b";

// ===========================
// Elements
// ===========================

const cityInput = document.getElementById("cityInput");
const loader = document.getElementById("loader");
const body = document.getElementById("body");

// ===========================
// Events
// ===========================

cityInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        getWeather();
    }
});

window.onload = function () {
    getWeather("Kathmandu");
};

// ===========================
// Get Weather
// ===========================

async function getWeather(defaultCity = "") {

    const city = defaultCity || cityInput.value.trim();

    if (!city) {
        alert("Please enter a city.");
        return;
    }

    loader.classList.remove("hidden");

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        console.log(data);

        if (data.cod != 200) {
            alert(data.message);
            loader.classList.add("hidden");
            return;
        }

        updateCurrentWeather(data);

        getForecast(city);

    } catch (err) {

        console.error(err);

        alert("Network Error");

    }

    loader.classList.add("hidden");

}

// ===========================
// Current Weather
// ===========================

function updateCurrentWeather(data) {

    document.getElementById("cityName").innerHTML =
        `${data.name}, ${data.sys.country}`;

    document.getElementById("temperature").innerHTML =
        `${Math.round(data.main.temp)}°C`;

    document.getElementById("condition").innerHTML =
        capitalize(data.weather[0].description);

    document.getElementById("feelsLike").innerHTML =
        `${Math.round(data.main.feels_like)}°C`;

    document.getElementById("humidity").innerHTML =
        `${data.main.humidity}%`;

    document.getElementById("wind").innerHTML =
        `${Math.round(data.wind.speed * 3.6)} km/h`;

    document.getElementById("pressure").innerHTML =
        `${data.main.pressure} hPa`;

    document.getElementById("minTemp").innerHTML =
        `${Math.round(data.main.temp_min)}°C`;

    document.getElementById("maxTemp").innerHTML =
        `${Math.round(data.main.temp_max)}°C`;

    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    document.getElementById("todayDate").innerHTML =
        new Date().toDateString();

    updateFlag(data.main.temp);

    changeTheme(
        data.weather[0].main,
        data.wind.speed,
        data.weather[0].icon
    );

}

// ===========================
// Forecast
// ===========================

async function getForecast(city) {

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok) {
            return;
        }

        const forecastDiv = document.getElementById("forecast");

        forecastDiv.innerHTML = "";

        const dailyForecast = data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

        dailyForecast.forEach(day => {

            const date = new Date(day.dt_txt);

            forecastDiv.innerHTML += `

            <div class="forecast-card">

                <h3>${date.toLocaleDateString("en-US", {
                    weekday: "short"
                })}</h3>

                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">

                <h2>${Math.round(day.main.temp)}°C</h2>

                <p>${capitalize(day.weather[0].description)}</p>

            </div>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}

// ===========================
// Weather Quality
// ===========================

function updateFlag(temp) {

    const flag = document.getElementById("flag");

    if (temp >= 20 && temp <= 28) {

        flag.innerHTML = "🟢 Excellent";
        flag.style.background = "#27ae60";

    }

    else if (temp >= 15 && temp < 20) {

        flag.innerHTML = "🟢 Good";
        flag.style.background = "#16a085";

    }

    else if (temp >= 29 && temp <= 35) {

        flag.innerHTML = "🟡 Warm";
        flag.style.background = "#f39c12";

    }

    else {

        flag.innerHTML = "🔴 Extreme";
        flag.style.background = "#e74c3c";

    }

}

// ===========================
// Theme Changer
// ===========================

function changeTheme(weather, windSpeed, icon) {

    const isNight = icon.includes("n");

    // Windy
    if (windSpeed >= 8) {

        body.style.backgroundImage = "url('images/windy.jpg')";
        return;

    }

    // Night
    if (isNight) {

        body.style.backgroundImage = "url('images/night.jpg')";
        return;

    }

    switch (weather.toLowerCase()) {

        case "clear":

            body.style.backgroundImage =
                "url('images/sunny.jpg')";
            break;

        case "clouds":

            body.style.backgroundImage =
                "url('images/cloudy.jpg')";
            break;

        case "rain":

        case "drizzle":

            body.style.backgroundImage =
                "url('images/rainy.jpg')";
            break;

        case "thunderstorm":

            body.style.backgroundImage =
                "url('images/storm.jpg')";
            break;

        case "snow":

            body.style.backgroundImage =
                "url('images/snow.jpg')";
            break;

        case "mist":

        case "fog":

        case "haze":

            body.style.backgroundImage =
                "url('images/mist.jpg')";
            break;

        default:

            body.style.backgroundImage =
                "url('images/cloudy.jpg')";
    }

}
// ===========================
// Capitalize
// ===========================

function capitalize(text) {

    return text
        .split(" ")
        .map(word =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(" ");

}