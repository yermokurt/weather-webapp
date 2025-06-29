document.addEventListener('DOMContentLoaded', function() 
{
    let cityInput = document.getElementById('input-city'),
    searchBtn = document.getElementById('search-location'),
    locationBtn = document.getElementById('search-currentLocation')
    api_key = ' ',
    currentWeatherCard = document.querySelectorAll('.weather-left .card')[0],
    fiveDaysForecastCard = document.querySelector('.day-forecast'),
    aqindex = document.querySelectorAll('.highlights .card')[0],
    sunriseCard = document.querySelectorAll('.highlights .card')[1],
    humidityVal = document.getElementById('humidityVal'),
    pressureVal = document.getElementById('pressureVal'),
    visibilityVal = document.getElementById('visibilityVal'),
    windVal = document.getElementById('windVal'),
    temperatureVal = document.getElementById('temperatureVal'),
    hourlyForecastedCard = document.querySelector('.hourly-forecast'),
    aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];

    function getWeatherDetails(name, lat, lon, country, state) {
    let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    let AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

    fetch(AIR_POLLUTION_API_URL)
    .then(res => res.json())
    .then(data => {
        let {co, no, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;
        aqindex.innerHTML = `
        <div class="card-head">
            <p>AIR QUALITY INDEX (AQI)</p>
            <p class="air-index aqi-${data.list[0].main.aqi}"> ${aqiList[data.list[0].main.aqi - 1]}</p>
        </div>
        <div class="air-indices">
            <div class="icon">
                <i class="fa-solid fa-wind" style="font-size: 60px;"></i>
            </div>
            <div class="item">
                <p>PM2.5</p>
                <h2>${pm2_5}</h2>
            </div>
            <div class="item">
                <p>PM10</p>
                <h2>${pm10}</h2>
            </div>
            <div class="item">
                <p>SO2</p>
                <h2>${so2}</h2>
            </div>
            <div class="item">
                <p>CO</p>
                <h2>${co}</h2>
            </div>
            <div class="item">
                <p>NO</p>
                <h2>${no}</h2>
            </div>
            <div class="item">
                <p>NO2</p>
                <h2>${no2}</h2>
            </div>
            <div class="item">
                <p>NH3</p>
                <h2>${nh3}</h2>
            </div>
            <div class="item">
                <p>O3</p>
                <h2>${o3}</h2>
            </div>
        </div>
        `;
    })
    .catch(() => {
        alert('Failed to fetch air pollution data');
    });


        // Fetch current weather
        fetch(WEATHER_API_URL)
            .then(res => res.json())
            .then(data => {
                let date = new Date();
                currentWeatherCard.innerHTML = `
                <div class="current-weather">
                    <div class="details">
                        <p>WEATHER NOW</p>
                        <h2>${(data.main.temp).toFixed(2)}&deg;C</h2>
                        <p>${data.weather[0].description}</p>
                    </div>
                    <div class="weather-icon">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
                    </div>
                </div>
                <hr>
                <div class="card-footer">
                    <p><i class="fa-solid fa-calendar"></i> ${days[new Date().getDay()]}, ${new Date().getDate()}, ${months[new Date().getMonth()]} ${new Date().getFullYear()}</p>
                    <p><i class="fa-solid fa-location-dot"></i> ${name}, ${country}</p>
                </div>
            `;

                let { sunrise, sunset } = data.sys;
                let { timezone, visibility } = data;
                let { humidity, feels_like, pressure, } = data.main;
                let { speed } = data.wind;

                let sRiseTime = moment.unix(sunrise).utcOffset(timezone / 60).format('hh:mm A');
                let sSetTime  = moment.unix(sunset).utcOffset(timezone / 60).format('hh:mm A');

                sunriseCard.innerHTML = `
                    <div class="card-head">
                        <p>SUNRISE AND SUNSET</p>
                    </div>
                    <div class="sunrise">
                        <div class="item">
                            <div class="icon">
                                <p><i class="fa-solid fa-sun" style="font-size: 50px; margin-right: 15px;"></i></p>
                            </div>
                            <div>
                                <p>SUNRISE</p>
                                <h2>${sRiseTime}</h2>
                            </div>
                        </div>
                        <div class="item">
                            <div class="icon">
                                <p><i class="fa-solid fa-moon" style="font-size: 50px; margin-right: 15px;"></i></p>
                            </div>
                            <div>
                                <p>SUNSET</p>
                                <h2>${sSetTime}</h2>
                            </div>
                        </div>
                    </div>
                `;
                humidityVal.innerHTML = `${humidity}%`;
                pressureVal.innerHTML = `${pressure}hPa`;
                visibilityVal.innerHTML = `${(visibility/1000).toFixed(1)}km`;
                windVal.innerHTML = `${speed}km`;
                temperatureVal.innerHTML = `${(feels_like).toFixed(2)}&deg;C`;
            })
            .catch(() => {
                alert('Failed to fetch current weather');
            });

        fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
                let hourlyForecast = data.list;
                hourlyForecastedCard.innerHTML = ''; 
                for(let x = 0; x <= 7; x++)
                {
                    let hrForecastDate = new Date(hourlyForecast[x].dt_txt);
                    let hr = hrForecastDate.getHours();
                    let a = 'PM';
                    if(hr < 12 ) a ='AM';
                    if(hr == 0 ) hr = 12;
                    if(hr > 12) hr = hr - 12;
                    hourlyForecastedCard.innerHTML += `
                        <div class="card">
                            <p>${hr} ${a}</p>
                            <img src="https://openweathermap.org/img/wn/${hourlyForecast[x].weather[0].icon}.png ">
                            <p>${(hourlyForecast[x].main.temp).toFixed(2)}&deg;C</p>
                        </div>
                    `; 
                }


                let uniqueForecastDays = []; 
                let fiveDaysForecast = data.list.filter(forecast => {
                    let forecastDate = new Date(forecast.dt_txt).getDate();
                    if (!uniqueForecastDays.includes(forecastDate)) {
                        uniqueForecastDays.push(forecastDate);
                        return true;
                    }
                    return false;
                });
                fiveDaysForecastCard.innerHTML = '';
                for(let i = 1; i < fiveDaysForecast.length; i++)
                    {
                    let date = new Date(fiveDaysForecast[i].dt_txt);
                    fiveDaysForecastCard.innerHTML += `
                            <div class="forecast-item">
                                <div class="icon-wrapper">
                                    <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt=" ">
                                    <span>${(fiveDaysForecast[i].main.temp).toFixed(2)}&deg;C</span>
                                </div>
                                <p>${date.getDate()} ${months[date.getMonth()]}</p>
                                <p>${days[date.getDay()]}</p>
                            </div>
                    `;
                }
            })
            .catch(() => {
                alert('Failed to fetch weather forecast');
            });
    }

    function getCityCoordinates() {
        let cityName = cityInput.value.trim();
        cityInput.value = '';
        if (!cityName) return;

        let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

        fetch(GEOCODING_API_URL)
            .then(res => res.json())
            .then(data => {
                if (!data || !data.length) {
                    alert('City not found');
                    return;
                }
                let { name, lat, lon, country, state } = data[0];
                getWeatherDetails(name, lat, lon, country, state);
            })
            .catch(() => {
                alert(`Failed to fetch coordinates of ${cityName}`);
            });
    }

function getUserCoordinates()
{
    navigator.geolocation.getCurrentPosition(position => {
        let {latitude, longitude} = position.coords;
        let REVERSE_GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;

        fetch(REVERSE_GEOCODING_API_URL).then(res => res.json()).then(data => {
            let { name, lat, lon, country, state } = data[0];
            getWeatherDetails(name, latitude, longitude, country, state);
        }).catch(() => {
            alert(`Failed to fetch coordinates of ${cityName}`);
        });
    }, error => {
        if(error.code === error.PERMISSION_DENIED){
            alert('Geolocation permission denied, Please reset location permission');
        }
    });
}

    searchBtn.addEventListener('click', getCityCoordinates);
    locationBtn.addEventListener('click', getUserCoordinates);
    cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates()); 
    window.addEventListener('load', getUserCoordinates);
});
