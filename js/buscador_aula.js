document.addEventListener('DOMContentLoaded', function () {

    // Agregue amnualmente aulas para probar como se ve
    const datosAulas = {
      1: {
        titulo: "Aula 1",
        capacidad: "30 personas",
        bancos: "De madera para 3 personas cada uno",
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
  