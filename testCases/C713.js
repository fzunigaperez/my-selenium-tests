const { Builder, By, until } = require('selenium-webdriver');  // Localrun 
const testBase = require('./testBase');  //Common
const { windowConfiguration, 
  loginAdmin, 
  logout, 
  
  emmaMenu,
  cleanDashboard,
  deleteManualReports,
  deleteRecurringReports,
  createChart,
  reportActionsButton,
  clearAndWrite,
  assertXpathNotPresent,
  waitingLoadingRingProficloudToDissapear,
  getCurrentDate,
  reports,
  downloadButton,
  handleBlobReportDownloadBs,
  waitForXPathPresentTimeout,


  } = require('../utils/sharedFunctions');// BS.


async function C713() {
  try {
    await testBase('C713_C720_C1052_Create a manual report / Downlaod a manual report / Export one or all widgets', async (driver) => {
      let vars = {};

      await windowConfiguration(driver, "EMMA");      
      await loginAdmin(driver, vars);
      await emmaMenu(driver);
      await cleanDashboard(driver);
      
      await createChart(driver, 'EPCTPC'); // Energy Pie Chart Time Period Comparison


      const reportTitle = "Phoenix Contact Single Report C713";
      const reportSubtitle = "Testing Subtitle";
      const reportDescription = "At absolute zero temperature, the system is in the state with the minimum thermal energy, the ground state. The constant value (not necessarily zero) of entropy at this point is called the residual entropy of the system. With the exception of non-crystalline solids (e.g. glass) the residual entropy of a system is typically close to zero.";
      const dateOfToday = await getCurrentDate('/');
      const reportCompany = "Apple Company";
      const reportAuthor = "Fernando Alejandro Zuniga Perez";

      await reports(driver);
      await deleteManualReports(driver);
      await deleteRecurringReports(driver);
      await reportActionsButton(driver);
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Export Single Report')]")), 3000).click();
      await driver.wait(until.elementLocated(By.xpath("//div[@data-analytics='modal headline'][contains(.,'Single Report')]")), 4000);
      await clearAndWrite(driver, "xpath", "//input[@ng-reflect-placeholder='Title']", reportTitle);
      await clearAndWrite(driver, "xpath", "//input[@ng-reflect-placeholder='Subtitle']", reportSubtitle);
      await clearAndWrite(driver, "xpath", "//textarea[@placeholder='Description']", reportDescription);
      await driver.wait(until.elementLocated(By.id("dateFormat")), 3000).click();
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'DD/MM/YYYY')]")), 30000).click();
      await clearAndWrite(driver, "xpath", "//input[@placeholder='Company']", reportCompany);
      await clearAndWrite(driver, "xpath", "//input[@placeholder='Author']", reportAuthor);
      //Since we create a single report, this elements should not be there:
      await assertXpathNotPresent(driver,"//input[@placeholder='Mail List']");
      await assertXpathNotPresent(driver,"//*[@id='recurrence']");
      await driver.wait(until.elementLocated(By.xpath("//pc-button[contains(.,'Export')]")), 3000).click();
      //We wait until the report creatio message appears
      await waitForXPathPresentTimeout(driver,"//*[contains(text(),'Report is ready for download.')]", 60000);
      await downloadButton(driver);
      await handleBlobReportDownloadBs(driver, reportTitle);
      //We check the generation alert
      await waitForXPathPresentTimeout(driver,"//div[@class='service-content'][contains(.,'Report generation successful')]",20000);
      //Check that the single report is being in the left side panel
      await waitForXPathPresentTimeout(driver,"//div[@class='recurring-report-name'][contains(.,'Phoenix Contact Single Report C713')]",10000);

      //Creating a second report

      await reports(driver);
      await reportActionsButton(driver);
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Export Single Report')]")), 3000).click();
      await driver.wait(until.elementLocated(By.xpath("//div[@data-analytics='modal headline'][contains(.,'Single Report')]")), 4000);
      await clearAndWrite(driver, "xpath", "//input[@ng-reflect-placeholder='Title']", "Second Report");
      await clearAndWrite(driver, "xpath", "//input[@ng-reflect-placeholder='Subtitle']", "Wahtever");
      await clearAndWrite(driver, "xpath", "//textarea[@placeholder='Description']", "NO DESCRIPTION");
      await driver.wait(until.elementLocated(By.id("dateFormat")), 3000).click();
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'DD/MM/YYYY')]")), 30000).click();
      await clearAndWrite(driver, "xpath", "//input[@placeholder='Company']", reportCompany);
      await clearAndWrite(driver, "xpath", "//input[@placeholder='Author']", reportAuthor);
      //Since we create a single report, this elements should not be there:
      await assertXpathNotPresent(driver,"//input[@placeholder='Mail List']");
      await assertXpathNotPresent(driver,"//*[@id='recurrence']");
      await driver.wait(until.elementLocated(By.xpath("//pc-button[contains(.,'Export')]")), 3000).click();
      //We wait until the report creatio message appears
      await waitForXPathPresentTimeout(driver,"//*[contains(text(),'Report is ready for download.')]", 60000);
      await downloadButton(driver);
      await handleBlobReportDownloadBs(driver, "Second single report");
      //We check the generation alert
      await waitForXPathPresentTimeout(driver,"//div[@class='service-content'][contains(.,'Report generation successful')]",20000);
      //Check that the single report is being in the left side panel
      await waitForXPathPresentTimeout(driver,"//div[@class='recurring-report-name'][contains(.,'Second Report')]",10000);
      await deleteManualReports(driver);
      await deleteRecurringReports(driver);


    

  



    });
  } catch (error) {
    throw new Error(`C713 failed: ${error.message}`);
  }
}





module.exports = C713;


if (require.main === module) {
  (async () => {
    try {
      console.log(`'🚀 Running the test `);
      await C713();   // Change here the test name
      
      console.log('✅ Test successfully completed.');
    } catch (error) {
      console.error('❌ Error running the test:', error.message);
    }
  })();
}
