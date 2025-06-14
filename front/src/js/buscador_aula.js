import { getFullEndpoint } from './api.js';

document.addEventListener('DOMContentLoaded', function () {
  const selectAula = document.getElementById('selectAula');
  const btnBuscar = document.getElementById('btnBuscar');
  const resultado = document.getElementById('resultadoAula');

  let datosAulas = {};
  const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const HORAS = Array.from({ length: 15 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

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

        return fetch(getFullEndpoint(`/api/v1/materias/${aulaSeleccionada}/materias`));
      })
      .then(response => {
        if (!response.ok) throw new Error('Error al cargar las materias del aula');
        return response.json();
      })
      .then(materias => {
        html += `
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">Calendario de uso del aula</h5>
              <div class="table-responsive">
                <table class="table table-bordered text-center">
                  <thead class="table-light">
                    <tr>
                      <th>Hora</th>
                      ${DIAS.map(dia => `<th>${dia}</th>`).join('')}
                    </tr>
                  </thead>
                  <tbody>
                    ${HORAS.map(hora => `
                      <tr>
                        <th scope="row">${hora}</th>
                        ${DIAS.map(() => `<td></td>`).join('')}
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `;

        resultado.innerHTML = html;
        resultado.classList.remove('d-none');

        // Llenar las celdas en rojo
        const tabla = resultado.querySelector('table');
        materias.forEach(materia => {
          const diaIndex = DIAS.findIndex(d => d.toLowerCase() === materia.dia_semana.toLowerCase());
          const horaInicio = parseInt(materia.hora_inicio.split(':')[0], 10);
          const horaFin = parseInt(materia.hora_fin.split(':')[0], 10);

          for (let h = horaInicio; h < horaFin; h++) {
            const rowIndex = h - 8; // Ajuste desde las 08:00
            if (rowIndex >= 0 && rowIndex < HORAS.length) {
              const fila = tabla.rows[rowIndex + 1]; // +1 porque la fila 0 es el encabezado
              const celda = fila.cells[diaIndex + 1]; // +1 porque la columna 0 es la hora
              celda.style.backgroundColor = '#2196F3';
              celda.style.color = 'white';
              celda.textContent = materia.nombre_materia;
            }
          }
        });
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