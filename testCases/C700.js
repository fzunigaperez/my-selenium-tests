const { Builder, By, until } = require('selenium-webdriver'); // Selenium WebDriver essentials
const assert = require('assert'); // Assertion module for validations
const testBase = require('./testBase'); // Common test setup
const {
  windowConfiguration,
  
  roothOrganizationTest, 
  logout,
  activeOrganization,
  createOrganizationButton1,
  createOrganizationButton2,
  waitForXPathPresentTimeout,
  waitingLoadingRingProficloudToDissapear,
  switchToExtraOrganization,
  countElementsByXPath,

  loginToProtonMail,
  clickSecondMail,
  clickFirstMail,
  
  settings,
  
  loginEditor,
  eliminateExtraOrganizationsEditor,
  loginViewer,
  deleteAllEmails,
  logOutFromProtonMail,
  clearAndWrite,
  

} =   require('../utils/sharedFunctions'); // Reusable shared functions

// Main test function for C700
async function C700() {

  try {
    await testBase('C700_C701 Create an organization as EDITOR/VIEWER', async (driver) => {
      let vars = {}; // Initialize variables container

      //Eliminate the leave organization for Registered user account in case a test may failed
      const serviceEnv = await windowConfiguration(driver,"UMS"); //This line is necessary for the flow in the program to know what to do depending on PROD or DEV
      await loginEditor(driver, vars);
      await eliminateExtraOrganizationsEditor(driver,serviceEnv);

    
      await roothOrganizationTest(driver);
      await activeOrganization(driver);
      await createOrganizationButton1(driver);

      await introduceOrganizationName(driver,"Z Z");
      await createOrganizationButton2(driver);
      await waitingLoadingRingProficloudToDissapear(driver);
      await switchToExtraOrganization(driver,"Z Z");
      await eliminateExtraOrganizationsEditor(driver,serviceEnv);
      await logout(driver);

      //C701 Create an organization as viewer


      await windowConfiguration(driver,"UMS"); //This line is necessary for the flow in the program to know what to do depending on PROD or DEV
      await loginViewer(driver, vars);
      await eliminateExtraOrganizationsEditor(driver,serviceEnv); //For viewer also valid 
      await roothOrganizationTest(driver);
      await activeOrganization(driver);
      await createOrganizationButton1(driver);

      await introduceOrganizationName(driver,"Z Z");
      await createOrganizationButton2(driver);
      await waitingLoadingRingProficloudToDissapear(driver);
      await switchToExtraOrganization(driver,"Z Z");
      await eliminateExtraOrganizationsEditor(driver,serviceEnv);
      await logout(driver);

      //We verify that editor and viewer get an email when they leave the organization


      await loginToProtonMail(driver,vars);
      await clickFirstMail(driver);
      await waitForXPathPresentTimeout(driver,"//h1[contains(@title,'organization Z Z')]//span[contains(text(),'You have been removed from the Proficloud.io')]",3000);
      await clickSecondMail(driver);
      await waitForXPathPresentTimeout(driver,"//h1[contains(@title,'organization Z Z')]//span[contains(text(),'You have been removed from the Proficloud.io')]",3000);
      await deleteAllEmails(driver);
      await logOutFromProtonMail(driver);

    });
  } catch (error) {
    throw new Error(`C700 failed: ${error.message}`);
  }
}


async function introduceOrganizationName(driver,orgaName) {
  await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Organization Name')]")), 30000).click();
  await clearAndWrite(driver,"xpath","//*[contains(text(),'Organization Name')]",orgaName)

  
}
  



// Allow this file to be executed directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running test C700...');
      await C700(); // Run the test
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      console.error(error.stack);
    }
  })();
}

// Export the test function for use in other modules
module.exports = C700;
