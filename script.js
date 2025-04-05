document.addEventListener('DOMContentLoaded', () => {
  const categoriaSelect = document.getElementById('categoria-select');
  const resultadoDiv = document.getElementById('resultado');
  const descripcionDiv = document.getElementById('descripcion');
  const wordButton1 = document.getElementById('word1');
  const wordButton2 = document.getElementById('word2');
  const scoreValue = document.getElementById('score-value');
  const langButtons = document.querySelectorAll('.lang-selector button');

  let palabrasActuales = [];
  let indicePalabra = 0;
  let score = 0;
  let idiomaActual = 'es'; // idioma por defecto

  const archivosPorIdioma = {
    es: [
      "frecuentes.json",
      "tilde.json",
      "bv.json",
      "jg.json",
      "h.json"
    ],
    val: [
      "frequents.json",
      "accent.json",
      "accent2.json",
      "accent3.json",
      "errors.json",
      "b-v.json",
      "b-v2.json"
    ]
  };

  function obtenerListaDeCategorias() {
    categoriaSelect.innerHTML = ""; // limpiar el selector
    const archivos = archivosPorIdioma[idiomaActual];

    archivos.forEach(file => {
      const option = document.createElement('option');
      option.value = file;
      option.textContent = file.replace('.json', '').replaceAll('-', ' ');
      categoriaSelect.appendChild(option);
    });

    // Cargar automáticamente la primera categoría
    if (archivos.length > 0) {
      categoriaSelect.value = archivos[0];
      cargarCategoria(archivos[0]);
    }
  }

  function cargarCategoria(filename) {
    fetch(`/json/${idiomaActual}/${filename}`)
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
      descripcionDiv.textContent = idiomaActual === 'es' ? '¡Has completado todas las palabras!' : 'Has completat totes les paraules!';
      wordButton1.disabled = true;
      wordButton2.disabled = true;
      resultadoDiv.textContent = `Puntuació final: ${score} / ${palabrasActuales.length}`;
    }
  }

  
// Añadir efecto visual cuando se hace clic
function handleWordClick(event) {
  const button = event.target;
  const esCorrecto = button.dataset.correcto === 'true';

  if (esCorrecto) {
    resultadoDiv.textContent = idiomaActual === 'es' ? '¡Correcto!' : 'Correcte!';
    score++;
    scoreValue.textContent = score;
    button.classList.add("correct");
  } else {
    resultadoDiv.textContent =
      (idiomaActual === 'es' ? '¡Incorrecto! La palabra correcta es: ' : 'Incorrecte! La paraula correcta és: ') +
      palabrasActuales[indicePalabra].correcta;
    button.classList.add("incorrect");
  }

  wordButton1.disabled = true;
  wordButton2.disabled = true;

  // Eliminar estilos después de mostrar y avanzar
  setTimeout(() => {
    wordButton1.classList.remove("correct", "incorrect");
    wordButton2.classList.remove("correct", "incorrect");
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

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      idiomaActual = btn.id === 'lang-va' ? 'val' : 'es';
      obtenerListaDeCategorias();
    });
  });

  obtenerListaDeCategorias();
});
