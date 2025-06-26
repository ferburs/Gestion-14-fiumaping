import { fetchAPI, getFullEndpoint } from './api.js';

document.addEventListener("DOMContentLoaded", async function () {

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("token")) {
        const token = urlParams.get("token");
        try {
            const response = await fetchAPI("api/v1/auth/user-info", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const userData = await response.json();

            // Podés guardar los datos o el token en localStorage si querés
            localStorage.setItem("authToken", token);
            localStorage.setItem("userName", userData.name);
            localStorage.setItem("userEmail", userData.email);
            localStorage.setItem("userRole", userData.role);

            // Redireccionar
            window.location.href = "mapa.html";

        } catch (error) {
            console.error("Error al autenticar:", error);
        }
    }

    const loginUrl = getFullEndpoint('api/v1/auth/google-login');

    const loginButton = document.getElementById("login-admin-btn");
    loginButton.href = loginUrl;

    if (urlParams.has("error")) {
        const alertElem = document.getElementById("alert-error");
        alertElem.innerText = urlParams.get("error");
        alertElem.classList.remove('d-none');
    }
});
