const { Builder, By, until } = require('selenium-webdriver'); // Importación completa
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const {
  windowConfiguration,
  acceptCookies,
  loginLandingPageButton,
} = require('../utils/sharedFunctions'); // Importación de funciones reutilizables

async function C16() {
  let driver;

  const capabilities = {
    ...baseCapabilities,
    'bstack:options': {
      ...baseCapabilities['bstack:options'],
      'sessionName': 'C16 Login with wrong credentials',
    },
  };

  try {
    // Inicializa el driver
    driver = await new Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub')
      .withCapabilities(capabilities)
      .build();

    // Configuración de la ventana
    await windowConfiguration(driver);

    // Aceptar cookies
    await acceptCookies(driver);

    // Ir al botón de inicio de sesión
    await loginLandingPageButton(driver);

    // Ingresar credenciales incorrectas
    await driver.findElement(By.id("username")).sendKeys("xxx@phoenixcontact-sb.io");
    await driver.findElement(By.id("password")).sendKeys("1234554");
    await driver.findElement(By.id("kc-login")).click();

    // Validar el mensaje de error
    const feedbackText = await driver.findElement(By.css(".kc-feedback-text")).getText();
    if (feedbackText !== "Invalid username or password.") {
      throw new Error("Unexpected error message: " + feedbackText);
    }

    console.log("C16 Login with wrong credentials completed successfully.");

    // Marca la sesión como exitosa
    const passedStatus = JSON.stringify({
      action: "setSessionStatus",
      arguments: {
        status: "passed",
        reason: "C16 test passed successfully",
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

module.exports = C16;
