const { Builder, By, until } = require('selenium-webdriver'); // Importación de Selenium WebDriver
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities')); // Cargar capacidades base
const {
  acceptCookies,
  windowConfiguration,
  loginLandingPageButton,
  loginToProtonMail,
  checkFailedLoginEmail,
  deleteAllEmails,
} = require('../utils/sharedFunctions'); // Importar funciones compartidas

async function C18() {
  let driver;
  let vars = {};

  // Definir capacidades específicas para el test C18
  const capabilities = {
    ...baseCapabilities,
    'bstack:options': {
      ...baseCapabilities['bstack:options'],
      'sessionName': 'C18 Login with valid email but wrong password',
    },
  };

  try {
    // Inicializar el navegador con capacidades
    driver = await new Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub') // Configuración del servidor remoto (BrowserStack)
      .withCapabilities(capabilities) // Aplicar capacidades
      .build();

    // Configuración inicial de la ventana y cookies
    await windowConfiguration(driver); // Configurar la URL inicial y maximizar la ventana
    await acceptCookies(driver); // Aceptar cookies si aparece el banner
    await loginLandingPageButton(driver); // Navegar al botón de inicio de sesión

    // Intento de login con credenciales inválidas
    const username = "testingpxc_admin@proton.me";
    const wrongPassword = "1234554";
    await driver.wait(until.elementLocated(By.id("username")), 5000);
    await driver.findElement(By.id("username")).sendKeys(username); // Ingresar usuario
    await driver.findElement(By.id("password")).sendKeys(wrongPassword); // Ingresar contraseña incorrecta
    await driver.findElement(By.id("kc-login")).click(); // Intentar iniciar sesión

    // Verificar mensaje de error
    const feedbackText = await driver.findElement(By.css(".kc-feedback-text")).getText();
    if (feedbackText !== "Invalid username or password.") {
      throw new Error("Expected invalid credentials message not found.");
    }
    console.log("Login failed as expected with invalid credentials.");

    // Verificar correo sobre intento fallido en Proton Mail
    
    
    await loginToProtonMail(driver, mailUsername, mailPassword); // Iniciar sesión en Proton Mail
    await checkFailedLoginEmail(driver); // Verificar correo de intento fallido

    // Eliminar todos los correos (opcional)
    await deleteAllEmails(driver); // Limpiar bandeja de entrada

    // Marcar la sesión como exitosa en BrowserStack
    const passedStatus = JSON.stringify({
      action: "setSessionStatus",
      arguments: {
        status: "passed",
        reason: "C18 test passed successfully.",
      },
    });
    await driver.executeScript(`browserstack_executor: ${passedStatus}`);
  } catch (error) {
    console.error("Error during test execution:", error.message);

    // Marcar la sesión como fallida en BrowserStack
    if (driver) {
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
    }
    throw error;
  } finally {
    // Cerrar el navegador
    if (driver) {
      await driver.quit();
    }
  }
}

// Exportar la función para ser utilizada como test case
module.exports = C18;
