const { Builder, By, until } = require('selenium-webdriver');
const {
  acceptCookies,
  windowConfiguration,
  loginLandingPageButton,
  loginToProtonMail,
  checkFailedLoginEmail,
  deleteAllEmails,
} = require('../utils/sharedFunctions');

async function C18() {
  let driver;
  try {
    // Inicializar el navegador
    driver = await new Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub')
      .forBrowser('chrome')
      .build();

    // Configuración inicial de la ventana
    await windowConfiguration(driver);
    await acceptCookies(driver);
    await loginLandingPageButton(driver);

    // Intento de login con credenciales inválidas
    const username = "testingpxc_admin@proton.me";
    const wrongPassword = "1234554";
    await driver.wait(until.elementLocated(By.id("username")), 5000);
    await driver.findElement(By.id("username")).sendKeys(username);
    await driver.findElement(By.id("password")).sendKeys(wrongPassword);
    await driver.findElement(By.id("kc-login")).click();

    // Verificar mensaje de error
    const feedbackText = await driver.findElement(By.css(".kc-feedback-text")).getText();
    if (feedbackText !== "Invalid username or password.") {
      throw new Error("Expected invalid credentials message not found.");
    }
    console.log("Login failed as expected with invalid credentials.");

    // Verificar intento fallido en Proton Mail
    const mailUsername = "testingpxc_admin@proton.me";
    const mailPassword = "Proficloud2022!";
    await loginToProtonMail(driver, mailUsername, mailPassword);
    await checkFailedLoginEmail(driver);

    // Eliminar todos los correos (opcional)
    await deleteAllEmails(driver);

  } catch (error) {
    console.error("Error during test execution:", error.message);

    // Manejo de estado en BrowserStack (opcional)
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
      console.error("Error setting BrowserStack session status:", executorError.message);
    }

    throw error;
  } finally {
    // Cerrar el navegador
    if (driver) {
      await driver.quit();
    }
  }
}

// Exportar el script para ser ejecutado
module.exports = C18;
