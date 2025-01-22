const { Builder, By, until } = require('selenium-webdriver'); // Importación completa
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const testBase = require('./testBase'); 
const {
  windowConfiguration,
  logout,
  loginViewer, // Reutilizamos la función definida en sharedFunctions.js
} = require('../utils/sharedFunctions');

async function C656() {
  await testBase(
    'C656 Log in with right credentials as VIEWER',
    async (driver) => {
      let vars = {}; // Inicializa vars como un objeto vacío

      console.log("Configurando la ventana...");
      await windowConfiguration(driver,"UMS");

      console.log("Iniciando sesión como Viewer...");
      await loginViewer(driver, vars);

      console.log("Cerrando sesión...");
      await logout(driver);
    }
  );
}

// Permite ejecutar este archivo directamente
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Ejecutando el test C656...');
      await C656(); // Cambia aquí el nombre del test si tienes varios
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
    }
  })();
}

module.exports = C656;