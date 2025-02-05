const { Builder, By, until } = require('selenium-webdriver'); // Selenium WebDriver essentials
const assert = require('assert'); // Assertion module for validations
const testBase = require('./testBase'); // Common test setup
const moment = require('moment'); // Date manipulation library

const {
  windowConfiguration,
  loginAdmin,
  emmaMenu,
  reports,
  logout,
  switchToExtraOrganization,
  waitForXPathPresentTimeout,
  sendMessageLogToBrowserStack,
  deleteManualReports,
  deleteRecurringReports,
  reportActionsButton,
  clearAndWrite,
  getCurrentDate,
  waitingLoadingRingProficloudToDissapear,
  editButton,
  getTextByLocator,
  modalClose,
  assertInputValue,
  verifyReportCounters,
} = require('../utils/sharedFunctions'); // Reusable shared functions
const { verify } = require('crypto');


async function C621() {
  try {
    await testBase('C621_C1057_C1051_Edit a recurring Report / Create a monthly recurring report / Report search bar and counter should work as intended', async (driver) => {
      let vars = {}; // Initialize variable container

      // Set up the test environment
      await windowConfiguration(driver, "EMMA");
      await loginAdmin(driver, vars);
      await emmaMenu(driver);
      await switchToExtraOrganization(driver, "Manager Orga");

      // Navigate to the Recurring Reports section
      await driver.wait(
        until.elementLocated(By.xpath("//div[@class='mat-mdc-tooltip-trigger dashboard__tab-title'][contains(.,'Edit Recurring Re...')]")),
        30000
      ).click();
      await reports(driver);

         
      await deleteManualReports(driver);
      await deleteRecurringReports(driver);

      //We create a monthly report
      await sendMessageLogToBrowserStack(driver,"C1057 Create a monthly recurring report");
      await reportActionsButton(driver);
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Create Recurring Report')]")), 3000).click();
      

      const reportTitle = "Phoenix Contact Monthly Recurring Report";
      const reportSubtitle = "Testing Subtitle";
      const reportDescription = "At absolute zero temperature, the system is in the state with the minimum thermal energy, the ground state. The constant value (not necessarily zero) of entropy at this point is called the residual entropy of the system. With the exception of non-crystalline solids (e.g. glass) the residual entropy of a system is typically close to zero.";
      const dateOfToday = await getCurrentDate('/');
      const reportCompany = "Apple Company";
      const reportAuthor = "Fernando Alejandro Zuniga Perez";
      const reportMailList = "testingpxc@proton.me,testingpxc_admin@proton.me";

      await driver.wait(until.elementLocated(By.xpath("//div[@data-analytics='modal headline'][contains(.,'Recurring Report')]")), 4000);
      await clearAndWrite(driver, "xpath", "//input[@ng-reflect-placeholder='Title']", reportTitle);
      await clearAndWrite(driver, "xpath", "//input[@ng-reflect-placeholder='Subtitle']", reportSubtitle);
      await clearAndWrite(driver, "xpath", "//textarea[@placeholder='Description']", reportDescription);
      await driver.sleep(2000);
    

      await driver.wait(until.elementLocated(By.id("dateFormat")), 3000).click();
      // Select American date format
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'DD/MM/YYYY')]")), 30000).click();
      await clearAndWrite(driver, "xpath", "//input[@placeholder='Company']", reportCompany);
      await clearAndWrite(driver, "xpath", "//input[@placeholder='Author']", reportAuthor);
      await clearAndWrite(driver, "xpath", "//input[@placeholder='Mail List']", reportMailList);


      // Activate toggles
      await driver.wait(until.elementLocated(By.xpath(`(//div[@data-analytics="modal"]//div[@class='bf' and contains(@style, 'background-color: var(--background-content);')])[1]`)), 3000).click();

      // Choose recurrence
      await driver.wait(until.elementLocated(By.id("recurrance")), 3000).click();
      await driver.findElement(By.xpath("(//div[@data-analytics='modal headline'][contains(.,'Recurring Report')])[2]"));
      await driver.wait(until.elementLocated(By.xpath("//input[contains(@value,'MONTHLY')]")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//div[normalize-space()='10']")), 30000).click();
      everyXdays = await getTextByLocator(driver,"xpath","//flex-row[@class='picker-item ng-star-inserted selected']");
      console.log(everyXdays);
      await clearAndWrite(driver, "xpath", "//input[@placeholder='Every']", "1");
      await waitForXPathPresentTimeout(driver,`//div[contains(text(), "A recurring report will be generated every month on the ${everyXdays}th at the start of the day")]`, 5000);

      
      await driver.wait(until.elementLocated(By.xpath("//span[@class='mdc-button__label'][contains(.,'OK')]")), 3000).click();
      await driver.wait(until.elementLocated(By.xpath("//pc-button[contains(.,'Create')]")), 3000).click();
      await waitingLoadingRingProficloudToDissapear(driver);
      await waitForXPathPresentTimeout(driver,"//div[@class='recurring-report-name'][contains(.,'Phoenix Contact Monthly Recurring Report')]", 5000);



      await driver.wait(until.elementLocated(By.xpath("//*[@ng-reflect-name='more']")), 30000).click();
      await editButton(driver);

      const reportTitleEdited = "Title Edited";
      const reportSubtitleEdited = "Subtitle Edited";
      const reportDescriptionEdited = "Short Description";
      const dateOfTodayEdited = await getCurrentDate('.');
      const reportCompanyEdited = "Edited Company";
      const reportAuthorEdited = "Edited Autor";
      const reportMailListEdited = "editedmail@fake.com";


      await driver.wait(until.elementLocated(By.xpath("//div[@data-analytics='modal headline'][contains(.,'Recurring Report')]")), 4000);
      await clearAndWrite(driver, "xpath", "//input[@ng-reflect-placeholder='Title']", reportTitleEdited);
      await clearAndWrite(driver, "xpath", "//input[@ng-reflect-placeholder='Subtitle']", reportSubtitleEdited);
      await clearAndWrite(driver, "xpath", "//textarea[@placeholder='Description']", reportDescriptionEdited);
      await driver.sleep(2000);
    

      await driver.wait(until.elementLocated(By.id("dateFormat")), 3000).click();
      // Select American date format
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'DD.MM.YYYY')]")), 30000).click();
      await clearAndWrite(driver, "xpath", "//input[@placeholder='Company']", reportCompanyEdited);
      await clearAndWrite(driver, "xpath", "//input[@placeholder='Author']", reportAuthorEdited);
      await clearAndWrite(driver, "xpath", "//input[@placeholder='Mail List']", reportMailListEdited);

 
        

      // Deactivate toggles
      await driver.wait(until.elementLocated(By.xpath(`(//div[@data-analytics="modal"]//div[@class='bf' and contains(@style, 'background-color: var(--background-content);')])[1]`)), 3000).click();

      // Choose recurrence
      await driver.wait(until.elementLocated(By.id("recurrance")), 3000).click();
      await driver.findElement(By.xpath("(//div[@data-analytics='modal headline'][contains(.,'Recurring Report')])[2]"));
      await driver.wait(until.elementLocated(By.xpath("//input[contains(@value,'WEEKLY')]")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//flex-row-grow[@class='picker-item ng-star-inserted'][contains(.,'M')]")), 30000).click();
      await clearAndWrite(driver, "xpath", "//input[@placeholder='Every']", "1");
      await waitForXPathPresentTimeout(driver,"//div[@class='ng-star-inserted'][contains(.,'A recurring report will be generated every week on Mon at the start of the day')]",5000);
      await waitingLoadingRingProficloudToDissapear(driver);
      await driver.wait(until.elementLocated(By.xpath("//span[@class='mdc-button__label'][contains(.,'OK')]")), 3000).click();
      await driver.wait(until.elementLocated(By.xpath("//pc-button[contains(.,'Save')]")), 3000).click();
      await waitForXPathPresentTimeout(driver,`//div[@class='recurring-report-name'][contains(normalize-space(), "${reportTitleEdited}")]`,5000);
      await driver.sleep(2000);

      //We take a look if the edited fields are present
   
      await driver.wait(until.elementLocated(By.xpath("//*[@ng-reflect-name='more']")), 30000).click();
      await editButton(driver);
      await driver.wait(until.elementLocated(By.xpath("//*[@data-analytics='modal']")), 4000);
      await assertInputValue(driver, "xpath", "//input[@ng-reflect-placeholder='Title']", reportTitleEdited);
      await assertInputValue(driver, "xpath", "//input[@ng-reflect-placeholder='Subtitle']", reportSubtitleEdited);
      await assertInputValue(driver, "xpath", "//textarea[@placeholder='Description']", reportDescription);
      await waitForXPathPresentTimeout(driver,"//span[contains(.,'DD.MM.YYYY')]",2000)

      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'DD.MM.YYYY')]")), 30000);
      await assertInputValue(driver, "xpath", "//input[@placeholder='Company']", reportCompanyEdited);
      await assertInputValue(driver, "xpath", "//input[@placeholder='Author']", reportAuthorEdited);
      await assertInputValue(driver, "xpath", "//input[@placeholder='Mail List']", reportMailListEdited);
      await modalClose(driver);

      await sendMessageLogToBrowserStack(driver,"C1051 Report search bar and counter should work as intended");
      await verifyReportCounters(driver);
      await deleteManualReports(driver);
      await deleteRecurringReports(driver);
      await verifyReportCounters(driver);


      //Due to a bug the search bar test cannot be finished yet:  https://proficloud.atlassian.net/browse/EM-2125

      await logout(driver);


    });
  } catch (error) {
    throw new Error(`C621 failed: ${error.message}`);
  }
}

// Allow this file to be executed directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running test C621...');
      await C621(); // Run the test
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      console.error(error.stack);
    }
  })();
}

module.exports = C621;



