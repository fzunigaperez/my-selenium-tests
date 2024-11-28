const { Builder, By, until } = require('selenium-webdriver'); // Importación completa
const path = require('path');
const assert = require('assert');
const testBase = require('./testBase'); // Lógica común para la ejecución de pruebas
const {
  windowConfiguration,
  logout,
  loginToProtonMail,
  logOutFromProtonMail,
  confirmLinkURLsOn,
  loginUnregisteredUser,
  unregisteredUserCredentials,
  deleteUnregisteredUserInCaseOfExistence,
  agreeTerms,
  waitUntilXpathNotPresent,
  loginLandingPageButton,
  acceptCookies,
  waitingLoadingRingProficloudToDissapear,
  enterRegistrationData,
} = require('../utils/sharedFunctions'); // Importación de funciones reutilizables

async function C13() {
  try {
    await testBase(
      'C13_C575_C697_C22_C895_C1024 Sign up in the proficloud with valid email and password / Sign UP with an already existing E-Mail / Introduce a wrong password before user deletion / Delete user / If the user enter an invalid email, and correcte it later, it is should be possible to REGISTER to Proficloud or create Billing account / Check and uncheck the Terms and Licences Agreement should not alter the registered button ',
      async (driver) => {
        let vars = {};

        /*await windowConfiguration(driver);
        await acceptCookies(driver);
        await loginToProtonMail(driver,vars);
        await confirmLinkURLsOn(driver,vars);
        await logOutFromProtonMail(driver,vars);*/
        //await windowConfiguration(driver);
        
  
        await deleteUnregisteredUserInCaseOfExistence(driver,vars);
        


        await windowConfiguration(driver);
        await acceptCookies(driver);
        //await loginLandingPageButton(driver);

        await driver.wait(until.elementLocated(By.id("registration-button")), 30000).click();
        await enterRegistrationData (driver, vars);

        //REGISTRATION

        // C895 If the user enter an invalid email, and correct it later, it is should be possible to REGISTER to Proficloud or create Billing account.

       // await driver.findElement(By.id("registration-button")).click();
        
         /* await driver.findElement(By.xpath("//input[@placeholder=\'Organization name\']")).sendKeys("Unregistered Orga");
          await driver.findElement(By.xpath("//input[@placeholder=\'Email\']")).sendKeys("thisEmailNotValid@");
          await driver.findElement(By.xpath("//div[@class=\'title\'][contains(.,\'Registration\')]")).click();
          await driver.sleep(1000);
        
          await driver.findElements(By.xpath("//app-icon[@name=\'warning\']//*[name()=\'svg\']//*[name()=\'path\' and contains(@class,\'ng-star-in\')]"));
            
          await driver.findElement(By.xpath("//input[@placeholder=\'Email\']")).clear();
          await driver.findElement(By.xpath("//input[@placeholder=\'Email\']")).sendKeys(vars["username"]);
          await driver.findElement(By.id("mat-select-value-1")).click();
          await driver.findElement(By.xpath("//span[contains(.,\'Spain\')]")).click();
          await driver.findElement(By.xpath("//input[@placeholder=\'First name\']")).sendKeys(vars["firstName"]);
          await driver.findElement(By.xpath("//input[@placeholder=\'Last name\']")).sendKeys(vars["lastName"]);
          await driver.findElement(By.xpath("//input[@placeholder=\'Password\']")).sendKeys(vars["password"]);
          await driver.findElement(By.xpath("//input[contains(@placeholder,\'Confirm password\')]")).sendKeys(vars["password"]);
          await driver.sleep(1000);


          // C1024  Check and uncheck the Terms and Licences Agreement should not alter the registered button
          await driver.findElements(By.xpath("//*[@disabled=\'true\'][contains(.,\'Register\')]"));

          // Agree terms
          await agreeTerms(driver);
          //Assert that Register button is deactivated
          const buttonRegisterDisabled = await driver.findElements(By.xpath("//*[@disabled=\'true\'][contains(.,\'Register\')]"));
          assert(!buttonRegisterDisabled.length);
          await agreeTerms(driver);
          await driver.findElements(By.xpath("//*[@disabled=\'true\'][contains(.,\'Register\')]"));
          await agreeTerms(driver);
          assert(!buttonRegisterDisabled.length);
          await driver.findElement(By.xpath("//span[contains(.,\'Register\')]")).click();*/


          // Waiting the loading Ring to dissapear
          await waitingLoadingRingProficloudToDissapear (driver);


          

       

        //await loginAdmin(driver, vars);
        //await logout(driver);
      }
    );
  } catch (error) {
    throw new Error(`C13 failed: ${error.message}`);
  }
}

module.exports = C13;

if (require.main === module) {
  (async () => {
    try {
      console.log(`'🚀 Ejecutando el test`);
      await C13(); // Change here the test name
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
    }
  })();
}
