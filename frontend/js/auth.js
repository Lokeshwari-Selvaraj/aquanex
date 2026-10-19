   /* =====================================================
   LOGIN
   ===================================================== */

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const email =
                document.getElementById("loginEmail").value.trim();

            const password =
                document.getElementById("loginPassword").value;

            const message =
                document.getElementById("loginMessage");


            /* Send login data to Spring Boot */

            try {

                const response = await fetch(
                    "http://localhost:8080/api/users/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );


                if (response.ok) {

                    const user = await response.json();

                    message.innerText =
                        "✅ Login successful! Welcome " + user.name;

                    message.style.color = "#16803c";


                    /* Store logged-in user */

                    localStorage.setItem(
                        "aquanexUser",
                        JSON.stringify(user)
                    );


                    /* Go to home page */

                    setTimeout(function() {

                        window.location.href =
                            "../index.html";

                    }, 1500);

                }

                else {

                    message.innerText =
                        "❌ Invalid email or password.";

                    message.style.color = "#d62828";

                }

            }

            catch (error) {

                console.error(error);

                message.innerText =
                    "❌ Cannot connect to server. Make sure Spring Boot is running.";

                message.style.color = "#d62828";

            }
        }
    );
}
  /* =====================================================
   REGISTRATION
   ===================================================== */

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const name =
                document.getElementById("name").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const password =
                document.getElementById("password").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            const message =
                document.getElementById("registerMessage");


            /* Check password */

            if (password !== confirmPassword) {

                message.innerText =
                    "❌ Passwords do not match.";

                message.style.color = "#d62828";

                return;
            }


            /* Check password length */

            if (password.length < 6) {

                message.innerText =
                    "❌ Password must contain at least 6 characters.";

                message.style.color = "#d62828";

                return;
            }


            /* Send data to Spring Boot */

            try {

                const response = await fetch(
                    "http://localhost:8080/api/users",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

                            email: email,

                            password: password

                        })
                    }
                );


                if (response.ok) {

                    message.innerText =
                        "✅ Account created successfully!";

                    message.style.color = "#16803c";


                    /* Clear form */

                    registerForm.reset();


                    /* Go to login */

                    setTimeout(function() {

                        window.location.href =
                            "login.html";

                    }, 1500);

                }

                else {

                    message.innerText =
                        "❌ Registration failed.";

                    message.style.color = "#d62828";

                }

            }

            catch (error) {

                console.error(error);

                message.innerText =
                    "❌ Cannot connect to server. Make sure Spring Boot is running.";

                message.style.color = "#d62828";

            }

        }
    );

} 