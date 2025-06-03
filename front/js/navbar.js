document.addEventListener("DOMContentLoaded", () => {
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const userInfoDiv = document.getElementById("user-info");
    const logoutLink = document.getElementById("logout-link");

    if (userName && userEmail) {
      userInfoDiv.textContent = `${userName} (${userEmail})`;
    } else {
      userInfoDiv.textContent = "Usuario invitado";
    }

    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "index.html"
    });
  });