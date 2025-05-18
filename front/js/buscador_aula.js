/// <reference path="./api.js" />


document.addEventListener('DOMContentLoaded', function () {
    const selectAula = document.getElementById('selectAula');
    const btnBuscar = document.getElementById('btnBuscar');
    const resultado = document.getElementById('resultadoAula');
  
    let datosAulas = {};
  
    fetch(getFullEndpoint('/api/v1/aulas/'))
      .then(response => {
        if (!response.ok) throw new Error('Error al cargar JSON');
        return response.json();
      })
      .then(data => {
        datosAulas = data;
  
        // Vaciar select antes de llenar (por si acaso)
        selectAula.innerHTML = '<option value="" disabled selected>Elegí un aula</option>';
  
        // Agregar opciones desde JSON
        Object.keys(datosAulas).forEach(aulaId => {
          const option = document.createElement('option');
          option.value = aulaId;
          option.textContent = datosAulas[aulaId].codigo;
          selectAula.appendChild(option);
        });
  
        // Si usás bootstrap-select, refrescalo para que actualice el listado visual
        if (window.$ && $('.selectpicker').selectpicker) {
          $('.selectpicker').selectpicker('refresh');
        }
      })
      .catch(error => {
        console.error('Error al cargar aulas:', error);
        resultado.innerHTML = `<p class="text-danger">No se pudieron cargar los datos de las aulas.</p>`;
        resultado.classList.remove('d-none');
      });
  
    selectAula.addEventListener('change', () => {
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
  

/*

document.addEventListener('DOMContentLoaded', function () {

    // Agregue amnualmente aulas para probar como se ve
    const datosAulas = {
      1: {
        titulo: "Aula 1",
        capacidad: "30 personas",
        bancos: "De madera para 3 personas",
        pizzarron: "Pizarra blanca",
        enchufes: "4",
        pantalla_proyector: "Sí"
      },
      2: {
        titulo: "Aula 2",
        capacidad: "25 personas",
        bancos: "pupitres",
        pizzarron: "Pizarra verde",
        enchufes: "2",
        pantalla_proyector: "No"
      },
      3: {
        titulo: "Aula 3",
        capacidad: "20 personas",
        bancos: "Sillas con tablita",
        pizzarron: "Pizarra blanca",
        enchufes: "3",
        pantalla_proyector: "Sí"
      },
      
    };
  
    const selectAula = document.getElementById('selectAula');
    const btnBuscar = document.getElementById('btnBuscar');
    const resultado = document.getElementById('resultadoAula');
  
    btnBuscar.addEventListener('click', () => {
      const aulaSeleccionada = selectAula.value;
      const info = datosAulas[aulaSeleccionada];
  
      if (info) {
        resultado.innerHTML = `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${info.titulo}</h5>
              <p class="card-text"><strong>Capacidad:</strong> ${info.capacidad}</p>
              <p class="card-text"><strong>Tipo de bancos:</strong> ${info.bancos}</p>
              <p class="card-text"><strong>Tipo de pizzarrón:</strong> ${info.pizzarron}</p>
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
  
  */