// Function to fetch forecast data
async function fetchForecast(cityName) {
  let apiKey = "248e30e1b319965578b944f3ea568be1"; // Replace with your actual API key
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
  );
  let data = await response.json();
  return data;
}

// Function to populate forecast data in the forecast section
function populateForecast(forecastData) {
  let forecastSection = document.getElementById("forecast");
  forecastSection.innerHTML = ""; // Clear previous forecast data

  let currentDate = new Date();
  let forecastDays = {};
  // Loop through the forecast data and organize it by day
  for (let day of forecastData.list) {
    let forecastDate = new Date(day.dt_txt);
    let dateKey = forecastDate.toDateString();

    if (!forecastDays[dateKey] && forecastDate >= currentDate) {
      forecastDays[dateKey] = day;
    }
  }

  // Create weather cards for each day
  for (let key in forecastDays) {
    let day = forecastDays[key];
    let card = document.createElement("div");
    card.classList.add("weather-card");

    // Extract relevant data from the API response
    let date = day.dt_txt;
    let temperature = day.main.temp;
    let weatherDescription = day.weather[0].description;

    // Create the card's HTML structure
    card.innerHTML = `
        <h3>${dayjs(date).format("dddd")}</h3>
        <p>Date: ${dayjs(date).format("YYYY-MM-DD")}</p>
        <p>Temperature: ${temperature}°C</p>
        <p>Weather: ${weatherDescription}</p>
      `;

    // Append the card to the forecast section or to today section based on whether the
    // forecast is for today or for any of the future days
    if (dayjs(currentDate).format("dddd") === dayjs(date).format("dddd"))
      document.getElementById("today").append(card);
    else forecastSection.appendChild(card);
  }
}

// Add event listener for the search form
document
  .getElementById("search-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    let cityName = document.getElementById("search-input").value;
    let forecastData = await fetchForecast(cityName);
    populateForecast(forecastData);
  });
