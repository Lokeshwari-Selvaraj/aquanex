/* =====================================================
   AQUANEX
   FEATURE 3 - LOCATION SELECTION
   ===================================================== */


/* =====================================================
   DEFAULT LOCATION
   Chennai
   ===================================================== */

const defaultLatitude = 13.0827;

const defaultLongitude = 80.2707;


/* =====================================================
   CREATE MAP
   ===================================================== */

const map = L.map("map").setView(
    [
        defaultLatitude,
        defaultLongitude
    ],
    12
);


/* =====================================================
   OPENSTREETMAP
   ===================================================== */

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            "&copy; OpenStreetMap contributors"
    }
).addTo(map);


/* =====================================================
   MARKER
   ===================================================== */

let marker = null;


/* =====================================================
   SELECT LOCATION
   ===================================================== */

function selectLocation(latitude, longitude) {


    /* Remove old marker */

    if (marker !== null) {

        map.removeLayer(marker);

    }


    /* Create new marker */

    marker = L.marker(
        [
            latitude,
            longitude
        ]
    ).addTo(map);


    /* Popup */

    marker.bindPopup(

        "<b>Selected Location</b>" +

        "<br>Latitude: " +
        latitude.toFixed(6) +

        "<br>Longitude: " +
        longitude.toFixed(6)

    ).openPopup();


    /* Display latitude */

    document.getElementById(
        "latitude"
    ).innerText =
        latitude.toFixed(6);


    /* Display longitude */

    document.getElementById(
        "longitude"
    ).innerText =
        longitude.toFixed(6);


    /* Display location */

    document.getElementById(
        "locationName"
    ).innerText =
        "Selected Location";


    /* Status */

    document.getElementById(
        "status"
    ).innerText =
        "✅ Location selected successfully.";


    /* Move map */

    map.setView(
        [
            latitude,
            longitude
        ],
        15
    );


    /*
     * Save location in browser.
     *
     * Later this can be sent to
     * Java + MySQL.
     */

    localStorage.setItem(
        "aquanexLatitude",
        latitude
    );

    localStorage.setItem(
        "aquanexLongitude",
        longitude
    );

}


/* =====================================================
   GET USER GPS LOCATION
   ===================================================== */

function getMyLocation() {


    document.getElementById(
        "status"
    ).innerText =
        "📍 Detecting your location...";


    /* Check browser support */

    if (!navigator.geolocation) {

        document.getElementById(
            "status"
        ).innerText =
            "❌ Geolocation is not supported by your browser.";

        return;

    }


    /* Request location */

    navigator.geolocation.getCurrentPosition(

        function(position) {


            const latitude =
                position.coords.latitude;


            const longitude =
                position.coords.longitude;


            /* Select location */

            selectLocation(
                latitude,
                longitude
            );


            document.getElementById(
                "status"
            ).innerText =
                "✅ Your current location has been detected.";

        },


        function(error) {


            if (error.code === 1) {

                document.getElementById(
                    "status"
                ).innerText =
                    "❌ Location permission was denied.";

            }

            else if (error.code === 2) {

                document.getElementById(
                    "status"
                ).innerText =
                    "❌ Unable to determine your location.";

            }

            else if (error.code === 3) {

                document.getElementById(
                    "status"
                ).innerText =
                    "❌ Location request timed out.";

            }

            else {

                document.getElementById(
                    "status"
                ).innerText =
                    "❌ Unable to access your location.";

            }

        },

        {
            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0
        }

    );

}


/* =====================================================
   MAP CLICK
   ===================================================== */

map.on(
    "click",
    function(event) {


        const latitude =
            event.latlng.lat;


        const longitude =
            event.latlng.lng;


        selectLocation(
            latitude,
            longitude
        );


        document.getElementById(
            "status"
        ).innerText =
            "📍 You selected this location from the map.";

    }
);


/* =====================================================
   CLEAR LOCATION
   ===================================================== */

function clearLocation() {


    /* Remove marker */

    if (marker !== null) {

        map.removeLayer(marker);

        marker = null;

    }


    /* Reset information */

    document.getElementById(
        "latitude"
    ).innerText =
        "Not Selected";


    document.getElementById(
        "longitude"
    ).innerText =
        "Not Selected";


    document.getElementById(
        "locationName"
    ).innerText =
        "Not Selected";


    document.getElementById(
        "status"
    ).innerText =
        "Select a location from the map.";


    /* Remove saved location */

    localStorage.removeItem(
        "aquanexLatitude"
    );

    localStorage.removeItem(
        "aquanexLongitude"
    );

}


/* =====================================================
   LOAD PREVIOUS LOCATION
   ===================================================== */

window.addEventListener(
    "load",
    function() {


        const savedLatitude =
            localStorage.getItem(
                "aquanexLatitude"
            );


        const savedLongitude =
            localStorage.getItem(
                "aquanexLongitude"
            );


        if (
            savedLatitude !== null &&
            savedLongitude !== null
        ) {


            selectLocation(

                Number(savedLatitude),

                Number(savedLongitude)

            );


            document.getElementById(
                "status"
            ).innerText =
                "📍 Previously selected location restored.";

        }

    }
);


/* =====================================================
   NEXT FEATURE
   ===================================================== */
function goToWeather() {

    const latitude =
        localStorage.getItem("aquanexLatitude");

    const longitude =
        localStorage.getItem("aquanexLongitude");


    if (
        latitude === null ||
        longitude === null
    ) {

        alert("Please select a location first.");

        return;
    }


    // Open Feature 4
    window.location.href = "weather.html";

}