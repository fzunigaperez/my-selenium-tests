const { Builder, By, until } = require('selenium-webdriver');  // Localrun
const testBase = require('./testBase');  // Common
const {
  windowConfiguration,
  logout,
  loginEditor,
  loginViewer,
  roothOrganizationTest,
  activeOrganization,
  settings,
  assertElementNotPresent,
 
} = require('../utils/sharedFunctions');  // BS


async function C706() {
  try {
    await testBase('C706_C707_Edit a billing account as an EDITOR not allowed', async (driver) => {
      let vars = {};
            
      await windowConfiguration(driver);
      await loginEditor(driver,vars, until);
      await roothOrganizationTest(driver,vars,until);
      await activeOrganization(driver);
      await settings(driver,until)
      await assertElementNotPresent(driver,"//div[@class='content__tab ng-star-inserted'][contains(.,'Billing Information')]","xpath", 5000);
      await logout(driver);

      //C707 Edit a billing account as an VIEWER not allowed

      
      await loginViewer(driver,vars, until);
      await roothOrganizationTest(driver,vars,until);
      await activeOrganization(driver);
      await settings(driver,until)
      await assertElementNotPresent(driver,"//div[@class='content__tab ng-star-inserted'][contains(.,'Billing Information')]","xpath", 5000);
      await logout(driver);




    });
  } catch (error) {
    throw new Error(`C706 failed: ${error.message}`);
  }
}





module.exports = C706;


if (require.main === module) {
  (async () => {
    try {
      console.log(`'🚀 Ejecutando el test `);
      await C706();   // Change here the test name
      
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
    }
  })();
}
