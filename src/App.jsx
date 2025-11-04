import React, { useState } from "react";
import { getWeatherForMultipleCities } from "./api/weatherService";
import WeatherCard from "./components/WeatherCard";

export default function App() {
  const [cities, setCities] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const cityList = cities.split(",").map((c) => c.trim());
    const data = await getWeatherForMultipleCities(cityList);
    setResults(data);
  };

  return (
    <div className="app-container">
      <h1>🌤️ Clima em várias cidades</h1>
      <input
        type="text"
        placeholder="Digite cidades separadas por vírgula (ex: Recife, São Paulo)"
        value={cities}
        onChange={(e) => setCities(e.target.value)}
      />
      <button onClick={handleSearch}>Buscar</button>

      <div className="weather-grid">
        {results.map((res) =>
          res.erro ? (
            <p key={res.cidade} className="error">
              {res.cidade}: {res.erro}
            </p>
          ) : (
            <WeatherCard key={res.cidade} weather={res} />
          )
        )}
      </div>
    </div>
  );
}
