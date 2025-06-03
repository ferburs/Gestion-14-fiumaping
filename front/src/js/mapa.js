import { getMapData, show3dMap, DOORS } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/index.css';

const options = {
  key: 'mik_D7AoZMisz1lZvdg655373076c',
  secret: 'mis_B5YmdmHNyrQ4AL8qZdRDYcIHsinq4A7HBy3O9j8RRlh85480fd3',
  mapId: '683cfcf0ef06ad000bd9c615',
};


async function init() {
  const mapData = await getMapData(options);

  const mappedinDiv = document.getElementById("mappedin-map");
  const floorSelector = document.getElementById("floorSelector");

  mapData.getByType("floor").forEach((floor) => {
    const option = document.createElement("option");
    option.text = floor.name;
    option.value = floor.id;
    floorSelector.appendChild(option);
  });

  const mapView = await show3dMap(mappedinDiv, mapData);

  floorSelector.value = mapView.currentFloor.id;

  // Cambio de piso
  floorSelector.addEventListener("change", (e) => {
    mapView.setFloor(e.target.value);
  });

  mapView.on("floor-change", (event) => {
    const id = event.floor.id;
    if (!id) return;
    floorSelector.value = id;
  });

  mapView.Labels.all();

  // Mostrar puertas
  mapView.updateState(DOORS.Interior, {
    visible: true,
    color: '#5C4033',
    opacity: 0.6,
  });

  mapView.updateState(DOORS.Exterior, {
    visible: true,
    color: 'black',
    opacity: 0.6,
  });

  // Espacios interactivos: solo los que sean rooms
  const spaces = mapData.getByType('space');

  spaces.forEach((space) => {
    const isRoom = space?.type?.toLowerCase() === 'room';
    if (isRoom) {
      mapView.updateState(space, {
        interactive: true,
        hoverColor: 'orange',
      });
    }
  });

  // Manejo de clics y rutas
  let startSpace = null;
  let currentPathId = null;

  mapView.on('click', (event) => {
    if (!event.spaces || event.spaces.length === 0) return;

    if (!startSpace) {
      startSpace = event.spaces[0];
    } else {
      if (currentPathId) {
        mapView.Paths.remove(currentPathId); // ✅ borra ruta anterior
      }

      const directions = mapView.getDirections(startSpace, event.spaces[0]);
      if (!directions) return;

      currentPathId = mapView.Paths.add(directions.coordinates, {
        nearRadius: 0.5,
        farRadius: 0.5,
      });

      startSpace = null;
    }
  });
}

init();