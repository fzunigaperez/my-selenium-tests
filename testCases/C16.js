const { Builder, By, until } = require('selenium-webdriver');
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const {
  windowConfiguration,
  acceptCookies,
  loginLandingPageButton,
} = require('../utils/sharedFunctions');

async function C16() {
  let driver;

  const capabilities = {
    ...baseCapabilities,
    'bstack:options': {
      ...baseCapabilities['bstack:options'],
      'sessionName': 'C16_C18 Login with wrong credentials_Login with valid email but wrong password',
    },
  };

  try {
    driver = await new Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub')
      .withCapabilities(capabilities)
      .build();

    await windowConfiguration(driver);
    await acceptCookies(driver);
    await loginLandingPageButton(driver);

    // Escenario 1: Credenciales completamente incorrectas
    console.log("Logging in with completely incorrect credentials...");
    let usernameField = await driver.findElement(By.id("username"));
    let passwordField = await driver.findElement(By.id("password"));

    await usernameField.sendKeys("xxx@phoenixcontact-sb.io");
    await passwordField.sendKeys("1234554");
    await driver.findElement(By.id("kc-login")).click();

    // Validar el mensaje de error
    await driver.wait(until.elementLocated(By.css(".kc-feedback-text")), 5000);
    let feedbackTextElement = await driver.findElement(By.css(".kc-feedback-text"));
    let feedbackText = await feedbackTextElement.getText();
    if (feedbackText !== "Invalid username or password.") {
      throw new Error(`Unexpected error message for invalid credentials: '${feedbackText}'`);
    }
    console.log("Validation passed for invalid credentials.");

    // Escenario 2: Email válido pero contraseña incorrecta
    console.log("Logging in with valid email but incorrect password...");
    usernameField = await driver.findElement(By.id("username"));
    passwordField = await driver.findElement(By.id("password"));

    await usernameField.clear();
    await passwordField.clear();
    await usernameField.sendKeys("testingpxc_admin@proton.me");
    await passwordField.sendKeys("1234554");
    await driver.findElement(By.id("kc-login")).click();

    // Validar el mensaje de error
    await driver.wait(until.elementLocated(By.css(".kc-feedback-text")), 5000);
    feedbackTextElement = await driver.findElement(By.css(".kc-feedback-text"));
    feedbackText = await feedbackTextElement.getText();
    if (feedbackText !== "Invalid username or password.") {
      throw new Error(`Unexpected error message for valid email and invalid password: '${feedbackText}'`);
    }
    console.log("Validation passed for valid email and invalid password.");

    const passedStatus = JSON.stringify({
      action: "setSessionStatus",
      arguments: {
        status: "passed",
        reason: "C16_C18 tests passed successfully",
      },
    });
    await driver.executeScript(`browserstack_executor: ${passedStatus}`);

  } catch (error) {
    console.error('Error during test execution:', error.message);

    const failedStatus = JSON.stringify({
      action: "setSessionStatus",
      arguments: {
        status: "failed",
        reason: `Test failed: ${error.message}`,
      },
    });

    try {
      await driver.executeScript(`browserstack_executor: ${failedStatus}`);
    } catch (executorError) {
      console.error('Error setting BrowserStack session status:', executorError.message);
    }

    throw error;

  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

module.exports = C16;
