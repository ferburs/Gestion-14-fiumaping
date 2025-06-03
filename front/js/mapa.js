var bounds = [[0, 0], [720, 1152]];
var maxBounds = function(bounds) {
  var extraw = (bounds[1][1] - bounds[0][1]) / 3;
  var extrah = (bounds[1][0] - bounds[0][0]) / 3;

  return [[bounds[0][0] - extrah, bounds[0][1] - extraw],
          [bounds[1][0] + extrah, bounds[1][1] + extraw]]
}(bounds)

var imageSs = L.imageOverlay('images/ss.png', bounds);
var imageEp = L.imageOverlay('images/ep.png', bounds);
var image0 = L.imageOverlay('images/0.png', bounds);
var image1 = L.imageOverlay('images/1.png', bounds);
var image2 = L.imageOverlay('images/2.png', bounds);
var image3 = L.imageOverlay('images/3.png', bounds);
var image4 = L.imageOverlay('images/4.png', bounds);
var image5 = L.imageOverlay('images/5.png', bounds);

var map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -1,
  layers: [image0],
  maxBounds: maxBounds,
});

map.fitBounds(bounds);

const baseLayers = {
  'Subsuelo': imageSs,
  'Entrepiso': imageEp,
  'Planta Baja': image0,
  '1er Piso': image1,
  '2do Piso': image2,
  '3er Piso': image3,
  '4to Piso': image4,
  '5to Piso': image5,
};

const layerControl = L.control.layers(baseLayers).addTo(map);

// Cargar los nodos desde coordenadas.json
fetch('json/coordenadas.json')
  .then(response => response.json())
  .then(data => {
    for (let key in data) {
      const lugar = data[key];

      const coord = lugar.coord;
      const tipo = lugar.tipo;

      if (!tipo) {
        continue;
      }

      // Agregar marcador como punto (circleMarker)
      const marker = L.marker(coord).addTo(map);
      marker.bindPopup(`<br>${tipo}`);
    }
  });


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
