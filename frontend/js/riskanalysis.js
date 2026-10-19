/* =====================================================
   AQUANEX
   FEATURE 6 - RISK ANALYSIS
   ROBUST DATA LOADING + HISTORICAL REPORTS
   ===================================================== */


/* =====================================================
   HELPER FUNCTION
   ===================================================== */

function getSavedData(key) {

    const data =
        localStorage.getItem(key);

    if (data === null) {
        return null;
    }

    try {

        return JSON.parse(data);

    }
    catch (error) {

        console.error(
            "Error reading " + key,
            error
        );

        return null;
    }
}


/* =====================================================
   LOAD ALL DATA
   ===================================================== */

function loadRiskAnalysisData() {

    /*
     * LOAD LOCATION
     */

    let latitude =
        localStorage.getItem(
            "aquanexLatitude"
        );

    let longitude =
        localStorage.getItem(
            "aquanexLongitude"
        );


    /*
     * LOAD WEATHER
     */

    const weatherData =
        getSavedData(
            "aquanexWeatherData"
        );


    /*
     * LOAD WATER LEVEL
     */

    const waterData =
        getSavedData(
            "aquanexWaterLevelData"
        );


    /*
     * IF LOCATION IS NOT AVAILABLE
     * USE LOCATION SAVED WITH WATER DATA
     */

    if (
        (latitude === null ||
         longitude === null) &&
        waterData !== null
    ) {

        if (
            latitude === null &&
            waterData.latitude !== null &&
            waterData.latitude !== undefined
        ) {

            latitude =
                waterData.latitude;
        }


        if (
            longitude === null &&
            waterData.longitude !== null &&
            waterData.longitude !== undefined
        ) {

            longitude =
                waterData.longitude;
        }
    }


    /* =================================================
       DISPLAY LOCATION
       ================================================= */

    const latitudeElement =
        document.getElementById(
            "latitude"
        );

    const longitudeElement =
        document.getElementById(
            "longitude"
        );


    if (latitudeElement) {

        if (latitude !== null) {

            latitudeElement.innerText =
                Number(latitude).toFixed(6);

        }
        else {

            latitudeElement.innerText =
                "Not Available";
        }
    }


    if (longitudeElement) {

        if (longitude !== null) {

            longitudeElement.innerText =
                Number(longitude).toFixed(6);

        }
        else {

            longitudeElement.innerText =
                "Not Available";
        }
    }


    /* =================================================
       DISPLAY WEATHER
       ================================================= */

    if (weatherData !== null) {

        const rainfallElement =
            document.getElementById(
                "rainfall"
            );

        const temperatureElement =
            document.getElementById(
                "temperature"
            );

        const humidityElement =
            document.getElementById(
                "humidity"
            );

        const conditionElement =
            document.getElementById(
                "condition"
            );


        if (rainfallElement) {

            rainfallElement.innerText =
                weatherData.rainfall +
                " mm";
        }


        if (temperatureElement) {

            temperatureElement.innerText =
                weatherData.temperature +
                " °C";
        }


        if (humidityElement) {

            humidityElement.innerText =
                weatherData.humidity +
                " %";
        }


        if (conditionElement) {

            conditionElement.innerText =
                weatherData.condition ||
                "Not Available";
        }

    }
    else {

        const rainfallElement =
            document.getElementById(
                "rainfall"
            );

        const temperatureElement =
            document.getElementById(
                "temperature"
            );

        const humidityElement =
            document.getElementById(
                "humidity"
            );

        const conditionElement =
            document.getElementById(
                "condition"
            );


        if (rainfallElement) {

            rainfallElement.innerText =
                "Not Available";
        }


        if (temperatureElement) {

            temperatureElement.innerText =
                "Not Available";
        }


        if (humidityElement) {

            humidityElement.innerText =
                "Not Available";
        }


        if (conditionElement) {

            conditionElement.innerText =
                "Not Available";
        }
    }


    /* =================================================
       DISPLAY WATER LEVEL
       ================================================= */

    if (waterData !== null) {

        const waterLevelElement =
            document.getElementById(
                "waterLevel"
            );

        const waterRiskElement =
            document.getElementById(
                "waterRisk"
            );

        const drainageElement =
            document.getElementById(
                "drainage"
            );

        const historicalElement =
            document.getElementById(
                "historicalReports"
            );


        if (waterLevelElement) {

            waterLevelElement.innerText =
                waterData.waterLevel +
                " cm";
        }


        if (waterRiskElement) {

            waterRiskElement.innerText =
                waterData.waterRisk ||
                "Not Available";
        }


        if (drainageElement) {

            drainageElement.innerText =
                getDrainageName(
                    waterData.drainageCondition
                );
        }


        if (historicalElement) {

            historicalElement.innerText =
                "Loading...";
        }

    }
    else {

        const waterLevelElement =
            document.getElementById(
                "waterLevel"
            );

        const waterRiskElement =
            document.getElementById(
                "waterRisk"
            );

        const drainageElement =
            document.getElementById(
                "drainage"
            );

        const historicalElement =
            document.getElementById(
                "historicalReports"
            );


        if (waterLevelElement) {

            waterLevelElement.innerText =
                "Not Available";
        }


        if (waterRiskElement) {

            waterRiskElement.innerText =
                "Not Available";
        }


        if (drainageElement) {

            drainageElement.innerText =
                "Not Available";
        }


        if (historicalElement) {

            historicalElement.innerText =
                "Not Available";
        }
    }


    /*
     * RETURN DATA FOR CALCULATION
     */

    return {

        latitude:
            latitude,

        longitude:
            longitude,

        weatherData:
            weatherData,

        waterData:
            waterData
    };
}


/* =====================================================
   DRAINAGE NAME
   ===================================================== */

function getDrainageName(value) {

    if (value === "good") {

        return "Good";
    }


    if (value === "poor") {

        return "Poor";
    }


    if (value === "none") {

        return "No Drainage";
    }


    if (value === "unknown") {

        return "Unknown / Not Available";
    }


    return "Not Available";
}


/* =====================================================
   GET HISTORICAL REPORTS
   ===================================================== */

async function getHistoricalReports(
    latitude,
    longitude
) {

    const historicalElement =
        document.getElementById(
            "historicalReports"
        );


    if (
        latitude === null ||
        longitude === null
    ) {

        if (historicalElement) {

            historicalElement.innerText =
                "Location Not Available";
        }

        return [];
    }


    try {

        const response =
            await fetch(
                "http://localhost:8080/api/reports/nearby" +
                "?latitude=" +
                encodeURIComponent(latitude) +
                "&longitude=" +
                encodeURIComponent(longitude) +
                "&radius=500"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load historical reports."
            );
        }


        const reports =
            await response.json();


        if (historicalElement) {

            historicalElement.innerText =
                reports.length;
        }


        return reports;

    }
    catch (error) {

        console.error(
            "Historical Report Error:",
            error
        );


        if (historicalElement) {

            historicalElement.innerText =
                "Unavailable";
        }


        return [];
    }
}


/* =====================================================
   GLOBAL DATA
   ===================================================== */

let currentData = {

    latitude: null,

    longitude: null,

    weatherData: null,

    waterData: null
};


let historicalReports = [];


/* =====================================================
   INITIALIZE PAGE
   ===================================================== */

async function initializeRiskAnalysis() {

    currentData =
        loadRiskAnalysisData();


    historicalReports =
        await getHistoricalReports(
            currentData.latitude,
            currentData.longitude
        );
}


/* =====================================================
   CALCULATE RISK
   ===================================================== */

async function calculateRisk() {

    /*
     * RELOAD DATA BEFORE CALCULATION
     */

    currentData =
        loadRiskAnalysisData();


    const latitude =
        currentData.latitude;

    const longitude =
        currentData.longitude;

    const weatherData =
        currentData.weatherData;

    const waterData =
        currentData.waterData;


    /* =================================================
       CHECK WEATHER
       ================================================= */

    if (weatherData === null) {

        alert(
            "Weather data is not available. Please complete the Weather page first."
        );

        return;
    }


    /* =================================================
       CHECK WATER LEVEL
       ================================================= */

    if (waterData === null) {

        alert(
            "Water level data is not available. Please complete the Water Level page first."
        );

        return;
    }


    /* =================================================
       GET VALUES
       ================================================= */

    const rainfall =
        Number(
            weatherData.rainfall
        );


    const waterLevel =
        Number(
            waterData.waterLevel
        );


    const drainage =
        waterData.drainageCondition;


    /* =================================================
       GET HISTORICAL REPORTS
       ================================================= */

    historicalReports =
        await getHistoricalReports(
            latitude,
            longitude
        );


    const historicalReportCount =
        historicalReports.length;


    /* =================================================
       SCORE
       ================================================= */

    let score = 0;

    let factors = [];


    /* =================================================
       RAINFALL
       ================================================= */

    if (rainfall <= 10) {

        score += 10;

        factors.push(
            "🌧️ Rainfall: Low"
        );

    }
    else if (rainfall <= 20) {

        score += 20;

        factors.push(
            "🌧️ Rainfall: Moderate"
        );

    }
    else if (rainfall <= 40) {

        score += 30;

        factors.push(
            "🌧️ Rainfall: High"
        );

    }
    else {

        score += 40;

        factors.push(
            "🌧️ Rainfall: Very High"
        );
    }


    /* =================================================
       WATER LEVEL
       ================================================= */

    if (waterLevel <= 10) {

        score += 10;

        factors.push(
            "💧 Water Level: Low"
        );

    }
    else if (waterLevel <= 20) {

        score += 25;

        factors.push(
            "💧 Water Level: Medium"
        );

    }
    else {

        score += 40;

        factors.push(
            "💧 Water Level: High"
        );
    }


    /* =================================================
       DRAINAGE
       ================================================= */

    if (drainage === "good") {

        score += 0;

        factors.push(
            "🚰 Drainage: Good"
        );

    }
    else if (drainage === "poor") {

        score += 10;

        factors.push(
            "🚰 Drainage: Poor"
        );

    }
    else if (drainage === "none") {

        score += 20;

        factors.push(
            "🚰 Drainage: No Drainage"
        );

    }
    else {

        factors.push(
            "🚰 Drainage: Unknown / Not Available"
        );
    }


    /* =================================================
       HISTORICAL REPORTS
       ================================================= */

    if (historicalReportCount === 0) {

        factors.push(
            "📊 Historical Reports: None within 500 m"
        );

    }
    else if (historicalReportCount <= 3) {

        score += 5;

        factors.push(
            "📊 Historical Reports: " +
            historicalReportCount +
            " within 500 m"
        );

    }
    else if (historicalReportCount <= 10) {

        score += 10;

        factors.push(
            "📊 Historical Reports: " +
            historicalReportCount +
            " within 500 m"
        );

    }
    else {

        score += 20;

        factors.push(
            "📊 Historical Reports: " +
            historicalReportCount +
            " within 500 m"
        );
    }


    /* =================================================
       FINAL RISK
       ================================================= */

    let finalRisk;


    if (score <= 30) {

        finalRisk = "LOW";

    }
    else if (score <= 60) {

        finalRisk = "MEDIUM";

    }
    else {

        finalRisk = "HIGH";
    }


    /* =================================================
       CONFIDENCE
       ================================================= */

    let confidence =
        "HIGH";


    if (
        drainage === "unknown"
    ) {

        confidence =
            "MEDIUM";
    }


    /* =================================================
       DISPLAY RESULT
       ================================================= */

    const riskLevelElement =
        document.getElementById(
            "riskLevel"
        );

    const riskScoreElement =
        document.getElementById(
            "riskScore"
        );

    const confidenceElement =
        document.getElementById(
            "confidence"
        );

    const riskFactorsElement =
        document.getElementById(
            "riskFactors"
        );


    if (riskLevelElement) {

        riskLevelElement.innerText =
            "⚠️ " +
            finalRisk +
            " RISK";
    }


    if (riskScoreElement) {

        riskScoreElement.innerText =
            "Risk Score: " +
            score;
    }


    if (confidenceElement) {

        confidenceElement.innerText =
            "Data Confidence: " +
            confidence;
    }


    if (riskFactorsElement) {

        riskFactorsElement.innerHTML =
            factors
                .map(
                    function(factor) {

                        return (
                            "<div>" +
                            factor +
                            "</div>"
                        );

                    }
                )
                .join("");
    }


    /* =================================================
       SAVE RISK DATA
       ================================================= */

    const riskData = {

        riskLevel:
            finalRisk,

        riskScore:
            score,

        confidence:
            confidence,

        historicalReports:
            historicalReportCount,

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
        "aquanexRiskData",
        JSON.stringify(
            riskData
        )
    );


    alert(
        "✅ Risk analysis completed successfully!"
    );
}


/* =====================================================
   GO TO EMERGENCY ALERTS
   ===================================================== */

function goToEmergency() {

    const riskData =
        localStorage.getItem(
            "aquanexRiskData"
        );


    if (riskData === null) {

        alert(
            "Please calculate the risk first."
        );

        return;
    }


    window.location.href =
        "emergency.html";
}


/* =====================================================
   PAGE LOAD
   ===================================================== */

window.addEventListener(
    "DOMContentLoaded",
    function() {

        initializeRiskAnalysis();

    }
);