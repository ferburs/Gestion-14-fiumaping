var map = L.map('map', {
    crs: L.CRS.Simple,
});

var bounds = [[0, 0], [191, 284]];
var image = L.imageOverlay('mapa.png', bounds).addTo(map);

map.fitBounds(bounds);
