const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const pool = require('./mySqlConection'); 
const PORT = 5500;

app.use(cors());


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });

app.use(express.json());

app.use('/api/articles', require('./routes/articleRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/articles/:id/upload', upload.single('image'), async (req, res) => {
  const id = parseInt(req.params.id);
  const imageUrl = req.file.path; 

  try {
    await pool.execute('UPDATE articles SET imageUrl = ? WHERE id = ?', [imageUrl, id]);
    res.json({ success: true, message: 'Imagen subida correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
