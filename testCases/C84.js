const { Builder, By, until } = require('selenium-webdriver');  // Localrun 
const testBase = require('./testBase');  //Common
const { windowConfiguration, loginAdmin, logout, userMenu,accountSettingsMainMenu } = require('../utils/sharedFunctions');// BS.


async function C84() {
  try {
    await testBase('C84_Download User CA certificate', async (driver) => {
      let vars = {};
            
      await windowConfiguration(driver);
      await loginAdmin(driver, vars);
      // Navigate to User Settings
      await userMenu(driver, vars);
      await accountSettingsMainMenu(driver);
      //Clicking on Certificates
      await driver.wait(until.elementLocated(By.xpath("//div[normalize-space()='Certificates']")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Download User CA certificate')]")), 30000).click();
      await logout(driver);
    });
  } catch (error) {
    throw new Error(`C84 failed: ${error.message}`);
  }
}





module.exports = C84;


if (require.main === module) {
  (async () => {
    try {
      console.log(`'🚀 Ejecutando el test `);
      await C84();   // Change here the test name
      
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
    }
  })();
}
