const express = require('express');
const router = express.Router();
const poolfn = require('../mySqlConection');
const multer = require('multer')
const path = require('path');
const admin = require('firebase-admin')
const serviceAccount= require('../siriushrm-3e7a6-firebase-adminsdk-eyy6c-803df93253.json')
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const {initializeApp} = require("firebase/app")

initializeApp({
  credential:admin.credential.cert(serviceAccount),
  storageBucket:'gs://siriushrm-3e7a6.appspot.com'
})

const storage= getStorage()

const upload=multer({storage:multer.memoryStorage()})


let pool
async function connect(){
    pool=await poolfn()
}
connect()


  router.post('/', async (req, res) => {
    try {
      // Obtener datos de búsqueda del cuerpo de la solicitud
      const searchData = req.body;
  
      // Construir la consulta SQL sin la cláusula WHERE
      let query = 'SELECT * FROM articles';
  
      // Verificar si hay datos de búsqueda
      const values = [];
      if (searchData && Object.keys(searchData).length > 0) {
        // Construir condiciones solo si hay datos de búsqueda
        const conditions = [];
  
        // Recorrer los datos de búsqueda y construir condiciones
        Object.keys(searchData).forEach((fieldName) => {
          const condition = searchData[fieldName].conditions;
          // Validar que haya datos de condición válidos
          if (condition && condition.value && condition.name) {
            // Usar LIKE en lugar de ILIKE para MySQL
            conditions.push(`${fieldName} LIKE ?`);
            values.push(`%${condition.value}%`);
          }
        });
  
        // Agregar la cláusula WHERE solo si hay condiciones
        if (conditions.length > 0) {
          query += ` WHERE ${conditions.join(' AND ')}`;
        }
      }
  
      // Ejecutar la consulta SQL
      const [rows] = await pool.query(query, values);
      res.status(200).json({ articles: rows });
    } catch (error) {
      res.status(500).send('Ha ocurrido un error, inténtalo de nuevo');
    }
  });
  
  router.post('/recents', async (req, res) => {
    try {
      let query = 'SELECT * FROM articles LIMIT 3'; //????????
      const [rows] = await pool.query(query);
      if (rows) {
        res.status(200).json({ articles: rows });
      }
      else{
        throw new Error
      }
    } catch (error) {
      res.status(500).send('Ha ocurrido un error, inténtalo de nuevo');
    }
  });

router.get('/getArticleById/:articleId', async (req, res) => {
  const articleId = req.params.articleId
  try {
    const [rows] = await pool.execute('SELECT * FROM articles WHERE articleId = ?', [articleId]);

    if (!rows || rows.length === 0) {
      return res.status(404).send('Artículo no encontrado' );
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).send('Error al obtener el artículo' );
  }
});

// Suponiendo que tengas una tabla llamada articles con una columna articleId que es tu clave primaria

router.delete('/deleteArticle/:articleId', async (req, res) => {
    const articleId = req.params.articleId
  
    try {
      const [result] = await pool.execute('DELETE FROM articles WHERE articleId = ?', [articleId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).send('Artículo no encontrado');
      }
  
      res.status(204).send();  // 204 significa "No Content" y se usa cuando se ha eliminado con éxito
    } catch (error) {
      res.status(500).send('Error al eliminar el artículo');
    }
  });
  

router.post('/add', upload.single('imageUrl'), async (req, res) => {
    const { title, content, author,publicationDate} = req.body;
    if (!title || !content || !author) {
      return res.status(400).send( 'Se requieren título, Autor y contenido' );
    }
    try {

      let fileUrl=''
      if (req.file) {
        console.log(req.file)
        const storageRef= ref(storage,`images/${req.file.originalname}`)
        const metadata= {
            contentType:req.file.mimetype,
        }
        const snapShot= await uploadBytes(storageRef,req.file.buffer,metadata)
        fileUrl= await getDownloadURL(snapShot.ref)
      }
      const [result] = await pool.execute('INSERT INTO articles (articleId,title, content, imageUrl,author,publicationDate) VALUES (UUID(),?, ?, ?,?,?)', [
        title,
        content,
        fileUrl,
        author,
        publicationDate
      ]);

      
      const newArticle = { id: result.insertId, title, content };
      res.status(201).json(newArticle);
    } catch (error) {
      res.status(500).send('Error al crear el artículo' );
      console.log(error)
    }
  });

router.put('/update/:articleId', upload.single('imageUrl'), async (req, res) => {
    const { title, content, author, publicationDate } = req.body;
    const { articleId } = req.params;
  
    try {
      // Verifica si el artículo existe
      const [existingArticle] = await pool.execute('SELECT * FROM articles WHERE articleId = ?', [articleId]);
  
      if (!existingArticle.length) {
        return res.status(404).send('Artículo no encontrado');
      }
  
      // Construye la actualización dinámicamente
      const updateFields = {};
      if (title) updateFields.title = title;
      if (content) updateFields.content = content;
      if (author) updateFields.author = author;
      if (publicationDate) updateFields.publicationDate = publicationDate;
      if (req?.file) updateFields.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.originalname}`;
  
      // Verifica si hay algún campo para actualizar
      if (Object.keys(updateFields).length === 0) {
        return res.status(400).send('No se proporcionaron campos para actualizar');
      }
  
      // Construye la consulta SQL dinámicamente
      const updateQuery = 'UPDATE articles SET ' + Object.keys(updateFields).map(key => `${key} = ?`).join(', ') + ' WHERE articleId = ?';
      const updateValues = [...Object.values(updateFields), articleId];
  
      // Ejecuta la consulta
      await pool.execute(updateQuery, updateValues);
  
      res.status(200).send('Artículo actualizado exitosamente');
    } catch (error) {
      res.status(500).send('Error al actualizar el artículo');
    }
  });
  

module.exports = router;