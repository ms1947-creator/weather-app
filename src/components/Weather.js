import React, { useState } from "react";
import "./Weather.css";

function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = "89729db0ceffe59f424e1d7e112ee46c"; 

  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError(null);
    setWeatherData(null);
    setForecastData(null);

    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!weatherRes.ok) throw new Error("City not found");
      const weather = await weatherRes.json();
      setWeatherData(weather);

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      const forecast = await forecastRes.json();

      // Filter forecast to midday for next 5 days
      const filteredForecast = forecast.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      setForecastData(filteredForecast);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

 return (
  <div className="weather-container">
    <h1 className="title">🌤️ Weather Forecast</h1>
    <div className="input-section">
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {if (e.key === "Enter") 
          {fetchWeather();}
  }}
        className="input"
      />
      <button onClick={fetchWeather} className="button">
        Search
      </button>
    </div>

    {loading && <p className="loader">Loading...</p>}
    {error && <p className="error">{error}</p>}

    {/* Wrap fetched weather data inside a container for responsive layout */}
    {(weatherData || forecastData) && (
      <div className="weather-data">
        {weatherData && (
          <div className="current-weather glass-card">
            <h2>{weatherData.name}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt="icon"
            />
            <p>{weatherData.weather[0].main}</p>
            <p>{Math.round(weatherData.main.temp)}°C</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>Wind: {weatherData.wind.speed} km/h</p>
          </div>
        )}

        {forecastData && (
          <div className="forecast">
            <h3>Next 5 Days</h3>
            <div className="forecast-cards">
              {forecastData.map((day, index) => (
                <div key={index} className="forecast-card glass-card">
                  <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt="icon"
                  />
                  <p>{day.weather[0].main}</p>
                  <p>{Math.round(day.main.temp)}°C</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);
}

export default Weather;
