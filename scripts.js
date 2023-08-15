// Function to fetch forecast data
async function fetchForecast(cityName) {
  const apiKey = "248e30e1b319965578b944f3ea568be1"; // Replace with your actual API key
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
  );
  const data = await response.json();
  return data;
}

// Function to populate forecast data in the forecast section
function populateForecast(forecastData) {
  const forecastSection = document.getElementById("forecast");
  forecastSection.innerHTML = ""; // Clear previous forecast data

  const currentDate = new Date();
  const forecastDays = {};

  // Loop through the forecast data and organize it by day
  for (const day of forecastData.list) {
    const forecastDate = new Date(day.dt_txt);
    const dateKey = forecastDate.toDateString();

    if (!forecastDays[dateKey] && forecastDate >= currentDate) {
      forecastDays[dateKey] = day;
    }
  }

  // Create weather cards for each day
  for (const key in forecastDays) {
    const day = forecastDays[key];
    const card = document.createElement("div");
    card.classList.add("weather-card");

    // Extract relevant data from the API response
    const date = day.dt_txt;
    const temperature = day.main.temp;
    const weatherDescription = day.weather[0].description;

    // Create the card's HTML structure
    card.innerHTML = `
        <h3>${dayjs(date).format("dddd")}</h3>
        <p>Date: ${dayjs(date).format("YYYY-MM-DD")}</p>
        <p>Temperature: ${temperature}°C</p>
        <p>Weather: ${weatherDescription}</p>
      `;

    forecastSection.appendChild(card); // Append the card to the forecast section
  }
}

// Add event listener for the search form
document
  .getElementById("search-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const cityName = document.getElementById("search-input").value;
    const forecastData = await fetchForecast(cityName);
    populateForecast(forecastData);
  });
