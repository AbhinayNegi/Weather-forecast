const searchField = document.getElementById("citySearchField");
const searchBtn = document.getElementById("seachBtn");
const clearSearchesBtn = document.getElementById("clearSearches");
const dropdown = document.getElementById("recentCities");
const recentSearchContainer = document.getElementById("recentSearchesContainer");

let recentSearch = [];

searchBtn.addEventListener("click", getEnteredCity);
function getEnteredCity(event) {
    // Trimming spaces
    const value = searchField.value.trim();

    // Validating if the user has left the search field empty or not
    if(value === "") {
        alert("Please enter a city");
    } else {
        console.log(searchField.value);
        addCityToRecentSearch(value);
    }
    
}

function addCityToRecentSearch(city) {
    if(recentSearch.includes(city)){
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

    // Applying tailwind hidden class to hide or unhide if we have recent searches in the array
    if(recentSearch.length === 0) {
        recentSearchContainer.classList.add("hidden");
    } else {
        recentSearchContainer.classList.remove("hidden");
    }
    // Here we getting data from local storage and since the data is in the form of string seperated by commas we are splitting the string and storing in the array, to further process the array
    if(localStorage.getItem("recent") != null) {
        recentSearch = localStorage.getItem("recent").split(",");
    }
    
    // For every searched city in the recentSearch array we are creating option element and appending it to the dropdown element
    recentSearch.forEach((city) => {
        console.log(city);
        let optionElement = document.createElement("option");
        optionElement.value = city;
        optionElement.textContent = city;
        dropdown.appendChild(optionElement);
    })
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