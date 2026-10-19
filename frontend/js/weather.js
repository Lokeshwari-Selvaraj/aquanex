/* =====================================================
   AQUANEX
   FEATURE 4 - WEATHER DATA COLLECTION
   DEMO / TEST MODE
   ===================================================== */


/* =====================================================
   LOAD LOCATION FROM FEATURE 3
   ===================================================== */

const latitude =
    localStorage.getItem("aquanexLatitude");

const longitude =
    localStorage.getItem("aquanexLongitude");


/* =====================================================
   DISPLAY SELECTED LOCATION
   ===================================================== */

if (latitude !== null && longitude !== null) {

    document.getElementById("latitude").innerText =
        Number(latitude).toFixed(6);

    document.getElementById("longitude").innerText =
        Number(longitude).toFixed(6);

}
else {

    document.getElementById("latitude").innerText =
        "Not Selected";

    document.getElementById("longitude").innerText =
        "Not Selected";

}


/* =====================================================
   GET WEATHER DATA - DEMO MODE
   ===================================================== */

function getWeatherData() {

    document.getElementById("weatherStatus").innerText =
        "🌦️ Collecting weather data...";


    setTimeout(function() {

        /* ================= WEATHER VALUES ================= */

        document.getElementById("temperature").innerText =
            "29 °C";

        document.getElementById("humidity").innerText =
            "78 %";

        document.getElementById("rainfall").innerText =
            "12 mm";

        document.getElementById("wind").innerText =
            "3.5 m/s";

        document.getElementById("pressure").innerText =
            "1008 hPa";

        document.getElementById("clouds").innerText =
            "75 %";


        /* ================= WEATHER CONDITION ================= */

        document.getElementById("condition").innerText =
            "Rain";

        document.getElementById("description").innerText =
            "Light rain expected";

        document.getElementById("conditionIcon").innerText =
            "🌧️";


        /* ================= STATUS ================= */

        document.getElementById("weatherStatus").innerText =
            "✅ Weather data collected successfully!";


        /* =====================================================
           SAVE WEATHER DATA
           ===================================================== */

        const weatherData = {

            temperature: 29,

            humidity: 78,

            rainfall: 12,

            windSpeed: 3.5,

            pressure: 1008,

            clouds: 75,

            condition: "Rain"

        };


        localStorage.setItem(
            "aquanexWeatherData",
            JSON.stringify(weatherData)
        );


    }, 1000);

}


/* =====================================================
   GO TO FEATURE 5 - WATER LEVEL
   ===================================================== */

function goToPrediction() {

    const weatherData =
        localStorage.getItem(
            "aquanexWeatherData"
        );


    /* Check whether weather data exists */

    if (!weatherData) {

        alert(
            "Please collect weather data first."
        );

        return;

    }


    /* Check whether location exists */

    const latitude =
        localStorage.getItem(
            "aquanexLatitude"
        );

    const longitude =
        localStorage.getItem(
            "aquanexLongitude"
        );


    if (
        latitude === null ||
        longitude === null
    ) {

        alert(
            "Please select a location first."
        );

        return;

    }


    /* =====================================================
       GO TO FEATURE 5
       ===================================================== */

    window.location.href =
        "waterlevel.html";

}