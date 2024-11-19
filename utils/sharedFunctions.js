const { By, until } = require('selenium-webdriver');

async function acceptCookies(driver) {
  const cookiesBanner = await driver.findElements(By.xpath("//h2[normalize-space()='This website uses cookies']"));
  if (cookiesBanner.length > 0) {
    console.log("Cookies banner detected.");
    await driver.findElement(By.xpath("//button[@id='ga-opt-out-false']")).click();
    console.log("Cookies accepted.");
  } else {
    console.log("No cookies banner found.");
  }
}

async function loginLandingPageButton(driver) {
  try {
    // Wait until the button is visible and enabled
    await driver.wait(until.elementLocated(By.id("login-button")), 10000);
    const loginButton = await driver.findElement(By.id("login-button"));
    await driver.wait(until.elementIsVisible(loginButton), 5000);
    await driver.wait(until.elementIsEnabled(loginButton), 5000);

    // Ensure it's in the viewport
    await driver.executeScript("arguments[0].scrollIntoView(true);", loginButton);

    // Click the button
    await loginButton.click();
    console.log("Login button clicked successfully.");
  } catch (error) {
    console.error("Error interacting with login button:", error);
    throw error; // Rethrow to handle it in the calling function
  }
}


async function adminCredentials(driver, vars) {
  vars["username"] = "testingpxc_admin@proton.me";
  vars["password"] = "Proficloud2022!";
  console.log("Credentials set:", vars);
}

async function isTheOrganizationNameEmpty(driver, vars) {
  vars["emptyName"] = await driver.findElement(By.xpath("//h4")).getText();
  console.log(`Orga name: ${vars["emptyName"]}`);
  if (vars["emptyName"] === "" || vars["emptyName"] === undefined) {
    console.log("ORGA NAME IS NOT PRESENT. Reloading...");
    await driver.sleep(2000);
  }
}

async function rootOrganizationTest(driver, vars) {
  vars["root"] = await driver.findElements(By.xpath("//h4[contains(.,'Rooth Organization')]")).length;
  if (vars["root"] > 0) {
    console.log("We are in the right organization.");
  } else {
    await switchToOriginalOrganization(driver);
  }
}

async function switchToOriginalOrganization(driver) {
  await activeOrganization(driver);
  await driver.sleep(1000);
  await driver
    .findElement(By.xpath("//div[@class='profile-menu_icon-text__text'][contains(.,'Rooth Organization')]"))
    .click();
  await driver.sleep(1000);
  await driver.wait(until.elementLocated(By.id("routeTitle")), 30000);
}

async function activeOrganization(driver) {
  await driver.findElement(By.xpath("//div[@id='active-organization']/h4")).click();
}

async function logout(driver) {
  await userMenu(driver);
  await driver
    .findElement(By.xpath("//div[@class='profile-menu_icon-text__text'][contains(.,'Logout')]"))
    .click();
  await driver.sleep(1000);
}

async function userMenu(driver) {
  await driver.wait(until.elementLocated(By.xpath("//div[@id='proficloud-user-icon']")), 30000);
  await driver.findElement(By.xpath("//div[@id='proficloud-user-icon']")).click();
}

async function windowConfiguration(driver) {
  await driver.get("https://proficloud.io/testrun");
  await driver.manage().window().maximize();
}

async function loginAdmin(driver, vars) {
  await acceptCookies(driver);
  await driver.sleep(1000);
  await acceptCookies(driver);
  await loginLandingPageButton(driver);
  await adminCredentials(driver, vars);
  await driver.sleep(1000);
  await driver.wait(until.elementLocated(By.id("username")), 50000);
  await driver.findElement(By.id("username")).sendKeys(vars["username"]);
  await driver.findElement(By.id("password")).sendKeys(vars["password"]);
  await driver.findElement(By.id("kc-login")).click();
  await driver.sleep(1000);
  await isTheOrganizationNameEmpty(driver, vars);
  await rootOrganizationTest(driver, vars);
}

module.exports = {
  acceptCookies,
  loginLandingPageButton,
  adminCredentials,
  isTheOrganizationNameEmpty,
  rootOrganizationTest,
  switchToOriginalOrganization,
  activeOrganization,
  logout,
  userMenu,
  windowConfiguration,
  loginAdmin,
};