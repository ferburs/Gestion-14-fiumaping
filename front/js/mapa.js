var map = L.map('map', {
    crs: L.CRS.Simple,
});

var bounds = [[0, 0], [720, 1152]];
var image = L.imageOverlay('images/mapa_sin_linea.png', bounds).addTo(map);
var [oldMarker, selectedMarker] = [null, null];
var geoaulas = { "type": "FeatureCollection", "features": [] };
var coordinates = [];
var lines = [];
var markers = [];

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

var [y1, x1, y2, x2] = [NaN, NaN, NaN, NaN];
function updateLine() {
  var line = svgLine.childNodes[0];
  line.setAttribute("x1", `${x1}`)
  line.setAttribute("y1", `${bounds[1][0]-y1}`)
  line.setAttribute("x2", `${x2}`)
  line.setAttribute("y2", `${bounds[1][0]-y2}`)
}

var svgLine = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svgLine.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
svgLine.setAttribute('viewBox', `${bounds[0][1]} ${bounds[0][0]} ${bounds[1][1]} ${bounds[1][0]}`);
svgLine.innerHTML = `<line id="line1" x1="0" y1="0" x2="0" y2="0" stroke="blue" />`;

L.svgOverlay(svgLine, bounds, {}).addTo(map);

function addLine(markerA, markerB) {
  var clone = svgLine.childNodes[0].cloneNode(true);
  clone.removeAttribute("id");
  clone.setAttribute("stroke", "red");
  svgLine.appendChild(clone);

  const i = coordinates.length;
  const coord = [y2, x2];
  updateMarker(coord, markerB, true);

  coordinates.push(coord);
  lines.push(clone);
  markers.push(markerB);

  markerA.on('move', (e) => {
    clone.setAttribute('x1', `${e.latlng.lng}`)
    clone.setAttribute('y1', `${bounds[1][0] - e.latlng.lat}`)
  });

  markerB.on('move', (e) => {
    coordinates[i] = [e.latlng.lat, e.latlng.lng];
    clone.setAttribute('x2', `${e.latlng.lng}`)
    clone.setAttribute('y2', `${bounds[1][0] - e.latlng.lat}`)
  });
}

function clearLines() {
  for (const line of lines) {
    svgLine.removeChild(line);
  }

  for (var marker of markers) {
    marker.dragging.disable();
  }

  markers = [];
  coordinates = [];
  lines = [];
}

function updateMarker(coord, marker, updateOld) {
  if (isNaN(x2)) {
    [y2, x2] = coord;
  }
  if (updateOld || coordinates.length === 0) {
    [y1, x1] = [y2, x2];
    oldMarker = selectedMarker;
  }
  [y2, x2] = coord;
  selectedMarker = marker;
  updateLine();
}

map.on('click', function (e) {
  const coord = [e.latlng.lat, e.latlng.lng];

  var leafletMarker = L.marker(coord, {
    draggable: true,
    autoPan: true,
  }).addTo(map).on('click', (e) => {
    updateMarker([e.latlng.lat, e.latlng.lng], leafletMarker, false);
  });

  updateMarker(coord, leafletMarker, false);
});

addEventListener("keydown", (e) => {
  if (e.key === "l") {
    addLine(oldMarker, selectedMarker);
  } else if (e.key === "c") {
    if (coordinates.length < 3) {
      return;
    }

    const name = prompt("nombre de aula/salon?");
    if (name === null) {
      return;
    }

    var geo = L.polygon(coordinates, {
      color: 'blue',
      opacity: 0.2
    }).addTo(map).toGeoJSON();
    geo.properties.name = name;

    geoaulas.features.push(geo);

    clearLines();
  } else if (e.key === "p") {
    console.log(JSON.stringify(geoaulas));
  }
})

//----------------------------------------------------------------------------------------------------------------------
