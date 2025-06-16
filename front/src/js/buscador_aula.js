/// <reference path="./api.js" />

function adminSaveAttribute(e, method) {
  let botonEdit = e.target.closest('button');
  let tableRowElem = botonEdit.closest('tr');
  let tableHeadElem = tableRowElem.children[0];
  let tableDataElem = tableRowElem.children[1];
  let req = {};

  if (method === "PUT") {
    req.id = +tableRowElem.getAttribute('id');
  }

  req.nombre_atributo = tableRowElem.querySelector('th').innerText;
  req.valor = tableRowElem.querySelector('td').innerText;
  req.codigo_aula = tableRowElem.closest('div').children[0].innerText.split(' ')[1];

  if (!req.nombre_atributo || !req.valor) {
    alert('Falta especificar el atributo');
    return;
  }

  tableHeadElem.setAttribute('contenteditable', 'false');
  tableDataElem.setAttribute('contenteditable', 'false');

  botonEdit.children[0].className = "bi bi-pencil-square";
  botonEdit.setAttribute('onclick', 'adminEditRow(event)');

  let promise = fetch(getFullEndpoint(`/api/v1/aulas/${req.codigo_aula}/atributos`), {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    },
    body: JSON.stringify(req)
  })

  if (method === "POST") {
    promise.then(res => {
      if (!res.ok) throw new Error('Error al agregar atributos al aula');
      return res.json();
    }).then(res => {
      tableRowElem.setAttribute('id', res.id);
    });
  }
}

function adminEditRow(e) {
  let botonEdit = e.target.closest('button');
  let tableRowElem = botonEdit.closest('tr');
  let tableDataElem = tableRowElem.children[1];

  tableDataElem.setAttribute('contenteditable', 'plaintext-only');

  botonEdit.children[0].className = "bi bi-check-lg";
  botonEdit.setAttribute('onclick', 'adminSaveAttribute(event, "PUT")');
}

document.addEventListener('DOMContentLoaded', function () {
  const selectAula = document.getElementById('selectAula');
  const btnBuscar = document.getElementById('btnBuscar');
  const resultado = document.getElementById('resultadoAula');
  const isAdmin = localStorage.getItem('userRole') == 'Administrador';

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
              <hr />
              <table id="atributosAula" class="table table-striped">
                <tbody>
                  ${atributosArray.map((attr) => `
                  <tr id=${attr.id}>
                    <th scope="row">${attr.nombre_atributo}</th>
                    <td>${attr.valor}</td>
                    ${isAdmin ? `
                    <td align="right"><div class="btn-group">
                      <button class="btn btn-primary" onclick="adminEditRow(event)">
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button class="btn btn-danger">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div></td>` : ''}
                  </tr>
                  `).join('')}
                  ${isAdmin ? `
                  <tr><td><button id="agregarAtributo" class="btn btn-primary">
                    <i class="bi bi-plus-lg"></i>
                  </button></td></tr>
                  ` : ""}
                </tbody>
              </table>
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
              <div class="d-flex p-2 justify-content-between align-items-center">
                <h5 class="card-title">Calendario de uso del aula</h5>
                ${isAdmin ? `
                <button class="btn btn-primary" data-toggle="modal" data-target="#modalCalendario">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <div class="modal fade" id="modalCalendario" tabindex="-1" role="dialog" aria-labelledby="Editor de Calendario" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">Editar Calendario del Aula</h5>
                      </div>
                      <div class="modal-body">
                        <form method="post" action="${getFullEndpoint(`/api/v1/materias/${aulaSeleccionada}/materias`)}">
                          <div class="form-group mb-3">
                            <label for="inputMateria">Materia</label>
                            <select id="inputMateria" class="form-control">
                              <option value="" disabled selected>Elegí una materia</option>
                            </select>
                          </div>
                          <div class="row">
                            <div class="form-group col-md-4">
                              <label for="inputDia">Día</label>
                              <select id="inputDia" class="form-control">
                                <option value="" disabled selected>Día</option>
                                ${DIAS.map(dia =>
                                  `<option>${dia}</option>`
                                ).join('')}
                              </select>
                            </div>
                            <div class="form-group col-md-4">
                              <label for="inputInicio">Horario inicio</label>
                              <select id="inputInicio" class="form-control">
                                <option value="" disabled selected>Inicio</option>
                                ${HORAS.map(hora =>
                                  `<option>${hora}</option>`
                                ).join('')}
                              </select>
                            </div>
                            <div class="form-group col-md-4">
                              <label for="inputFin">Horario fin</label>
                              <select id="inputFin" class="form-control">
                                <option value="" disabled selected>Fin</option>
                                ${HORAS.map(hora =>
                                  `<option>${hora}</option>`
                                ).join('')}
                              </select>
                            </div>
                          </div>
                          <br />
                          <div class="d-md-flex gap-2 d-grid justify-content-md-end">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Guardar cambios</button>
                          </div>
                        </form>
                      </div>
                      <div class="modal-footer">
                      </div>
                    </div>
                  </div>
                </div>` : ""}
              </div>
              <div class="table-responsive">
                <table id="calendario" class="table table-bordered text-center">
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

        if (isAdmin) {
          resultado.querySelector('#agregarAtributo').addEventListener('click', e => {
            $('#atributosAula tr:last').before(`<tr>
              <th contenteditable="plaintext-only"></th>
              <td contenteditable="plaintext-only"></td>
              <td align="right"><div class="btn-group">
                <button class="btn btn-primary" onclick="adminSaveAttribute(event, 'POST')">
                  <i class="bi bi-check-lg"></i>
                </button>
                <button class="btn btn-danger">
                  <i class="bi bi-trash"></i>
                </button>
              </div></td>
              </tr>`);
          });
        }

        // Llenar las celdas en rojo
        const tabla = resultado.querySelector('#calendario');
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
        console.log(materias);
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
