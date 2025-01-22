const { Builder, By, until } = require('selenium-webdriver'); // Importación completa
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const testBase = require('./testBase');
const {
  windowConfiguration,
  logout,
  loginEditor, // Reutilizamos la función definida en sharedFunctions.js
} = require('../utils/sharedFunctions');

async function C655() {
  await testBase(
    'C655 Log in with right credentials as EDITOR',
    async (driver) => {
      let vars = {}; // Inicializa vars como un objeto vacío

      console.log("Configurando la ventana...");
      await windowConfiguration(driver,"UMS");

      console.log("Iniciando sesión como EDITOR...");
      await loginEditor(driver, vars);

      console.log("Cerrando sesión...");
      await logout(driver);
    }
  );
}

// Permite ejecutar este archivo directamente
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Ejecutando el test C655...');
      await C655();
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
    }
  })();
}

module.exports = C655;