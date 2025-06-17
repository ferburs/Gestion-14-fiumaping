import { getFullEndpoint } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const selectMateria = document.getElementById('selectMateria');
  const btnBuscar = document.getElementById('btnBuscarMateria');
  const resultado = document.getElementById('resultadoMateria');
  const tablaAulasContainer = document.getElementById('tablaAulasContainer');
  const materiaTitulo = document.getElementById('materiaTitulo');
  const templateTablaHorarios = document.querySelector('#templateTablaHorarios');

  let materiasData = {};

  fetch(getFullEndpoint('/api/v1/materias/'))
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar las materias');
      return response.json();
    })
    .then(materias => {
      selectMateria.innerHTML = ''; // Limpia primero por si recargás

      const placeholderOption = document.createElement('option');
      placeholderOption.textContent = 'Elegí una materia';
      placeholderOption.disabled = true;
      placeholderOption.selected = true;
      placeholderOption.value = "";
      selectMateria.appendChild(placeholderOption);
      
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

    fetch(getFullEndpoint('/api/v1/materias/' + codigo))
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

        const oldMaterias = document.querySelector('#materiaAulas');
        if (oldMaterias !== null) {
          tablaAulasContainer.replaceChild(clone, oldMaterias);
        } else {
          tablaAulasContainer.appendChild(clone);
        }

        resultado.classList.remove('d-none');
      });
  });

});
  
