const { Builder, By, until } = require('selenium-webdriver'); // Selenium WebDriver essentials
const assert = require('assert'); // Assertion module for validations
const testBase = require('./testBase'); // Common test setup
const {
  windowConfiguration,
  loginAdmin,
  logout,
  testEmpro3Name,
  resetToOriginalUserNameInRoothOrganization,
  userManagementMenu,
  resetAssignedDevicesForEditorViewer,
  devicesByAssigment,
  assignDevicesButton,
  assertText,
  clearAndWrite,
  modalClose,
  sendMessageLogToBrowserStack,
  waitForXPathPresentTimeout,
  waitUntilXpathNotPresent,
  arrowLeftSideMenu,
  waitForTitle,
  
  
} = require('../utils/sharedFunctions'); // Reusable shared functions
const { userInfo } = require('os');

// Main test function for C875
async function C875() {
  try {
    await testBase('C875_C876_C893_Change device permissions  search and select devices fields work  as intended / Search bar in devices tab section works as intended / Left Side Menu works in the compact version', async (driver) => {
      let vars = {}; // Initialize variables container

      // Step 1: Configure the browser window and login as admin
      await windowConfiguration(driver,"UMS");
      await loginAdmin(driver, vars);
      await testEmpro3Name(driver);
      await resetToOriginalUserNameInRoothOrganization(driver);
      await userManagementMenu(driver);
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),' rsylvester@phoenixcontact-sb.io')]")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Fernando Editor')]")), 30000).click();
      await devicesByAssigment(driver);
      await assignDevicesButton(driver);
      await waitForXPathPresentTimeout(driver,"//div[@data-analytics='modal headline'][contains(.,'Change device permissions')]",5000);
      await assertText(driver,"css",".rbac-assignment__selectable","(3 of 17 devices)");
      await clearAndWrite(driver,"xpath","//input[@placeholder='Search devices ']","PH 1 Machine Park 2");
      await assertText(driver,"css",".rbac-assignment__selectable","(1 of 1 devices)");
      await modalClose(driver);


      await sendMessageLogToBrowserStack(driver,"C876 Search bar in devices tab section works as intended");
      await clearAndWrite(driver,"xpath","//input[@placeholder='Search']","empro 3");
      await waitForXPathPresentTimeout(driver,"//div[@class='pc-table__item__column'][contains(.,'empro 3')]",5000);
      await waitUntilXpathNotPresent(driver,"//div[@class='pc-table__item__column'][contains(.,'PH 1 Machine Park 1')]");
      await waitUntilXpathNotPresent(driver,"//div[@class='pc-table__item__column'][contains(.,'PH 1 Machine Park 2')]");

      await clearAndWrite(driver,"xpath","//input[@placeholder='Search']","a87a7563-3da3-41fe-b2f4-320d08159d1f");
      await waitForXPathPresentTimeout(driver,"//div[@class='pc-table__item__column'][contains(.,'PH 1 Machine Park 1')]",5000);
      await waitUntilXpathNotPresent(driver,"//div[@class='pc-table__item__column'][contains(.,'empro 3')]");
      await waitUntilXpathNotPresent(driver,"//div[@class='pc-table__item__column'][contains(.,'PH 1 Machine Park 2')]");


      await sendMessageLogToBrowserStack(driver,"C925 Left Side Menu works in the compact version");
      //We click on the arrow to be sure the left panel got minimized
      await driver.wait(until.elementLocated(By.xpath("/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/app-navigation[1]/div[1]/div[2]/flex-col-center[2]/div[1]/app-icon[1]/*[name()='svg'][1]/*[name()='g'][1]/*[name()='path'][1]")), 10000).click()  
      await driver.wait(until.elementLocated(By.id("user-management-service")), 3000).click();
      await driver.wait(until.elementLocated(By.xpath("//flex-row[@id='navigation-user-management-service-user-roles']")), 3000).click();
      await waitForTitle(driver,"Proficloud.io | User Management Service | Roles",10000);
      await driver.wait(until.elementLocated(By.id("user-management-service")), 3000).click();
      await driver.wait(until.elementLocated(By.xpath("//flex-row[@id='navigation-user-management-service-users']")), 3000).click();
      await waitForTitle(driver,"Proficloud.io | User Management Service | Users",10000);
      await logout(driver);

    });
  } catch (error) {
    throw new Error(`C875 failed: ${error.message}`);
  }
}



// Allow this file to be executed directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running test C875...');
      await C875(); // Run the test
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      console.error(error.stack);
    }
  })();
}

// Export the test function for use in other modules
module.exports = C875;


