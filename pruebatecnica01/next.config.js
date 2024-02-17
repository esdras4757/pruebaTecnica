// next.config.js

module.exports = {
    // Otras configuraciones específicas de Next.js que puedas tener
  
    webpack: (config, { isServer }) => {
      // Soluciona el problema de la carga del lado del cliente
      if (!isServer) {
        config.resolve.fallback = {
          fs: false,
          module: false,
        };
      }
      return config;
    },
  };
  