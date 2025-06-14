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

    // TODO: cual es el rol?
    if (userRole === "Administrador") {
      const navbar = document.getElementById("navbarLinks");
      let navbarListItem = navbar.children[0].cloneNode(true);

      let aTag = navbarListItem.children[0];
      aTag.href = "admin.html";
      aTag.textContent = "Editar Datos de Aulas";
      navbar.appendChild(navbarListItem);
    }

    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "index.html"
    });
  });
