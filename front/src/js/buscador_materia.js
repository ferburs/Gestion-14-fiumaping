import { fetchAPI } from './api.js';

function adminRemoveCalendar(e) {
  const codigo = document.getElementById('select-materia').value;
  fetchAPI('api/v1/materias/' + codigo, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    },
  });
  const materiaAulas = document.getElementById('materia-aulas');
  const oldAulas = document.getElementById('calendario');
  const templateTablaHorarios = document.getElementById('template-tabla-horarios');
  const clone = templateTablaHorarios.content.cloneNode(true);
  materiaAulas.replaceChild(clone, oldAulas);
}

function adminSubmitForm(e) {
  let form = document.getElementById('edit-form');
  const isValid = form.checkValidity();

  form.classList.add('was-validated');

  if (isValid === false) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  const req = {
    codigo_aula: form[0].value,
    dia_semana: form[1].value,
    hora_inicio: form[2].value,
    hora_fin: form[3].value,
  };

  const codigoMateria = document.getElementById('select-materia').value;
  fetchAPI(`api/v1/materias/${codigoMateria}`, {
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
  const diaIndex = form[1].selectedIndex - 1; // -1 porque la opcion 0 es "Día"
  const horaInicio = parseInt(req.hora_inicio.split(':')[0], 10);
  const horaFin = parseInt(req.hora_fin.split(':')[0], 10);
  const aula = 'Aula ' + req.codigo_aula;

  for (let h = horaInicio; h < horaFin; h++) {
    const rowIndex = h - 8; // Ajuste desde las 08:00
    const fila = tabla.rows[rowIndex + 1]; // +1 porque la fila 0 es el encabezado
    const celda = fila.cells[diaIndex + 1]; // +1 porque la columna 0 es la hora
    celda.style.backgroundColor = '#2196F3';
    celda.style.color = 'white';
    celda.textContent = aula;
  }

  form.reset();
  form.classList.remove('was-validated');
}

function updateMinHorarioFin(e) {
  document.getElementById('input-fin')
    .setAttribute('min', e.target.value < '08:00' ? '08:00' : e.target.value);
}

document.addEventListener('DOMContentLoaded', () => {
  const selectMateria = document.getElementById('select-materia');
  const btnBuscar = document.getElementById('btn-buscar-materia');
  const resultado = document.getElementById('resultado-materia');
  const materiaAulas = document.getElementById('materia-aulas');
  const materiaTitulo = document.getElementById('materia-titulo');
  const templateTablaHorarios = document.getElementById('template-tabla-horarios');
  const isAdmin = localStorage.getItem('userRole') === 'ADMIN';

  if (isAdmin) {
    const templateBotonesAdmin = document.getElementById('template-botones-admin');
    const clone = templateBotonesAdmin.content.cloneNode(true);

    const btnEliminar = clone.querySelector('#modal-reset-calendario .btn-primary');
    btnEliminar.addEventListener('click', adminRemoveCalendar);

    const btnSubmit = clone.querySelector('#submit-form');
    btnSubmit.addEventListener('click', adminSubmitForm);

    const inputInicio = clone.querySelector('#input-inicio');
    inputInicio.addEventListener('change', updateMinHorarioFin);

    const selectAula = clone.querySelector('#input-aula');
    fetchAPI('api/v1/aulas/')
      .then(response => {
        if (!response.ok) throw new Error('Error al cargar las materias');
        return response.json();
      })
      .then(aulas => {
        for (const aula of aulas) {
          const option = document.createElement('option');
          option.textContent = aula.codigo;
          selectAula.appendChild(option);
        }
      })
    document.getElementById('calendario-header').appendChild(clone);
  }

  let materiasData = {};

  fetchAPI('api/v1/materias/')
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar las materias');
      return response.json();
    })
    .then(materias => {

      for (const materia of materias) {
        const option = document.createElement('option');
        option.value = materia.codigo;
        option.textContent = `${materia.nombre} (${materia.codigo})`;
        materiasData[materia.codigo] = materia;
        selectMateria.appendChild(option);
      }

      $('.selectpicker').selectpicker('refresh'); // si usás bootstrap-select
    })
    .catch(error => {
      console.error('Error al cargar aulas:', error);
      resultado.innerHTML = `<p class="text-danger">No se pudieron cargar los datos de las aulas.</p>`;
      resultado.classList.remove('d-none');
    });
    

  btnBuscar.addEventListener('click', () => {
    const codigo = selectMateria.value;

    if (!codigo)
      return;

    const materia = materiasData[codigo];
    materiaTitulo.textContent = `${materia.nombre} (${materia.codigo})`;

    fetchAPI('api/v1/materias/' + codigo)
      .then(response => {
        if (!response.ok) throw new Error('Error al cargar las materias');
        return response.json();
      })
      .then(cursos => {
        const clone = templateTablaHorarios.content.cloneNode(true);
        const td = clone.querySelectorAll('td');
        const th = clone.querySelectorAll('th');
        const DIAS = [];

        for (let i = 1; i <= 7; i++) {
          DIAS.push(th[i].innerText.toLowerCase());
        }

        for (const curso of cursos) {
          const aula = `Aula ${curso.aula.codigo}`;
          const col = DIAS.indexOf(curso.dia_semana.toLowerCase());
          const hora_i = parseInt(curso.hora_inicio) - 8;
          const hora_f = parseInt(curso.hora_fin) - 8;
          for (let i = hora_i; i < hora_f; i++) {
            const celda = td[i * 7 + col];
            celda.style.backgroundColor = '#2196F3';
            celda.style.color = 'white';
            celda.textContent = aula;
          }
        }

        const oldAulas = document.getElementById('calendario');
        if (oldAulas !== null) {
          materiaAulas.replaceChild(clone, oldAulas);
        } else {
          materiaAulas.appendChild(clone);
        }

        resultado.classList.remove('d-none');
      });
  });

});
