// Função auxiliar para montar o URL de geocodificação
const buildGeoUrl = (city) =>
  `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1&language=pt&format=json`;

// Função auxiliar para montar o URL da previsão
const buildWeatherUrl = (latitude, longitude) =>
  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;

/**
 * 🔹 Função otimizada para buscar clima de UMA cidade
 */
export async function getWeatherByCity(cityName) {
  try {
    if (!cityName) throw new Error("Digite o nome de uma cidade.");

    // 1️⃣ Buscar coordenadas (apenas o essencial)
    const geoRes = await fetch(buildGeoUrl(cityName));
    if (!geoRes.ok) throw new Error("Falha ao buscar coordenadas.");
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0)
      throw new Error("Cidade não encontrada.");

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2️⃣ Buscar apenas os dados necessários do clima
    const weatherRes = await fetch(buildWeatherUrl(latitude, longitude));
    if (!weatherRes.ok) throw new Error("Falha ao buscar dados meteorológicos.");
    const weatherData = await weatherRes.json();

    // 3️⃣ Converter código de clima em descrição legível
    const weatherDescriptions = {
      0: "Céu limpo",
      1: "Principalmente limpo",
      2: "Parcialmente nublado",
      3: "Nublado",
      45: "Nevoeiro",
      51: "Garoa leve",
      61: "Chuva leve",
      63: "Chuva moderada",
      65: "Chuva forte",
      80: "Aguaceiros leves",
      81: "Aguaceiros moderados",
      82: "Aguaceiros fortes",
      95: "Trovoadas",
    };

    const { temperature_2m, weather_code } = weatherData.current;

    return {
      cidade: `${name}, ${country}`,
      temperatura: temperature_2m,
      descricao: weatherDescriptions[weather_code] || "Condição desconhecida",
    };
  } catch (error) {
    throw new Error(error.message || "Erro desconhecido.");
  }
}

/**
 * 🔸 Função NOVA: buscar clima de várias cidades em paralelo
 */
export async function getWeatherForMultipleCities(cityList) {
  if (!Array.isArray(cityList) || cityList.length === 0) {
    throw new Error("Forneça uma lista de cidades.");
  }

  // Executa todas as requisições em paralelo (Promise.all)
  const results = await Promise.allSettled(
    cityList.map((city) => getWeatherByCity(city))
  );

  // Retorna um array com sucesso e erros tratados
  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      return { cidade: cityList[index], erro: result.reason.message };
    }
  });
}
