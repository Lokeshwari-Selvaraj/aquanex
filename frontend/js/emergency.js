/* =====================================================
   AQUANEX
   FEATURE 11 - EMERGENCY ALERTS
   ===================================================== */

function loadEmergencyAlert() {

    const alertBox =
        document.getElementById("alertBox");

    const alertIcon =
        document.getElementById("alertIcon");

    const alertTitle =
        document.getElementById("alertTitle");

    const alertMessage =
        document.getElementById("alertMessage");

    const riskLevel =
        document.getElementById("riskLevel");

    const riskScore =
        document.getElementById("riskScore");

    const confidence =
        document.getElementById("confidence");

    const safetyInstructions =
        document.getElementById(
            "safetyInstructions"
        );

    const status =
        document.getElementById(
            "emergencyStatus"
        );


    /* ================= LOCATION ================= */

    const latitude =
        localStorage.getItem(
            "aquanexLatitude"
        );

    const longitude =
        localStorage.getItem(
            "aquanexLongitude"
        );


    if (latitude !== null) {

        document.getElementById(
            "latitude"
        ).innerText =
            Number(latitude).toFixed(6);

    }

    if (longitude !== null) {

        document.getElementById(
            "longitude"
        ).innerText =
            Number(longitude).toFixed(6);

    }


    /* ================= RISK DATA ================= */

    const savedRiskData =
        localStorage.getItem(
            "aquanexRiskData"
        );


    if (savedRiskData === null) {

        riskLevel.innerText =
            "Not Available";

        riskScore.innerText =
            "Not Available";

        confidence.innerText =
            "Not Available";

        alertBox.className =
            "alert-box";

        alertIcon.innerText =
            "⚠️";

        alertTitle.innerText =
            "No Risk Analysis Available";

        alertMessage.innerText =
            "Please complete the Risk Analysis page first.";

        safetyInstructions.innerHTML =
            "<p>" +
            "Complete the Risk Analysis to generate " +
            "appropriate safety instructions." +
            "</p>";

        status.innerText =
            "⚠️ Risk analysis data is not available.";

        status.style.color =
            "#d62828";

        return;
    }


    const riskData =
        JSON.parse(savedRiskData);


    const finalRisk =
        riskData.riskLevel;

    const score =
        riskData.riskScore;

    const dataConfidence =
        riskData.confidence;


    /* ================= DISPLAY DATA ================= */

    riskLevel.innerText =
        finalRisk;

    riskScore.innerText =
        score;

    confidence.innerText =
        dataConfidence;


    /* ================= LOW RISK ================= */

    if (finalRisk === "LOW") {

        alertBox.className =
            "alert-box low";

        alertIcon.innerText =
            "🟢";

        alertTitle.innerText =
            "LOW RISK";

        alertMessage.innerText =
            "Waterlogging risk is currently low. " +
            "Normal monitoring is recommended.";

        safetyInstructions.innerHTML =

            '<div class="safety-item">' +
            '✅ Continue normal activities.' +
            '</div>' +

            '<div class="safety-item">' +
            '🌧️ Continue monitoring weather conditions.' +
            '</div>' +

            '<div class="safety-item">' +
            '📱 Check AQUANEX again if rainfall increases.' +
            '</div>';

        status.innerText =
            "✅ Low-risk alert generated successfully.";

        status.style.color =
            "#16803c";

    }


    /* ================= MEDIUM RISK ================= */

    else if (finalRisk === "MEDIUM") {

        alertBox.className =
            "alert-box medium";

        alertIcon.innerText =
            "🟠";

        alertTitle.innerText =
            "MEDIUM RISK - WARNING";

        alertMessage.innerText =
            "Waterlogging conditions may develop. " +
            "Please monitor the area carefully.";

        safetyInstructions.innerHTML =

            '<div class="safety-item">' +
            '⚠️ Avoid unnecessary travel through low-lying areas.' +
            '</div>' +

            '<div class="safety-item">' +
            '🚗 Avoid roads where water accumulation is increasing.' +
            '</div>' +

            '<div class="safety-item">' +
            '📱 Monitor AQUANEX alerts and weather updates.' +
            '</div>' +

            '<div class="safety-item">' +
            '🚨 Report newly observed waterlogging conditions.' +
            '</div>';

        status.innerText =
            "⚠️ Medium-risk warning generated successfully.";

        status.style.color =
            "#b06b00";

    }


    /* ================= HIGH RISK ================= */

    else if (finalRisk === "HIGH") {

        alertBox.className =
            "alert-box high";

        alertIcon.innerText =
            "🔴";

        alertTitle.innerText =
            "HIGH RISK - EMERGENCY ALERT";

        alertMessage.innerText =
            "High waterlogging risk detected. " +
            "Avoid the affected area and follow safety instructions.";

        safetyInstructions.innerHTML =

            '<div class="safety-item">' +
            '🚨 Avoid entering heavily waterlogged areas.' +
            '</div>' +

            '<div class="safety-item">' +
            '🚗 Do not drive through deep or rapidly rising water.' +
            '</div>' +

            '<div class="safety-item">' +
            '⚡ Stay away from electrical equipment and exposed wires.' +
            '</div>' +

            '<div class="safety-item">' +
            '📞 Contact local emergency services when immediate assistance is required.' +
            '</div>' +

            '<div class="safety-item">' +
            '📱 Continue monitoring AQUANEX alerts for updates.' +
            '</div>';

        status.innerText =
            "🚨 High-risk emergency alert generated.";

        status.style.color =
            "#d62828";

    }


    else {

        alertBox.className =
            "alert-box";

        alertIcon.innerText =
            "⚠️";

        alertTitle.innerText =
            "Unknown Risk Level";

        alertMessage.innerText =
            "The risk level could not be determined.";

        safetyInstructions.innerHTML =
            "<p>" +
            "Please perform the Risk Analysis again." +
            "</p>";

        status.innerText =
            "⚠️ Unable to determine the risk level.";

        status.style.color =
            "#d62828";
    }

}


/* =====================================================
   LOAD ALERT WHEN PAGE OPENS
   ===================================================== */

window.addEventListener(
    "load",
    function() {

        loadEmergencyAlert();

        const refreshButton =
            document.getElementById(
                "refreshAlertButton"
            );

        if (refreshButton) {

            refreshButton.addEventListener(
                "click",
                function() {

                    loadEmergencyAlert();

                    const status =
                        document.getElementById(
                            "emergencyStatus"
                        );

                    status.innerText =
                        "🔄 Emergency alert refreshed successfully.";

                    status.style.color =
                        "#0783aa";

                }
            );

        }

    }
);