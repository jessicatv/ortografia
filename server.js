const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const jsonDirectory = path.join(__dirname, 'public', 'json');

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener la lista de archivos JSON
app.get('/api/listar-json', (req, res) => {
  fs.readdir(jsonDirectory, (err, files) => {
    if (err) {
      console.error('Error al leer la carpeta de JSON:', err);
      return res.status(500).json({ error: 'Error al leer la carpeta de JSON' });
    }
    // Filtrar solo archivos con extensión .json
    const jsonFiles = files.filter(file => path.extname(file) === '.json');
    res.json(jsonFiles);
  });
});

// Ruta para servir el contenido de un archivo JSON específico
app.get('/json/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(jsonDirectory, filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo JSON:', err);
      return res.status(500).json({ error: 'Error al leer el archivo JSON' });
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseError) {
      console.error('Error al parsear el JSON:', parseError);
      res.status(500).json({ error: 'Error al parsear el JSON' });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
