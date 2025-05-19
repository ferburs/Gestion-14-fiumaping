
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
    let html = '';
  
    fetch(getFullEndpoint(`/api/v1/aulas/${aulaSeleccionada}/atributos`))
      .then(response => {
        if (!response.ok) throw new Error('Error al cargar la información del aula');
        return response.json();
      })
      .then(atributosArray => {
        if (!atributosArray.length) {
          html += `
            <div class="card mb-3">
              <div class="card-body">
                <p class="card-text">No se encontraron atributos para el aula ${aulaSeleccionada}.</p>
              </div>
            </div>
          `;
        } else {
          html += `
            <div class="card mb-3">
              <div class="card-body">
                <h5 class="card-title">Aula ${aulaSeleccionada}</h5>
                ${atributosArray.map(attr => `
                  <p class="card-text"><strong>${attr.nombre_atributo}:</strong> ${attr.valor}</p>
                `).join('')}
              </div>
            </div>
          `;
        }
  
        // Luego de atributos, buscar materias
        return fetch(getFullEndpoint(`/api/v1/materias/${aulaSeleccionada}/materias`));
      })
      .then(response => {
        if (!response.ok) throw new Error('Error al cargar las materias del aula');
        return response.json();
      })
      .then(materias => {
        if (materias.length) {
          html += `
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Materias dictadas</h5>
                <ul class="list-group list-group-flush">
                  ${materias.map(m => `
                    <li class="list-group-item">
                      <strong>Materia:</strong> ${m.nombre_materia}<br>
                      <strong>Codigo:</strong> ${m.codigo_materia}<br>
                      <strong>Día:</strong> ${m.dia_semana}<br>
                      <strong>Horario:</strong> ${m.hora_inicio} - ${m.hora_fin}
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>
          `;
        } else {
          html += `
            <div class="card">
              <div class="card-body">
                <p class="card-text">No se encontraron materias para el aula ${aulaSeleccionada}.</p>
              </div>
            </div>
          `;
        }
  
        resultado.innerHTML = html;
        resultado.classList.remove('d-none');
      })
      .catch(error => {
        console.error('Error al buscar información:', error);
        resultado.innerHTML = `
          <div class="card">
            <div class="card-body">
              <p class="text-danger">Error al cargar los datos del aula.</p>
            </div>
          </div>
        `;
        resultado.classList.remove('d-none');
      });
  });
});

