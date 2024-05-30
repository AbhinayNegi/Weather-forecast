const searchField = document.getElementById("citySearchField");
const searchBtn = document.getElementById("seachBtn");
const clearSearchesBtn = document.getElementById("clearSearches");
const dropdown = document.getElementById("recentCities");
const recentSearchContainer = document.getElementById(
  "recentSearchesContainer"
);
const currentLocationBtn = document.getElementById("currentLocationBtn");

const apiKey = "6d97913c5ae84c2440f0f66b96381f21";
const weatherIcon = document.getElementById("weatherIcon");
const weatherDisplaySection = document.getElementById("displayWeather");
const cityName = document.getElementById("cityName");
const mainTemp = document.getElementById("temp");
const weatherDesc = document.getElementById("desc");
const minTemp = document.getElementById("minTemp");
const maxTemp = document.getElementById("maxTemp");
const pressure = document.getElementById("pressure");

let recentSearch = [];

searchBtn.addEventListener("click", getEnteredCity);
function getEnteredCity(event) {
  // Trimming spaces
  const value = searchField.value.trim();

  // Validating if the user has left the search field empty or not
  if (value === "") {
    alert("Please enter a city");
  } else {
    console.log(searchField.value);
    // addCityToRecentSearch(value);
    fetchWeatherData(value);
  }
}

function addCityToRecentSearch(city) {
  if (recentSearch.includes(city)) {
    // If the city already in the recent search then just return
    return;
  }

  // We are pushing the current city name to the first index of the array
  recentSearch.unshift(city);
  // We are triming our array to keeping its size to 5 elements only because we only want to store 5 recent cities searched.
  recentSearch = recentSearch.slice(0, 5);
  localStorage.setItem("recent", recentSearch);
  console.log(localStorage.getItem("recent"));
  updateRecentSearchDropDown();
}

function updateRecentSearchDropDown() {
  // We are making sure there is always only one option and removing other options from dropdown list
  dropdown.length = 1;

  // Here we getting data from local storage and since the data is in the form of string seperated by commas we are splitting the string and storing in the array, to further process the array
  if (localStorage.getItem("recent") != null) {
    recentSearch = localStorage.getItem("recent").split(",");
    // Removing the hidden class and making recent search dropdown appear if we have recent searches.
    recentSearchContainer.classList.remove("hidden");
  } else {
    // Applying tailwind hidden class to hide the dropdown if we dont have recent searches in the array
    recentSearchContainer.classList.add("hidden");
  }

  // For every searched city in the recentSearch array we are creating option element and appending it to the dropdown element
  recentSearch.forEach((city) => {
    console.log(city);
    let optionElement = document.createElement("option");
    optionElement.value = city;
    optionElement.textContent = city;
    dropdown.appendChild(optionElement);
  });
}

clearSearchesBtn.addEventListener("click", clearSearches);
function clearSearches(event) {
  // function clears the search history by making array empty and clearing local storage
  recentSearch = [];
  localStorage.clear();
  updateRecentSearchDropDown();
}

window.addEventListener("load", (event) => {
  console.log("Loaded");
  updateRecentSearchDropDown();
});

function fetchWeatherData(city) {
  url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (!data.ok) {
        if (data.cod == 404) {
          throw new Error("city not found");
        }
      }
      addCityToRecentSearch(city);
      displayWeatherData(data);
      console.log(data);
    })
    .catch((error) => {
      alert(`Invalid city name: ${city}`);
    });
}

function fetchWeatherDataGeoLocation(lon, lat) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (!data.ok) {
        if (data.cod == 404) {
          throw new Error("city not found");
        }
      }
      addCityToRecentSearch(data.name);
      displayWeatherData(data);
      console.log(data);
    })
    .catch((error) => {
      alert(`Invalid city name: ${city}`);
    });
}

currentLocationBtn.addEventListener("click", fetchWeatherBaseOnLocation);
function fetchWeatherBaseOnLocation(event) {
  const detectedLocation = navigator.geolocation.getCurrentPosition(
    success,
    failure
  );
}

async function success(position) {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;
  
  fetchWeatherDataGeoLocation(long, lat);
}

function failure() {}

// Selecting city from the recent search city dropdown list

dropdown.addEventListener("change", (event) => {
  const city = event.target.value;
  if (city !== "Select a City") {
    fetchWeatherData(city);
  }
});

function displayWeatherData(data) {
  // Creating array that represent different weather types code group like 2 for 200 - 232 code type
  const groupCodes = [2, 3, 5, 6, 7, 8, 9];
  currentWeatherGroupCode = 0;

  // Getting the weather code
  const weatherCode = data.weather[0].id;
  // Special case if weather code is between 801 to 804 it will be reprsented by number 9
  if (weatherCode > 800 && weatherCode <= 804) {
    currentWeatherGroupCode = 9;
  } else {
    // We are getting the first digit from the weather code. For example 200 -> 2, 300 -> 3 etc.
    currentWeatherGroupCode = Math.trunc(weatherCode / 100);
  }

  console.log(currentWeatherGroupCode);

  // Based on weather group code display correct weather icons
  switch (currentWeatherGroupCode) {
    case 2:
      weatherIcon.setAttribute(
        "src",
        "http://openweathermap.org/img/wn/11d@2x.png"
      );
      cityName.innerHTML = data.name;
      mainTemp.innerHTML = data.main.temp;
      weatherDesc.innerHTML = data.weather[0].main;
      maxTemp.innerHTML = data.main.temp_max;
      minTemp.innerHTML = data.main.temp_min;
      break;

    case 3:
      weatherIcon.setAttribute(
        "src",
        "http://openweathermap.org/img/wn/09d@2x.png"
      );
      cityName.innerHTML = data.name;
      mainTemp.innerHTML = data.main.temp;
      weatherDesc.innerHTML = data.weather[0].main;
      maxTemp.innerHTML = data.main.temp_max;
      minTemp.innerHTML = data.main.temp_min;
      pressure.innerHTML = data.main.pressure;
      break;

    case 5:
      weatherIcon.setAttribute(
        "src",
        "http://openweathermap.org/img/wn/10d@2x.png"
      );
      cityName.innerHTML = data.name;
      mainTemp.innerHTML = data.main.temp;
      weatherDesc.innerHTML = data.weather[0].main;
      maxTemp.innerHTML = data.main.temp_max;
      minTemp.innerHTML = data.main.temp_min;
      pressure.innerHTML = data.main.pressure;
      break;

    case 6:
      weatherIcon.setAttribute(
        "src",
        "http://openweathermap.org/img/wn/13d@2x.png"
      );
      cityName.innerHTML = data.name;
      mainTemp.innerHTML = data.main.temp;
      weatherDesc.innerHTML = data.weather[0].main;
      maxTemp.innerHTML = data.main.temp_max;
      minTemp.innerHTML = data.main.temp_min;
      pressure.innerHTML = data.main.pressure;
      break;

    case 7:
      weatherIcon.setAttribute(
        "src",
        "http://openweathermap.org/img/wn/50d@2x.png"
      );
      cityName.innerHTML = data.name;
      mainTemp.innerHTML = data.main.temp;
      weatherDesc.innerHTML = data.weather[0].main;
      maxTemp.innerHTML = data.main.temp_max;
      minTemp.innerHTML = data.main.temp_min;
      pressure.innerHTML = data.main.pressure;
      break;

    case 8:
      weatherIcon.setAttribute(
        "src",
        "http://openweathermap.org/img/wn/01d@2x.png"
      );
      cityName.innerHTML = data.name;
      mainTemp.innerHTML = data.main.temp;
      weatherDesc.innerHTML = data.weather[0].main;
      maxTemp.innerHTML = data.main.temp_max;
      minTemp.innerHTML = data.main.temp_min;
      pressure.innerHTML = data.main.pressure;
      break;

    case 9:
      weatherIcon.setAttribute(
        "src",
        "http://openweathermap.org/img/wn/03d@2x.png"
      );
      cityName.innerHTML = data.name;
      mainTemp.innerHTML = data.main.temp;
      weatherDesc.innerHTML = data.weather[0].main;
      maxTemp.innerHTML = data.main.temp_max;
      minTemp.innerHTML = data.main.temp_min;
      pressure.innerHTML = data.main.pressure;
      break;
  }
}
