
export function setupSpaceInteractions(mapView, mapData) {
  const spaces = mapData.getByType('space');

  //Agrego posibles destino por el piso en el que estoy
  //busqueda = document.getElementById('map-container')

  const origen = document.getElementById("origen");
  const destino = document.getElementById("destino");
  const rutaTipo = document.getElementById("rutaTipo");
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
      const name = (connection.type || "").toLowerCase();
  
      if (name.includes("stairs") || name.includes("escalera")) {
        //console.log(connection);
        labelText = "🪜🪜";
      } else if (name.includes("elevator") || name.includes("ascensor")) {
        //.log(connection);
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
    const origenRoomName = origen.value.trim();
    const destinoRoomName = destino.value.trim();
    if (!destinoRoomName) return;
    if (!origenRoomName) return; // cambiar si queremos para que, si no se ingresa origen, este harcodeado con ascensores

    const destinoSpace = spaces.find(s => s.name.toLowerCase() === destinoRoomName.toLowerCase());
    if (!destinoSpace) {
      alert("No se encontró la habitación: " + destinoRoomName);
      return;
    }

    const origenSpace = spaces.find(s => s.name.toLowerCase() === origenRoomName.toLowerCase());
    if (!origenSpace) {
      alert("No se encontró la habitación: " + origenSpace);
      return; // cambiar si queremos para que, si no se ingresa origen, este harcodeado con ascensores
    }

    let accessibleRoute = rutaTipo.value === "normal" ? false : true; // si es normal, no es accesible, si es accesible, no es normal

    // Calcular ruta solo usando ascensores
    const directions = mapView.getDirections(origenSpace, destinoSpace, { accessible: accessibleRoute });
  
    if (!directions) {
      alert("No se pudo calcular la ruta a la habitación: " + destinoRoomName + " desde la habitación: " + origenRoomName);
      return;
    }

    console.log(directions)

    // const directions = mapView.getDirections(origenSpace, destinoSpace, {exclude: ["stairs"]});
    // if (!directions) {
    //   alert("No se pudo calcular la ruta a la habitación: " + destinoRoomName + "desde la habitacion: " + origenRoomName);
    //   return;
    // }


    // Debug: ver qué conexiones usa la ruta

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

