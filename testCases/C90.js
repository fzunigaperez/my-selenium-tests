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

    async function windowConfiguration() {
      await driver.get("https://proficloud.io/testrun");
      await driver.manage().window().maximize();
    }

    async function loginAdmin() {
      try {
        await driver.sleep(1000);
        await loginLandingPageButton();
        await adminCredentials();
        await driver.sleep(1000);
        await driver.wait(until.elementLocated(By.id("username")), 5000);
        await driver.findElement(By.id("username")).sendKeys(vars["username"]);
        await driver.findElement(By.id("password")).sendKeys(vars["password"]);
        await driver.findElement(By.id("kc-login")).click();
        await driver.sleep(1000);
      } catch (e) {
        console.error('Error during loginAdmin:', e.message);
        throw e; // Relanzar el error para que sea capturado globalmente
      }
    }

    async function loginLandingPageButton() {
      await driver.findElement(By.id("login-button")).click();
    }

    async function adminCredentials() {
      vars["username"] = "testingpxc_admin@proton.me";
      vars["password"] = "Proficloud2022!";
      console.log(vars["username"]);
      console.log(vars["password"]);
    }

    async function logout() {
      try {
        await userMenu();
        await driver
          .findElement(By.xpath("//div[@class='profile-menu_icon-text__text'][contains(.,'Logout')]"))
          .click();
        await driver.sleep(1000);
      } catch (e) {
        console.error('Error during logout:', e.message);
        throw e; // Relanzar el error
      }
    }

    async function userMenu() {
      await driver.wait(until.elementLocated(By.xpath("//div[@id='proficloud-user-icon']")), 30000);
      await driver.findElement(By.xpath("//div[@id='proficloud-user-icon']")).click();
    }

    await windowConfiguration();
    await loginAdmin();
    await logout();

    // Marcar la sesión como exitosa solo si no hay errores
    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "C90 test passed successfully"}}'
    );

  } catch (error) {
    console.error('Error during test execution:', error.message);

    // Marcar la sesión como fallida en caso de error
    try {
      await driver.executeScript(
        `browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Test failed: ${error.message}"}}`
      );
    } catch (e) {
      console.error('Error setting BrowserStack session status:', e.message);
    }

    throw error; // Relanzar el error para que el pipeline registre el fallo
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

module.exports = C90;
