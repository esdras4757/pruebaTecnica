const { createPool } = require('mysql2/promise');

let pool;

const initializePool = async () => {
  try {
    pool = await createPool({
      host: 'aws.connect.psdb.cloud',
      user: 'z7yam0wvf1ob6qdtij5h',
      password: 'pscale_pw_bqg4pinXeIbch5ThGNJKrQoxtQ8I4vIGrUaL8pgFcwx',
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
