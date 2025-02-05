const { Builder, By, until } = require('selenium-webdriver'); // Selenium WebDriver essentials
const assert = require('assert'); // Assertion module for validations
const testBase = require('./testBase'); // Common test setup
const moment = require('moment'); // Date manipulation library

const {
  windowConfiguration,
  loginEditor,
  emmaMenu,
  reports,
  logout,
  switchToExtraOrganization,
  loginToProtonMailRecurringReports,
  checkReportsPresence,
  waitForXPathPresentTimeout,
  assertXpathNotPresent,
  sendMessageLogToBrowserStack
} = require('../utils/sharedFunctions'); // Reusable shared functions

/**
 * Main test function for C1058
 * Validates that recurring reports are generated correctly based on their schedule.
 */
async function C1058() {
  try {
    await testBase('C1058 Admin and Editor are able to user reports without restrictions but viewer cannot download anything but the widgets', async (driver) => {
      let vars = {}; // Initialize variable container

      // Set up the test environment
      await windowConfiguration(driver, "EMMA");
      await loginEditor(driver, vars);
      await switchToExtraOrganization(driver, "Manager Orga");
      await emmaMenu(driver);
      await switchToExtraOrganization(driver, "Manager Orga");


      // Navigate to the Recurring Reports section
      await driver.wait(
        until.elementLocated(By.xpath("//div[@class='mat-mdc-tooltip-trigger dashboard__tab-title'][contains(.,'Recurring Reports')]")),
        30000
      ).click();
      await reports(driver);

      // Ensure the daily and weekly recurring reports exist
      await waitForXPathPresentTimeout(driver, "//div[@title='Daily Recurring Report']", 10000);
      await waitForXPathPresentTimeout(driver, "//div[@title='Weekly Recurring Report']", 10000);

      // Open dropdown menus to check if the recurring reports are being generated
      await driver.wait(
        until.elementLocated(By.xpath("//flex-col[@class='reports__existing']//flex-col//flex-col[1]//flex-row[1]//div[3]//app-icon[1]//*[name()='svg']")),
        30000
      ).click();
      await driver.wait(
        until.elementLocated(By.xpath("//flex-col[@class='reports__existing']//flex-col//flex-col[2]//flex-row[1]//div[3]//app-icon[1]//*[name()='svg']")),
        30000
      ).click();

      // Generate and validate report XPaths
      let dailyXPath = getXPathPreviousDay();
      let weeklyXPath = getXPathWeeklyReport();
      let activatedPausedXPath = getXPathActivatedPausedDaily();

      console.log("Daily Report XPath:", dailyXPath);
      console.log("Weekly Report XPath:", weeklyXPath);
      console.log("Activated and Paused Report XPath:", activatedPausedXPath);

      // Daily report check (Always present)
      await checkXPath(driver, dailyXPath, "Daily");

      // Weekly report check (Only on Monday, Wednesday, and Friday)
      const today = moment().day(); // Get the current day of the week (0 = Sunday, 6 = Saturday)
      if ([1, 3, 5].includes(today)) { // Monday (1), Wednesday (3), or Friday (5)
        await checkXPath(driver, weeklyXPath, "Weekly");
      } else {
        console.log("Today is not Monday, Wednesday, or Friday, the Weekly Report should not be present.");
        await assertXpathNotPresent(driver, weeklyXPath);
      }


      await sendMessageLogToBrowserStack(driver,"C644 Pause / Resume a recurring report");

      // Navigate to "Edit and Pause" section
      await driver.wait(
        until.elementLocated(By.xpath("//div[@class='mat-mdc-tooltip-trigger dashboard__tab-title'][contains(.,'Edit and pause re...')]")),
        30000
      ).click();



      // Ensure the "Activated and Paused Recurring Report Daily" is visible
      await waitForXPathPresentTimeout(driver, "//div[@class='recurring-report-name'][contains(.,'Activated and Paused Recurring Report Daily')]", 5000);

      const sundayType = getSundayWeekType();

      if (sundayType === "odd") {
        console.log("✅ Today is an ODD Sunday. It is necessary to DEACTIVATE the daily report");

        await driver.wait(until.elementLocated(By.xpath("(//*[@ng-reflect-name='more'])[10]")), 30000).click();
        await driver.wait(until.elementLocated(By.xpath("//span[@class='mat-mdc-menu-item-text'][contains(.,'Pause')]")), 30000).click();
        await waitForXPathPresentTimeout(driver,"//div[@class='tag'][contains(.,'Paused')]",5000);
        
      } else if (sundayType === "even") {

        console.log("✅ Today is an EVEN Sunday. It is necessary to ACTIVATE the daily report");
        await driver.wait(until.elementLocated(By.xpath("(//*[@ng-reflect-name='more'])[10]")), 30000).click();
        await driver.wait(until.elementLocated(By.xpath("//span[@class='mat-mdc-menu-item-text'][contains(.,'Resume')]")), 30000).click();
        await waitForXPathPresentTimeout(driver,"//div[@class='tag'][contains(.,'Active')]",5000);
      } else {
        console.log("Today is NOT Sunday. No action taken. :)");
      }


      // Open dropdown menu for further verification
      await driver.wait(
        until.elementLocated(By.xpath("//flex-col[@class='reports__existing']//flex-col//flex-col[1]//flex-row[1]//div[3]//app-icon[1]//*[name()='svg']")),
        30000
      ).click();

      // Check for Activated and Paused Report (Only if the current week is odd)
      const weekNumber = moment().week(); // Get the current week number
      if (weekNumber % 2 !== 0) { // Odd week
        await checkXPath(driver, activatedPausedXPath, "Activated and Paused");
      } else {
        console.log("This is an even week; the 'Activated and Paused' report should not be present.");
        await assertXpathNotPresent(driver, activatedPausedXPath);
      }

      // Logout and verify email reports
      await logout(driver);
      await loginToProtonMailRecurringReports(driver, vars);
      await checkReportsPresence(driver);
    });
  } catch (error) {
    throw new Error(`C1058 failed: ${error.message}`);
  }
}

// Allow this file to be executed directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running test C1058...');
      await C1058(); // Run the test
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      console.error(error.stack);
    }
  })();
}

module.exports = C1058;


