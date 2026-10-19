/* =====================================================
   AQUANEX
   FEATURE - INTERACTIVE RISK MAP
   ===================================================== */


/* =====================================================
   DEFAULT MAP LOCATION
   ===================================================== */

const defaultLatitude = 13.0827;
const defaultLongitude = 80.2707;


/* =====================================================
   CREATE LEAFLET MAP
   ===================================================== */

const riskMap =
    L.map("riskMap").setView(
        [
            defaultLatitude,
            defaultLongitude
        ],
        12
    );


/* =====================================================
   OPENSTREETMAP TILE LAYER
   ===================================================== */

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            "&copy; OpenStreetMap contributors"
    }
).addTo(riskMap);


/* =====================================================
   STORE MARKERS
   ===================================================== */

let markers = [];


/* =====================================================
   GET RISK LEVEL FROM WATER LEVEL
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
   GET MARKER COLOR
   ===================================================== */

function getMarkerColor(riskLevel) {

    if (riskLevel === "LOW") {

        return "#16803c";

    }

    else if (riskLevel === "MEDIUM") {

        return "#f39c12";

    }

    else {

        return "#d62828";

    }

}


/* =====================================================
   CREATE CUSTOM MAP MARKER
   ===================================================== */

function createRiskMarker(
    latitude,
    longitude,
    riskLevel
) {

    const color =
        getMarkerColor(riskLevel);


    const markerIcon =
        L.divIcon({

            className:
                "aquanex-marker",

            html:
                '<div style="' +
                'background:' +
                color +
                ';' +
                'width:22px;' +
                'height:22px;' +
                'border-radius:50%;' +
                'border:3px solid white;' +
                'box-shadow:0 2px 6px rgba(0,0,0,0.3);' +
                '">' +
                '</div>',

            iconSize: [
                22,
                22
            ],

            iconAnchor: [
                11,
                11
            ],

            popupAnchor: [
                0,
                -12
            ]

        });


    return L.marker(
        [
            latitude,
            longitude
        ],
        {
            icon: markerIcon
        }
    );

}


/* =====================================================
   LOAD RISK MAP
   ===================================================== */

async function loadRiskMap() {

    const status =
        document.getElementById(
            "mapStatus"
        );


    const summary =
        document.getElementById(
            "mapSummary"
        );


    const button =
        document.getElementById(
            "loadMapButton"
        );


    /* =================================================
       LOADING MESSAGE
       ================================================= */

    status.innerText =
        "⏳ Loading reported waterlogging locations...";

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


        /* =============================================
           CHECK RESPONSE
           ============================================= */

        if (!response.ok) {

            throw new Error(
                "Unable to load reports."
            );

        }


        /* =============================================
           CONVERT RESPONSE TO JSON
           ============================================= */

        const reports =
            await response.json();


        /* =============================================
           REMOVE OLD MARKERS
           ============================================= */

        markers.forEach(
            function(marker) {

                riskMap.removeLayer(
                    marker
                );

            }
        );


        markers = [];


        /* =============================================
           NO REPORTS
           ============================================= */

        if (reports.length === 0) {

            status.innerText =
                "ℹ️ No reported waterlogging locations available.";

            status.style.color =
                "#71828c";


            summary.innerHTML = "";


            button.disabled = false;


            return;

        }


        /* =============================================
           RISK COUNTERS
           ============================================= */

        let lowCount = 0;

        let mediumCount = 0;

        let highCount = 0;

        let validReports = 0;


        /* =============================================
           STORE VALID LOCATIONS
           ============================================= */

        const validLocations = [];


        /* =============================================
           PROCESS EACH REPORT
           ============================================= */

        reports.forEach(
            function(report) {

                /* =====================================
                   CHECK COORDINATES
                   ===================================== */

                if (
                    report.latitude === null ||
                    report.longitude === null
                ) {

                    return;

                }


                const latitude =
                    Number(
                        report.latitude
                    );


                const longitude =
                    Number(
                        report.longitude
                    );


                const waterLevel =
                    Number(
                        report.waterLevel
                    );


                if (
                    isNaN(latitude) ||
                    isNaN(longitude) ||
                    isNaN(waterLevel)
                ) {

                    return;

                }


                validReports++;


                /* =====================================
                   GET RISK
                   ===================================== */

                const riskLevel =
                    getRiskLevel(
                        waterLevel
                    );


                /* =====================================
                   COUNT RISK
                   ===================================== */

                if (riskLevel === "LOW") {

                    lowCount++;

                }

                else if (
                    riskLevel === "MEDIUM"
                ) {

                    mediumCount++;

                }

                else {

                    highCount++;

                }


                /* =====================================
                   CREATE MARKER
                   ===================================== */

                const marker =
                    createRiskMarker(
                        latitude,
                        longitude,
                        riskLevel
                    );


                /* =====================================
                   POPUP CONTENT
                   ===================================== */

                const location =
                    report.location ||
                    "Unknown Location";


                const problemType =
                    report.problemType ||
                    "Not Available";


                const description =
                    report.description ||
                    "No description";


                const popupContent =

                    '<div>' +

                        '<div class="popup-title">' +
                        '📍 ' +
                        location +
                        '</div>' +

                        '<div>' +
                        '<strong>Problem:</strong> ' +
                        problemType +
                        '</div>' +

                        '<div class="popup-water">' +
                        '<strong>Water Level:</strong> ' +
                        waterLevel +
                        ' cm' +
                        '</div>' +

                        '<div class="popup-risk">' +
                        '<strong>Risk:</strong> ' +
                        riskLevel +
                        '</div>' +

                        '<div>' +
                        '<strong>Latitude:</strong> ' +
                        latitude.toFixed(6) +
                        '</div>' +

                        '<div>' +
                        '<strong>Longitude:</strong> ' +
                        longitude.toFixed(6) +
                        '</div>' +

                        '<div class="popup-reports">' +
                        '<strong>Description:</strong> ' +
                        description +
                        '</div>' +

                    '</div>';


                marker.bindPopup(
                    popupContent
                );


                marker.addTo(
                    riskMap
                );


                markers.push(
                    marker
                );


                validLocations.push({

                    latitude:
                        latitude,

                    longitude:
                        longitude

                });

            }
        );


        /* =============================================
           MAP VIEW
           ============================================= */

        if (
            validLocations.length > 0
        ) {

            const bounds =
                L.latLngBounds(
                    validLocations.map(
                        function(location) {

                            return [
                                location.latitude,
                                location.longitude
                            ];

                        }
                    )
                );


            riskMap.fitBounds(
                bounds,
                {
                    padding: [
                        40,
                        40
                    ]
                }
            );

        }


        /* =============================================
           SUMMARY
           ============================================= */

        summary.innerHTML =

            '<div class="summary-card">' +

                '<h3>' +
                validReports +
                '</h3>' +

                '<p>Mapped Reports</p>' +

            '</div>' +


            '<div class="summary-card">' +

                '<h3>' +
                lowCount +
                '</h3>' +

                '<p>Low Risk</p>' +

            '</div>' +


            '<div class="summary-card">' +

                '<h3>' +
                mediumCount +
                '</h3>' +

                '<p>Medium Risk</p>' +

            '</div>' +


            '<div class="summary-card">' +

                '<h3>' +
                highCount +
                '</h3>' +

                '<p>High Risk</p>' +

            '</div>';


        /* =============================================
           SUCCESS MESSAGE
           ============================================= */

        if (
            validReports > 0
        ) {

            status.innerText =
                "✅ Risk map loaded successfully.";

            status.style.color =
                "#16803c";

        }

        else {

            status.innerText =
                "⚠️ Reports were found, but no valid coordinates are available.";

            status.style.color =
                "#b65f00";

        }

    }


    /* =================================================
       CONNECTION ERROR
       ================================================= */

    catch (error) {

        console.error(
            "Risk Map Error:",
            error
        );


        status.innerText =
            "❌ Cannot connect to the AQUANEX server.";

        status.style.color =
            "#d62828";


        summary.innerHTML =

            '<div class="no-data">' +

            'Please make sure Spring Boot is running.' +

            '</div>';

    }


    /* =================================================
       ENABLE BUTTON
       ================================================= */

    button.disabled = false;

}