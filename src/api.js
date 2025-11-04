export async function getWeatherByCity(cityName) {
  try {
    if (!cityName) throw new Error("Digite o nome de uma cidade.");

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      cityName
    )}&count=1&language=pt&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error("Falha ao buscar coordenadas.");
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0)
      throw new Error("Cidade não encontrada.");

    const { latitude, longitude, name, country } = geoData.results[0];

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) throw new Error("Falha ao buscar dados do clima.");
    const weatherData = await weatherRes.json();

    const weatherDescriptions = {
      0: "Céu limpo",
      1: "Principalmente limpo",
      2: "Parcialmente nublado",
      3: "Nublado",
      45: "Nevoeiro",
      48: "Nevoeiro gelado",
      51: "Garoa leve",
      53: "Garoa moderada",
      55: "Garoa intensa",
      61: "Chuva leve",
      63: "Chuva moderada",
      65: "Chuva forte",
      71: "Neve leve",
      73: "Neve moderada",
      75: "Neve forte",
      80: "Aguaceiros leves",
      81: "Aguaceiros moderados",
      82: "Aguaceiros fortes",
      95: "Trovoadas",
      96: "Trovoadas com granizo leve",
      99: "Trovoadas com granizo forte",
    };

    const { temperature_2m, weather_code } = weatherData.current;

    return {
      cidade: `${name}, ${country}`,
      temperatura: `${temperature_2m} °C`,
      descricao: weatherDescriptions[weather_code] || "Condição desconhecida",
    };
  } catch (error) {
    throw new Error(error.message || "Erro desconhecido.");
  }
}
