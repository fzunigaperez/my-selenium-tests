const { Builder, By, until } = require('selenium-webdriver');

// Importa las capacidades desde capabilities.js
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));

async function C90() {
  let driver;
  let vars = {};

  const capabilities = {
    ...baseCapabilities,
    'bstack:options': {
      ...baseCapabilities['bstack:options'],
      'sessionName': 'C90 Log out successfully',
    },
  };

  try {
    driver = await new Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub')
      .forBrowser('chrome')
      .withCapabilities(capabilities)
      .build();

    // Configuración inicial
    await driver.get("https://proficloud.io/testrun");
    await driver.manage().window().maximize();

    // Funciones de prueba
    await loginAdmin(driver, vars);
    await logout(driver);

    // Si todo pasa, marca la sesión como exitosa
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "C90 test passed successfully"}}'
    );

  } catch (error) {
    console.error('Error during test execution:', error.message);

    // Marca la sesión como fallida y registra la razón
    try {
      await driver.executeScript(
        `browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Test failed: ${error.message}"}}`
      );
    } catch (executorError) {
      console.error('Error setting BrowserStack session status:', executorError.message);
    }

    // Relanzar el error para que el pipeline CI lo registre como fallo
    throw error;

  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

// Función para login
async function loginAdmin(driver, vars) {
  try {
    await driver.sleep(1000);
    await driver.findElement(By.id("login-button")).click();
    vars["username"] = "testingpxc_admin@proton.me";
    vars["password"] = "Proficloud2022!";
    console.log(vars["username"], vars["password"]);

    await driver.wait(until.elementLocated(By.id("username")), 5000);
    await driver.findElement(By.id("username")).sendKeys(vars["username"]);
    await driver.findElement(By.id("password")).sendKeys(vars["password"]);
    await driver.findElement(By.id("kc-login")).click();
    await driver.sleep(1000);

  } catch (e) {
    console.error('Error during loginAdmin:', e.message);
    throw e; // Relanzar para manejo global
  }
}

// Función para logout
async function logout(driver) {
  try {
    await driver.wait(until.elementLocated(By.xpath("//div[@id='proficloud-user-icon']")), 5000);
    await driver.findElement(By.xpath("//div[@id='proficloud-user-icon']")).click();
    await driver
      .findElement(By.xpath("//div[@class='profile-menu_icon-text__text'][contains(.,'Logout')]"))
      .click();
    await driver.sleep(1000);

  } catch (e) {
    console.error('Error during logout:', e.message);
    throw e; // Relanzar para manejo global
  }
}

module.exports = C90;
