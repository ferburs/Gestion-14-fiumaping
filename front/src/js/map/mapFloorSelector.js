export function setupFloorSelector(mapView, selector, mapData) {
    mapData.getByType("floor").forEach(floor => {
      const option = document.createElement("option");
      option.value = floor.id;
      option.text = floor.name;
      selector.appendChild(option);
    });
  
    selector.value = mapView.currentFloor.id;
  
    selector.addEventListener("change", (e) => {
      mapView.setFloor(e.target.value);
    });
  
    mapView.on("floor-change", (e) => {
      if (e.floor?.id) {
        selector.value = e.floor.id;
      }
    });
  }