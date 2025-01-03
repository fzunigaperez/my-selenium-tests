const { Builder, By, until } = require('selenium-webdriver'); // Selenium WebDriver essentials
const assert = require('assert'); // Assertion module for validations
const testBase = require('./testBase'); // Common test setup
const {
  windowConfiguration,
  loginAdmin,
  emmaMenu,
  dashboard,
  assertText,
  waitForXPathPresentTimeout,
  logout,
  waitUntilXpathNotPresent,
  getTextByLocator,
 
} = require('../utils/sharedFunctions'); // Reusable shared functions

// Main test function for C178
async function C178() {
  try {
    await testBase('C178_C179_C180_C646_C181_C184_Introducing a Dashboard name / Maximize the whole Dashboard Editing a Dashboard name / Introducing a Dashboard name with a maximum length of 27 characters Introducing a Dashboard description / Editing a Dashboard description', async (driver) => {
      let vars = {}; // Initialize variables container


      await windowConfiguration(driver);
      await loginAdmin(driver, vars);
      await emmaMenu(driver);
      await dashboard(driver);
      await driver.findElement(By.id("title"),20000).clear();
      await driver.findElement(By.id("title"),20000).sendKeys("Testing Dash");
      await driver.sleep(2000);
      await assertText(driver,"css",".dashboard__tab-title","Testing Dash");

      //C179 Editing Dashboard Name

      await driver.findElement(By.id("title"),20000).clear();
      await driver.findElement(By.id("title"),20000).sendKeys("Dashboard edit");
      await driver.sleep(2000);
      await assertText(driver,"css",".dashboard__tab-title","Dashboard edit");

      //C180 Introducing a Dashboard name with a maximum length of 27 characters.

      await driver.findElement(By.id("title"),20000).clear();
      await driver.findElement(By.id("title"),20000).sendKeys("LLLLLLLLLLLLLLLLLLLLLLLLLLL");
      await driver.sleep(2000);
      await assertText(driver,"css",".dashboard__tab-title","LLLLLLLLLLLLLLL...");

      //Returning the original Name of the Dashboard


      await driver.findElement(By.id("title"),20000).clear();
      await driver.findElement(By.id("title"),20000).sendKeys("Testing Dash");
      await driver.sleep(2000);
      await assertText(driver,"css",".dashboard__tab-title","Testing Dash");

      //C181 / C184 Introducing a Dashboard description / Editing a Dashboard description

      await driver.findElement(By.id("description"),5000).clear();
      await driver.findElement(By.id("description"),5000).sendKeys("Edited Description");
      await dashboard(driver);
  

      //Maximize the whole Dashboard

      await driver.wait(until.elementLocated(By.id("sidePanel")), 30000).click();
      await waitUntilXpathNotPresent(driver,"//mat-label[contains(.,'Filter metrics')]")
      await driver.wait(until.elementLocated(By.id("sidePanel")), 30000).click();
      await waitForXPathPresentTimeout(driver,"//mat-label[contains(.,'Filter metrics')]",3000);

             
      await logout(driver);
    });
  } catch (error) {
    throw new Error(`C178 failed: ${error.message}`);
  }
}

// Allow this file to be executed directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running test C178...');
      await C178(); // Run the test
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      console.error(error.stack);
    }
  })();
}

// Export the test function for use in other modules
module.exports = C178;
