const { Builder, By, until } = require('selenium-webdriver'); // Selenium WebDriver essentials
const assert = require('assert'); // Assertion module for validations
const testBase = require('./testBase'); // Common test setup
const {
  windowConfiguration,
  loginAdmin,
  resetToOriginalUserNameInRoothOrganization,
  deviceManagementMenu,
  getTextByLocator,
  userManagementMenu,
  devicesByAssigment,
  assignDevicesButton,
  waitForXPathPresentTimeout,
  clearAndWrite,
  assertText,
  modalClose,
  logout,
  sendMessageLogToBrowserStack,
  assertXpathNotPresent,
  testEmpro3Name,
 
  
} = require('../utils/sharedFunctions'); // Reusable shared functions


// Main test function for C734
async function C734() {
  try {
    await testBase('C734_C751_C888_UUIDs & Names of Device Management and Assign devices to user have to be the same /  Admin cannot assign devices to another admin / Search bar in Assing devices work as intended', async (driver) => {
      let vars = {}; // Initialize variables container

      
      await windowConfiguration(driver,"UMS");
      await loginAdmin(driver, vars);
      await testEmpro3Name(driver);
      await resetToOriginalUserNameInRoothOrganization(driver);
      await deviceManagementMenu(driver);
      
      UUID1 = await getTextByLocator(driver,"xpath","//div[@id='device-list-item-a87a7563-3da3-41fe-b2f4-320d08159d1f']/app-device-item/div/flex-col[2]/flex-row-between-center[2]/div/div");
      UUID2 = await getTextByLocator(driver,"xpath","//div[@id='device-list-item-a39b8382-bace-481e-936d-472793f31ae3']/app-device-item/div/flex-col[2]/flex-row-between-center[2]/div/div");
      UUID3 = await getTextByLocator(driver,"xpath","//div[@id='device-list-item-f8be7a9a-9212-4ad2-86ed-8fd383968e01']/app-device-item/div/flex-col[2]/flex-row-between-center[2]/div/div");

      await userManagementMenu(driver);
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),' rsylvester@phoenixcontact-sb.io')]")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Fernando Editor')]")), 30000).click();
      await devicesByAssigment(driver);
      await assignDevicesButton(driver);

      await waitForXPathPresentTimeout(driver,`//div[@class='mat-mdc-list-item-line mdc-list-item__secondary-text rbac-assignment__subtext'][contains(.,'${UUID1}')]`,3000);
      await waitForXPathPresentTimeout(driver,`//div[@class='mat-mdc-list-item-line mdc-list-item__secondary-text rbac-assignment__subtext'][contains(.,'${UUID2}')]`,3000);
      await waitForXPathPresentTimeout(driver,`//div[@class='mat-mdc-list-item-line mdc-list-item__secondary-text rbac-assignment__subtext'][contains(.,'${UUID3}')]`,3000);
      await clearAndWrite(driver,"xpath","//input[@placeholder='Search devices ']","PH 1 Machine Park 2");
      await assertText(driver,"css",".rbac-assignment__selectable","(1 of 1 devices)");
      await modalClose(driver);

      await sendMessageLogToBrowserStack(driver,"C751 Admin cannot assign devices to another admin");
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Fernando Editor')]")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),' rsylvester@phoenixcontact-sb.io')]")), 30000).click();
      await devicesByAssigment(driver);
      await assertXpathNotPresent(driver,"//*[contains(text(),'Assign devices to user')]");
      await waitForXPathPresentTimeout(driver,"//span[contains(.,'As an administrator you have access to all devices in this organization. This can not be changed in the admin role.')]",3000);

      await sendMessageLogToBrowserStack(driver,"C888 Search bar in Assing devices work as intended")

      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),' rsylvester@phoenixcontact-sb.io')]")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Fernando Editor')]")), 30000).click();
      await devicesByAssigment(driver);
      await assignDevicesButton(driver);
      await clearAndWrite(driver,"xpath","//input[@placeholder='Search devices ']","Alerting Device");
      await waitForXPathPresentTimeout(driver,"//label[@class='mdc-label'][contains(.,'Alerting Device')]",3000);
      await assertXpathNotPresent(driver,"//label[@class='mdc-label'][contains(.,'empro 3')]");
      await assertXpathNotPresent(driver,"//label[@class='mdc-label'][contains(.,'empro 4')]");
      await assertXpathNotPresent(driver,"//label[@class='mdc-label'][contains(.,'empro 5')]");
      await assertXpathNotPresent(driver,"//label[@class='mdc-label'][contains(.,'empro 6')]");
      await clearAndWrite(driver,"xpath","//input[@placeholder='Search devices ']","f8be7a9a-9212-4ad2-86ed-8fd383968e01");
      await waitForXPathPresentTimeout(driver,"//label[@class='mdc-label'][contains(.,'empro 3')]",3000);
      await modalClose(driver);
      await logout(driver);



    });
  } catch (error) {
    throw new Error(`C734 failed: ${error.message}`);
  }
}



// Allow this file to be executed directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running test C734...');
      await C734(); // Run the test
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      console.error(error.stack);
    }
  })();
}

// Export the test function for use in other modules
module.exports = C734;
