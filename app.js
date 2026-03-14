const apiKey = "YOUR_API_KEY";

window.onload = () => {
  const savedCity = localStorage.getItem("lastCity");
  if (savedCity) {
    document.getElementById("cityInput").value = savedCity;
    getWeather();
  }
};

async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  localStorage.setItem("lastCity", city);

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    if (weatherData.cod !== 200) {
      document.getElementById("weatherResult").innerHTML = `<p>City not found</p>`;
      document.getElementById("forecastResult").innerHTML = "";
      return;
    }

    document.getElementById("weatherResult").innerHTML = `
      <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
      <p><strong>Temperature:</strong> ${weatherData.main.temp}°C</p>
      <p><strong>Weather:</strong> ${weatherData.weather[0].description}</p>
      <p><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${weatherData.wind.speed} m/s</p>
    `;

    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    let forecastHTML = "";
    const dailyForecasts = forecastData.list.filter(item =>
      item.dt_txt.includes("12:00:00")
    );

    dailyForecasts.slice(0, 5).forEach(day => {
      forecastHTML += `
        <div class="forecast-card">
          <h3>${new Date(day.dt_txt).toDateString()}</h3>
          <p>${day.main.temp}°C</p>
          <p>${day.weather[0].description}</p>
        </div>
      `;
    });

    document.getElementById("forecastResult").innerHTML = forecastHTML;
  } catch (error) {
    document.getElementById("weatherResult").innerHTML = `<p>Error fetching weather data</p>`;
    document.getElementById("forecastResult").innerHTML = "";
  }
                                        }
