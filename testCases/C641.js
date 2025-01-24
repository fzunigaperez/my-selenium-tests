const { Builder, By, until } = require('selenium-webdriver'); // Selenium WebDriver essentials
const assert = require('assert'); // Assertion module for validations
const testBase = require('./testBase'); // Common test setup
const {
  windowConfiguration,
  loginAdmin,
  logout,
  userManagementMenu,
  userMenu,
  waitForXPathPresentTimeout,
  switchToPxcOrganization,
  switchToExtraOrganization,
  accountSettingsMainMenu,
  getTextByLocator,
  usersTab,
  countElementsByXPath,
  
} = require('../utils/sharedFunctions'); // Reusable shared functions


// Main test function for C641
async function C641() {
  try {
    await testBase('C641_C1009_Admin rights check / Users of other organization should not be visible if not Admin rights when switching organization', async (driver) => {
      let vars = {}; // Initialize variables container

      
      await windowConfiguration(driver,"UMS");
      await loginAdmin(driver, vars);
      await userManagementMenu(driver);
      await switchToExtraOrganization(driver,"No Devices Organization");
      await userMenu(driver);
      await accountSettingsMainMenu(driver);
      await driver.wait(until.elementLocated(By.xpath("//span[@class='mdc-tab__text-label'][contains(.,'Organizations')]")), 3000).click();
      await waitForXPathPresentTimeout(driver,"//td[contains(.,'1')]",5000);
      await switchToPxcOrganization(driver);
      await driver.sleep(2000); //Waiting time, since the loading of the righ number takes a bit
      userNumber = await getTextByLocator(driver,"xpath","//tr[2]/td[2]");
      
      console.log(userNumber);

      if (userNumber > 1) {
        console.log("Right user inforamtion is being displayed");
        
      }

      else{
        
        throw new Error(`Right user inforamtion is NOT being displayed`);
      }

      await usersTab(driver);
      await waitForXPathPresentTimeout(driver,"//tr[2]//td[1]",5000); //We wait the user stable to be loaded
      userNumberTable = await countElementsByXPath(driver,"//tr"); //We count the number of Xpath elements minus 1 since it is the table title.
      if ((userNumberTable-1) == userNumber) { 

        console.log("The user counting is right")
        
      }

      else{
        throw new Error(`The user counting is not right UserNumber:${userNumber} is different than userNumberTable:${userNumberTable-1}`);
      }



      await switchToExtraOrganization(driver,"No Devices Organization");
      await waitForXPathPresentTimeout(driver,"//tr[2]//td[1]",5000); //We wait the user stable to be loaded
      userNumberTable = await countElementsByXPath(driver,"//tr"); //We count the number of Xpath elements minus 1 since it is the table title.

      if ((userNumberTable-1) == 1) {   //In case that this result is not equal to 1, means that other users are being displayed, and this should never happens

        console.log("The user counting is right")
        
      }

      else{
        throw new Error(`More than 1 user is being displayed for this organization!!!!`);
      }

      await logout(driver);
      




    });
  } catch (error) {
    throw new Error(`C641 failed: ${error.message}`);
  }
}



// Allow this file to be executed directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running test C641...');
      await C641(); // Run the test
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      console.error(error.stack);
    }
  })();
}

// Export the test function for use in other modules
module.exports = C641;
