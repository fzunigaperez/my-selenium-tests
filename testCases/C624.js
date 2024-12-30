const { Builder, By, until  } = require('selenium-webdriver'); // Importación completa y precisa
const path = require('path');
const assert = require('assert'); // Import the assert module
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const testBase = require('./testBase');  //Common
const {
  windowConfiguration,
  loginEditor,
  loginViewer,
  logout,
  viewerRoleReset,
  loginAdmin,
  resetToOriginalUserNameInRoothOrganization,
  switchToPxcOrganization,
  userManagementMenu,
  arrowSortByButton,
  lastNameButton,
  removeOldMemberInvitationsRoothOrga,
  roleSelectionField,
  assertText,
  loginToProtonMail,
  deleteAllEmails,
  logOutFromProtonMail,
  waitForUsersToLoad,
  waitForXPathPresentTimeout,
  waitingLoadingRingProficloudToDissapear,

} = require('../utils/sharedFunctions'); // Importación de funciones reutilizables

async function C624() {
  try {
    await testBase('C624_Sorting users by first name, last name, email, invited, role.', async (driver) => {
      let vars = {};
      await windowConfiguration(driver);
      await loginAdmin(driver, vars);
      await resetToOriginalUserNameInRoothOrganization(driver);
      await userManagementMenu(driver);
      await removeOldMemberInvitationsRoothOrga(driver);
      await arrowSortByButton(driver);
      await lastNameButton(driver);
      await viewerRoleReset(driver);
      
      //Click on the hamburger menu from viewer 
      await driver.wait(until.elementLocated(By.xpath("/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[1]/app-user-management[1]/div[1]/app-members[1]/flex-col[1]/flex-col[1]/div[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/div[4]/pc-list-item[1]/div[1]/div[1]/div[4]/app-icon[1]/*[name()='svg'][1]")), 30000).click();
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'change role')]")), 30000).click();
      await roleSelectionField(driver);
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Editor')]")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Apply role')]")), 30000).click();
      await waitingLoadingRingProficloudToDissapear(driver);
      await waitForXPathPresentTimeout(driver,"//div[@data-analytics='list-item- rsylvester@phoenixcontact-sb.io']",10000);
      await assertText(driver,"xpath","//div[@id='outlet']/app-user-management/div/app-members/flex-col/flex-col/div/ng-scrollbar/div/div/div/div/div[4]/pc-list-item/div/div/div[3]/div[2]","Editor");
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
