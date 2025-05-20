var map = L.map('map', {
    crs: L.CRS.Simple,
});

var bounds = [[0, 0], [720, 1152]];
var image = L.imageOverlay('images/mapa_sin_linea.png', bounds).addTo(map);
var markers = [];
var startMarker = null;
var oldMarker = null;

function updateLine() {
  var line = document.getElementById("line1");
  line.setAttribute("x1", `${x1}`)
  line.setAttribute("y1", `${720-y1}`)
  line.setAttribute("x2", `${x2}`)
  line.setAttribute("y2", `${720-y2}`)
  oldMarker = null;
}

function addMarker(id, coord) {
  const marker = { id: id, coord: coord, vecinos: [] };
  if (startMarker) {
    if (oldMarker) {
      oldMarker.vecinos.push(startMarker.id);
      startMarker.vecinos.push(oldMarker.id);
      var clone = document.getElementById("line1").cloneNode(true);
      clone.removeAttribute("id");
      clone.setAttribute("stroke", "red");
      svgLine.appendChild(clone);
      contadorNodo--;
      return;
    } else {
      startMarker.vecinos.push(id);
      marker.vecinos.push(startMarker.id);
    }
    marker.tipo = prompt("tipo de nodo:");
    if (marker.tipo === null) {
      return;
    } else if (marker.tipo.length === 0) {
      marker.tipo = "PASILLO";
    }
    var clone = document.getElementById("line1").cloneNode(true);
    clone.removeAttribute("id");
    clone.setAttribute("stroke", "red");
    svgLine.appendChild(clone);
  } else {
    marker.tipo = "ENTRADA";
  }
  markers.push(marker);
  L.circleMarker(coord, {
    radius: 5,
    color: 'green',
    fillOpacity: 0.8
  }).addTo(map).bindPopup(id).on('click', (e) => {
    var old = startMarker;
    startMarker = marker;
    [y2, x2] = [y1, x1];
    [y1, x1] = coord;
    updateLine();
    oldMarker = old;
  });
  startMarker = marker;
  x1 = x2;
  y1 = y2;
  updateLine();
}

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

var [y1, x1, y2, x2] = [126, 576, 126, 576];

{
  var svgLine = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgLine.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgLine.setAttribute('viewBox', '0 0 1152 720');
  svgLine.innerHTML = `<line id="line1" x1="576" y1="126" x2="576" y2="126" stroke="blue" />`;

  L.svgOverlay(svgLine, bounds, {}).addTo(map);
}
addMarker(generarIdNodo(contadorNodo++), [126, 576]);

map.on('click', function (e) {
  const coord = [Math.round(e.latlng.lat), Math.round(e.latlng.lng)];

  if (Math.abs(coord[0] - y1) < Math.abs(coord[1] - x1)) {
    coord[0] = y1;
  } else {
    coord[1] = x1;
  }
  [y2, x2] = coord;

  updateLine();
});

addEventListener("keydown", (e) => {
  if (e.shiftKey) {
    diff = 10;
  } else {
    diff = 1;
  }
  if (e.key === "w" || e.key === "W") {
    y2 += diff;
    updateLine();
  } else if (e.key === "a" || e.key === "A") {
    x2 -= diff;
    updateLine();
  } else if (e.key === "s" || e.key === "S") {
    y2 -= diff;
    updateLine();
  } else if (e.key === "d" || e.key === "D") {
    x2 += diff;
    updateLine();
  } else if (e.key === "k") {
    addMarker(generarIdNodo(contadorNodo++), [y2, x2]);
  } else if (e.key === "p") {
    console.log(JSON.stringify(markers));
  }
})

//----------------------------------------------------------------------------------------------------------------------
