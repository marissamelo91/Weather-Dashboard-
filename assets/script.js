const weatherForm = document.querySelector(".weatherForm");
const forecastCard = document.querySelector("#forecastCard");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card"); 
const searchHistory = document.querySelector("#search-history");
const apiKey = "48070ef699d302bca84ac6ec7e64e3c1";
const forecastParent = document.querySelector("#forecastParent")


weatherForm.addEventListener("submit", async event => {
  event.preventDefault();

  const city = cityInput.value;

  if (city) {
    try {
      const weatherData = await getWeatherData(city);
      displayWeatherInfo(weatherData);

      const forecastData = await getForecastData(city);
      console.log(forecastData);
      displayForecastInfo(forecastData);

      saveToLocalStorage(city)
      loadFromLocalStorage();

    }
  
    catch (error) {
      console.error(error);
      displayError(error);
    }
  }
  else {
    displayError("Enter a City")
  }

});


async function getWeatherData(city) {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  const response = await fetch(apiURL);

  console.log(response);

  if (!response.ok) {
    throw new Error("Could not fetch data");
  }
  return await response.json();
}

//Forecast Data 
async function getForecastData(city) {
  const apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  const response = await fetch(apiURL);

  console.log(response);

  if (!response.ok) {
    throw new Error("Could not fetch data");
  }
  const data = await response.json();
  const selectedData = [
    data.list[0],
    data.list[8],
    data.list[16],
    data.list[24],
    data.list[32],
    

  ];

  return selectedData;
}


//Data for Current Weather
function displayWeatherInfo(data) {

  const { name: city,

    dt: {date},
    main: { temp, humidity },
    wind: { speed },
    weather: [{ description, icon }] } = data;

  card.textContent = "";
  card.style.display = "flex";

  const cityDisplay = document.createElement("h1");
  const dateDisplay = document.createElement("p");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const windDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("img");

  cityDisplay.textContent = city;
  dateDisplay.textContent = dayjs(data.dt * 1000).format("MM/DD/YYYY");
  tempDisplay.textContent = `${((temp-273.15)* (9/5) +32).toFixed(1)}°F`;
  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  windDisplay.textContent = `Wind Speed: ${speed}`;
  weatherEmoji.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;


  cityDisplay.classList.add("cityDisplay");
  dateDisplay.classList.add("dateDisplay");
  tempDisplay.classList.add("tempDisplay");
  humidityDisplay.classList.add("humidityDisplay");
  windDisplay.classList.add("windDisplay");
  weatherEmoji.classList.add("weatherEmoji");


  card.appendChild(cityDisplay);
  card.appendChild(dateDisplay);
  card.appendChild(tempDisplay);
  card.appendChild(humidityDisplay);
  card.appendChild(windDisplay);
  card.appendChild(weatherEmoji);
}

// Display Forecast Data
function displayForecastInfo(forecastData) {
  forecastCard.style.display="flex"
  forecastParent.style.display=""

  for (let i = 0; i < forecastData.length; i++) {
    const data = forecastData[i];
    const { name: city,
      dt: {date},
      main: { temp, humidity },
      wind: { speed },
      weather: [{ description, icon }] } = data;

    const card = document.querySelector("#card-"+ (i +1));

    card.textContent = "";
    card.style.display = "flex";
  
    const cityDisplay = document.createElement("h1");
    const dateDisplay = document.createElement("p");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const windDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("img");
  
    cityDisplay.textContent = city;
    dateDisplay.textContent = dayjs(data.dt * 1000).format("MM/DD/YYYY");
    tempDisplay.textContent = `${((temp-273.15)* (9/5) +32).toFixed(1)}°F`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    windDisplay.textContent = `Wind Speed: ${speed}`;
    weatherEmoji.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  
  
    cityDisplay.classList.add("cityDisplay");
    dateDisplay.classList.add("dateDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    windDisplay.classList.add("windDisplay");
    weatherEmoji.classList.add("weatherEmoji");
  
  
    card.appendChild(cityDisplay);
    card.appendChild(dateDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(windDisplay);
    card.appendChild(weatherEmoji);
    
  }

  
}


//Display Error if City is not valid
function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);

}



function saveToLocalStorage(city) {
  const cities = JSON.parse(localStorage.getItem("savedCities")) || []

  cities.push(city);

  localStorage.setItem("savedCities", JSON.stringify(cities));
}

function loadFromLocalStorage() {
  const cities = JSON.parse(localStorage.getItem("savedCities")) || [];


  searchHistory.innerHTML = "";

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];

    // create a search history button
    const newButton = document.createElement("button");
    newButton.textContent = city;
    newButton.classList.add("search-history-item");
    searchHistory.appendChild(newButton)

    // add event listern for each button
    newButton.addEventListener("click", async function(e){
      const city = e.target.textContent
      try {
        const weatherData = await getWeatherData(city);
        displayWeatherInfo(weatherData);
  
        const forecastData = await getForecastData(city);
        console.log(forecastData);
        displayForecastInfo(forecastData);
      }
    
      catch (error) {
        console.error(error);
        displayError(error);
      }
    })
    
  }
}


loadFromLocalStorage();


