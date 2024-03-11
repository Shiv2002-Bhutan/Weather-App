var weatherApi = '/weather';
const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const weatherIcon = document.querySelector('.weatherIcon i');
const weatherCondition = document.querySelector('.weatherCondition');
const temptElement = document.querySelector('.temperature span');
const locationElement = document.querySelector('.place');
const dateElement = document.querySelector('.date');


function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12; 
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes; 
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}


function formatDate(date) {
    const day = date.getDate();
    const monthName = date.toLocaleString("en-US", { month: "long" });
    return `${day},${monthName}`;
}


const currentDate = new Date();
dateElement.textContent = formatTime(currentDate) + " | " + formatDate(currentDate);

if ("geolocation" in navigator) {
    locationElement.textContent = "Loading..."
    navigator.geolocation.getCurrentPosition(
        function (position) {
            const lat = position.coords.latitude
            const long = position.coords.longitude
            const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`

            fetch(apiUrl).then((response) => response.json()).then((data) => {
                if (data && data.address && data.address.city) {
                    const city = data.address.city;
                    showData(city)

                } else {
                    console.log("City Not Found")
                }

            })
                .catch((error) => {
                    console.log(error)
                })

        }
    )
} else {
    console.log("Geolocation Not Available On This Browser")
}

weatherForm.addEventListener("submit", (e) => {
    e.preventDefault();
    locationElement.textContent = "Loading..."
    weatherIcon.className = "";
    temptElement.textContent = ""
    weatherCondition.textContent = ""
    showData(search.value)
})

function showData(city) {
    getWeatherData(city, (result) => {
        if (result.cod === 200) {
            if (result.weather[0].description == "rain") {
                weatherIcon.className = "wi wi-day-rainy"
            } else if (result.weather[0].description == "sunny") {
                weatherIcon.textContent = weatherIcon.className = "wi wi-day-sunny"
            } else {
                weatherIcon.className = "wi wi-day-cloudy"
            }
            locationElement.textContent = result.name;
            temptElement.textContent = (result.main.feels_like - 273).toFixed() + "°C";
            weatherCondition.textContent = result.weather[0].description.toUpperCase()

        } else {
            locationElement.textContent = "City not Found "

        }
    })

}

function getWeatherData(city, callback) {
    const locationApi = weatherApi + "?address=" + city;
    fetch(locationApi)
        .then((response) => {
            response.json().then((response) => {
                callback(response)
            })
        })

}
