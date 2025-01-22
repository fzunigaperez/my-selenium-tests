const { Builder, By, until } = require('selenium-webdriver'); // Selenium WebDriver essentials
const assert = require('assert'); // Assertion module for validations
const testBase = require('./testBase'); // Common test setup
const {
  windowConfiguration,
  loginAdmin,
  logout,
  activeOrganization,
  settings,
  userManagementMenu,
  userMenu,
  waitForXPathPresentTimeout,
  waitUntilXpathNotPresent,
  switchToPxcOrganization,
  reloadPage,
  switchToOriginalOrganization,
  
} = require('../utils/sharedFunctions'); // Reusable shared functions
const { userInfo } = require('os');

// Main test function for C911
async function C911() {
  try {
    await testBase('C911_Search field for organizations works as intended', async (driver) => {
      let vars = {}; // Initialize variables container

      // Step 1: Configure the browser window and login as admin
      await windowConfiguration(driver,"UMS");
      await loginAdmin(driver, vars);
      await activeOrganization(driver);
      await driver.findElement(By.xpath("//mat-label[contains(.,'Search for organizations')]"),10000).click();

      
      await driver.findElement(By.xpath("//*[@data-analytics='text-field']")).sendKeys("Richards organization");
      await waitForXPathPresentTimeout(driver,"//div[@class='profile-menu_icon-text__text'][contains(.,'Richards organization')]",5000);
      await waitUntilXpathNotPresent(driver,"//div[@class='profile-menu_icon-text__text'][contains(.,'Phoenix Contact Smart Bus...')]");
      await waitUntilXpathNotPresent(driver,"//div[normalize-space()='Available organizations']//following::div[contains(text(),'Rooth Organization')]");
      await reloadPage(driver);
      await driver.sleep(5000);

      await switchToPxcOrganization(driver);
      await switchToOriginalOrganization(driver);
      await logout(driver);

    });
  } catch (error) {
    throw new Error(`C911 failed: ${error.message}`);
  }
}



// Allow this file to be executed directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running test C911...');
      await C911(); // Run the test
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      console.error(error.stack);
    }
  })();
}

// Export the test function for use in other modules
module.exports = C911;
