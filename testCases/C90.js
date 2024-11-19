const { Builder, By, until } = require('selenium-webdriver'); // Importación completa
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const {
  windowConfiguration,
  loginAdmin,
  logout,
} = require('../utils/sharedFunctions');

await driver.manage().setTimeouts({ implicit: 2000 }); // Espera implícita

async function C90() {
  let driver;
  let vars = {};

  const capabilities = {
    ...baseCapabilities,
    'bstack:options': {
      ...baseCapabilities['bstack:options'],
      'sessionName': 'C90 Log out successfully',
    },
  };

  try {
    driver = await new Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub')
      .forBrowser('chrome')
      .withCapabilities(capabilities)
      .build();

    await driver.manage().setTimeouts({ implicit: 2000 }); // Espera implícita

    // Configuración de la ventana
    await windowConfiguration(driver);

    // Inicio de sesión
    await loginAdmin(driver, vars);

    // Cierre de sesión
    await logout(driver);

    // Marca la sesión como exitosa
    const passedStatus = JSON.stringify({
      action: "setSessionStatus",
      arguments: {
        status: "passed",
        reason: "C90 test passed successfully",
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

module.exports = C90;
