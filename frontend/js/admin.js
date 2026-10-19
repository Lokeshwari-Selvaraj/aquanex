/* =====================================================
   AQUANEX
   FEATURE 10 - ADMIN DASHBOARD
   ===================================================== */


/* =====================================================
   GET RISK LEVEL
   ===================================================== */

function getRiskLevel(waterLevel) {

    if (waterLevel <= 10) {

        return "LOW";

    }

    else if (waterLevel <= 20) {

        return "MEDIUM";

    }

    else {

        return "HIGH";

    }

}


/* =====================================================
   LOAD ADMIN DASHBOARD
   ===================================================== */

async function loadDashboard() {

    const status =
        document.getElementById(
            "dashboardStatus"
        );


    const reportsList =
        document.getElementById(
            "reportsList"
        );


    const button =
        document.getElementById(
            "loadDashboardButton"
        );


    /* =================================================
       LOADING MESSAGE
       ================================================= */

    status.innerText =
        "⏳ Loading dashboard data...";

    status.style.color =
        "#0783aa";


    button.disabled = true;


    try {

        /* =============================================
           GET REPORTS FROM SPRING BOOT
           ============================================= */

        const response =
            await fetch(
                "http://localhost:8080/api/reports"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load reports."
            );

        }


        const reports =
            await response.json();


        /* =============================================
           INITIAL COUNTS
           ============================================= */

        let lowCount = 0;

        let mediumCount = 0;

        let highCount = 0;


        /* =============================================
           EMPTY REPORT CHECK
           ============================================= */

        if (reports.length === 0) {

            document.getElementById(
                "totalReports"
            ).innerText = 0;


            document.getElementById(
                "lowRisk"
            ).innerText = 0;


            document.getElementById(
                "mediumRisk"
            ).innerText = 0;


            document.getElementById(
                "highRisk"
            ).innerText = 0;


            reportsList.innerHTML =

                '<div class="no-data">' +

                'No waterlogging reports available.' +

                '</div>';


            status.innerText =
                "ℹ️ No reports have been submitted yet.";

            status.style.color =
                "#71828c";


            button.disabled = false;

            return;

        }


        /* =============================================
           CALCULATE RISK COUNTS
           ============================================= */

        reports.forEach(
            function(report) {

                const waterLevel =
                    Number(
                        report.waterLevel
                    );


                const risk =
                    getRiskLevel(
                        waterLevel
                    );


                if (risk === "LOW") {

                    lowCount++;

                }

                else if (
                    risk === "MEDIUM"
                ) {

                    mediumCount++;

                }

                else {

                    highCount++;

                }

            }
        );


        /* =============================================
           DISPLAY SUMMARY
           ============================================= */

        document.getElementById(
            "totalReports"
        ).innerText =
            reports.length;


        document.getElementById(
            "lowRisk"
        ).innerText =
            lowCount;


        document.getElementById(
            "mediumRisk"
        ).innerText =
            mediumCount;


        document.getElementById(
            "highRisk"
        ).innerText =
            highCount;


        /* =============================================
           CLEAR OLD REPORTS
           ============================================= */

        reportsList.innerHTML = "";


        /* =============================================
           SORT REPORTS
           NEWEST FIRST
           ============================================= */

        const sortedReports =
            [...reports].sort(
                function(a, b) {

                    return new Date(
                        b.timestamp
                    ) -

                    new Date(
                        a.timestamp
                    );

                }
            );


        /* =============================================
           DISPLAY REPORT CARDS
           ============================================= */

        sortedReports.forEach(
            function(report) {

                const waterLevel =
                    Number(
                        report.waterLevel
                    );


                const risk =
                    getRiskLevel(
                        waterLevel
                    );


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "report-card";


                /* =====================================
                   LOCATION
                   ===================================== */

                const title =
                    document.createElement(
                        "h3"
                    );


                title.innerText =
                    "📍 " +
                    (
                        report.location ||
                        "Unknown Location"
                    );


                card.appendChild(
                    title
                );


                /* =====================================
                   WATER LEVEL
                   ===================================== */

                const water =
                    document.createElement(
                        "p"
                    );


                water.innerText =
                    "💧 Water Level: " +
                    waterLevel +
                    " cm";


                card.appendChild(
                    water
                );


                /* =====================================
                   PROBLEM TYPE
                   ===================================== */

                const problem =
                    document.createElement(
                        "p"
                    );


                problem.innerText =
                    "⚠️ Problem: " +
                    (
                        report.problemType ||
                        "Not Available"
                    );


                card.appendChild(
                    problem
                );


                /* =====================================
                   DESCRIPTION
                   ===================================== */

                const description =
                    document.createElement(
                        "p"
                    );


                description.innerText =
                    "📝 Description: " +
                    (
                        report.description ||
                        "No description"
                    );


                card.appendChild(
                    description
                );


                /* =====================================
                   COORDINATES
                   ===================================== */

                const coordinates =
                    document.createElement(
                        "p"
                    );


                if (
                    report.latitude !== null &&
                    report.longitude !== null
                ) {

                    coordinates.innerText =
                        "📍 Coordinates: " +
                        Number(
                            report.latitude
                        ).toFixed(6) +

                        ", " +

                        Number(
                            report.longitude
                        ).toFixed(6);

                }

                else {

                    coordinates.innerText =
                        "📍 Coordinates: Not Available";

                }


                card.appendChild(
                    coordinates
                );


                /* =====================================
                   DATE / TIME
                   ===================================== */

                const dateTime =
                    document.createElement(
                        "p"
                    );


                if (report.timestamp) {

                    dateTime.innerText =
                        "🕒 Reported: " +
                        new Date(
                            report.timestamp
                        ).toLocaleString();

                }

                else {

                    dateTime.innerText =
                        "🕒 Reported: Not Available";

                }


                card.appendChild(
                    dateTime
                );


                /* =====================================
                   RISK BADGE
                   ===================================== */

                const riskBadge =
                    document.createElement(
                        "div"
                    );


                riskBadge.className =
                    "report-risk " +
                    risk.toLowerCase();


                riskBadge.innerText =
                    "Risk: " +
                    risk;


                card.appendChild(
                    riskBadge
                );


                /* =====================================
                   ADD CARD
                   ===================================== */

                reportsList.appendChild(
                    card
                );

            }
        );


        /* =============================================
           SUCCESS MESSAGE
           ============================================= */

        status.innerText =
            "✅ Admin dashboard data loaded successfully.";

        status.style.color =
            "#16803c";

    }


    /* =================================================
       ERROR
       ================================================= */

    catch (error) {

        console.error(
            "Admin Dashboard Error:",
            error
        );


        status.innerText =
            "❌ Cannot connect to the AQUANEX server.";

        status.style.color =
            "#d62828";


        reportsList.innerHTML =

            '<div class="no-data">' +

            'Please make sure Spring Boot is running.' +

            '</div>';

    }


    /* =================================================
       ENABLE BUTTON
       ================================================= */

    button.disabled = false;

}