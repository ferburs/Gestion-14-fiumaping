const API_URL = "https://gestion-14-fiumaping-back.onrender.com/"
//const API_URL = "http://localhost:5000/"

export function getFullEndpoint(endpoint) {
    return API_URL + endpoint
}