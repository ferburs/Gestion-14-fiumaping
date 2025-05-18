/// <reference path="./api.js" />

document.addEventListener('DOMContentLoaded', function () {
  const selectAula = document.getElementById('selectAula');
  const btnBuscar = document.getElementById('btnBuscar');
  const resultado = document.getElementById('resultadoAula');

  let datosAulas = {};

  fetch(getFullEndpoint('/api/v1/aulas/'))
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar las aulas');
      return response.json();
    })
    .then(aulas => {
      for (const aula of aulas) {
        const option = document.createElement('option');
        option.value = aula.codigo;
        option.textContent = aula.codigo;
        datosAulas[aula.codigo] = aula;
        selectAula.appendChild(option);
      }

      $('.selectpicker').selectpicker('refresh');
    })
    .catch(error => {
      console.error('Error al cargar aulas:', error);
      resultado.innerHTML = `<p class="text-danger">No se pudieron cargar los datos de las aulas.</p>`;
      resultado.classList.remove('d-none');
    });


  btnBuscar.addEventListener('click', () => {
    const aulaSeleccionada = selectAula.value;
    const info = datosAulas[aulaSeleccionada];

    if (info) {
      resultado.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Aula ${info.codigo}</h5>
            <p class="card-text"><strong>Capacidad:</strong> ${info.capacidad}</p>
            <p class="card-text"><strong>Tipo de bancos:</strong> ${info.tipo_banco}</p>
            <p class="card-text"><strong>Tipo de pizzarrón:</strong> ${info.tipo_pizarron}</p>
            <p class="card-text"><strong>Cantidad de enchufes:</strong> ${info.enchufes}</p>
            <p class="card-text"><strong>Pantalla para proyectar:</strong> ${info.pantalla_proyector}</p>
          </div>
        </div>
      `;
      resultado.classList.remove('d-none');
    } else {
      resultado.innerHTML = `
        <div class="card">
          <div class="card-body">
            <p class="card-text">No se encontró información para esa aula.</p>
          </div>
        </div>
      `;
      resultado.classList.remove('d-none');
    }
  });

});