const { Builder, By, until } = require('selenium-webdriver');  // Localrun 
const testBase = require('./testBase');  //Common
const { windowConfiguration,
        loginAdmin, 
        logout,
        testEmpro3Name, 
        clearAndWrite, 
        waitForXPathPresentTimeout, 
        assertXpathNotPresent, 
        sendMessageLogToBrowserStack,
        getTextByLocator,  } = require('../utils/sharedFunctions');// BS.


async function C46() {
  try {
    await testBase('C46_', async (driver) => {
      let vars = {};

      const serviceEnv = await windowConfiguration(driver,"DMS");      
      await loginAdmin(driver, vars);
     
      await driver.wait(until.elementLocated(By.xpath("//div[@title='PH 1 Machine Park 2']")), 10000).click();
      await waitForXPathPresentTimeout(driver,"//span[contains(.,'Connection status')]",5000);
      await waitForXPathPresentTimeout(driver,"//div[@data-analytics='expandable-device-item-health-online-offline'][contains(.,'Online')]",5000);
      await waitForXPathPresentTimeout(driver,"//span[@data-analytics='expandable-device-item-health-device-status'][contains(.,'Device status')]",5000);
      await waitForXPathPresentTimeout(driver,"//div[@data-analytics='expandable-device-item-health-device-status'][contains(.,'No status received')]",5000);
      
      
      status1 = await getTextByLocator(driver,"xpath","//div[@id='device-list-item-a39b8382-bace-481e-936d-472793f31ae3']/app-device-item/div/flex-col/flex-row/flex-col[2]/div");
      status2 = await getTextByLocator(driver,"xpath","//div[@data-analytics='expandable-device-item-health-online-offline']");

      if (status1 === status2) {
        console.log("Status are the same :)");

      }

      else
      {
        console.log("Status are not the same");
        throw new Error("Status are not the same :(");
      }
      
      
      await waitForXPathPresentTimeout(driver,"",5000);
      await waitForXPathPresentTimeout(driver,"",5000);
      await waitForXPathPresentTimeout(driver,"",5000);
      await waitForXPathPresentTimeout(driver,"",5000);
 
 





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
    throw new Error(`C46 failed: ${error.message}`);
  }
}





module.exports = C46;


if (require.main === module) {
  (async () => {
    try {
      console.log(`'🚀 Running the test `);
      await C46();   // Change here the test name
      
      console.log('✅ Test successfully completed.');
    } catch (error) {
      console.error('❌ Error running the test:', error.message);
    }
  })();
}
