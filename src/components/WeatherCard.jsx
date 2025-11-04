import React from "react";

export default function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <div className="weather-card">
      <h2>{weather.cidade}</h2>
      <div className="icon-temp">
        <span>🌤️</span>
        <h3>{weather.temperatura}</h3>
      </div>
      <p>{weather.descricao}</p>
    </div>
  );
}
