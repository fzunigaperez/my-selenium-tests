const { Builder, By, until } = require('selenium-webdriver'); // Selenium WebDriver essentials
const assert = require('assert'); // Assertion module for validations
const testBase = require('./testBase'); // Common test setup
const {
  windowConfiguration,
  loginAdmin,
  logout,
  loginEditor,
  userMenu,
  waitForXPathPresentTimeout,
  switchToPxcOrganization,
  switchToExtraOrganization,
  accountSettingsMainMenu,
  getTextByLocator,
  usersTab,
  countElementsByXPath,
  serviceStoreMenu,
  waitForTitle,
  modalClose,
  
} = require('../utils/sharedFunctions'); // Reusable shared functions


// Main test function for C725
async function C725() {
  try {
    await testBase('C725_Admin, Editor and Viewer can access to the store, but only admin role can book a service', async (driver) => {
      let vars = {}; // Initialize variables container

      
      await windowConfiguration(driver,"UMS");
      await loginAdmin(driver, vars);
      await serviceStoreMenu(driver);

      //C1023 Go to service button in service store redirects the user to User Management Service

      await driver.wait(until.elementLocated(By.xpath("//flex-row-center[contains(.,'User Management Service')]")), 3000).click();
      await driver.wait(until.elementLocated(By.xpath("//button[@id='undefined']/span[2]/span")), 3000).click(); //Click on go to the service
      await waitForTitle(driver,"Proficloud.io | User Management Service | Users",10000);


      await serviceStoreMenu(driver);
      await driver.wait(until.elementLocated(By.xpath("//flex-row-center[contains(.,'Energy Management Service')]")), 3000).click();
      await driver.sleep(1000);
      planAlreadyBooked = await countElementsByXPath(driver,"//*[contains(text(),'your plan')]");

      //This is case one ore more packages have been booked

      if (planAlreadyBooked > 0 ) {

        await driver.wait(until.elementLocated(By.xpath("(//flex-row-center[4]/pc-button/button/span[2]/div/span)[4]")), 10000).click();
        
      }
      else{

        await driver.wait(until.elementLocated(By.xpath("//span[2]/span")), 3000).click();
        
      }


      await driver.wait(until.elementLocated(By.css(".pc-overlay__content")), 5000);
      await driver.wait(until.elementLocated(By.id("termsCheck")), 3000).click();
      await driver.wait(until.elementLocated(By.id("purchase-license")), 3000)
      await modalClose(driver);
      await logout(driver);

      await windowConfiguration(driver,"UMS");
      await loginEditor(driver, vars);





      await driver.wait(until.elementLocated(By.id("termsCheck")), 3000).click();











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
