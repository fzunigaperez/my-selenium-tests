const { Builder, By, until } = require('selenium-webdriver');
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));

async function C90() {
  let driver;
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
      .withCapabilities(capabilities)
      .build();

    await driver.get("https://proficloud.io/testrun");
    await driver.manage().window().maximize();

    await loginAdmin(driver);
    await logout(driver);

    await driver.executeScript(
      'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "C90 test passed successfully"}}'
    );

  } catch (error) {
    console.error('Error during test execution:', error.message);

    if (driver) {
      try {
        await driver.executeScript(
          `browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Test failed: ${error.message}"}}`
        );
      } catch (executorError) {
        console.error('Error setting BrowserStack session status:', executorError.message);
      } finally {
        await driver.quit();
      }
    }
    throw error;
  }
}

async function loginAdmin(driver) {
  try {
    await driver.sleep(1000);
    await driver.findElement(By.id("login-button")).click();
    const username = "testingpxc_admin@proton.me";
    const password = "Proficloud2022!";
    await driver.wait(until.elementLocated(By.id("username")), 5000);
    await driver.findElement(By.id("username")).sendKeys(username);
    await driver.findElement(By.id("password")).sendKeys(password);
    await driver.findElement(By.id("kc-login")).click();
    await driver.sleep(1000);
  } catch (e) {
    console.error('Error during loginAdmin:', e.message);
    throw e;
  }
}

async function logout(driver) {
  try {
    await driver.wait(until.elementLocated(By.xpath("//div[@id='proficloud-user-icon']")), 5000);
    await driver.findElement(By.xpath("//div[@id='proficloud-user-icon']")).click();
    await driver.findElement(By.xpath("//div[@class='profile-menu_icon-text__text'][contains(.,'Logout')]")).click();
    await driver.sleep(1000);
  } catch (e) {
    console.error('Error during logout:', e.message);
    throw e;
  }
}

module.exports = C90;
