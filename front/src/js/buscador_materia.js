/// <reference path="./api.js" />

document.addEventListener('DOMContentLoaded', () => {
  const selectMateria = document.getElementById('selectMateria');
  const btnBuscar = document.getElementById('btnBuscarMateria');
  const resultado = document.getElementById('resultadoMateria');
  const materiaTitulo = document.getElementById('materiaTitulo');
  const materiaCodigo = document.getElementById('materiaCodigo');
  const materiaAulas = document.getElementById('materiaAulas');

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
        materiasData[materia.codigo] = materia
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
    materiaTitulo.textContent = materia.nombre;
    materiaCodigo.textContent = `Código: ${materia.codigo}`;

    fetch(getFullEndpoint('/api/v1/materias/' + codigo))
      .then(response => {
        if (!response.ok) throw new Error('Error al cargar las materias');
        return response.json();
      })
      .then(cursos => {
        const aulasHtml = cursos.map(un_curso => {
          const datos_aula = un_curso.aula;

          return `Aula ${datos_aula.codigo}: ${un_curso.dia_semana} de ${un_curso.hora_inicio} a ${un_curso.hora_fin}`;
        }).join('<br>');

        materiaAulas.innerHTML = `<strong>Aulas donde se dicta:</strong><br>${aulasHtml}`;
        resultado.classList.remove('d-none');
      });
  });

});
  
