const { Builder, By, until } = require('selenium-webdriver');  // Localrun 
const testBase = require('./testBase');  //Common
const { windowConfiguration, 
        loginAdmin, 
        waitForTitle, 
        sendMessageLogToBrowserStack,  } = require('../utils/sharedFunctions');// BS.



async function C26() {
  try {
    await testBase('C26_C28_C34_C581_External links', async (driver) => {
      let vars = {};
            
      await windowConfiguration(driver,"DMS");
  
      await driver.get("https://proficloud.io/contact/");
      await waitForTitle(driver,"Get in Contact | Proficloud.io", 10000);
      await sendMessageLogToBrowserStack(driver,"C28 Site notice link is working");
      await driver.get("https://proficloud.io/site-notice/");
      await waitForTitle(driver,"Site notice | Phoenix Contact", 10000);

      await sendMessageLogToBrowserStack(driver,"C31 Software License Terms, Product Description, Data Privacy, Privacy Settings and Data  Terms link is working.");
      await driver.get("https://www.phoenixcontact.com/en-pc/legal-notice");
      await waitForTitle(driver,"Site notice | Phoenix Contact", 10000);
      await driver.get("https://proficloud.io/data-privacy/");
      await waitForTitle(driver,"PHOENIX CONTACT on data protection | Phoenix Contact", 10000);
      await driver.get("https://proficloud.io/terms-and-conditions/");
      await waitForTitle(driver,"Terms and Conditions | Proficloud.io");

      await sendMessageLogToBrowserStack(driver,"C581 Help icon redirect user to a FAQ page") 
      await windowConfiguration(driver,"DMS");
      await loginAdmin(driver, vars);
      await driver.wait(until.elementLocated(By.xpath("//flex-col-center-center[contains(.,'?')]")), 3000).click();
      

      let handles = await driver.getAllWindowHandles();
      await driver.switchTo().window(handles[handles.length - 1]);



      await waitForTitle(driver,"Frequently Asked Questions | Proficloud", 2000);


    });

  } catch (error) {
    throw new Error(`C26 failed: ${error.message}`);
  }
}





module.exports = C26;


if (require.main === module) {
  (async () => {
    try {
      console.log(`'🚀 Running the test `);
      await C26();   // Change here the test name
      
      console.log('✅ Test successfully completed.');
    } catch (error) {
      console.error('❌ Error running the test:', error.message);
    }
  })();
}
