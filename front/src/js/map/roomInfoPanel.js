import { fetchAPI } from "../api";

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

    infoName.textContent = clickedSpace.name;
    /*
    if (roomInfo.image) {
      infoImage.src = roomInfo.image;
      infoImage.style.display = 'block';
    } else {
      infoImage.style.display = 'none';
    }*/

    // Por ahora hardcodeado para todas la misma imagen
    infoImage.src = "images/aula403.jpg"
    infoImage.style.display = 'block';
    infoPanel.style.display = 'block';

    


    const cleanName = clickedSpace.name.trim();
    //Me quedo solo con el numero de aula. Aula 403 -> 403. Aula 403b -> 403b. Baño piso 3 -> null
    const match = cleanName.match(/^aula\s+(\w.*)$/i);
    let numAula = match ? match[1] : null;
    console.log("Nombre limpio:", cleanName);
    if (numAula === null) {
      console.log("No es aula.");
      infoDescription.textContent = '';
      return;
    }

    console.log("Número de aula:", numAula);
    fetchAPI(`api/v1/aulas/${numAula}/atributos`)
        .then(response => {
          if (!response.ok) throw new Error('Error al cargar la información del aula');
          return response.json();
        })
        .then(atributosArray => {
          console.log("Atributos del aula:", atributosArray);

          let pizarron = atributosArray.find(a => a.nombre_atributo.toLowerCase() === 'tipo pizarron')?.valor;
          let banco = atributosArray.find(a => a.nombre_atributo.toLowerCase() === 'tipo banco')?.valor;
          let enchufes = atributosArray.find(a => a.nombre_atributo.toLowerCase() === 'cantidad enchufes')?.valor;
          let capacidad = atributosArray.find(a => a.nombre_atributo.toLowerCase() === 'capacidad')?.valor;

          if (pizarron) {
            pizarron = `<div><i class="fas fa-chalkboard"></i> ${pizarron}</div>`;
          }
          if (banco) {
            banco = `<div><i class="fas fa-chair"></i> ${banco}</div>`;
          }
          if (enchufes) {
            enchufes = `<div><i class="fas fa-plug"></i> ${enchufes} enchufe${enchufes > 1 ? "s" : ""}</div>`;
          }
          if (capacidad) {
            capacidad = `<div><i class="fas fa-users"></i> ${capacidad} alumno${capacidad > 1 ? "s" : ""}</div>`;
          }

          infoDescription.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 14px;">
              ${pizarron || ""}
              ${banco || ""}
              ${enchufes || ""}
              ${capacidad || ""}
              <div><a href="/buscador_por_aula.html?codigo=${numAula}"><i class="fas fa-circle-info"></i> Ver información del aula</a></div>
            </div>
          `;
        })
        .catch(error => {
          console.error('Error al cargar los atributos del aula:', error);
          infoDescription.textContent = 'No se pudieron cargar los atributos del aula.';
        });
   
  });

  closePanelButton.addEventListener("click", () => {
    infoPanel.style.display = 'none';
  });
}
