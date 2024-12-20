const { Builder, By, until } = require('selenium-webdriver'); // Importación completa
const path = require('path');
const assert = require('assert');
const testBase = require('./testBase'); // Lógica común para la ejecución de pruebas
const {
  windowConfiguration,
  deleteUnregisteredUserInCaseOfExistence,
  enterRegistrationData,
  emailVerification,
  loginAsUnregisteredUserAndDeleteAccount,
  waitingLoadingRingProficloudToDissapear,
  loginToProtonMail,
  deleteAllEmails,
  logOutFromProtonMail,
  confirmLinkUrlToggleIsOff,
} = require('../utils/sharedFunctions'); // Importación de funciones reutilizables

async function C13() {
  try {
    await testBase(
      'C13_C575_C697_C22_C895_C1024 Sign up in the proficloud with valid email and password / Sign UP with an already existing E-Mail / Introduce a wrong password before user deletion / Delete user / If the user enter an invalid email, and correcte it later, it is should be possible to REGISTER to Proficloud or create Billing account / Check and uncheck the Terms and Licences Agreement should not alter the registered button ',
      async (driver) => {
        let vars = {};

        await windowConfiguration(driver);
        await loginToProtonMail(driver, vars);
        await confirmLinkUrlToggleIsOff(driver);
        await logOutFromProtonMail(driver);
        await deleteUnregisteredUserInCaseOfExistence(driver, vars);

        await windowConfiguration(driver);
        await driver.wait(until.elementLocated(By.id("registration-button")), 30000).click();
        await enterRegistrationData(driver, vars);
        
        // Espera a que desaparezca el mensaje de éxito
        await waitingLoadingRingProficloudToDissapear(driver, vars);

        await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Register')]")), 2000).click();
        await enterRegistrationData(driver, vars);

        await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'You are already registered. Please check the inbox of your given email address. If you experience any trouble, please contact our support.')]")), 30000);
        await driver.wait(until.elementLocated(By.id("modal-close")), 5000).click();

        await emailVerification(driver, vars);
        await loginAsUnregisteredUserAndDeleteAccount(driver, vars);
        await loginToProtonMail(driver, vars);
        await deleteAllEmails(driver, vars);
        await logOutFromProtonMail(driver);
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
      await C13(); // Ejecuta el test C13
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
    }
  })();
}
