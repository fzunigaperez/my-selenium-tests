const { Builder, By, until } = require('selenium-webdriver');  // Localrun 
const testBase = require('./testBase');  //Common
const { windowConfiguration, loginAdmin, logout, loginToProtonMail, forceFailStatus, } = require('../utils/sharedFunctions');// BS.


async function C714() {
  try {
    await testBase('C714_Log out successfully', async (driver) => {
      let vars = {};
            
      await windowConfiguration(driver);
      await loginAdmin(driver, vars);
      await logout(driver);
    });
  } catch (error) {
    throw new Error(`C714 failed: ${error.message}`);
  }
}





module.exports = C714;


if (require.main === module) {
  (async () => {
    try {
      console.log(`'🚀 Ejecutando el test `);
      await C714();   // Change here the test name
      
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
    }
  })();
}
