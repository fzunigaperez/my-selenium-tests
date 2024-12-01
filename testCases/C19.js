const { Builder, By, until } = require('selenium-webdriver');  // Localrun 
const testBase = require('./testBase');  //Common
const { windowConfiguration, loginAdmin, logout, loginToProtonMail, } = require('../utils/sharedFunctions');// BS.


async function C19() {
  try {
    await testBase('C19_Log out successfully', async (driver) => {
      let vars = {};
            
      await windowConfiguration(driver);
      await loginAdmin(driver, vars);
      await logout(driver);
    });
  } catch (error) {
    throw new Error(`C19 failed: ${error.message}`);
  }
}





module.exports = C19;


if (require.main === module) {
  (async () => {
    try {
      console.log(`'🚀 Ejecutando el test `);
      await C19();   // Change here the test name
      
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
    }
  })();
}
