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
  devicesByAssigment,
  assignDevicesButton,
  assertText,
  clearAndWrite,
  modalClose,
  sendMessageLogToBrowserStack,
  waitForXPathPresentTimeout,
  waitUntilXpathNotPresent,
  waitForTitle,
} = require('../utils/sharedFunctions'); // Reusable shared functions

// Main test function for C875
async function C875() {
  try {
    await testBase(
      'C875_C876_C893_Change device permissions, search and select devices fields work as intended / Search bar in devices tab section works as intended / Left Side Menu works in the compact version',
      async (driver) => {
        let vars = {}; // Initialize variables container

        // Step 1: Configure the browser window and login as admin
        const serviceEnv = await windowConfiguration(driver, 'UMS'); // Determine if in PROD or DEV
        await loginAdmin(driver, vars);
        await testEmpro3Name(driver, serviceEnv);
        await resetToOriginalUserNameInRoothOrganization(driver);
        await userManagementMenu(driver);

        // Step 2: Handle environment-specific conditions
        if (serviceEnv === 'PROD') {
          await driver
            .wait(until.elementLocated(By.xpath("//*[contains(text(),'rsylvester@phoenixcontact-sb.io')]")), 30000)
            .click();
          await driver
            .wait(until.elementLocated(By.xpath("//*[contains(text(),'Fernando Editor')]")), 30000)
            .click();
        }

        // Step 3: Open device assignment section
        await devicesByAssigment(driver);
        await assignDevicesButton(driver);
        await waitForXPathPresentTimeout(driver, "//div[@data-analytics='modal headline'][contains(.,'Change device permissions')]",5000);

        // Step 4: Validate device count in assignment
        const expectedDeviceText = serviceEnv === 'PROD' ? '(3 of 17 devices)' : '(3 of 9 devices)';
        await assertText(driver, 'css', '.rbac-assignment__selectable', expectedDeviceText);

        // Step 5: Test search functionality in the device assignment modal
        await clearAndWrite(driver, 'xpath', "//input[@placeholder='Search devices ']", 'PH 1 Machine Park 2');
        await assertText(driver, 'css', '.rbac-assignment__selectable', '(1 of 1 devices)');
        await modalClose(driver);

        // Step 6: Test search functionality in the devices tab
        await sendMessageLogToBrowserStack(driver, 'C876 Search bar in devices tab section works as intended');
        await clearAndWrite(driver, 'xpath', "//input[@placeholder='Search']", 'empro 3');
        await waitForXPathPresentTimeout(driver, "//div[@class='pc-table__item__column'][contains(.,'empro 3')]",5000);
        await waitUntilXpathNotPresent(driver, "//div[@class='pc-table__item__column'][contains(.,'PH 1 Machine Park 1')]");
        await waitUntilXpathNotPresent(driver, "//div[@class='pc-table__item__column'][contains(.,'PH 1 Machine Park 2')]");

        // Step 7: Test search functionality using UUID
        const UUID = serviceEnv === 'PROD' ? 'a87a7563-3da3-41fe-b2f4-320d08159d1f' : '68584532-d769-460b-99f1-52697ec2454e';
        await clearAndWrite(driver, 'xpath', "//input[@placeholder='Search']", UUID);
        await waitForXPathPresentTimeout(driver, "//div[@class='pc-table__item__column'][contains(.,'PH 1 Machine Park 1')]", 5000);
        await waitUntilXpathNotPresent(driver, "//div[@class='pc-table__item__column'][contains(.,'empro 3')]");
        await waitUntilXpathNotPresent(driver, "//div[@class='pc-table__item__column'][contains(.,'PH 1 Machine Park 2')]");

        // Step 8: Test compact menu navigation
        await sendMessageLogToBrowserStack(driver, 'C925 Left Side Menu works in the compact version');
        await driver
          .wait(until.elementLocated(By.xpath("/html/body/app-root/div/div/div/app-root/app-proficloud-shell/div/div[2]/app-navigation/div/div[2]/flex-col-center[2]/div/app-icon/*[name()='svg']/*[name()='g']/*[name()='path']")), 10000)
          .click(); // Click to minimize left panel

        // Navigate through User Management options
        await driver.wait(until.elementLocated(By.id('user-management-service')), 3000).click();
        await driver.wait(until.elementLocated(By.xpath("//flex-row[@id='navigation-user-management-service-user-roles']")), 3000).click();
        await waitForTitle(driver, 'Proficloud.io | User Management Service | Roles', 10000);

        await driver.wait(until.elementLocated(By.id('user-management-service')), 3000).click();
        await driver.wait(until.elementLocated(By.xpath("//flex-row[@id='navigation-user-management-service-users']")), 3000).click();
        await waitForTitle(driver, 'Proficloud.io | User Management Service | Users', 10000);

        await logout(driver);
      }
    );
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
