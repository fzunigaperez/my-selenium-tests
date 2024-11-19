const { Builder, By, until } = require('selenium-webdriver'); // Importaciones necesarias w
const assert = require('assert');
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const {
  windowConfiguration,
  logout,
  loginEditor,
} = require('../utils/sharedFunctions');

describe('C655 Log in with right credentials as EDITOR', function () {
  this.timeout(30000);
  let driver;
  let vars;

  const capabilities = {
    ...baseCapabilities,
    'bstack:options': {
      ...baseCapabilities['bstack:options'],
      'sessionName': 'C655 Log in with right credentials as EDITOR',
    },
  };

  beforeEach(async function () {
    driver = await new Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub')
      .forBrowser('chrome')
      .withCapabilities(capabilities)
      .build();
    vars = {};
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('C655 Log in with right credentials as EDITOR', async function () {
    try {
      // Configuración de ventana
      await windowConfiguration(driver);
      console.log('C655 Log in with right credentials as EDITOR');

      // Inicio de sesión como EDITOR
      await loginEditor(driver, vars);

      // Cierre de sesión
      await logout(driver);

      // Marca la sesión como exitosa en BrowserStack
      const passedStatus = JSON.stringify({
        action: "setSessionStatus",
        arguments: {
          status: "passed",
          reason: "C655 test passed successfully",
        },
      });
      await driver.executeScript(`browserstack_executor: ${passedStatus}`);
    } catch (error) {
      console.error('Error during test execution:', error.message);

      // Marca la sesión como fallida en BrowserStack
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

      throw error; // Re-lanza el error para que Mocha lo reporte
    }
  });
});
