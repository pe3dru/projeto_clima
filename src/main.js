// Nova função completa para buscar e formatar o clima
async function getWeatherByCity(cityName) {
  try {
    if (!cityName || typeof cityName !== "string") {
      throw new Error("Por favor, insira um nome de cidade válido.");
    }

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=pt&format=json`;
    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) throw new Error("Falha ao acessar o serviço de geocodificação.");
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("Cidade não encontrada.");
    }

    const { latitude, longitude, name, country } = geoData.results[0];
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) throw new Error("Falha ao buscar dados meteorológicos.");
    const weatherData = await weatherResponse.json();

    const { temperature_2m, weather_code } = weatherData.current;

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

    const descricao = weatherDescriptions[weather_code] || "Condição desconhecida";

    return {
      cidade: `${name}, ${country}`,
      temperatura: `${temperature_2m} °C`,
      descricao,
    };
  } catch (error) {
    console.error("Erro:", error.message);
    return { erro: true, mensagem: error.message };
  }
}

// Evento do botão de busca → usa a função acima
document.getElementById("searchBtn").addEventListener("click", async () => {
  const city = document.getElementById("cityInput").value.trim();
  const card = document.getElementById("weatherCard");
  const error = document.getElementById("errorMsg");

  if (!city) return;

  card.classList.add("hidden");
  error.classList.add("hidden");

  const result = await getWeatherByCity(city);

  if (result.erro) {
    error.textContent = result.mensagem;
    error.classList.remove("hidden");
    return;
  }

  document.getElementById("cityName").textContent = result.cidade;
  document.getElementById("temperature").textContent = result.temperatura;
  document.getElementById("description").textContent = result.descricao;
  document.getElementById("weatherIcon").textContent = "🌤️";

  card.classList.remove("hidden");
});
