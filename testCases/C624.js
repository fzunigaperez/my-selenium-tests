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
  clickFirstMail,
  deleteAllEmails,
  logOutFromProtonMail
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
      await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'change role')]")), 30000).click();
      await roleSelectionField(driver);
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Editor')]")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Apply role')]")), 30000).click();
      await waitForElementByXPath(driver,"//div[@data-analytics='list-item- rsylvester@phoenixcontact-sb.io']",10000);
      await assertText(driver,"xpath","//div[@id='outlet']/app-user-management/div/app-members/flex-col/flex-col/div/ng-scrollbar/div/div/div/div/div[4]/pc-list-item/div/div/div[3]/div[2]","Editor");
      await driver.wait(until.elementLocated(By.xpath("/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[1]/app-user-management[1]/div[1]/app-members[1]/flex-col[1]/flex-col[1]/div[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/div[4]/pc-list-item[1]/div[1]/div[1]/div[4]/app-icon[1]/*[name()='svg'][1]")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'change role')]")), 30000).click();
      await roleSelectionField(driver);  
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Viewer')]")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Apply role')]")), 30000).click();
      await waitForElementByXPath(driver,"//div[@data-analytics='list-item- rsylvester@phoenixcontact-sb.io']",10000);
       await assertText(driver,"xpath","//div[@id='outlet']/app-user-management/div/app-members/flex-col/flex-col/div/ng-scrollbar/div/div/div/div/div[4]/pc-list-item/div/div/div[3]/div[2]","Viewer");
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


// Permite ejecutar este archivo directamente
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Ejecutando el test C624...');
      await C624(); // Cambia aquí el nombre del test si tienes varios
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
      console.error(error.stack);
    }
  })();
}

module.exports = C624;