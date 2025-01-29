const { Builder, By, until  } = require('selenium-webdriver'); // Importación completa y precisa
const path = require('path');
const assert = require('assert'); // Import the assert module
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const testBase = require('./testBase');  //Common
const {
  windowConfiguration,
  logout,
  viewerRoleReset,
  loginAdmin,
  resetToOriginalUserNameInRoothOrganization,
  userManagementMenu,
  arrowSortByButton,
  lastNameButton,
  removeOldMemberInvitationsRoothOrga,
  removeOldMemberInvitationsRoothOrgaDev,
  roleSelectionField,
  assertText,
  loginToProtonMail,
  deleteAllEmails,
  logOutFromProtonMail,
  waitForXPathPresentTimeout,
  waitingLoadingRingProficloudToDissapear,
  clearAndWrite,
  deviceManagementMenu,
  waitForUsersToLoad,

} = require('../utils/sharedFunctions'); // Importación de funciones reutilizables

async function C624() {
  try {
    await testBase('C624_C677_Sorting users by first name, last name, email, invited, role. / ADMIN can access to USER MANAGEMENT', async (driver) => {
      let vars = {};
      const serviceEnv = await windowConfiguration(driver,"UMS"); //This line is necessary for the flow in the program to know what to do depending on PROD or DEV
      await loginAdmin(driver, vars);
      await resetToOriginalUserNameInRoothOrganization(driver);
      //C667 ADMIN can access to USER MANAGEMENT

      await userManagementMenu(driver);
      if (serviceEnv ==='DEV') {
        await removeOldMemberInvitationsRoothOrgaDev(driver);  
      }
      else{
        await removeOldMemberInvitationsRoothOrga(driver);
      }

      
      await arrowSortByButton(driver);
      await lastNameButton(driver);
      await viewerRoleReset(driver);
      
      //Click on the hamburger menu from viewer


      await clearAndWrite(driver,"xpath","//input","Viewer");
      await driver.wait(until.elementLocated(By.xpath("//*[@ng-reflect-name='more']")), 30000).click();
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'change role')]")), 30000).click();
      await roleSelectionField(driver);
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Editor')]")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Apply role')]")), 30000).click();
      await waitingLoadingRingProficloudToDissapear(driver);

      await driver.findElement(By.xpath("//input")).clear();
        await deviceManagementMenu(driver);
        await userManagementMenu(driver);
        await waitForUsersToLoad(driver);

      
      await waitForXPathPresentTimeout(driver,"//*[contains(text(),'testingpxc_admin@proton.me')]",10000);
      if (serviceEnv ==='DEV') {
        await assertText(driver,"xpath","//div[@id='outlet']/app-user-management/div/app-members/flex-col/flex-col/div/ng-scrollbar/div/div/div/div/div[5]/pc-list-item/div/div/div[3]/div[2]","Editor");
      }
      else{
      await assertText(driver,"xpath","//div[@id='outlet']/app-user-management/div/app-members/flex-col/flex-col/div/ng-scrollbar/div/div/div/div/div[4]/pc-list-item/div/div/div[3]/div[2]","Editor");
      }

      await viewerRoleReset(driver);
      await logout(driver);
      await loginToProtonMail(driver,vars);
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Your role in the Proficloud.io organization Rooth Organization was changed.')]")), 30000).click();
      await deleteAllEmails(driver);
      await logOutFromProtonMail(driver);
      
      
    });
  } catch (error) {
    throw new Error(`C624 failed: ${error.message}`);
  }
}


// Allows this file to be executed directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running test C624...');
      await C624(); // Change the test name here if you have multiple tests
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Error executing the test:', error.message);
      console.error(error.stack);
    }
  })();
}

module.exports = C624;
