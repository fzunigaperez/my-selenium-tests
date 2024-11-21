const { Builder } = require('selenium-webdriver');
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const {
  windowConfiguration,
  loginAdmin,
  logout,
} = require('../utils/sharedFunctions');

async function C90() {
  let driver;

  const capabilities = {
    ...baseCapabilities,
    'bstack:options': {
      ...baseCapabilities['bstack:options'],
      sessionName: 'C90 Log out successfully',
    },
  };

  try {
    driver = await new Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub')
      .forBrowser('chrome')
      .withCapabilities(capabilities)
      .build();

    // Ejecución general del test
    await executeWithDetailedError(async () => await windowConfiguration(driver), 'windowConfiguration');
    await executeWithDetailedError(async () => await loginAdmin(driver), 'loginAdmin');
    await executeWithDetailedError(async () => await logout(driver), 'logout');

    // Marcar la sesión como exitosa
    const passedStatus = JSON.stringify({
      action: 'setSessionStatus',
      arguments: {
        status: 'passed',
        reason: 'C90 test passed successfully',
      },
    });
    await driver.executeScript(`browserstack_executor: ${passedStatus}`);
    console.log('✅ Test passed successfully.');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('🔍 Stack trace:', error.stack);

    // Marca la sesión como fallida
    const failedStatus = JSON.stringify({
      action: 'setSessionStatus',
      arguments: {
        status: 'failed',
        reason: `Test failed: ${error.message}`,
      },
    });

    try {
      await driver.executeScript(`browserstack_executor: ${failedStatus}`);
    } catch (executorError) {
      console.error('❌ Failed to update BrowserStack session status:', executorError.message);
    }

    throw error;

  } finally {
    if (driver) {
      await driver.quit();
      console.log('🚪 Driver session closed.');
    }
  }
}

async function executeWithDetailedError(fn, fnName) {
  try {
    await fn();
  } catch (error) {
    const enhancedError = new Error(`Error in function ${fnName}: ${error.message}`);
    enhancedError.stack = error.stack; // Asegura que el stack trace se preserve
    throw enhancedError;
  }
}

module.exports = C90;
