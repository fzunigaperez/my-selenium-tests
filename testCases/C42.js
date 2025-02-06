const { Builder, By, until } = require('selenium-webdriver');  // Localrun 
const testBase = require('./testBase');  //Common
const { windowConfiguration,
        loginAdmin, 
        logout,
        testEmpro3Name, 
        clearAndWrite, 
        waitForXPathPresentTimeout, 
        assertXpathNotPresent, 
        sendMessageLogToBrowserStack,  } = require('../utils/sharedFunctions');// BS.


async function C42() {
  try {
    await testBase('C42_C44_C45_Searching with capital/small letters / search sensitivity', async (driver) => {
      let vars = {};

      const serviceEnv = await windowConfiguration(driver,"DMS");      
      await loginAdmin(driver, vars);
      await testEmpro3Name(driver,serviceEnv);
      await driver.wait(until.elementLocated(By.xpath("//*[@data-analytics='device-list-top-bar-search-section']")), 10000).click();
      await clearAndWrite(driver,"id","mat-input-0","EMPRO");
      await waitForXPathPresentTimeout(driver,"//div[@title='empro 3']",5000);
      await waitForXPathPresentTimeout(driver,"//div[@title='empro 4']",5000);
      await waitForXPathPresentTimeout(driver,"//div[@title='empro 5']",5000);
      await waitForXPathPresentTimeout(driver,"//div[@title='empro 6']",5000);
      await assertXpathNotPresent(driver,"//div[@title='Alerting Device']",5000);

      await sendMessageLogToBrowserStack(driver,"C44 Searching with small letters");
      await driver.wait(until.elementLocated(By.xpath("//*[@data-analytics='device-list-top-bar-search-section']")), 10000).click();
      await clearAndWrite(driver,"id","mat-input-0","empro");
      await waitForXPathPresentTimeout(driver,"//div[@title='empro 3']",5000);
      await waitForXPathPresentTimeout(driver,"//div[@title='empro 4']",5000);
      await waitForXPathPresentTimeout(driver,"//div[@title='empro 5']",5000);
      await waitForXPathPresentTimeout(driver,"//div[@title='empro 6']",5000);
      await assertXpathNotPresent(driver,"//div[@title='Alerting Device']",5000);

      await sendMessageLogToBrowserStack(driver,"C45 Search sensitivity");
      await driver.wait(until.elementLocated(By.xpath("//*[@data-analytics='device-list-top-bar-search-section']")), 10000).click();
      await clearAndWrite(driver,"id","mat-input-0","mac");
      await waitForXPathPresentTimeout(driver,"//div[@title='PH 1 Machine Park 2']",5000);
      await waitForXPathPresentTimeout(driver,"//div[@title='PH 1 Machine Park 1']",5000);
      await logout(driver);

    });
  } catch (error) {
    throw new Error(`C42 failed: ${error.message}`);
  }
}





module.exports = C42;


if (require.main === module) {
  (async () => {
    try {
      console.log(`'🚀 Running the test `);
      await C42();   // Change here the test name
      
      console.log('✅ Test successfully completed.');
    } catch (error) {
      console.error('❌ Error running the test:', error.message);
    }
  })();
}
