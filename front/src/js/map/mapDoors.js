import { DOORS } from '@mappedin/mappedin-js';

export function setupDoorVisibility(mapView) {
  mapView.updateState(DOORS.Interior, {
    visible: true,
    color: '#5C4033',
    opacity: 0.6,
  });

  mapView.updateState(DOORS.Exterior, {
    visible: true,
    color: 'black',
    opacity: 0.6,
  });
}