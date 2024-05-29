const searchField = document.getElementById("citySearchField");
const searchBtn = document.getElementById("seachBtn");
const clearSearchesBtn = document.getElementById("clearSearches");
const dropdown = document.getElementById("recentCities");
const recentSearchContainer = document.getElementById(
  "recentSearchesContainer"
);
const currentLocationBtn = document.getElementById("currentLocationBtn");

const apiKey = "6d97913c5ae84c2440f0f66b96381f21";

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
    console.log(lat);
    console.log(long);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  
    const response = await fetch(url);
    const data = await response.json();
  
    console.log(data);
}

function failure() {}

// Selecting city from the recent search city dropdown list

dropdown.addEventListener("change", (event) => {
    const city = event.target.value;
    fetchWeatherData(city);
})