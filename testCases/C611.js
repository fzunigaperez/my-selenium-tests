const { Builder, By, until } = require('selenium-webdriver'); // Selenium WebDriver essentials
const assert = require('assert'); // Assertion module for validations
const testBase = require('./testBase'); // Common test setup
const { eliminateExtraOrganizationsAdmin,
  windowConfiguration,
  loginAdmin,
  roothOrganizationTest, 
  logout,
  activeOrganization,
  createOrganizationButton1,
  createOrganizationButton2,
  waitForXPathPresentTimeout,
  waitingLoadingRingProficloudToDissapear,
  switchToExtraOrganizationAsAdmin,
  inviteMember,
  loginToProtonMail,
  clickSecondMail,
  clickFirstMail,
  changeFrameAndClickonProficloudEmail,
  isTheOrganizationNameEmpty,
  loginRegisteredUser,
  settings,
  

} = require('../utils/sharedFunctions'); // Reusable shared functions

// Main test function for C611
async function C611() {

  try {
    await testBase('C611_C179_C180_C646_C181_C184_Introducing a Dashboard name / Maximize the whole Dashboard Editing a Dashboard name / Introducing a Dashboard name with a maximum length of 27 characters Introducing a Dashboard description / Editing a Dashboard description', async (driver) => {
      let vars = {}; // Initialize variables container


      await windowConfiguration(driver);
      await loginAdmin(driver, vars);
      await eliminateExtraOrganizationsAdmin(driver);
      //Create organization as ADMIN C699
      await roothOrganizationTest(driver);
      await activeOrganization(driver);
      await createOrganizationButton1(driver);

      //C892 Message about what characters are allowed in the name of organization has to be displayed
      await waitForXPathPresentTimeout(driver,"//mat-hint[contains(.,'Allowed characters are (a-z A-Z 0-9 - _ . @)')]",4000);
      await waitForXPathPresentTimeout(driver,"//*[contains(text(),'Fields marked with')]",4000);
      await introduceOrganizationName(driver,"$%&badName");
      await driver.wait(until.elementLocated(By.xpath("//div[@data-analytics='modal headline'][contains(.,'Your Organization')]")), 30000).click();
      await waitForXPathPresentTimeout(driver,"//app-icon[@name='warning']//*[name()='svg']//*[name()='path' and contains(@class,'ng-star-in')]",5000);
      await driver.sleep(2000);
  
      await introduceOrganizationName(driver,"Leave this Organization");
      await createOrganizationButton2(driver);
      await waitingLoadingRingProficloudToDissapear(driver);

      //Inviting admin and editor to the new created organization / C626 Switch Organization

      await switchToExtraOrganizationAsAdmin(driver);

      await inviteMember(driver,"testingpxc@proton.me","Admin");
      await inviteMember(driver,"testingpxc_editor+1@proton.me","Editor");
      await logout(driver);

      //Accept Admin invitation

      await loginToProtonMail(driver,vars);
      await clickSecondMail(driver);
      await changeFrameAndClickonProficloudEmail(driver);
       // Fill in login form
      await driver.wait(until.elementLocated(By.id("username")), 50000);
      await driver.findElement(By.id("username")).sendKeys("testingpxc@proton.me");
      await driver.findElement(By.id("password")).sendKeys("Proficloud2022!"),
      await driver.findElement(By.id("kc-login")).click();
      await driver.sleep(5000);
      const proficloudLogo = await driver.findElement(By.xpath("//div[contains(@id,'routeTitle')]"),10000);
      await driver.wait(until.elementIsVisible(proficloudLogo), 10000);
   
      //await isTheOrganizationNameEmpty(driver);
      await logout(driver);

      //Accept Editor Invitation

      await loginToProtonMail(driver,vars);
      await clickFirstMail(driver);
      await changeFrameAndClickonProficloudEmail(driver);
       // Fill in login form
      await driver.wait(until.elementLocated(By.id("username")), 50000);
      await driver.findElement(By.id("username")).sendKeys("testingpxc_editor+1@proton.me");
      await driver.findElement(By.id("password")).sendKeys("Proficloud2022!"),
      await driver.findElement(By.id("kc-login")).click();
      await driver.sleep(5000);
      const proficloudLogo2 = await driver.findElement(By.xpath("//div[contains(@id,'routeTitle')]"),10000);
      await driver.wait(until.elementIsVisible(proficloudLogo2), 10000);
      await logout(driver);

      //Log in as Admin 2 and leave the organization and check the email of the removal
      await windowConfiguration(driver);
      await loginRegisteredUser(driver,vars);
      await activeOrganization(driver);
      await settings(driver);
      leaveOrga = await countElementsByXPath(driver,"//h4[contains(.,'Leave this Organization')]");
      zzOrga = await countElementsByXPath(driver,"//h4[contains(text(), 'Z Z')]");

      if (leaveOrga > 0 || zzOrga > 0) {

        console.log("We do not need to change the orga since we are in the leave organization / Z Z  Orga");
        
      } else {
        await activeOrganization(driver);
        await driver.wait(until.elementLocated(By.xpath("//div[@class='profile-menu_icon-text__text'][contains(.,'Leave this Organization')]")), 30000).click();
        await waitingLoadingRingProficloudToDissapear(driver);
        
      }

    



    
     





     




      
             
      await logout(driver);
    });
  } catch (error) {
    throw new Error(`C611 failed: ${error.message}`);
  }
}


async function introduceOrganizationName(driver,orgaName) {

  await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Organization Name')]")), 30000).click();
  await driver.findElement(By.xpath("//input[@placeholder='Organization Name']"),5000).clear();
  await driver.findElement(By.xpath("//input[@placeholder='Organization Name']")).sendKeys(orgaName);
 
  
}
  


// Allow this file to be executed directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running test C611...');
      await C611(); // Run the test
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      console.error(error.stack);
    }
  })();
}

// Export the test function for use in other modules
module.exports = C611;
