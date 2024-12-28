const { Builder } = require('selenium-webdriver'); // Importación de Selenium WebDrivers
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));

async function testBase(sessionName, testSteps) {
  let driver;

  // Selector para decidir ejecución local o en BrowserStack
  const EXECUTION_MODE = {
    LOCAL: 'OFF',
    BROWSERSTACK: 'ON',
  };

  let selectLocal = EXECUTION_MODE.LOCAL;

  try {
    if (selectLocal === EXECUTION_MODE.LOCAL) {
      console.log("Ejecución local activada.");
      // Configura el driver para usar Chrome localmente
      driver = await new Builder().forBrowser('chrome').build();

      // Ejecutar los pasos de prueba
      console.log(`🚀 Iniciando la prueba local: ${sessionName}`);
      await testSteps(driver);

      console.log(`✅ La prueba '${sessionName}' se ejecutó correctamente.`);
    } else {
      console.log("Ejecución en BrowserStack activada.");

      const capabilities = {
        ...baseCapabilities,
        'bstack:options': {
          ...baseCapabilities['bstack:options'],
          sessionName,
        },
      };

      // Configura el driver para usar BrowserStack
      driver = await new Builder()
        .usingServer('https://hub-cloud.browserstack.com/wd/hub')
        .forBrowser('chrome')
        .withCapabilities(capabilities)
        .build();

      // Ejecutar los pasos específicos del test
      console.log(`🚀 Iniciando la prueba en BrowserStack: ${sessionName}`);
      await testSteps(driver);

      // Marcar la sesión como exitosa
      const passedStatus = JSON.stringify({
        action: 'setSessionStatus',
        arguments: {
          status: 'passed',
          reason: `${sessionName} test passed successfully`,
        },
      });
      await driver.executeScript(`browserstack_executor: ${passedStatus}`);
      console.log(`✅ ${sessionName} test passed successfully.`);
    }
  } catch (error) {
    console.error(`❌ Error durante la prueba '${sessionName}':`, error.message);
    console.error('🔍 Rastreo del error:', error.stack);

    if (selectLocal !== EXECUTION_MODE.LOCAL) {
      // Marcar la sesión como fallida en BrowserStack
      try {
        const failedStatus = JSON.stringify({
          action: 'setSessionStatus',
          arguments: {
            status: 'failed',
            reason: `Test failed: ${error.message}`,
          },
        });
        await driver.executeScript(`browserstack_executor: ${failedStatus}`);
      } catch (executorError) {
        console.error('❌ Failed to update BrowserStack session status:', executorError.message);
      }
    }

    throw error; // Re-lanzar el error después de registrar el estado
  } finally {
    // Asegurarse de cerrar el driver
    if (driver) {
      try {
        await driver.quit();
        console.log('🗝️  Sesión del driver cerrada.');
      } catch (quitError) {
        console.error('❌ Error al cerrar la sesión del driver:', quitError.message);
      }
    }
  }
}

module.exports = testBase;
