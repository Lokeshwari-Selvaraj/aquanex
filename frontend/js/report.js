/* =====================================================
   AQUANEX
   FEATURE - REPORT WATERLOGGING
   STEP 18 - EXACT LOCATION SELECTION
   ===================================================== */


/* =====================================================
   DEFAULT MAP LOCATION
   ===================================================== */

const defaultLatitude = 13.0827;
const defaultLongitude = 80.2707;


/* =====================================================
   CREATE REPORT MAP
   ===================================================== */

const reportMap =
    L.map("reportMap").setView(
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
).addTo(reportMap);


/* =====================================================
   MARKER
   ===================================================== */

let reportMarker = null;


/* =====================================================
   SELECT LOCATION ON MAP
   ===================================================== */

function selectReportLocation(
    latitude,
    longitude
) {

    /* =============================================
       REMOVE OLD MARKER
       ============================================= */

    if (reportMarker !== null) {

        reportMap.removeLayer(
            reportMarker
        );

    }


    /* =============================================
       CREATE NEW MARKER
       ============================================= */

    reportMarker =
        L.marker(
            [
                latitude,
                longitude
            ]
        ).addTo(reportMap);


    /* =============================================
       POPUP
       ============================================= */

    reportMarker.bindPopup(

        "<b>Selected Waterlogging Location</b>" +

        "<br>Latitude: " +
        latitude.toFixed(6) +

        "<br>Longitude: " +
        longitude.toFixed(6)

    ).openPopup();


    /* =============================================
       DISPLAY COORDINATES
       ============================================= */

    document.getElementById(
        "selectedLatitude"
    ).innerText =
        latitude.toFixed(6);


    document.getElementById(
        "selectedLongitude"
    ).innerText =
        longitude.toFixed(6);


    /* =============================================
       SAVE EXACT COORDINATES
       ============================================= */

    localStorage.setItem(
        "aquanexReportLatitude",
        latitude
    );


    localStorage.setItem(
        "aquanexReportLongitude",
        longitude
    );


    /* =============================================
       MOVE MAP
       ============================================= */

    reportMap.setView(
        [
            latitude,
            longitude
        ],
        16
    );

}


/* =====================================================
   MAP CLICK
   ===================================================== */

reportMap.on(
    "click",
    function(event) {

        const latitude =
            event.latlng.lat;

        const longitude =
            event.latlng.lng;


        selectReportLocation(
            latitude,
            longitude
        );

    }
);


/* =====================================================
   RESTORE PREVIOUSLY SELECTED LOCATION
   ===================================================== */

window.addEventListener(
    "load",
    function() {

        const savedLatitude =
            localStorage.getItem(
                "aquanexReportLatitude"
            );


        const savedLongitude =
            localStorage.getItem(
                "aquanexReportLongitude"
            );


        if (
            savedLatitude !== null &&
            savedLongitude !== null
        ) {

            selectReportLocation(
                Number(savedLatitude),
                Number(savedLongitude)
            );

        }

    }
);


/* =====================================================
   REPORT FORM
   ===================================================== */

const reportForm =
    document.getElementById(
        "reportForm"
    );


if (reportForm) {

    reportForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            /* =============================================
               GET FORM VALUES
               ============================================= */

            const location =
                document.getElementById(
                    "location"
                ).value.trim();


            const waterLevel =
                Number(
                    document.getElementById(
                        "waterLevel"
                    ).value
                );


            const problemType =
                document.getElementById(
                    "problemType"
                ).value;


            const description =
                document.getElementById(
                    "description"
                ).value.trim();


            const message =
                document.getElementById(
                    "reportMessage"
                );


            /* =============================================
               GET EXACT MAP COORDINATES
               ============================================= */

            const latitude =
                localStorage.getItem(
                    "aquanexReportLatitude"
                );


            const longitude =
                localStorage.getItem(
                    "aquanexReportLongitude"
                );


            /* =============================================
               VALIDATION - LOCATION NAME
               ============================================= */

            if (location === "") {

                message.innerText =
                    "❌ Please enter the location name.";

                message.style.color =
                    "#d62828";

                return;

            }


            /* =============================================
               VALIDATION - MAP LOCATION
               ============================================= */

            if (
                latitude === null ||
                longitude === null
            ) {

                message.innerText =
                    "❌ Please select the exact location on the map.";

                message.style.color =
                    "#d62828";

                return;

            }


            /* =============================================
               VALIDATION - WATER LEVEL
               ============================================= */

            if (
                isNaN(waterLevel) ||
                waterLevel < 0
            ) {

                message.innerText =
                    "❌ Please enter a valid water level.";

                message.style.color =
                    "#d62828";

                return;

            }


            /* =============================================
               VALIDATION - PROBLEM TYPE
               ============================================= */

            if (problemType === "") {

                message.innerText =
                    "❌ Please select the problem type.";

                message.style.color =
                    "#d62828";

                return;

            }


            /* =============================================
               VALIDATION - DESCRIPTION
               ============================================= */

            if (description === "") {

                message.innerText =
                    "❌ Please enter a description.";

                message.style.color =
                    "#d62828";

                return;

            }


            /* =============================================
               CREATE REPORT OBJECT
               ============================================= */

            const reportData = {

                location:
                    location,

                waterLevel:
                    waterLevel,

                problemType:
                    problemType,

                description:
                    description,

                latitude:
                    Number(latitude),

                longitude:
                    Number(longitude),

                timestamp:
                    new Date().toISOString()

            };


            /* =============================================
               SEND DATA TO SPRING BOOT
               ============================================= */

            try {

                message.innerText =
                    "⏳ Submitting report...";

                message.style.color =
                    "#0783aa";


                const response =
                    await fetch(
                        "http://localhost:8080/api/reports",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    reportData
                                )
                        }
                    );


                /* =========================================
                   SUCCESS
                   ========================================= */

                if (response.ok) {

                    const savedReport =
                        await response.json();


                    console.log(
                        "Saved Report:",
                        savedReport
                    );


                    message.innerText =
                        "✅ Waterlogging report saved successfully!";

                    message.style.color =
                        "#16803c";


                    /* =====================================
                       RESET FORM
                       ===================================== */

                    reportForm.reset();


                    /* =====================================
                       KEEP MAP MARKER
                       ===================================== */

                    document.getElementById(
                        "selectedLatitude"
                    ).innerText =
                        Number(latitude).toFixed(6);


                    document.getElementById(
                        "selectedLongitude"
                    ).innerText =
                        Number(longitude).toFixed(6);

                }


                /* =========================================
                   SERVER ERROR
                   ========================================= */

                else {

                    message.innerText =
                        "❌ Unable to save the report.";

                    message.style.color =
                        "#d62828";

                }

            }


            /* =============================================
               CONNECTION ERROR
               ============================================= */

            catch (error) {

                console.error(
                    "Report Error:",
                    error
                );


                message.innerText =
                    "❌ Cannot connect to the AQUANEX server. Make sure Spring Boot is running.";

                message.style.color =
                    "#d62828";

            }

        }
    );

}