const { Builder, By, until } = require('selenium-webdriver'); // Importación completa
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const {
  windowConfiguration,
  loginAdmin,
  logout,
} = require('./sharedFunctions');

async function C15() {
  let driver;
  let vars = {};

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

    // Configura la ventana del navegador
    await windowConfiguration(driver);

    // Realiza el inicio de sesión como administrador
    console.log("C15 Log in with right credentials as ADMIN - Starting");
    await loginAdmin(driver, vars);
    console.log("C15 Log in with right credentials as ADMIN - Completed");

    // Cierra la sesión
    await logout(driver);

    // Marca la sesión como exitosa
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

    // Marca la sesión como fallida
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
