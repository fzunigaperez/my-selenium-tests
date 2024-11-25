const { Builder } = require('selenium-webdriver'); // Importación completa y precisa
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const testBase = require('./testBase');  //Common
//const { sendResultToTestRail } = require('../utils/sharedFunctions');
const {
  windowConfiguration,
  loginAdmin,
  logout,
  sendResultToTestRail
} = require('../utils/sharedFunctions'); // Importación de funciones reutilizables

async function C15() {
  try {
    await testBase('C15 Login with right credentials as ADMIN', async (driver) => {
      let vars = {};
      await windowConfiguration(driver);
      await loginAdmin(driver, vars);
      await logout(driver);
    });
  } catch (error) {
    throw new Error(`C15 failed: ${error.message}`);
  }
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