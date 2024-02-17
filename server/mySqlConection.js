const { createPool } = require('mysql2/promise');
require('dotenv').config();
let pool;
const dbUser = process.env.USERDB;
const dbPassword= process.env.PASWORDDB;
const initializePool = async () => {
  try {
    pool = await createPool({
      host: 'aws.connect.psdb.cloud',
      user: dbUser,
      password: dbPassword,
      database: 'dbpttest',
      ssl: {
        rejectUnauthorized: false
      }
    });
    const result= await pool.query('SELECT * FROM articles')
    return pool
  } catch (error) {
    throw error; // Propaga el error para detener la ejecución si hay un problema
  }
};

// Inicializar la piscina al cargar el módulo
  // initializePool()

module.exports =  initializePool;
