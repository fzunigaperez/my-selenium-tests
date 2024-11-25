const { Builder } = require('selenium-webdriver'); // Importación completa y precisa
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const testBase = require('./testBase');  //Common
const { sendResultToTestRail } = require('../utils/sharedFunctions');
const {
  windowConfiguration,
  loginAdmin,
  logout,
} = require('../utils/sharedFunctions'); // Importación de funciones reutilizables

async function C15() {
  try {
    // Aquí va el código de la prueba
    await testBase('C15 Log out successfully', async (driver) => {
      let vars = {};  // Inicializa vars como un objeto vacío

      // Configuración de la ventana
      await windowConfiguration(driver);

      // Inicio de sesión
      await loginAdmin(driver, vars);

      // Cierre de sesión
      await logout(driver);
    });

    // Si la prueba pasa, enviamos el resultado a TestRail
    await sendResultToTestRail('C15-testcase-id', 1, 'Test passed successfully.');
  } catch (error) {
    // Si la prueba falla, enviamos el resultado a TestRail con el error
    await sendResultToTestRail('C15-testcase-id', 5, `Test failed: ${error.message}`);
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