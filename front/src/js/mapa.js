import { getMapData, show3dMap, DOORS } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/index.css';

const options = {
  key: 'mik_D7AoZMisz1lZvdg655373076c',
  secret: 'mis_B5YmdmHNyrQ4AL8qZdRDYcIHsinq4A7HBy3O9j8RRlh85480fd3',
  mapId: '683cfcf0ef06ad000bd9c615',
};

function calculateCentroid(polygon) {
  const coords = polygon?.coordinates;
  if (!coords || coords.length === 0) return null;

  let x = 0, y = 0, z = 0;
  coords.forEach(point => {
    x += point.x;
    y += point.y;
    z += point.z;
  });

  return {
    x: x / coords.length,
    y: y / coords.length,
    z: z / coords.length,
  };
}

async function init() {
  const mapData = await getMapData(options);
  const mapView = await show3dMap(
    document.getElementById('mappedin-map'),
    mapData
  );

  mapView.Labels.all();
  console.log(mapData.allVerticalMovements);
  console.log('mapData keys:', Object.keys(mapData));
  // Mostrar puertas interiores
  mapView.updateState(DOORS.Interior, {
    visible: true,
    color: '#5C4033',
    opacity: 0.6,
  });

  // Mostrar puertas exteriores
  mapView.updateState(DOORS.Exterior, {
    visible: true,
    color: 'black',
    opacity: 0.6,
  });

  // Obtener y mostrar todos los vertical movements (elevadores, escaleras, etc.)
  // const verticalMovements = mapData.getByType('vertical_movement');
  // console.log(`Vertical movements encontrados: ${verticalMovements.length}`);

  verticalMovements.forEach(vm => {
    console.log({
      name: vm.name,
      type: vm.verticalMovementType,
      id: vm.id,
      hasGeometry: !!vm.polygon || !!vm.mesh || !!vm.geometry,
    });

    // Intentar hacer visible cada uno
    mapView.updateState(vm, {
      visible: true,
      color: 'blue',
      opacity: 0.8,
    });
  });

  // Hacer interactivos los espacios
  const spaces = mapData.getByType('space');
  spaces.forEach((space) => {
    mapView.updateState(space, {
      interactive: true,
      hoverColor: 'orange',
    });
  });


  // Manejo de clics para rutas
  let startSpace = null;
  let path = null;




  //Camino de un click a otro

  // mapView.on('click', (event) => {
  //   if (!event.spaces || event.spaces.length === 0) return;

  //   if (!startSpace) {
  //     startSpace = event.spaces[0];
  //   } else if (!path) {
  //     const directions = mapView.getDirections(startSpace, event.spaces[0]);
  //     if (!directions) return;

  //     mapView.Paths.add(directions.coordinates, {
  //       nearRadius: 0.5,
  //       farRadius: 0.5,
  //     });

  //     path = directions;
  //   }
  // });
}

init();
