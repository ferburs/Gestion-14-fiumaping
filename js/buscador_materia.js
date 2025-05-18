document.addEventListener('DOMContentLoaded', () => {
    const selectMateria = document.getElementById('selectMateria');
    const btnBuscar = document.getElementById('btnBuscarMateria');
    const resultado = document.getElementById('resultadoMateria');
    const materiaTitulo = document.getElementById('materiaTitulo');
    const materiaCodigo = document.getElementById('materiaCodigo');
    const materiaDepartamento = document.getElementById('materiaDepartamento');
    const materiaAulas = document.getElementById('materiaAulas');
  
    let materiasData = {};
    let aulasData = {};
  
    // Cargar materias y aulas
    Promise.all([
      fetch('json/materia.json').then(res => res.json()),
      fetch('json/aulas.json').then(res => res.json())
    ])
      .then(([materias, aulas]) => {
        materiasData = materias;
        aulasData = aulas;
  
        // Agregar opciones al select
        for (const codigo in materias) {
            const option = document.createElement('option');
            option.value = codigo;
            option.textContent = `${materias[codigo].nombre} (${codigo})`;
            selectMateria.appendChild(option);
          }
  
        $('.selectpicker').selectpicker('refresh'); // si usás bootstrap-select
      })
      .catch(error => {
        console.error('Error al cargar materias o aulas:', error);
        alert(`Error al cargar materias o aulas: ${error.message}`);
      });
  
    btnBuscar.addEventListener('click', () => {
      const codigo = selectMateria.value;
      if (!codigo || !materiasData[codigo]) return;
  
      const materia = materiasData[codigo];
      materiaTitulo.textContent = materia.nombre;
      materiaCodigo.textContent = `Código: ${materia.codigo}`;
      materiaDepartamento.textContent = `Departamento: ${materia.departamento}`;
  
      // Mostrar info de aulas
      const aulasHtml = materia.aulas.map(aulaId => {
        const aula = aulasData[aulaId];
        return aula
          ? `Aula ${aulaId}: ${aula.capacidad}, ${aula.bancos}, ${aula.pizzarron}, Enchufes: ${aula.enchufes}, Proyector: ${aula.pantalla_proyector}`
          : `Aula ${aulaId} (sin información)`;
      }).join('<br>');
  
      materiaAulas.innerHTML = `<strong>Aulas donde se dicta:</strong><br>${aulasHtml}`;
  
      resultado.classList.remove('d-none');
    });
  });
  