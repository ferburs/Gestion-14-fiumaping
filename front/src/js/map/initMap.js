import { show3dMap } from '@mappedin/mappedin-js';
import { setupFloorSelector } from './mapFloorSelector.js';
import { setupDoorVisibility } from './mapDoors.js';
import { setupSpaceInteractions } from './mapInteractions.js';

export async function initMap(container, floorSelector, mapData) {
  const mapView = await show3dMap(container, mapData);

  setupFloorSelector(mapView, floorSelector, mapData);
  setupDoorVisibility(mapView);
  setupSpaceInteractions(mapView, mapData);
  mapView.Labels.all();
  return mapView;
}