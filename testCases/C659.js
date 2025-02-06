const { Builder, By, until } = require('selenium-webdriver');  // Localrun 
const testBase = require('./testBase');  //Common
const { windowConfiguration,
        loginEditor, 
        logout,
        waitForXPathPresentTimeout, 
     
        sendMessageLogToBrowserStack,
        getTextByLocator,  } = require('../utils/sharedFunctions');// BS.


async function C659() {
  try {
    await testBase('C659_C661_C663_Device health / general / service information is displayed correctly for an EDITOR', async (driver) => {
      let vars = {};

      const serviceEnv = await windowConfiguration(driver,"DMS");      

      if (serviceEnv === "PROD") {
        uuid = "a39b8382-bace-481e-936d-472793f31ae3";
        
      }
      else{
        uuid = "844bde27-6828-430c-9cc9-7c2ac5e00a63";
      }

      await loginAdmin(driver, vars);
     
      await driver.wait(until.elementLocated(By.xpath("//div[@title='PH 1 Machine Park 2']")), 10000).click();
      await waitForXPathPresentTimeout(driver,"//span[contains(.,'Connection status')]",5000);
      await waitForXPathPresentTimeout(driver,"//div[@data-analytics='expandable-device-item-health-online-offline'][contains(.,'Online')]",5000);
      await waitForXPathPresentTimeout(driver,"//span[@data-analytics='expandable-device-item-health-device-status'][contains(.,'Device status')]",5000);
      await waitForXPathPresentTimeout(driver,"//div[@data-analytics='expandable-device-item-health-device-status'][contains(.,'No status received') or contains(.,'Device Status not available')]",5000);
      
      
      
      status1 = await getTextByLocator(driver,"xpath",`//div[@id='device-list-item-${uuid}']/app-device-item/div/flex-col/flex-row/flex-col[2]/div`);
      status2 = await getTextByLocator(driver,"xpath","//div[@data-analytics='expandable-device-item-health-online-offline']");

      if (status1 === status2) {
        console.log("Status are the same :)");

      }

      else
      {
        console.log("Status are not the same");
        throw new Error("Status are not the same :(");
      }
      
      await sendMessageLogToBrowserStack(driver,"C47 Device general information is displayed correctly for an ADMIN");
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Information')]")), 3000).click();
   
      await waitForXPathPresentTimeout(driver,"//span[normalize-space()='Comment']",5000);
      await waitForXPathPresentTimeout(driver,"//pre[@data-analytics='expandable-device-item-info-comment'][contains(.,'Amazing Simulation Device')]",5000);
      await waitForXPathPresentTimeout(driver,"//span[contains(.,'Location')]",5000);
      await waitForXPathPresentTimeout(driver,"//div[@data-analytics='expandable-device-item-info-location'][contains(.,'Hannoversche Str. 30, 30629 Hannover, Deutschland (52.3904633, 9.8486995)')]",5000);
      await waitForXPathPresentTimeout(driver,"//div[normalize-space()='Serial Number']",5000);
      await waitForXPathPresentTimeout(driver,"//div[@data-analytics='expandable-device-item-info-serial-number'][contains(.,'Not available')]",5000);
      await waitForXPathPresentTimeout(driver,"//div[normalize-space()='Device Type']",5000);
      await waitForXPathPresentTimeout(driver,"//div[@data-analytics='expandable-device-item-info-device-type'][contains(.,'AXC F 2152')]",5000);

      

      await waitForXPathPresentTimeout(driver,`//div[@data-analytics='expandable-device-item-info-uuid'][contains(.,'${uuid}')]`,5000);
      await waitForXPathPresentTimeout(driver,"//div[normalize-space()='Hardware Version']",5000);
      await waitForXPathPresentTimeout(driver,"//div[@data-analytics='expandable-device-item-info-hardware-version'][contains(.,'Not available')]",5000);

      await sendMessageLogToBrowserStack(driver,"C48 Device service information is displayed correctly for an ADMIN");
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Services')]")), 30000).click();
      await waitForXPathPresentTimeout(driver,"//mat-card-title[normalize-space()='DMS Basic Add-on']",5000);
      await waitForXPathPresentTimeout(driver,"//mat-card-title[normalize-space()='Time Series Data Service']",5000);

      await sendMessageLogToBrowserStack(driver,"C49 Device Logs information is displayed correctly for an ADMIN");
          
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Logs')]")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'LIVE')]")), 30000).click();
      await waitForXPathPresentTimeout(driver,"//div[contains(text(),'Check the configuration on the device to get more ')]",50000);
      await waitForXPathPresentTimeout(driver,"//*[contains(text(),'Timestamp')]",5000);
      await waitForXPathPresentTimeout(driver,"//*[contains(text(),'Log ')]",5000);
      await logout(driver);



    });
  } catch (error) {
    throw new Error(`C659 failed: ${error.message}`);
  }
}





module.exports = C659;


if (require.main === module) {
  (async () => {
    try {
      console.log(`'🚀 Running the test `);
      await C659();   // Change here the test name
      
      console.log('✅ Test successfully completed.');
    } catch (error) {
      console.error('❌ Error running the test:', error.message);
    }
  })();
}
