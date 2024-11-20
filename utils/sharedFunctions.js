const { By, until } = require('selenium-webdriver');

async function acceptCookies(driver) {
  try {
    const cookiesXPath = "//h2[normalize-space()='This website uses cookies']";
    const acceptButtonXPath = "//button[@id='ga-opt-out-false']";

    // Esperar un máximo de 3 segundos para el banner de cookies
    const cookiesBanner = await driver.wait(until.elementLocated(By.xpath(cookiesXPath)), 3000);

    if (cookiesBanner) {
      console.log("Cookies banner detected.");
      const acceptButton = await driver.wait(until.elementLocated(By.xpath(acceptButtonXPath)), 3000);
      await acceptButton.click();
      console.log("Cookies accepted.");
    }
  } catch (error) {
    console.error("Cookies banner not found or timed out:", error.message);
  }
}



async function loginLandingPageButton(driver) {
  await driver.findElement(By.id("login-button")).click();
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

async function loginEditor(driver, vars) {
  await acceptCookies(driver);
  await loginLandingPageButton(driver);
  vars["username"] = "testingpxc_editor@proton.me";
  vars["password"] = "Proficloud2022!";
  console.log("Credentials set for EDITOR:", vars);

  // Log in
  await driver.wait(until.elementLocated(By.id("username")), 5000);
  await driver.findElement(By.id("username")).sendKeys(vars["username"]);
  await driver.findElement(By.id("password")).sendKeys(vars["password"]);
  await driver.findElement(By.id("kc-login")).click();

  // Wait for page to load
  await driver.sleep(10000);
  await isTheOrganizationNameEmpty(driver, vars);

  // Assert the correct page is loaded
  const pageTitle = await driver.findElement(By.xpath("//div[@id='routeTitle']")).getText();
  assert.strictEqual(pageTitle, "Device Management Service");

  // Check if in the right organization
  await rootOrganizationTest(driver, vars);
}

async function loginViewer(driver, vars) {
  await acceptCookies(driver);
  await loginLandingPageButton(driver);
  vars["username"] = "testingpxc_viewer@proton.me";
  vars["password"] = "Proficloud2022!";
  console.log("Credentials set for VIEWER:", vars);

  // Log in
  await driver.wait(until.elementLocated(By.id("username")), 5000);
  await driver.findElement(By.id("username")).sendKeys(vars["username"]);
  await driver.findElement(By.id("password")).sendKeys(vars["password"]);
  await driver.findElement(By.id("kc-login")).click();

  // Wait for page to load
  await driver.sleep(10000);
  await isTheOrganizationNameEmpty(driver, vars);

  // Assert the correct page is loaded
  const pageTitle = await driver.findElement(By.xpath("//div[@id='routeTitle']")).getText();
  assert.strictEqual(pageTitle, "Device Management Service");

  // Check if in the right organization
  await rootOrganizationTest(driver, vars);

}
  

  async function loginToProtonMail(driver, vars) {
    await driver.get("https://account.proton.me/login");
       
    vars["mailUsername"] = "testingpxc_viewer@proton.me";
    vars["mailPassword"] = "Proficloud2022!";
  
    const loggedIn = (await driver.findElements(By.xpath("//button[contains(text(),'New message')]"))).length > 0;
    if (!loggedIn) {
      console.log("Logging into Proton Mail...");
      
      await driver.wait(until.elementLocated(By.id("username")), 50000);
      await driver.findElement(By.id("username")).sendKeys(vars["mailUsername"]);
      await driver.findElement(By.id("password")).sendKeys(vars["mailPassword"]);
      await driver.findElement(By.xpath("//button[contains(text(),'Sign in')]")).click();
      await driver.sleep(5000);
    } else {
      console.log("Already logged into Proton Mail.");
    }
  }
  
  async function checkFailedLoginEmail(driver) {
    await driver.wait(until.elementLocated(By.css(".message-conversation-summary-header > span")), 10000);
    const emailSubject = await driver.findElement(By.css(".message-conversation-summary-header > span")).getText();
    if (emailSubject !== "Failed login attempt detected") {
      throw new Error("Failed login email not found in Proton Mail.");
    }
    console.log("Failed login email detected as expected.");
  }
  
  async function deleteAllEmails(driver) {
    console.log("Deleting all mails...");
    await driver.findElement(By.xpath("//span[contains(text(),'All mail')]")).click();
    await driver.sleep(2000);
    await driver.findElement(By.id("idSelectAll")).click();
    await driver.findElement(By.xpath("//button[contains(text(),'Move to trash')]")).click();
    await driver.sleep(2000);
    console.log("All mails moved to trash.");
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
  loginEditor,
  loginViewer,
  loginToProtonMail,
  checkFailedLoginEmail,
  deleteAllEmails,
};