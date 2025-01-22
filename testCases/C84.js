const { Builder, By, until } = require('selenium-webdriver'); // Import Selenium
const testBase = require('./testBase'); // Common test base
const { 
  windowConfiguration, 
  loginAdmin, 
  logout, 
  userMenu, 
  accountSettingsMainMenu 
} = require('../utils/sharedFunctions'); // Shared functions

/**
 * Test C84: Download User CA certificate.
 */
async function C84() {
  try {
    await testBase('C84_Download User CA certificate', async (driver) => {
      let vars = {};

      // Window configuration
      await windowConfiguration(driver,"UMS");

      // Log in as admin
      await loginAdmin(driver, vars);

      // Navigate to the User Menu and Account Settings
      await userMenu(driver, vars);
      await accountSettingsMainMenu(driver);

      // Click on "Certificates"
      await driver
        .wait(until.elementLocated(By.xpath("//div[normalize-space()='Certificates']")), 30000)
        .click();

      // Download the User CA certificate
      await driver
        .wait(until.elementLocated(By.xpath("//span[contains(.,'Download User CA certificate')]")), 30000)
        .click();

      // Log out
      await logout(driver);
    });
  } catch (error) {
    throw new Error(`C84 failed: ${error.message}`);
  }
}

module.exports = C84;

// Execute the test if run directly from the command line
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running the test');
      await C84(); // Change here the test name if needed

      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Error while running the test:', error.message);
    }
  })();
}
