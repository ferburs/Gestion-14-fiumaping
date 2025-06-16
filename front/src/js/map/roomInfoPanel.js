export function setupRoomInfoPanel(mapView, roomDetails) {
  const infoPanel = document.getElementById("room-info-panel");
  const infoName = document.getElementById("room-info-name");
  const infoDescription = document.getElementById("room-info-description");
  const infoImage = document.getElementById("room-info-image");
  const closePanelButton = document.getElementById("close-panel-btn");

  mapView.on('click', (event) => {
    const clickedSpace = event.spaces?.[0];
    if (!clickedSpace?.name) return;

    console.log("Espacio clickeado:", clickedSpace.name);

    const roomInfo = roomDetails.find(
      r => r.name.toLowerCase() === clickedSpace.name.toLowerCase()
    );

    if (roomInfo) {
      infoName.textContent = roomInfo.name;
      infoDescription.textContent = roomInfo.description;

    
      if (roomInfo.image) {
        infoImage.src = roomInfo.image;
        infoImage.style.display = 'block';
        console.log("Mostrando imagen:", infoImage.src);
      } else {
        infoImage.style.display = 'none';
      }

      infoPanel.style.display = 'block';
    } else {
      infoPanel.style.display = 'none';
    }
  });

  closePanelButton.addEventListener("click", () => {
    infoPanel.style.display = 'none';
  });
}