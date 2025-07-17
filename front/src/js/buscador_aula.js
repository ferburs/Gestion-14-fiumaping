import { fetchAPI } from './api.js';

let toDeleteTableRow = null;
function adminSetToDeleteTableRow(e) {
  toDeleteTableRow = e.target.closest('tr');
}

async function adminSaveAttribute(e) {
  let botonEdit = e.target.closest('button');
  let tableRowElem = botonEdit.closest('tr');
  let tableHeadElem = tableRowElem.children[0];
  let tableDataElem = tableRowElem.children[1];
  let req = {};

  if (tableRowElem.hasAttribute('id')) {
    var method = 'PUT';
    req.id = +tableRowElem.getAttribute('id');
  } else {
    var method = 'POST';
  }

  req.nombre_atributo = tableRowElem.querySelector('th').innerText;
  req.valor = tableRowElem.querySelector('td').innerText;
  req.codigo_aula = document.getElementById('select-aula').value;

  if (!req.nombre_atributo || !req.valor) {
    alert('Falta especificar el atributo');
    return;
  }

  await fetchAPI(`api/v1/aulas/${req.codigo_aula}/atributos`, {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    },
    body: JSON.stringify(req)
  }).then(res => {
    if (!res.ok) throw new Error('Error al guardar atributo');
    if (method === "POST") {
      return res.json();
    }
  }).then(res => {
    tableRowElem.id ||= res.id;
  });

  tableHeadElem.setAttribute('contenteditable', 'false');
  tableDataElem.setAttribute('contenteditable', 'false');

  botonEdit.children[0].className = "bi bi-pencil-square";
  botonEdit.removeEventListener('click', adminSaveAttribute);
  botonEdit.addEventListener('click', adminEditRow);
}

function adminEditRow(e) {
  let botonEdit = e.target.closest('button');
  let tableRowElem = botonEdit.closest('tr');
  let tableDataElem = tableRowElem.children[1];

  tableDataElem.setAttribute('contenteditable', 'plaintext-only');
  tableDataElem.setAttribute('data-old-value', tableDataElem.innerText);
  tableDataElem.addEventListener('keydown', adminEditRowReset);

  botonEdit.children[0].className = "bi bi-check-lg";
  botonEdit.removeEventListener('click', adminEditRow);
  botonEdit.addEventListener('click', adminSaveAttribute);
}

function adminEditRowReset(e) {
  if (e.key !== 'Escape') {
    return;
  }

  let tableDataElem = e.target;
  let botonEdit = tableDataElem.closest('tr').querySelector('.btn-primary');

  tableDataElem.removeEventListener('keydown', adminEditRowReset);
  tableDataElem.setAttribute('contenteditable', false);
  tableDataElem.innerText = tableDataElem.getAttribute('data-old-value');

  botonEdit.children[0].className = "bi bi-pencil-square";
  botonEdit.setAttribute('onclick', 'adminEditRow(event)');
}

async function adminRemoveRow(e) {
  const codigo = document.getElementById('select-aula').value;
  const tableRowElem = e.target.closest('tr') ?? toDeleteTableRow;
  const id = tableRowElem.getAttribute('id');

  if (id) {
    await fetchAPI(`api/v1/aulas/${codigo}/atributos?`
             + new URLSearchParams({ id: id }), {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      },
    });
  }

  tableRowElem.remove();
}

async function adminRemoveCalendar(e) {
  const codigo = document.getElementById('select-aula').value;
  await fetchAPI(`api/v1/materias/${codigo}/materias`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    },
  });

  const oldTabla = document.getElementById('calendario');
  const templateTablaHorarios = document.getElementById('template-tabla-horarios');
  const clone = templateTablaHorarios.content.cloneNode(true);
  document.getElementById('calendar-container').replaceChild(clone, oldTabla);
}

async function adminSubmitForm(e) {
  const codigo = document.getElementById('select-aula').value;
  let form = document.getElementById('edit-form');
  const isValid = form.checkValidity();

  form.classList.add('was-validated');

  if (isValid === false) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  const req = {
    codigo: form[0].value,
    dia_semana: form[1].value,
    hora_inicio: form[2].value,
    hora_fin: form[3].value,
  };

  await fetchAPI(`api/v1/materias/${codigo}/materias`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    },
    body: JSON.stringify(req),
  }).then(res => {
      if (!res.ok) {
        throw new Error("No se pudo agregar el horario");
      }
  });

  const tabla = document.getElementById('calendario');
  const diaIndex = form[1].selectedIndex - 1;
  const horaInicio = parseInt(req.hora_inicio);
  const horaFin = parseInt(req.hora_fin);
  const nombre_materia = form[0].options[form[0].selectedIndex].getAttribute('data-nombre-materia');

  for (let h = horaInicio; h < horaFin; h++) {
    const rowIndex = h - 8; // Ajuste desde las 08:00
    const fila = tabla.rows[rowIndex + 1]; // +1 porque la fila 0 es el encabezado
    const celda = fila.cells[diaIndex + 1]; // +1 porque la columna 0 es la hora
    celda.style.backgroundColor = '#2196F3';
    celda.style.color = 'white';
    celda.textContent = nombre_materia;
  }

  form.reset();
  form.classList.remove('was-validated');
}

function updateMinHorarioFin(e) {
  document.getElementById('input-fin')
    .setAttribute('min', e.target.value < '08:00' ? '08:00' : e.target.value);
}

document.addEventListener('DOMContentLoaded', async function () {
  const isAdmin = localStorage.getItem('userRole') == 'ADMIN';
  const selectAula = document.getElementById('select-aula');
  const btnBuscar = document.getElementById('btn-buscar');
  const resultado = document.getElementById('resultado-aula');
  const calendarContainer = document.getElementById('calendar-container');
  const tablaAtributos = document.getElementById('atributos-aula');
  const templateTablaHorarios = document.getElementById('template-tabla-horarios');
  const templateAtributo = document.getElementById('template-atributo');
  const templateNuevoAttr = document.getElementById('template-nuevo-atributo');
  const templateBtnAttr = document.getElementById('template-btn-attr-admin');

  await fetchAPI('api/v1/aulas/')
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar las aulas');
      return response.json();
    })
    .then(aulas => {
      for (const aula of aulas) {
        const option = document.createElement('option');
        option.textContent = aula.codigo;
        selectAula.appendChild(option);
      }

      $('.selectpicker').selectpicker('refresh');
    })
    .catch(error => {
      console.error('Error al cargar aulas:', error);
      resultado.innerHTML = `<p class="text-danger">No se pudieron cargar los datos de las aulas.</p>`;
      resultado.classList.remove('d-none');
    });

  if (isAdmin) {
    document
      .querySelector('#modal-delete .btn-primary')
      .addEventListener('click', adminRemoveRow);

    const templateBtnAdmin = document.getElementById('template-btn-admin');
    const clone = templateBtnAdmin.content.cloneNode(true);

    const btnEliminar =
      clone.querySelector('#modal-reset-calendario .btn-primary');
    btnEliminar.addEventListener('click', adminRemoveCalendar);

    const btnSubmit = clone.querySelector('#submit-form');
    btnSubmit.addEventListener('click', adminSubmitForm);

    const inputInicio = clone.querySelector('#input-inicio');
    inputInicio.addEventListener('change', updateMinHorarioFin);
    document.getElementById('calendario-header').appendChild(clone);

    const templateAgregar = document.getElementById('template-agregar-atributo');
    const filaAgregar = templateAgregar.content.cloneNode(true);

    filaAgregar.querySelector('.btn-primary').addEventListener('click', e => {
      const clone = templateNuevoAttr.content.cloneNode(true);

      const btnSave = clone.querySelector('.btn-primary');
      btnSave.addEventListener('click', adminSaveAttribute);

      const btnRemove = clone.querySelector('.btn-danger');
      btnRemove.addEventListener('click', adminRemoveRow);

      e.target.closest('tr').before(clone);
    });
    tablaAtributos.insertRow().appendChild(filaAgregar);

    await fetchAPI('api/v1/materias/')
      .then(response => {
        if (!response.ok) throw new Error('Error al cargar las materias');
        return response.json();
      })
      .then(materias => {
        let selectMateria = resultado.querySelector('form')[0];
        for (const materia of materias) {
          const option = document.createElement('option');
          option.value = materia.codigo;
          option.setAttribute('data-nombre-materia', materia.nombre);
          option.textContent = `${materia.nombre} (${materia.codigo})`;
          selectMateria.appendChild(option);
        }
      })
  }

  btnBuscar.addEventListener('click', async function() {
    const aulaSeleccionada = selectAula.value;

    if (!aulaSeleccionada) {
      return;
    }

    window.history.replaceState(null, "", `?codigo=${aulaSeleccionada}`);
    document.getElementById('aula-titulo').innerText = `Aula ${aulaSeleccionada}`;

    await Promise.all([
      fetchAPI(`api/v1/aulas/${aulaSeleccionada}/atributos`)
        .then(response => {
          if (!response.ok) throw new Error('Error al cargar la información del aula');
          return response.json();
        }).then(atributosArray => {
          for (let i = tablaAtributos.rows.length; i > isAdmin; i--) {
            tablaAtributos.deleteRow(0);
          }

          for (const attr of atributosArray.reverse()) {
            const row = tablaAtributos.insertRow(0);
            const clone = templateAtributo.content.cloneNode(true);
            // TODO: if isAdmin clear all but , otherwise clear all
            row.id = attr.id;
            clone.querySelector('th').innerText = attr.nombre_atributo;
            clone.querySelector('td').innerText = attr.valor;
            row.appendChild(clone);

            if (isAdmin) {
              const btnAdmin = templateBtnAttr.content.cloneNode(true);
              btnAdmin
                .querySelector('.btn-primary')
                .addEventListener('click', adminEditRow);
              btnAdmin
                .querySelector('.btn-danger')
                .addEventListener('click', adminSetToDeleteTableRow);
              row.appendChild(btnAdmin);
            }
          }
        }),
      fetchAPI(`api/v1/materias/${aulaSeleccionada}/materias`)
        .then(response => {
          if (!response.ok) throw new Error('Error al cargar las materias del aula');
          return response.json();
        }).then(materias => {
          // Llenar las celdas en rojo
          const clone = templateTablaHorarios.content.cloneNode(true);
          const td = clone.querySelectorAll('td');
          const th = clone.querySelectorAll('th');
          const DIAS = [];

          for (let i = 1; i <= 7; i++) {
            DIAS.push(th[i].innerText.toLowerCase());
          }

          for (const materia of materias) {
            const col = DIAS.indexOf(materia.dia_semana.toLowerCase());
            const hora_i = parseInt(materia.hora_inicio) - 8;
            const hora_f = parseInt(materia.hora_fin) - 8;
            for (let i = hora_i; i < hora_f; i++) {
              const celda = td[i * 7 + col];
              celda.style.backgroundColor = '#2196F3';
              celda.style.color = 'white';
              celda.textContent = materia.nombre_materia;
            }
          }

          const oldTabla = document.getElementById('calendario');
          if (oldTabla !== null) {
            calendarContainer.replaceChild(clone, oldTabla);
          } else {
            calendarContainer.appendChild(clone);
          }

          resultado.classList.remove('d-none');
        })
    ]).catch(error => {
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
