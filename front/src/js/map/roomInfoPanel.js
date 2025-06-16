import { getFullEndpoint } from "../api";

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
    
      if (roomInfo.image) {
        infoImage.src = roomInfo.image;
        infoImage.style.display = 'block';
      } else {
        infoImage.style.display = 'none';
      }

      infoPanel.style.display = 'block';

      //Me quedo solo con el numero de aula
      const numAula = clickedSpace.name.match(/\d+/);

      fetch(getFullEndpoint(`/api/v1/aulas/${numAula[0]}/atributos`))
          .then(response => {
            if (!response.ok) throw new Error('Error al cargar la información del aula');
            return response.json();
          })
          .then(atributosArray => {
            console.log("Atributos del aula:", atributosArray);

            const pizarron = atributosArray.find(a => a.nombre_atributo.toLowerCase() === 'tipo pizarron')?.valor || 'Desconocido';
            const banco = atributosArray.find(a => a.nombre_atributo.toLowerCase() === 'tipo banco')?.valor || 'Desconocido';
            const enchufes = atributosArray.find(a => a.nombre_atributo.toLowerCase() === 'cantidad enchufes')?.valor || 'Desconocido';

            infoDescription.innerHTML = `
              <div style="display: flex; flex-direction: column; gap: 6px; font-size: 14px;">
                <div><i class="fas fa-chalkboard"></i> ${pizarron}</div>
                <div><i class="fas fa-chair"></i> ${banco}</div>
                <div><i class="fas fa-plug"></i> ${enchufes} enchufes</div>
              </div>
            `;
          })
          .catch(error => {
            console.error('Error al cargar los atributos del aula:', error);
            infoDescription.textContent = 'No se pudieron cargar los atributos del aula.';
          });
   
    }else {
      infoPanel.style.display = 'none';
    }
  });

  closePanelButton.addEventListener("click", () => {
    infoPanel.style.display = 'none';
  });
}