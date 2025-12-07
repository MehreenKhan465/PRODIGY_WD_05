const apiKey = '68e7e8a64e89ac38d27c1a95aa775ead'; // Replace with your OpenWeatherMap API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const weatherForm = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');
const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const loading = document.getElementById('loading');
const error = document.getElementById('error');

// Function to fetch weather data
async function fetchWeather(lat, lon, city = null) {
    let url;
    if (city) {
        url = `${apiUrl}?q=${city}&appid=${apiKey}&units=metric`;
    } else {
        url = `${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found or API error');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (err) {
        showError(err.message);
    }
}

// Function to display weather data
function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    temperature.textContent = `Temperature: ${data.main.temp}°C`;
    description.textContent = `Conditions: ${data.weather[0].description}`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;

    weatherDisplay.classList.remove('hidden');
    loading.classList.add('hidden');
    error.classList.add('hidden');
}

// Function to show error
function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
    loading.classList.add('hidden');
    weatherDisplay.classList.add('hidden');
}

// Get user's location on page load
window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeather(latitude, longitude);
            },
            () => {
                showError('Geolocation denied. Please enter a city manually.');
            }
        );
    } else {
        showError('Geolocation not supported. Please enter a city manually.');
    }
});

// Handle form submission
weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        loading.classList.remove('hidden');
        weatherDisplay.classList.add('hidden');
        error.classList.add('hidden');
        fetchWeather(null, null, city);
        cityInput.value = '';
    }
});