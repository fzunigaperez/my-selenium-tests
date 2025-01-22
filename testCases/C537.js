const { Builder, By, until } = require('selenium-webdriver'); // Import Selenium
const testBase = require('./testBase'); // Common test base
const { 
  windowConfiguration, 
  loginAdmin, 
  logout, 
  userMenu, 
  settings,
  billingInformationTab,
  editBillingAccountButton,
  waitingLoadingRingProficloudToDissapear,
  activeOrganization,
  resetBillingAccountInformation,
} = require('../utils/sharedFunctions'); // Shared functions

/**
 * Test C537: Download User CA certificate.
 */
async function C537() {
  try {
    await testBase('C537_Edit a billing account as an ADMIN', async (driver) => {
      let vars = {};

      // Window configuration
      await windowConfiguration(driver,"UMS");

      // Log in as admin
      await loginAdmin(driver, vars);

      // Navigate to the User Menu and Account Settings
      await activeOrganization(driver, vars);
      await settings(driver,until);
      await billingInformationTab(driver,until);
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Edit Billing Account')]")), 5000);
      await resetBillingAccountInformation(driver,until);


      


  await editBillingAccountButton(driver,until);

  await driver.wait(until.elementIsEnabled(await driver.findElement(By.xpath("//input[@placeholder=\'Email\']"))), 30000)
  await driver.findElement(By.xpath("//input[@placeholder='Email']")).clear();
  await driver.findElement(By.xpath("//input[@placeholder='Email']")).sendKeys("fzuniga+testing@phoenixcontact-sb.io");
  
  await driver.findElement(By.xpath("//input[@placeholder='First Name']")).clear();
  await driver.findElement(By.xpath("//input[@placeholder='First Name']")).sendKeys("Z");
  
  await driver.findElement(By.xpath("//input[@placeholder='Last Name']")).clear();
  await driver.findElement(By.xpath("//input[@placeholder='Last Name']")).sendKeys("Z");
  
  await driver.findElement(By.xpath("//input[@placeholder='Company Name']")).clear();
  await driver.findElement(By.xpath("//input[@placeholder='Company Name']")).sendKeys("PxC");
  
  await driver.findElement(By.xpath("//input[@placeholder='Address Line 1']")).clear();
  await driver.findElement(By.xpath("//input[@placeholder='Address Line 1']")).sendKeys("Teststrasse 123");
  
  await driver.findElement(By.xpath("//input[@placeholder='Postal Code']")).clear();
  await driver.findElement(By.xpath("//input[@placeholder='Postal Code']")).sendKeys("123456");
  
  await driver.findElement(By.xpath("//input[@placeholder='City']")).clear();
  await driver.findElement(By.xpath("//input[@placeholder='City']")).sendKeys("Test City");
  
  // Click on "Country" dropdown and select "Argentina"
  await driver.findElement(By.xpath("//mat-label[contains(.,'Country')]")).click();
  await driver.sleep(1000);
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Argentina')]")), 30000);
  await driver.findElement(By.xpath("//span[contains(.,'Argentina')]")).click();
  
  await driver.findElement(By.xpath("//input[@placeholder='VAT number']")).clear();
  await driver.findElement(By.xpath("//input[@placeholder='VAT number']")).sendKeys("123testing");
  
  //await driver.sleep(2000);
  
  // Click on "Update billing account"
  await driver.findElement(By.xpath("//span[contains(.,'Update billing account')]")).click();


  await driver.sleep(5000);  

  

  await resetBillingAccountInformation(driver,until);
  
      
    });
  } catch (error) {
    throw new Error(`C537 failed: ${error.message}`);
  }
}

module.exports = C537;

// Execute the test if run directly from the command line
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running the test');
      await C537(); // Change here the test name if needed

      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Error while running the test:', error.message);
    }
  })();
}
