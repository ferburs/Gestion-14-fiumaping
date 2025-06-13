
export function setupSpaceInteractions(mapView, mapData) {
  const spaces = mapData.getByType('space');

  //Agrego posibles destino por el piso en el que estoy
  //busqueda = document.getElementById('map-container')

  const roomInput = document.getElementById("roomInput");
  const roomList = document.getElementById("roomList");
  const goButton = document.getElementById("goRoomBotton");

  mapData.getByType("space").forEach((space) => {
    if (space.type === "room") {
      const option = document.createElement("option");
      option.value = space.name;
      option.textContent = space.name;
      roomList.appendChild(option);
    }
  });


  mapData.getByType("connection").forEach((connection) => {

    const coords = connection.coordinates.find(
      (coord) => coord.floorId === mapView.currentFloor.id
    );
  
    if (coords) {
      let labelText = "";
      
      // Detectar por nombre si es escalera o ascensor
      const name = (connection.name || "").toLowerCase();
  
      if (name.includes("stairs") || name.includes("escalera")) {
        labelText = "🪜🪜";
      } else if (name.includes("elevator") || name.includes("ascensor")) {
        labelText = "🛗🛗";
      } else {
        // Otros tipos de conexiones opcionalmente
        labelText = connection.name || "";
      }
  
      mapView.Labels.add(coords, labelText, {
        fontSize: 48,
        fontWeight: "bold", // algunos motores lo aceptan
        color: "#000000",   // opcional: mejora la visibilidad
      });
    }
  });
  
  // 🔹 Aplica estilos e interactividad a cada espacio según su tipo
  spaces.forEach(space => {
    const type = space?.type?.toLowerCase();

    // Si el espacio es una habitación ('room')
    if (type === 'room') {
      mapView.updateState(space, {
        interactive: true,
        hoverColor: 'orange',
      });
    }
  });

  goButton.addEventListener("click", () => {
    const roomName = roomInput.value.trim();
    if (!roomName) return;

    const space = spaces.find(s => s.name.toLowerCase() === roomName.toLowerCase());
    if (!space) {
      alert("No se encontró la habitación: " + roomName);
      return;
    }

    //crear camino hasta la room seleccionada tomando como el punto inicial los ascensores.

    const startSpace = mapData.getByType("connection").find(connection =>
      connection.name.toLowerCase() === "ascensor"
    );
    if (!startSpace) {
      alert("No se encontraron ascensores disponibles.");
      return;
    }
    const directions = mapView.getDirections(startSpace, space);
    if (!directions) {
      alert("No se pudo calcular la ruta a la habitación: " + roomName);
      return;
    }

    mapView.Navigation.draw(directions);

    // const pathId = mapView.Paths.add(directions.coordinates, {
    //   nearRadius: 0.5,
    //   farRadius: 0.5,
    // });

  });




  // // 🔹 Sistema de navegación entre espacios (sin cambios)
  // let startSpace = null;
  // let currentPathId = null;
  // const roomInfoDiv = document.getElementById("roomInfo");

  // mapView.on('click', (event) => {
  //   const clickedSpace = event.spaces?.[0];
  //   if (!clickedSpace) return;

  //   if (clickedSpace.name && roomInfoDiv) {
  //     roomInfoDiv.innerText = `Seleccionaste: ${clickedSpace.name}`;
  //   }

  //   if (!startSpace) {
  //     startSpace = clickedSpace;
  //   } else {
  //     if (currentPathId) {
  //       mapView.Paths.remove(currentPathId);
  //     }

  //     const directions = mapView.getDirections(startSpace, clickedSpace);
  //     if (!directions) return;

  //     currentPathId = mapView.Paths.add(directions.coordinates, {
  //       nearRadius: 0.5,
  //       farRadius: 0.5,
  //     });

  //     startSpace = null;
  //   }
  // });
}

