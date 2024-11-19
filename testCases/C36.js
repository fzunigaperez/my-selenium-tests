const { Builder, By, until } = require('selenium-webdriver'); // Importación completa
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const {
  windowConfiguration,
  acceptCookies,
  loginLandingPageButton,
  logout,
} = require('../utils/sharedFunctions'); // Importación de funciones reutilizables

async function C36() {
  let driver;
  let vars = {};

  const capabilities = {
    ...baseCapabilities,
    'bstack:options': {
      ...baseCapabilities['bstack:options'],
      'sessionName': 'C36 Login with wrong credentials (10 wrong attempts)',
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
    await loginLandingPageButton(driver);

    // Realizar 10 intentos fallidos
    const wrongCredentials = { username: "ferchoalejandro86@gmail.com", password: "wwqrewrewewr" };
    console.log(`Testing with wrong credentials: ${JSON.stringify(wrongCredentials)}`);

    for (let i = 0; i < 10; i++) {
      console.log(`Attempt ${i + 1} of 10`);
      await loginWithCredentials(driver, wrongCredentials.username, wrongCredentials.password);
      const feedbackText = await driver.findElement(By.css(".kc-feedback-text")).getText();
      if (feedbackText !== "Invalid username or password.") {
        throw new Error(`Unexpected error message on attempt ${i + 1}: ${feedbackText}`);
      }
      console.log(`Attempt ${i + 1} failed as expected.`);
      await driver.sleep(3000);
    }

    // Intento con credenciales válidas pero bloqueadas
    //console.log("Testing with valid credentials but locked account...");
    //await loginWithCredentials(driver, "ferchoalejandro86@gmail.com", "Proficloud2020!");
    //const feedbackLocked = await driver.findElement(By.css(".kc-feedback-text")).getText();
    //if (feedbackLocked !== "Invalid username or password.") {
      //throw new Error(`Unexpected error message for locked account: ${feedbackLocked}`);
    //}

    console.log("Waiting for account lock to expire...");
    await driver.sleep(65000); // Simula el desbloqueo después de esperar

    // Intento con credenciales válidas
    console.log("Testing with valid credentials...");
    await loginWithCredentials(driver, "ferchoalejandro86@gmail.com", "Proficloud2020!");
    const routeTitle = await driver.findElement(By.id("routeTitle")).getText();
    if (routeTitle !== "Device Management Service") {
      throw new Error(`Unexpected route title: ${routeTitle}`);
    }
    console.log("Successfully logged in with valid credentials.");

    // Cierre de sesión
    await logout(driver);

    // Marca la sesión como exitosa
    const passedStatus = JSON.stringify({
      action: "setSessionStatus",
      arguments: {
        status: "passed",
        reason: "C36 test passed successfully",
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

// Función para iniciar sesión con credenciales específicas
async function loginWithCredentials(driver, username, password) {
  await driver.findElement(By.id("username")).clear();
  await driver.findElement(By.id("username")).sendKeys(username);
  await driver.findElement(By.id("password")).clear();
  await driver.findElement(By.id("password")).sendKeys(password);
  await driver.findElement(By.id("kc-login")).click();
  await driver.sleep(2000);
}

module.exports = C36;
