const { Builder, By, until } = require('selenium-webdriver'); // Selenium WebDriver essentials
const assert = require('assert'); // Assertion module for validations
const testBase = require('./testBase'); // Common test setup
const {
  windowConfiguration,
  loginAdmin,
  resetToOriginalUserNameInRoothOrganization,
  userManagementMenu,
  devicesByAssigment,
  assignDevicesButton,
  waitForXPathPresentTimeout,
  modalClose,
  logout,
  sendMessageLogToBrowserStack,
  testEmpro3Name,
  inviteMemberButton,
  roleSelectionDropDownMenu,
  resetAssignedDevicesForEditorViewer,
  assignDevicesForEditorViewer,
  saveAssigmentButton,
  loginEditor,
  loginViewer,
  waitingLoadingRingProficloudToDissapear,
  
} = require('../utils/sharedFunctions'); // Reusable shared functions


// Main test function for C745
async function C745() {
  try {
    await testBase('C745_C896_C925_Admins of an organization can assign / unassign devices to viewer and editor roles / Device persmission area by Invite Member, should be hidden in case the role ADMIN is selected  If the user open the window ASSIGN DEVICES and no other devices are added, then by clicking on SAVE ASSIGMENT does not lead to endless loading', async (driver) => {
      let vars = {}; // Initialize variables container

      
      await windowConfiguration(driver,"UMS");
      await loginAdmin(driver, vars);
      await testEmpro3Name(driver);
      await resetToOriginalUserNameInRoothOrganization(driver);
      await userManagementMenu(driver);

      await sendMessageLogToBrowserStack(driver,"C896 Device persmission area by Invite Member, should be hidden in case the role ADMIN is selected.");
      await inviteMemberButton(driver);
      await roleSelectionDropDownMenu(driver);
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Admin')]")), 30000).click();
      await waitForXPathPresentTimeout(driver,"//div[@class='rbac-assignment__summery-value'][contains(.,'17 of 17')]",3000);
      await modalClose(driver);
      await resetAssignedDevicesForEditorViewer(driver,"editor");
      await resetAssignedDevicesForEditorViewer(driver,"viewer");

      await assignDevicesForEditorViewer(driver,"editor");
      await assignDevicesForEditorViewer(driver,"viewer");

      await sendMessageLogToBrowserStack(driver,"C925 If the user open the window ASSIGN DEVICES and no other devices are added, then by clicking on SAVE ASSIGMENT does not lead to endless loading")
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Fernando Editor')]")), 30000).click();
      await devicesByAssigment(driver);
      await assignDevicesButton(driver);
      await saveAssigmentButton(driver);
      await waitingLoadingRingProficloudToDissapear(driver);
      //Here should not come any error message
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Fernando Editor')]")), 30000).click();
      await logout(driver);

      //Verify the assigned devices for editor
      await loginEditor(driver,vars);
      await waitForXPathPresentTimeout(driver,"//div[contains(text(),'PH 1 Machine Park 1')]",10000);
      await waitForXPathPresentTimeout(driver,"//div[contains(text(),'PH 1 Machine Park 2')]",10000);
      await waitForXPathPresentTimeout(driver,"//div[contains(text(),'empro 3')]",10000);
      await logout(driver);

      //Verify the assigned devices for viewer

      await loginViewer(driver,vars);
      await waitForXPathPresentTimeout(driver,"//div[contains(text(),'PH 1 Machine Park 1')]",10000);
      await waitForXPathPresentTimeout(driver,"//div[contains(text(),'PH 1 Machine Park 2')]",10000);
      await waitForXPathPresentTimeout(driver,"//div[contains(text(),'empro 3')]",10000);
      await logout(driver);


      
    ;  


    });
  } catch (error) {
    throw new Error(`C745 failed: ${error.message}`);
  }
}



// Allow this file to be executed directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running test C745...');
      await C745(); // Run the test
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      console.error(error.stack);
    }
  })();
}

// Export the test function for use in other modules
module.exports = C745;


