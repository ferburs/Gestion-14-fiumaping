var map = L.map('map', {
    crs: L.CRS.Simple,
});

var bounds = [[0, 0], [191, 284]];
var image = L.imageOverlay('images/dibujo_pb.png', bounds).addTo(map);

map.fitBounds(bounds);


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