const { Builder } = require('selenium-webdriver'); // Importación completa y precisa
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const testBase = require('./testBase');  //Common
const {
  windowConfiguration,
  loginAdmin,
  logout,
} = require('../utils/sharedFunctions'); // Importación de funciones reutilizables

async function C15() {
  await testBase('C15 Log in with right credentials as ADMIN', async (driver) => {
    let vars = {}; // Inicializa vars como un objeto vacío

    console.log("Configurando la ventana...");
    await windowConfiguration(driver);

    console.log("Iniciando sesión como ADMIN...");
    await loginAdmin(driver, vars);

    // Lógica específica de C15 (si corresponde)
    console.log("C15 Log in with right credentials as ADMIN completed.");

    console.log("Cerrando sesión...");
    await logout(driver);
  });
}

// Permite ejecutar este archivo directamente
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Ejecutando el test C15...');
      await C15(); // Cambia aquí el nombre del test si tienes varios
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
      console.error(error.stack);
    }
  })();
}

module.exports = C15;