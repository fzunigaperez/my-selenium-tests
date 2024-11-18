const { Builder, By, until } = require('selenium-webdriver'); // Se asegura que By esté importado
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const {
  acceptCookies,
  loginLandingPageButton,
  adminCredentials,
  isTheOrganizationNameEmpty,
  rootOrganizationTest,
  logout,
} = require('./sharedFunctions');

async function C15() {
  let driver;
  let vars = {};

  // Clona las capacidades y agrega el sessionName dinámicamente
  const capabilities = {
    ...baseCapabilities,
    'bstack:options': {
      ...baseCapabilities['bstack:options'],
      'sessionName': 'C15 Log in with right credentials as ADMIN',
    },
  };

  try {
    driver = await new Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub')
      .withCapabilities(capabilities)
      .build();

    async function windowConfiguration() {
      await driver.get("https://proficloud.io/testrun");
      await driver.manage().window().maximize();
    }

    async function loginAdmin() {
      await acceptCookies(driver);
      await driver.sleep(1000);
      await acceptCookies(driver);
      await loginLandingPageButton(driver);
      await adminCredentials(driver, vars);
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.id("username")), 50000); // By se usa aquí
      await driver.findElement(By.id("username")).sendKeys(vars["username"]);
      await driver.findElement(By.id("password")).sendKeys(vars["password"]);
      await driver.findElement(By.id("kc-login")).click();
      await driver.sleep(1000);
      await isTheOrganizationNameEmpty(driver, vars);
      await rootOrganizationTest(driver, vars);
    }

    await windowConfiguration();
    console.log("C15 Log in with right credentials as ADMIN");
    await loginAdmin();
    console.log("C15 Log in with right credentials as ADMIN completed.");
    await logout(driver);

    // Marcar la sesión como exitosa
    const passedStatus = JSON.stringify({
      action: "setSessionStatus",
      arguments: {
        status: "passed",
        reason: "C15 test passed successfully",
      },
    });
    await driver.executeScript(`browserstack_executor: ${passedStatus}`);

  } catch (error) {
    console.error('Error during test execution:', error.message);

    // Marcar la sesión como fallida
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

module.exports = C15;
