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
  assertXpathNotPresent,
 
} = require('../utils/sharedFunctions');  // BS

async function C706() {
  try {
    await testBase('C706_C707_Edit a billing account as an EDITOR not allowed', async (driver) => {
      let vars = {};
            
      await windowConfiguration(driver,"UMS");
      await loginEditor(driver,vars, until);
      await roothOrganizationTest(driver,vars,until);
      await activeOrganization(driver);
      await settings(driver,until);
      await assertXpathNotPresent(driver,"//div[@class='content__tab ng-star-inserted'][contains(.,'Billing Information')]","xpath");
      await logout(driver);

      //C707 Edit a billing account as a VIEWER not allowed

      await loginViewer(driver,vars, until);
      await roothOrganizationTest(driver,vars,until);
      await activeOrganization(driver);
      await settings(driver,until);
      await assertXpathNotPresent(driver,"//div[@class='content__tab ng-star-inserted'][contains(.,'Billing Information')]","xpath");
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
      console.log(`'🚀 Running the test `);
      await C706();   // Change here the test name
      
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Error running the test:', error.message);
    }
  })();
}
