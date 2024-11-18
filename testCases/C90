const { Builder, By, until } = require('selenium-webdriver');
const browserstack = require('browserstack-local');

// Configuración de capacidades para BrowserStack
const capabilities = {
  'bstack:options': {
    'os': 'Windows',
    'osVersion': '10',
    'local': 'false',
    'seleniumVersion': '3.141.59',
    'userName': process.env.BROWSERSTACK_USERNAME, // Credenciales del entorno
    'accessKey': process.env.BROWSERSTACK_ACCESS_KEY, // Credenciales del entorno
    'sessionName': 'C90 Log out successfully',
  },
  'browserName': 'Chrome',
  'browserVersion': 'latest',
};

describe('C90 Log out successfully', function () {
  this.timeout(30000);
  let driver;
  let vars;

  beforeEach(async function () {
    driver = await new Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub') // URL de BrowserStack
      .forBrowser('chrome') // Especifica el navegador
      .withCapabilities(capabilities)
      .build();
    vars = {};
  });

  afterEach(async function () {
    await driver.quit();
  });

  async function windowConfiguration() {
    await driver.get("https://proficloud.io/testrun");
  }

  async function loginAdmin() {
    await acceptCookies();
    await driver.sleep(1000);
    await acceptCookies();
    await loginLandingPageButton();
    await adminCredentials();
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.id("username")), 50000);
    await driver.findElement(By.id("username")).sendKeys(vars["username"]);
    await driver.findElement(By.id("password")).sendKeys(vars["password"]);
    await driver.findElement(By.id("kc-login")).click();
    await driver.sleep(1000);
    await waitForPageToLoad();
    await isTheOrganizationNameEmpty();
    await rootOrganizationTest();
    assert.strictEqual(
      await driver.findElement(By.xpath("//div[@id='routeTitle']")).getText(),
      "Device Management Service"
    );
  }

  async function acceptCookies() {
    let aceptarCookiesButton = await driver.findElements(By.id("ga-opt-out-true"));
    if (aceptarCookiesButton.length > 0) {
      await aceptarCookiesButton[0].click();
      console.log('Cookies accepted.');
    } else {
      console.log('Accept cookies button not found.');
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

  async function waitForPageToLoad() {
    // Agrega lógica adicional si es necesario
  }

  async function isTheOrganizationNameEmpty() {
    vars["emptyName"] = await driver.findElement(By.xpath("//h4")).getText();
    console.log(`Orga name at the moment: ${vars["emptyName"]}`);
    if (vars["emptyName"] === "" || vars["emptyName"] === undefined) {
      console.log("ORGA NAME IS NOT PRESENT!! Reload and wait");
      await driver.sleep(2000);
    }
  }

  async function rootOrganizationTest() {
    await driver.sleep(1000);
    vars["root"] = await driver.findElements(By.xpath("//h4[contains(.,'Rooth Organization')]")).length;
    if (vars["root"] > 0) {
      console.log("We have started in the right organization :) ");
    } else {
      await switchToOriginalOrganization();
    }
  }

  async function switchToOriginalOrganization() {
    await activeOrganization();
    await driver.sleep(1000);
    await driver
      .findElement(By.xpath("//div[@class='profile-menu_icon-text__text'][contains(.,'Rooth Organization')]"))
      .click();
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.id("routeTitle")), 30000);
  }

  async function activeOrganization() {
    await driver.findElement(By.xpath("//div[@id='active-organization']/h4")).click();
  }

  async function logout() {
    await userMenu();
    await driver
      .findElement(By.xpath("//div[@class='profile-menu_icon-text__text'][contains(.,'Logout')]"))
      .click();
    await driver.sleep(1000);
  }

  async function userMenu() {
    await driver.wait(until.elementLocated(By.xpath("//div[@id='proficloud-user-icon']")), 30000);
    await driver.findElement(By.xpath("//div[@id='proficloud-user-icon']")).click();
  }

  it('C90 Log out successfully', async function () {
    await windowConfiguration();
    await driver.executeScript("console.log('C90 Log out successfully');");
    await loginAdmin();
    await logout();
  });
});
