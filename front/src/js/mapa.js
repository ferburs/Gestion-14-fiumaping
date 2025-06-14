import { getMapData } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/index.css';
import { initMap } from './map/initMap.js';
import { MAP_OPTIONS } from './utils.js';

async function init() {
  try {
    const mapData = await getMapData(MAP_OPTIONS);
    const container = document.getElementById("mappedin-map");
    const floorSelector = document.getElementById("floorSelector");
    
    
    await initMap(container, floorSelector, mapData);
  } catch (error) {
    console.error("Error initializing the map:", error);
  }
}

init();