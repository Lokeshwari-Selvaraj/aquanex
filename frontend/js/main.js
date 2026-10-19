/* =====================================================
   AQUANEX - MAIN JAVASCRIPT
   Feature 1: Home Page
   ===================================================== */


/* ================= LOGIN ================= */

function loginMessage() {

    alert(
        "AQUANEX Login\n\n" +
        "The User Registration & Login feature " +
        "will be added in Feature 2."
    );

}


/* ================= CHECK MY AREA ================= */

function checkArea() {

    alert(
        "📍 Location Selection\n\n" +
        "The Location Selection feature will be " +
        "developed in Feature 3.\n\n" +
        "It will allow you to:\n" +
        "• Detect your GPS location\n" +
        "• Select a location from the map\n" +
        "• View latitude and longitude\n" +
        "• Check waterlogging risk"
    );

}


/* ================= LEARN MORE ================= */

function learnMore() {

    document
        .getElementById("how-it-works")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* ================= PAGE LOADED ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "AQUANEX Home Page Loaded Successfully!"
        );

    }
);