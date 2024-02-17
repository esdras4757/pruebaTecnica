const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const pool = require('./mySqlConection'); // Ajusta la ruta según tu estructura de archivos

const app = express();
const PORT = 5500;

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3000', // Ajusta esto para permitir tu origen específico
  credentials: true
}));
// Configuración de Multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre de archivo único
  },
});

const upload = multer({ storage });

app.use(express.json());

// Rutas para manejo de artículos y archivos
app.use('/api/articles', require('./routes/articleRoutes'));
app.use('/uploads', express.static('./uploads'));

// Ruta para subir una imagen a un artículo específico
app.post('/articles/:id/upload', upload.single('image'), async (req, res) => {
  const id = parseInt(req.params.id);
  const imageUrl = req.file.path; // Ruta del archivo guardado por Multer

  try {
    // Actualizar la base de datos con la URL de la imagen
    await pool.execute('UPDATE articles SET imageUrl = ? WHERE id = ?', [imageUrl, id]);
    res.json({ success: true, message: 'Imagen subida correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
