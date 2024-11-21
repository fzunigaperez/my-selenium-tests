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
    // Construir el driver
    driver = await new Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub')
      .forBrowser('chrome')
      .withCapabilities(capabilities)
      .build();

    // Ejecución general de los pasos del test
    await windowConfiguration(driver); // Configuración de ventana
    await loginAdmin(driver);         // Inicio de sesión
    await logout(driver);             // Cierre de sesión

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
    // Captura de errores generales
    console.error('❌ Test failed with error:', error.message);
    console.error('🔍 Stack trace:', error.stack);

    // Marcar la sesión como fallida en BrowserStack
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

    throw error; // Relanzar el error para que sea manejado por el sistema de CI/CD si es necesario

  } finally {
    // Cierre del driver
    if (driver) {
      await driver.quit();
      console.log('🚪 Driver session closed.');
    }
  }
}

module.exports = C90;
