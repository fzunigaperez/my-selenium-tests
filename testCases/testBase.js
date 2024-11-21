const { Builder, By, until } = require('selenium-webdriver'); // Importación completa
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));

async function testBase(sessionName, testSteps) {
  let driver;

  const capabilities = {
    ...baseCapabilities,
    'bstack:options': {
      ...baseCapabilities['bstack:options'],
      sessionName,
    },
  };

  try {
    driver = await new Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub')
      .forBrowser('chrome')
      .withCapabilities(capabilities)
      .build();

    // Ejecutar los pasos específicos del test
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
  } catch (error) {
    console.error(`❌ Error during ${sessionName} test:`, error.message);
    console.error('🔍 Stack trace:', error.stack);

    // Marcar la sesión como fallida
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

module.exports = testBase;
