const API_URL = "https://gestion-14-fiumaping-back.onrender.com/"
// const API_URL = "http://localhost:5000/"

export function getFullEndpoint(endpoint) {
    return API_URL + endpoint
}

export async function fetchAPI() {
    arguments[0] = getFullEndpoint(arguments[0]);
    const response = await fetch.apply(null, arguments);
    if (response.status === 401) {
        // Unauthorized: redirect to index.html
        try {
            var err = await response.json();
        } catch (e) {
            // pass
        }

        localStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");

        window.location.assign('index.html?' + new URLSearchParams(err));
    }

    return response;
}
