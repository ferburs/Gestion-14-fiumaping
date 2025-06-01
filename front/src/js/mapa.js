import { getMapData, show3dMap } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/index.css';

const options = {
    key: 'mik_D7AoZMisz1lZvdg655373076c',
    secret: 'mis_B5YmdmHNyrQ4AL8qZdRDYcIHsinq4A7HBy3O9j8RRlh85480fd3',
    mapId: '683ca5d7d26993000b622490',
};

async function init() {
  const mapData = await getMapData(options);
  const mapView = await show3dMap(
      document.getElementById('mappedin-map'),
      mapData
  );

  mapData.getByType('space').forEach((space) => {
    mapView.updateState(space, {
      interactive: true,
      hoverColor: 'orange',
    });

    let startSpace = null;
    let path = null;

    mapView.on('click', (event) => {
      if (!startSpace) {
        startSpace = event.spaces[0];
      } else if (!path && event.spaces[0]) {
        const directions = mapView.getDirections(startSpace, event.spaces[0]);
        if (!directions) return;

        mapView.Paths.add(directions.coordinates, {
          nearRadius: 0.5,
          farRadius: 0.5,
        });
      }
    });
  });
}

init();











// var map = L.map('map', {
//   crs: L.CRS.Simple,
//   minZoom: -1,
// });

// var bounds = [[0, 0], [720, 1152]];
// var image = L.imageOverlay('images/mapa_sin_linea.png', bounds).addTo(map);

// map.fitBounds(bounds);


// // Cargar los nodos desde coordenadas.json
// fetch('json/coordenadas.json')
//   .then(response => response.json())
//   .then(data => {
//     for (let key in data) {
//       const lugar = data[key];
//       if (!lugar.hasOwnProperty("tipo")) {
//         continue;
//       }

//       const coord = lugar.coord;
//       const tipo = lugar.tipo;

//       // Agregar marcador como punto (circleMarker)
//       const marker = L.marker(coord).addTo(map);
//       marker.bindPopup(`<br>${tipo}`);

      
//     }
//   });


/*
//------------- para que en la consola me aparezcan las coordenadas al hacer click, esto despues hay que borrarlo-------------------------
// --- MODO EDICIÓN: Agregar nodos con clic ---
let contadorNodo = 0;

// Mapa de letras: 0 -> A, 1 -> B, ..., 25 -> Z, 26 -> AA, etc.
function generarIdNodo(n) {
  let id = '';
  do {
    id = String.fromCharCode(65 + (n % 26)) + id;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return id;
}

map.on('click', function (e) {
  const coord = [Math.round(e.latlng.lat), Math.round(e.latlng.lng)];
  const id = generarIdNodo(contadorNodo++);
  
  // Dibujar el nodo
  L.circleMarker(coord, {
    radius: 5,
    color: 'green',
    fillOpacity: 0.8
  }).addTo(map).bindTooltip(id, { permanent: true, direction: 'right' });

  // Imprimir nodo en formato listo para copiar
  console.log(`"${id}": { coord: [${coord[0]}, ${coord[1]}], vecinos: [] },`);
});

//----------------------------------------------------------------------------------------------------------------------

*/
