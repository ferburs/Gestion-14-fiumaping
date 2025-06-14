import { getFullEndpoint } from './api.js';

document.addEventListener("DOMContentLoaded", async function () {

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
        try {
            const response = await fetch(getFullEndpoint("api/v1/auth/user-info"), {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Token inválido");
            }

            const userData = await response.json();
            console.log("Usuario autenticado:", userData);

            // Podés guardar los datos o el token en localStorage si querés
            localStorage.setItem("authToken", token);
            localStorage.setItem("userName", userData.name);
            localStorage.setItem("userEmail", userData.email);
            localStorage.setItem("userRole", userData.role);

            // Redireccionar
            window.location.href = "mapa.html";

        } catch (error) {
            console.error("Error al autenticar:", error);
            // Opcional: mostrar mensaje o redirigir al login
        }
    }

    const loginUrl = getFullEndpoint('api/v1/auth/google-login');

    const loginButton = document.getElementById("login-admin-btn");
    loginButton.href = loginUrl;
});