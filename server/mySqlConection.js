const { createPool } = require('mysql2/promise');

let pool;

const initializePool = async () => {
  try {
    pool = await createPool({
      host: 'aws.connect.psdb.cloud',
      user: 'bszgh0bbh14ffd7ajljd',
      password: 'pscale_pw_WvPvypmRx8OgS7n4hYyTfNG0LYdtU1ydQGK8EyCXH1o',
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
