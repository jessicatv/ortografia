document.addEventListener('DOMContentLoaded', () => {
    const categoriaSelect = document.getElementById('categoria-select');
    const resultadoDiv = document.getElementById('resultado');
    const descripcionDiv = document.getElementById('descripcion');
    const wordButton1 = document.getElementById('word1');
    const wordButton2 = document.getElementById('word2');
    const scoreValue = document.getElementById('score-value');
    
    let palabrasActuales = [];
    let indicePalabra = 0;
    let score = 0;
  
    // Lista estática de categorías disponibles
    const categorias = [
      { value: 'palabras.json', nombre: 'Palabras comunes' },
      // Añade aquí más categorías según necesites
    ];
  
    // Cargar las categorías disponibles en el selector
    function cargarCategorias() {
      categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.value;
        option.textContent = categoria.nombre;
        categoriaSelect.appendChild(option);
      });
    }
  
    // Cargar el contenido del archivo JSON seleccionado
    function cargarCategoria(filename) {
      fetch(`json/${filename}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error al cargar el archivo JSON: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (!Array.isArray(data)) {
            throw new Error('El JSON debe ser un array');
          }
          palabrasActuales = data;
          indicePalabra = 0;
          score = 0;
          scoreValue.textContent = '0';
          mostrarPalabra();
        })
        .catch(error => {
          console.error('Error detallado:', error);
          resultadoDiv.textContent = 'Error cargando la categoría: ' + error.message;
        });
    }
  
    // El resto de las funciones se mantienen igual...
    // mostrarPalabra(), handleWordClick(), etc.
  
    // Manejar el cambio de categoría
    categoriaSelect.addEventListener('change', (event) => {
      const categoriaSeleccionada = event.target.value;
      if (categoriaSeleccionada) {
        cargarCategoria(categoriaSeleccionada);
      }
    });
  
    // Añadir event listeners a los botones
    wordButton1.addEventListener('click', handleWordClick);
    wordButton2.addEventListener('click', handleWordClick);
  
    // Inicializar
    cargarCategorias();
  });