const { By, until } = require('selenium-webdriver');

async function acceptCookies(driver) {
  const cookiesButton = await driver.findElements(By.id("ga-opt-out-true"));
  if (cookiesButton.length > 0) {
    await cookiesButton[0].click();
    console.log('Cookies accepted.');
  } else {
    console.log('Accept cookies button not found.');
  }
}

async function loginLandingPageButton(driver) {
  await driver.findElement(By.id("login-button")).click();
}

async function adminCredentials(driver, vars) {
  vars["username"] = "testingpxc_admin@proton.me";
  vars["password"] = "Proficloud2022!";
  console.log(vars["username"]);
  console.log(vars["password"]);
}

async function isTheOrganizationNameEmpty(driver, vars) {
  vars["emptyName"] = await driver.findElement(By.xpath("//h4")).getText();
  console.log(`Orga name at the moment: ${vars["emptyName"]}`);
  if (vars["emptyName"] === "" || vars["emptyName"] === undefined) {
    console.log("ORGA NAME IS NOT PRESENT!! Reload and wait");
    await driver.sleep(2000);
  }
}

async function rootOrganizationTest(driver, vars) {
  await driver.sleep(1000);
  vars["root"] = await driver.findElements(By.xpath("//h4[contains(.,'Rooth Organization')]")).length;
  if (vars["root"] > 0) {
    console.log("We have started in the right organization :) ");
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
};
