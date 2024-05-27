const searchField = document.getElementById("citySearchField");
const searchBtn = document.getElementById("seachBtn");
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
        return;
    }

    // We are pushing the current city name to the first index of the array
    recentSearch.unshift(city);
    // We are triming our array to keeping its size to 5 elements only because we only want to store 5 recent cities searched.
    recentSearch = recentSearch.slice(0, 5);
    localStorage.setItem("recent", recentSearch);
    console.log(localStorage.getItem("recent"));
}