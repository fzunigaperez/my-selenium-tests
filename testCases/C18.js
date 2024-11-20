const { Builder } = require('selenium-webdriver');
const {
  acceptCookies,
  windowConfiguration,
  loginLandingPageButton,
  loginToProtonMail,
  checkFailedLoginEmail,
  deleteAllEmails,
} = require('../utils/sharedFunctions');
const baseCapabilities = require('../capabilities/capabilities'); // Asegúrate de que esta ruta sea correcta

async function C18() {
  let driver;
  let vars = {};

  // Definir capacidades
  const capabilities = {
    ...baseCapabilities,
    'bstack:options': {
      ...baseCapabilities['bstack:options'],
      sessionName: 'C18 Login with valid email but wrong password',
    },
  };

  try {
    // Inicializar el navegador con capacidades
    driver = await new Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub') // Configuración del servidor remoto (BrowserStack)
      .withCapabilities(capabilities) // Aplicar capacidades
      .build();

    // Configuración inicial de la ventana
    await windowConfiguration(driver); // Configura la URL inicial y maximiza la ventana
    await acceptCookies(driver); // Acepta el banner de cookies si está presente
    await loginLandingPageButton(driver); // Navega al botón de inicio de sesión y hace clic

    // Intento de login con credenciales inválidas
    const username = "testingpxc_admin@proton.me"; // Usuario
    const wrongPassword = "1234554"; // Contraseña incorrecta
    await driver.findElement(By.id("username")).sendKeys(username); // Ingresa el correo
    await driver.findElement(By.id("password")).sendKeys(wrongPassword); // Ingresa la contraseña incorrecta
    await driver.findElement(By.id("kc-login")).click(); // Hace clic en el botón de login

    // Verificar mensaje de error de inicio de sesión
    const feedbackText = await driver.findElement(By.css(".kc-feedback-text")).getText();
    if (feedbackText !== "Invalid username or password.") {
      throw new Error("Expected invalid credentials message not found.");
    }
    console.log("Login failed as expected with invalid credentials.");

    // Verificar intento fallido de inicio de sesión en Proton Mail
    const mailUsername = "testingpxc_admin@proton.me"; // Usuario de Proton Mail
    const mailPassword = "Proficloud2022!"; // Contraseña de Proton Mail
    await loginToProtonMail(driver, mailUsername, mailPassword); // Llama a la función de inicio de sesión en Proton Mail
    await checkFailedLoginEmail(driver); // Verifica el correo de intento fallido en Proton Mail

    // Eliminar todos los correos (opcional)
    await deleteAllEmails(driver); // Llama a la función para eliminar todos los correos electrónicos

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

// Exportar la función para ser utilizada como un test case
module.exports = C18;
