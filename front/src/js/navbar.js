document.addEventListener("DOMContentLoaded", () => {
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const userRole = localStorage.getItem("userRole");
    const userInfoDiv = document.getElementById("user-info");
    const logoutLink = document.getElementById("logout-link");

    if (userName && userEmail) {
      userInfoDiv.textContent = `${userName} (${userEmail}) - ${userRole}`;
    } else {
      userInfoDiv.textContent = "Usuario invitado";
    }

    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "index.html"
    });
  });
