const { Builder, By, until } = require('selenium-webdriver');  // Localrun
const testBase = require('./testBase');  //Common
const { windowConfiguration, loginAdmin, logout } = require('../utils/sharedFunctions'); // BS

async function C90() {
  await testBase('C90 Log out successfully', async (driver) => {

    let vars = {}; // Inicializa vars como un objeto vacío
    // Configuración de la ventana
    await windowConfiguration(driver);

    // Inicio de sesión
    await loginAdmin(driver,vars);

    // Cierre de sesión
    await logout(driver);
  });
}




module.exports = C90;


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