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

  // Obtener la lista de categorías desde index.json
  function obtenerListaDeCategorias() {
    fetch('/json/index.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener index.json');
        }
        return response.json();
      })
      .then(files => {
        // Llenar el selector con los nombres de los archivos JSON
        files.forEach(file => {
          const option = document.createElement('option');
          option.value = file;
          option.textContent = file.replace('.json', '');
          categoriaSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error al obtener index.json:', error);
        const option = document.createElement('option');
        option.value = 'palabras.json';
        option.textContent = 'Palabras comunes';
        categoriaSelect.appendChild(option);
      });
  }

  // Cargar el contenido del archivo JSON seleccionado
  function cargarCategoria(filename) {
    fetch(`/json/${filename}`)
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

  function mostrarPalabra() {
    if (indicePalabra < palabrasActuales.length) {
      const palabraActual = palabrasActuales[indicePalabra];
      descripcionDiv.textContent = palabraActual.descripcion;

      const botonCorrecto = Math.random() < 0.5 ? wordButton1 : wordButton2;
      const botonIncorrecto = botonCorrecto === wordButton1 ? wordButton2 : wordButton1;

      botonCorrecto.textContent = palabraActual.correcta;
      botonIncorrecto.textContent = palabraActual.incorrecta;

      wordButton1.disabled = false;
      wordButton2.disabled = false;

      resultadoDiv.textContent = '';

      botonCorrecto.dataset.correcto = 'true';
      botonIncorrecto.dataset.correcto = 'false';
    } else {
      descripcionDiv.textContent = '¡Has completado todas las palabras!';
      wordButton1.disabled = true;
      wordButton2.disabled = true;
      resultadoDiv.textContent = `Puntuación final: ${score} de ${palabrasActuales.length}`;
    }
  }

  function handleWordClick(event) {
    const button = event.target;
    const esCorrecto = button.dataset.correcto === 'true';

    if (esCorrecto) {
      resultadoDiv.textContent = '¡Correcto!';
      score++;
      scoreValue.textContent = score;
    } else {
      resultadoDiv.textContent = '¡Incorrecto! La palabra correcta es: ' + 
        palabrasActuales[indicePalabra].correcta;
    }

    wordButton1.disabled = true;
    wordButton2.disabled = true;

    setTimeout(() => {
      indicePalabra++;
      mostrarPalabra();
    }, 1500);
  }

  categoriaSelect.addEventListener('change', (event) => {
    const categoriaSeleccionada = event.target.value;
    if (categoriaSeleccionada) {
      cargarCategoria(categoriaSeleccionada);
    }
  });

  wordButton1.addEventListener('click', handleWordClick);
  wordButton2.addEventListener('click', handleWordClick);

  obtenerListaDeCategorias();
});
