/* =====================================================
   AQUANEX
   FEATURE 5 - WATER LEVEL MONITORING
   ===================================================== */


/* =====================================================
   LOAD LOCATION
   ===================================================== */

const latitude =
    localStorage.getItem("aquanexLatitude");

const longitude =
    localStorage.getItem("aquanexLongitude");


if (latitude !== null) {

    document.getElementById("latitude").innerText =
        Number(latitude).toFixed(6);

}
else {

    document.getElementById("latitude").innerText =
        "Not Selected";

}


if (longitude !== null) {

    document.getElementById("longitude").innerText =
        Number(longitude).toFixed(6);

}
else {

    document.getElementById("longitude").innerText =
        "Not Selected";

}


/* =====================================================
   LOAD WEATHER DATA
   ===================================================== */

const savedWeather =
    localStorage.getItem(
        "aquanexWeatherData"
    );


if (savedWeather !== null) {

    const weatherData =
        JSON.parse(savedWeather);


    document.getElementById("temperature").innerText =
        weatherData.temperature + " °C";


    document.getElementById("rainfall").innerText =
        weatherData.rainfall + " mm";


    document.getElementById("humidity").innerText =
        weatherData.humidity + " %";


    document.getElementById("condition").innerText =
        weatherData.condition;

}
else {

    document.getElementById("temperature").innerText =
        "Not Available";


    document.getElementById("rainfall").innerText =
        "Not Available";


    document.getElementById("humidity").innerText =
        "Not Available";


    document.getElementById("condition").innerText =
        "Not Available";

}


/* =====================================================
   CALCULATE WATER RISK
   ===================================================== */

function calculateWaterRisk() {

    /* Get water level */

    const waterLevelInput =
        document.getElementById("waterLevel");


    const waterLevel =
        Number(waterLevelInput.value);


    /* Get drainage */

    const drainageInput =
        document.getElementById("drainage");


    const drainage =
        drainageInput.value;


    /* Get historical reports */

    const historicalInput =
        document.getElementById("historicalReports");


    const historicalReports =
        Number(historicalInput.value);


    /* Result area */

    const result =
        document.getElementById(
            "waterLevelResult"
        );


    /* =================================================
       VALIDATION
       ================================================= */

    if (
        waterLevelInput.value === "" ||
        isNaN(waterLevel) ||
        waterLevel < 0
    ) {

        result.innerText =
            "❌ Please enter a valid water level.";

        return;
    }


    if (drainage === "") {

        result.innerText =
            "❌ Please select the drainage condition.";

        return;
    }


    if (
        historicalInput.value === "" ||
        isNaN(historicalReports) ||
        historicalReports < 0
    ) {

        result.innerText =
            "❌ Please enter the number of historical reports.";

        return;
    }


    /* =================================================
       WATER LEVEL RISK
       ================================================= */

    let waterRisk;


    if (waterLevel <= 10) {

        waterRisk = "LOW";

        result.innerText =
            "🟢 LOW WATER LEVEL\n\n" +
            "Water level is within the safe range.";

    }

    else if (waterLevel <= 20) {

        waterRisk = "MEDIUM";

        result.innerText =
            "🟠 MEDIUM WATER LEVEL\n\n" +
            "Water level is increasing. Monitoring is recommended.";

    }

    else {

        waterRisk = "HIGH";

        result.innerText =
            "🔴 HIGH WATER LEVEL\n\n" +
            "Water level is high and may indicate waterlogging.";

    }


    /* =================================================
       SAVE WATER LEVEL DATA
       ================================================= */

    const waterLevelData = {

        waterLevel:
            waterLevel,

        waterRisk:
            waterRisk,

        drainageCondition:
            drainage,

        historicalReports:
            historicalReports,

        latitude:
            latitude !== null
                ? Number(latitude)
                : null,

        longitude:
            longitude !== null
                ? Number(longitude)
                : null,

        timestamp:
            new Date().toISOString()

    };


    localStorage.setItem(
        "aquanexWaterLevelData",
        JSON.stringify(
            waterLevelData
        )
    );


    /* =================================================
       SUCCESS MESSAGE
       ================================================= */

    result.innerText +=
        "\n\n✅ Water level data saved successfully.";

}


/* =====================================================
   CONTINUE TO RISK ANALYSIS
   ===================================================== */

function goToRiskAnalysis() {

    const savedData =
        localStorage.getItem(
            "aquanexWaterLevelData"
        );


    if (savedData === null) {

        alert(
            "Please calculate the water risk first."
        );

        return;
    }


    window.location.href =
        "riskanalysis.html";

}