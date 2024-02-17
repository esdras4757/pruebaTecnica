const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const pool = require('./mySqlConection'); 
const PORT = 5500;

app.use(cors());



app.use(express.json());

app.use('/api/articles', require('./routes/articleRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
