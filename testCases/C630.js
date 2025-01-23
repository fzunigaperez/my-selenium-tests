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
  activeOrganization,
  settings,
  assertText,
  waitForTitle,
  subscriptionsTab,
  
} = require('../utils/sharedFunctions'); // Reusable shared functions


// Main test function for C630
async function C630() {
  try {
    await testBase('C630_C639_C627_628_User organization information is displayed correctly / Go to User Management Button redirect the user to User Management Service / Organization information is displayed correctly / Organization subscriptions are displayed correctly', async (driver) => {
      let vars = {}; // Initialize variables container

      //630 User organization information is displayed correctly
      await windowConfiguration(driver,"UMS");
      await loginAdmin(driver, vars);
      await activeOrganization(driver);
      await settings(driver);
      await usersTab(driver);
      await waitForXPathPresentTimeout(driver,"//th[contains(.,'User Name')]",5000);
      await waitForXPathPresentTimeout(driver,"//th[contains(.,'User Email')]",5000);
      await waitForXPathPresentTimeout(driver,"//th[contains(.,'User Role')]",5000);
      await driver.wait(until.elementLocated(By.id("members")), 3000).click();

      //C627 Organization information is displayed correctly

      await driver.wait(until.elementLocated(By.xpath("//div[normalize-space()='Information']")), 3000).click();
      await waitForXPathPresentTimeout(driver,"//td[contains(.,'Creator')]",5000);
      await waitForXPathPresentTimeout(driver,"//td[contains(.,'Fernando Zuniga')]",5000);
      await waitForXPathPresentTimeout(driver,"//td[contains(.,'Members')]",5000);     
      await waitForXPathPresentTimeout(driver,"//td[contains(.,'4')]",5000);

      //C628 Organization subscriptions are displayed correctly

      await subscriptionsTab(driver);
      await driver.wait(until.elementLocated(By.xpath("//mat-panel-title[contains(.,'Energy Management Service')]")), 3000).click();
      await assertText(driver,"xpath","//mat-expansion-panel[3]/div/div/app-subscription-information/mat-card/mat-tab-group/div/mat-tab-body/div/div/div/span","Description");
      await assertText(driver,"xpath","//mat-expansion-panel[3]/div/div/app-subscription-information/mat-card/mat-tab-group/div/mat-tab-body/div/div/div/div","Professional licence for Energy Management Service. Annual subscription. 100 metrics included. Once per customer. Extends EMS - Starter sub lic when ordered.");
      await assertText(driver,"xpath","//mat-expansion-panel[3]/div/div/app-subscription-information/mat-card/mat-tab-group/div/mat-tab-body/div/div/div/span[2]","Subscription ID");
      await assertText(driver,"xpath","//mat-expansion-panel[3]/div/div/app-subscription-information/mat-card/mat-tab-group/div/mat-tab-body/div/div/div/div[2]","1768807");
      await assertText(driver,"xpath","//mat-expansion-panel[3]/div/div/app-subscription-information/mat-card/mat-tab-group/div/mat-tab-body/div/div/div/span[3]","Reference");
      await assertText(driver,"xpath","//mat-expansion-panel[3]/div/div/app-subscription-information/mat-card/mat-tab-group/div/mat-tab-body/div/div/div/div[3]","FSJGL-SRLWN");
      await assertText(driver,"xpath","//mat-expansion-panel[3]/div/div/app-subscription-information/mat-card/mat-tab-group/div/mat-tab-body/div/div/div/span[4]","Booked at");
      await assertText(driver,"xpath","//mat-expansion-panel[3]/div/div/app-subscription-information/mat-card/mat-tab-group/div/mat-tab-body/div/div/div/div[4]","30.09.2024");


      //C639 Go to User Management Button redirect the user to User Management Service
      await usersTab(driver);
      await driver.wait(until.elementLocated(By.xpath("//button[@id='undefined']/span[2]/div/span")), 3000).click();
      await waitForTitle(driver,"Proficloud.io | User Management Service | Users",10000);
      await logout(driver);



    });
  } catch (error) {
    throw new Error(`C630 failed: ${error.message}`);
  }
}



// Allow this file to be executed directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running test C630...');
      await C630(); // Run the test
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      console.error(error.stack);
    }
  })();
}

// Export the test function for use in other modules
module.exports = C630;
