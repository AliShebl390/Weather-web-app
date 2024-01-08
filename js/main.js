let current = false;
let citySpan = document.querySelector("#citySpan");
let rain = document.querySelector("#rain");
let temp_c = document.querySelector("#temp_c");
let isDay = true;
let hero = document.querySelector("#hero");
let feels = document.querySelector("#feels");
let wind = document.querySelector("#wind");
let humidity = document.querySelector("#humadity");
let uv = document.querySelector("#uv");
let hoursDiv = document.querySelector("#hoursDiv");
let aside = document.querySelector("#aside");
let searchInput = document.getElementById("searchInput");

// create async function
async function city() {
    // make it wait and fetch the data
    let data = await fetch(
        "https://api.geoapify.com/v1/ipinfo?apiKey=3c992b5be33640f3b979f5e13eec1eb3"
    );
    // store the data into variable
    let finalData = await data.json();
    currentCity = finalData.city.name;
    // send the location of the user
    if (current === false) {
        getData(currentCity);
    }
    // checks the input cahnges and send it
    searchInput.addEventListener("input", function (e) {
        current = e.target.value;
        if (current !== null) {
            getData(current);
        }
    });
}

//
//

async function getData(city) {
    // in case the location is undefined cairo city will be the default
    if (city === undefined) {
        city = "london";
    }
    let data = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=fc2c9b6df5dc49e4b99162312240501&q=${city}&days=7&aqi=no&alerts=no`
    );
    // get the data from api
    let finalData = await data.json();

    // get the next 7 days
    let days = finalData.forecast.forecastday;
    //
    //
    // data for main top section
    citySpan.innerHTML = `${finalData.location.name}, ${finalData.location.country}`;
    rain.innerHTML = `chance of rain: ${finalData.forecast.forecastday[0].day.daily_chance_of_rain}%`;
    temp_c.innerHTML = `    ${finalData.current.temp_c}<span>&#8451;</span>`;
    //checks if its day or night to change the icon
    isDay = finalData.current.is_day;
    if (isDay) {
        hero.attributes.src.value = "images/sun.png";
    } else {
        ("images/crescent-moon.png");
    }
    //data for main bottom section
    feels.innerHTML = `${finalData.current.feelslike_c}<span>&#8451;</span>`;
    humidity.innerHTML = `${finalData.current.humidity}%`;
    wind.innerHTML = `${finalData.current.wind_kph} Kp/h`;
    uv.innerHTML = `${finalData.current.uv}`;
    //data for main middle seciton
    let hours = finalData.forecast.forecastday[0].hour;
    let hoursResult = "";
    for (let i = 0; i < hours.length; i += 4) {
        hoursResult += `
        <div class="box col">
        <p>${tConvert(hours[i].time.slice(11))}</p>
        <img src="${hours[i].condition.icon}" class="" alt="">
        <h5>${hours[i].temp_c.toFixed()}<span>&#8451;</span></h5>
        </div>
        `;
    }
    hoursDiv.innerHTML = hoursResult;
    //
    // data for aside section (days)
    //
    let daysResult = "";
    days.forEach((element) => {
        // store all data into Date variable which return number of day in a week
        let date = new Date(element.date).getDay();
        // ceate a list of the days in the week
        const weekday = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        // get the day
        let day = weekday[date];
        // display the data
        daysResult += `<div class="box">
        <span>${day}</span>
        <div>
            <img src="${element.day.condition.icon}" alt="">
        <h4>${element.day.condition.text}</h4>
        </div>
        <h4>${element.day.maxtemp_c.toFixed()}<span>&#8451;</span> <span>/${element.day.mintemp_c.toFixed()}<span>&#8451;</span></span></h4>
    </div>`;
    });
    aside.innerHTML = daysResult;
}

city();

// to convert time form 24h to 12h
function tConvert(time) {
    // Check correct time format and split into components
    time = time
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
        // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
}
