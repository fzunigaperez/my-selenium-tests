const { Builder, By, until } = require('selenium-webdriver'); // Selenium WebDriver essentials
const assert = require('assert'); // Assertion module for validations
const testBase = require('./testBase'); // Common test setup
const {
  windowConfiguration,
  loginAdmin,
  logout,
  loginEditor,

  countElementsByXPath,
  serviceStoreMenu,
  waitForTitle,
  modalClose,
  assertElementNotPresent,
  loginViewer,
  sendMessageLogToBrowserStack,
  waitUntilXpathNotPresent,
  
} = require('../utils/sharedFunctions'); // Reusable shared functions


// Main test function for C725
async function C725() {
  try {
    await testBase('C725_C1023_Admin, Editor and Viewer can access to the store, but only admin role can book a service / Go to service button in service store redirects the user to User Management Service', async (driver) => {
      let vars = {}; // Initialize variables container

      
      await windowConfiguration(driver,"UMS");
      await loginAdmin(driver, vars);
      await serviceStoreMenu(driver);

      //C1023 Go to service button in service store redirects the user to User Management Service
      await sendMessageLogToBrowserStack(driver,"C1023 Go to service button in service store redirects the user to User Management Service");

      await driver.wait(until.elementLocated(By.xpath("//flex-row-center[contains(.,'User Management Service')]")), 3000).click();
      await driver.wait(until.elementLocated(By.xpath("//button[@id='undefined']/span[2]/span")), 3000).click(); //Click on go to the service
      await waitForTitle(driver,"Proficloud.io | User Management Service | Users",10000);


      await serviceStoreMenu(driver);
      await driver.wait(until.elementLocated(By.xpath("//flex-row-center[contains(.,'Energy Management Service')]")), 3000).click();
      await driver.sleep(2000);
      planAlreadyBooked = await countElementsByXPath(driver,"//*[contains(text(),'your plan')]");

      //This is case one ore more packages have been booked

      if (planAlreadyBooked > 0 ) {

        await driver.wait(until.elementLocated(By.xpath("(//flex-row-center[4]/pc-button/button/span[2]/div/span)[1]")), 10000).click();
        
      }
      else{

        await driver.wait(until.elementLocated(By.xpath("//span[2]/span")), 3000).click();
        
      }


      await driver.wait(until.elementLocated(By.css(".pc-overlay__content")), 5000);
      await driver.sleep(500);
      await driver.wait(until.elementLocated(By.id("termsCheck")), 6000).click();
      await driver.wait(until.elementLocated(By.id("purchase-license")), 3000)
      await modalClose(driver);
      await logout(driver);

     // await windowConfiguration(driver,"UMS");
      await loginEditor(driver, vars);
      await serviceStoreMenu(driver);
      await driver.wait(until.elementLocated(By.xpath("//flex-row-center[contains(.,'Energy Management Service')]")), 3000).click();
      await driver.sleep(1000);
      
     
      await driver.wait(until.elementLocated(By.xpath("(//pc-button[contains(.,'book package')])[2]")), 3000).click();
      await waitUntilXpathNotPresent(driver,'.//*[contains(concat(" ",normalize-space(@class)," ")," pc-overlay__content ")]');
      await waitUntilXpathNotPresent(driver,"//*[@id='purchase-license']");

      await logout(driver);


      await loginViewer(driver, vars);
      await serviceStoreMenu(driver);
      await driver.wait(until.elementLocated(By.xpath("//flex-row-center[contains(.,'Energy Management Service')]")), 3000).click();
      await driver.sleep(1000);
      
     
      await driver.wait(until.elementLocated(By.xpath("(//pc-button[contains(.,'book package')])[2]")), 3000).click();
        
      await waitUntilXpathNotPresent(driver,'.//*[contains(concat(" ",normalize-space(@class)," ")," pc-overlay__content ")]');
      await waitUntilXpathNotPresent(driver,"//*[@id='purchase-license']");


      await logout(driver);
      




    });
  } catch (error) {
    throw new Error(`C725 failed: ${error.message}`);
  }
}



// Allow this file to be executed directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running test C725...');
      await C725(); // Run the test
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      console.error(error.stack);
    }
  })();
}

// Export the test function for use in other modules
module.exports = C725;
