const { Builder, By, until } = require('selenium-webdriver'); // Importación de Selenium WebDriver
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));

async function testBase(sessionName, testSteps) {
    let driver;
  
    try {
      if (process.env.RUN_ENV === 'browserstack') {
        // Configuración para ejecutar en BrowserStack
        const capabilities = {
          ...baseCapabilities,
          'bstack:options': {
            ...baseCapabilities['bstack:options'],
            sessionName,
          },
        };
  
        driver = await new Builder()
          .usingServer('https://hub-cloud.browserstack.com/wd/hub')
          .withCapabilities(capabilities)
          .build();
      } else {
        // Configuración para ejecutar localmente
        driver = await new Builder().forBrowser('chrome').build();
      }
  
      // Ejecutar los pasos de prueba
      await testSteps(driver);
  
      console.log(`✅ La prueba '${sessionName}' se ejecutó correctamente.`);
    } catch (error) {
      console.error(`❌ Error durante la prueba '${sessionName}':`, error.message);
      console.error('🔍 Rastreo del error:', error.stack);
      throw error;
    } finally {
      if (driver) {
        await driver.quit();
        console.log('🚪 Sesión del driver cerrada.');
      }
    }
  }
  
  module.exports = testBase;