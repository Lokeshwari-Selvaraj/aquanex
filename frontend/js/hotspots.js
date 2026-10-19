/* =====================================================
   AQUANEX
   FEATURE - HISTORICAL HOTSPOTS
   GEOGRAPHICAL COORDINATE BASED LOGIC
   ===================================================== */


/* =====================================================
   HOTSPOT RADIUS
   ===================================================== */

/*
   Reports within 500 meters are considered
   part of the same geographical hotspot.
*/

const HOTSPOT_RADIUS_METERS = 500;


/* =====================================================
   CALCULATE DISTANCE BETWEEN TWO COORDINATES
   HAVERSINE FORMULA
   ===================================================== */

function calculateDistance(
    latitude1,
    longitude1,
    latitude2,
    longitude2
) {

    const earthRadius = 6371000;


    const lat1 =
        latitude1 * Math.PI / 180;

    const lat2 =
        latitude2 * Math.PI / 180;


    const differenceLatitude =
        (latitude2 - latitude1) *
        Math.PI / 180;


    const differenceLongitude =
        (longitude2 - longitude1) *
        Math.PI / 180;


    const a =
        Math.sin(differenceLatitude / 2) *
        Math.sin(differenceLatitude / 2) +

        Math.cos(lat1) *
        Math.cos(lat2) *

        Math.sin(differenceLongitude / 2) *
        Math.sin(differenceLongitude / 2);


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return earthRadius * c;

}


/* =====================================================
   FIND NEAREST HOTSPOT
   ===================================================== */

function findNearbyHotspot(
    hotspots,
    latitude,
    longitude
) {

    for (
        let i = 0;
        i < hotspots.length;
        i++
    ) {

        const hotspot =
            hotspots[i];


        const distance =
            calculateDistance(

                latitude,
                longitude,

                hotspot.latitude,
                hotspot.longitude

            );


        if (
            distance <=
            HOTSPOT_RADIUS_METERS
        ) {

            return hotspot;

        }

    }


    return null;

}


/* =====================================================
   LOAD HISTORICAL HOTSPOTS
   ===================================================== */

async function loadHotspots() {

    const status =
        document.getElementById(
            "hotspotStatus"
        );


    const summary =
        document.getElementById(
            "hotspotSummary"
        );


    const hotspotList =
        document.getElementById(
            "hotspotList"
        );


    const button =
        document.getElementById(
            "loadHotspotsButton"
        );


    /* =================================================
       SHOW LOADING MESSAGE
       ================================================= */

    status.innerText =
        "⏳ Loading historical reports...";

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
           NO REPORTS
           ============================================= */

        if (reports.length === 0) {

            status.innerText =
                "ℹ️ No historical reports available.";

            status.style.color =
                "#71828c";


            summary.innerHTML = "";


            hotspotList.innerHTML =
                '<div class="no-data">' +
                'No waterlogging reports have been submitted yet.' +
                '</div>';


            button.disabled = false;

            return;

        }


        /* =============================================
           CREATE HOTSPOTS
           ============================================= */

        const hotspots = [];


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


                if (
                    isNaN(latitude) ||
                    isNaN(longitude)
                ) {

                    return;

                }


                /* =====================================
                   FIND NEARBY HOTSPOT
                   ===================================== */

                const nearbyHotspot =
                    findNearbyHotspot(
                        hotspots,
                        latitude,
                        longitude
                    );


                /* =====================================
                   ADD TO EXISTING HOTSPOT
                   ===================================== */

                if (
                    nearbyHotspot !== null
                ) {

                    nearbyHotspot.count++;


                    nearbyHotspot.reports.push(
                        report
                    );


                    /* =================================
                       UPDATE CENTER COORDINATES
                       ================================= */

                    nearbyHotspot.latitude =
                        nearbyHotspot.reports.reduce(
                            function(sum, item) {

                                return sum +
                                    Number(item.latitude);

                            },
                            0
                        ) /
                        nearbyHotspot.reports.length;


                    nearbyHotspot.longitude =
                        nearbyHotspot.reports.reduce(
                            function(sum, item) {

                                return sum +
                                    Number(item.longitude);

                            },
                            0
                        ) /
                        nearbyHotspot.reports.length;

                }


                /* =====================================
                   CREATE NEW HOTSPOT
                   ===================================== */

                else {

                    hotspots.push({

                        latitude:
                            latitude,

                        longitude:
                            longitude,

                        location:
                            report.location ||
                            "Unknown Location",

                        count:
                            1,

                        reports:
                            [report]

                    });

                }

            }
        );


        /* =============================================
           SORT HOTSPOTS BY REPORT COUNT
           ============================================= */

        hotspots.sort(
            function(a, b) {

                return b.count - a.count;

            }
        );


        /* =============================================
           SUMMARY
           ============================================= */

        const repeatedLocations =
            hotspots.filter(
                function(hotspot) {

                    return hotspot.count >= 2;

                }
            ).length;


        summary.innerHTML =

            '<div class="summary-card">' +

                '<h3>' +
                reports.length +
                '</h3>' +

                '<p>Total Reports</p>' +

            '</div>' +


            '<div class="summary-card">' +

                '<h3>' +
                hotspots.length +
                '</h3>' +

                '<p>Geographical Locations</p>' +

            '</div>' +


            '<div class="summary-card">' +

                '<h3>' +
                repeatedLocations +
                '</h3>' +

                '<p>Repeated Hotspots</p>' +

            '</div>';


        /* =============================================
           DISPLAY HOTSPOTS
           ============================================= */

        hotspotList.innerHTML = "";


        hotspots.forEach(
            function(hotspot) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "hotspot-card";


                /* =====================================
                   GET LATEST REPORT
                   ===================================== */

                const sortedReports =
                    [...hotspot.reports].sort(
                        function(a, b) {

                            return new Date(
                                b.timestamp
                            ) -
                            new Date(
                                a.timestamp
                            );

                        }
                    );


                const latestReport =
                    sortedReports[0];


                /* =====================================
                   TITLE
                   ===================================== */

                const title =
                    document.createElement(
                        "h3"
                    );


                title.innerText =
                    "📍 " +
                    hotspot.location;


                card.appendChild(title);


                /* =====================================
                   REPORT COUNT
                   ===================================== */

                const reportCount =
                    document.createElement(
                        "div"
                    );


                reportCount.className =
                    "hotspot-count";


                reportCount.innerText =
                    hotspot.count +
                    (
                        hotspot.count === 1
                            ? " Report"
                            : " Reports"
                    );


                card.appendChild(
                    reportCount
                );


                /* =====================================
                   COORDINATES
                   ===================================== */

                const coordinates =
                    document.createElement(
                        "p"
                    );


                coordinates.innerText =
                    "Latitude: " +
                    hotspot.latitude.toFixed(6) +

                    " | Longitude: " +
                    hotspot.longitude.toFixed(6);


                card.appendChild(
                    coordinates
                );


                /* =====================================
                   LATEST WATER LEVEL
                   ===================================== */

                const waterLevel =
                    document.createElement(
                        "p"
                    );


                waterLevel.innerText =
                    "Latest Reported Water Level: " +
                    latestReport.waterLevel +
                    " cm";


                card.appendChild(
                    waterLevel
                );


                /* =====================================
                   HOTSPOT STATUS
                   ===================================== */

                const hotspotStatus =
                    document.createElement(
                        "p"
                    );


                if (
                    hotspot.count >= 2
                ) {

                    hotspotStatus.innerText =
                        "⚠️ Repeated geographical hotspot";

                }

                else {

                    hotspotStatus.innerText =
                        "📊 Single reported location";

                }


                card.appendChild(
                    hotspotStatus
                );


                /* =====================================
                   ADD CARD
                   ===================================== */

                hotspotList.appendChild(
                    card
                );

            }
        );


        /* =============================================
           SUCCESS MESSAGE
           ============================================= */

        status.innerText =
            "✅ Historical hotspot data loaded successfully.";

        status.style.color =
            "#16803c";

    }


    /* =================================================
       CONNECTION ERROR
       ================================================= */

    catch (error) {

        console.error(
            "Hotspot Error:",
            error
        );


        status.innerText =
            "❌ Cannot connect to the AQUANEX server.";

        status.style.color =
            "#d62828";


        summary.innerHTML = "";


        hotspotList.innerHTML =
            '<div class="no-data">' +
            'Please make sure Spring Boot is running.' +
            '</div>';

    }


    /* =================================================
       ENABLE BUTTON
       ================================================= */

    button.disabled = false;

}