const { Builder, By, until } = require('selenium-webdriver');
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));

async function C90() {
  let driver;
  let vars = {};

  // Clona las capacidades y agrega el sessionName dinámicamente
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
      // Add logic here if needed
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
      await driver.wait(until.elementLocated(By.xpath("//div[@id='proficloud-user-iconxxx']")), 30000);
      await driver.findElement(By.xpath("//div[@id='proficloud-user-icon']")).click();
    }

    await windowConfiguration();
    await loginAdmin();
    await logout();

    // Marcar la sesión como exitosa solo si todo pasa
    const passedStatus = JSON.stringify({
      action: "setSessionStatus",
      arguments: {
        status: "passed",
        reason: "C90 test passed successfully",
      },
    });
    await driver.executeScript(`browserstack_executor: ${passedStatus}`);

  } catch (error) {
    console.error('Error during test execution:', error.message);

    // Marcar la sesión como fallida en caso de error
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

module.exports = C90;
