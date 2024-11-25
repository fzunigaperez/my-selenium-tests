const { Builder, By, until } = require('selenium-webdriver');  // Localrun
const testBase = require('./testBase');  //Common
const { windowConfiguration, loginAdmin, logout, sendResultToTestRail } = require('../utils/sharedFunctions'); // BS


async function C90() {
  try {
    // Aquí va el código de la prueba
    await testBase('C90 Log out successfully', async (driver) => {
      let vars = {}; // Inicializa vars como un objeto vacío

      // Configuración de la ventana
      //await windowConfiguration(driver);

      // Inicio de sesión
      await loginAdmin(driver, vars);

      // Cierre de sesión
      await logout(driver);
    });

    // Si la prueba pasa, enviamos el resultado a TestRail
    await sendResultToTestRail(90, 1, 'Test passed successfully.'); // Reemplaza 101 con el ID real
  } catch (error) {
    // Si la prueba falla, enviamos el resultado a TestRail con el error
    await sendResultToTestRail(90, 5, `Test failed: ${error.message}`);
  }
}




module.exports = C90;

// Verificar las variables de entorno
console.log('TESTRAIL_USERNAME:', process.env.TESTRAIL_USERNAME);
console.log('TESTRAIL_API_KEY:', process.env.TESTRAIL_API_KEY);
console.log('TESTRAIL_ENABLED:', process.env.TESTRAIL_ENABLED);

if (require.main === module) {
  (async () => {
    try {
      console.log(`'🚀 Ejecutando el test `);
      await C90();   // Change here the test name
      
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
    }
  })();
}