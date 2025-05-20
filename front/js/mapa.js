var map = L.map('map', {
    crs: L.CRS.Simple,
});

var bounds = [[0, 0], [720, 1152]];
var image = L.imageOverlay('images/mapa_sin_linea.png', bounds).addTo(map);
var markers = [];
var edgeStack = [];
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

function addLine(markerA, markerB) {
  const lineId = `${markerA.id},${markerB.id}`;
  if (document.getElementById(lineId)) {
    return false;
  }
  if (document.getElementById(`${markerB.id},${markerA.id}`)) {
    return false;
  }

  edgeStack.push([markerA, markerB, undefined]);
  markerA.vecinos.push(markerB.id);
  markerB.vecinos.push(markerA.id);

  var clone = document.getElementById("line1").cloneNode(true);
  clone.setAttribute("id", lineId);
  clone.setAttribute("stroke", "red");
  svgLine.appendChild(clone);

  return true;
}

function addMarker(id, coord) {
  const marker = { id: id, coord: coord, vecinos: [] };
  if (startMarker) {
    if (oldMarker) {
      addLine(oldMarker, startMarker);
      contadorNodo--;
      return;
    }
    marker.tipo = prompt("tipo de nodo:");
    if (marker.tipo === null) {
      return;
    } else if (marker.tipo.length === 0) {
      marker.tipo = "PASILLO";
    }
    if (!addLine(marker, startMarker)) {
      contadorNodo--;
      return;
    }
  } else {
    marker.tipo = "ENTRADA";
  }
  markers.push(marker);
  var leafletMarker = L.circleMarker(coord, {
    radius: 5,
    color: 'green',
    fillOpacity: 0.8
  }).addTo(map).bindPopup(marker.tipo).on('click', (e) => {
    [y2, x2] = [y1, x1];
    [y1, x1] = coord;
    updateLine();
    oldMarker = startMarker;
    startMarker = marker;
  });
  x1 = x2;
  y1 = y2;
  updateLine();
  startMarker = marker;
  if (edgeStack.length > 0) {
    edgeStack[edgeStack.length-1][2] = leafletMarker;
  }
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
  } else if (e.key === "u") {
    if (edgeStack.length > 0) {
      var [markerA, markerB, leafletMarker] = edgeStack.pop();
      markerA.vecinos.pop();
      markerB.vecinos.pop();
      svgLine.removeChild(document.getElementById(`${markerA.id},${markerB.id}`));
      [y2, x2] = markerA.coord;
      [y1, x1] = markerB.coord;
      updateLine();
      startMarker = markerB;
      if (leafletMarker) {
        map.removeLayer(leafletMarker);
        contadorNodo--;
        markers.pop();
      } else {
        oldMarker = markerA;
      }
    }
  }
})

//----------------------------------------------------------------------------------------------------------------------
