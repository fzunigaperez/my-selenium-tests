const { Builder, By, until } = require('selenium-webdriver');  // Localrun
const testBase = require('./testBase');  // Common
const {
  windowConfiguration,
  logout,
  loginChangeOrgaUserName,
  userMenu,
  accountSettingsMainMenu,
  accountSettingsTab,
  changeInformationButton,
  saveProfileDataButton,
  modalClose,
  resetToOriginalUserNameInRoothOrganization,
  confirmButton,
  loginToProtonMail,
  deleteAllEmails,
  logOutFromProtonMail,
} = require('../utils/sharedFunctions');  // BS

async function C19() {
  try {
    await testBase(
      'C19_C20_C21_C678 Add name and surname to the general information / Confirm email change in profile settings / Edit name and surname to the general information / Email change should not be possible if the email is already registered in proficloud',
      async (driver) => {
        let vars = {};

        // Initial Configuration and Login
        await windowConfiguration(driver);
        await loginChangeOrgaUserName(driver, vars, until);
        await resetToOriginalUserNameInRoothOrganization(driver, vars);

        // Navigate to User Settings
        await userMenu(driver, vars);
        await accountSettingsMainMenu(driver);
        await accountSettingsTab(driver);

        // C19: Add Name and Surname
        vars["Name"] = "Fercho";
        vars["Surname"] = "Tester";

        await changeInformationButton(driver);
        await driver.sleep(1000);

        // Edit Name and Surname Fields
        await driver.wait(until.elementLocated(By.xpath("//input[contains(@placeholder,'First name')]")), 30000);
        await driver.findElement(By.xpath("//input[contains(@placeholder,'First name')]")).clear();
        await driver.findElement(By.xpath("//input[contains(@placeholder,'First name')]")).sendKeys(vars["Name"]);
        await driver.findElement(By.xpath("//input[contains(@placeholder,'Last name')]")).clear();
        await driver.findElement(By.xpath("//input[contains(@placeholder,'Last name')]")).sendKeys(vars["Surname"]);

        await saveProfileDataButton(driver);

        // Verify Success Message
        await driver.sleep(3000);
        await driver.wait(
          until.elementTextIs(
            driver.findElement(By.xpath('//pc-overlay/div/div[2]/div/div[2]/div')),
            "Your profile has been successfully updated."
          ),
          5000
        );
        console.log("El texto esperado está presente!");
        await modalClose(driver, until);

        // Confirm Name and Surname Update
        await driver.wait(
          until.elementTextIs(
            driver.findElement(By.xpath("//flex-col/div/div[2]/div[2]")),
            "Fercho Tester"
          ),
          5000
        );

        // C21: Reset Name and Surname
        await resetToOriginalUserNameInRoothOrganization(driver, vars);
        await driver.sleep(1000);

        // C678: Email Change Validation
        vars["originalEmail"] = await driver.findElement(By.xpath("//div[3]/div[2]")).getText();
        console.log(`The original user Email is: ${vars["originalEmail"]}`);

        await changeInformationButton(driver);
        await driver.findElement(By.xpath("//input[@placeholder='Email']")).clear();
        await driver.findElement(By.xpath("//input[@placeholder='Email']")).sendKeys("testingpxc_viewer@proton.me");
        await saveProfileDataButton(driver);
        await driver.sleep(2000);
        await confirmButton(driver);
        await driver.sleep(2000);

        // Verify Email Update Error Message
        await driver.wait(
          until.elementTextIs(
            driver.findElement(By.xpath("//span[contains(.,'The user profile data could not be updated.')]")),
            "The user profile data could not be updated."
          ),
          5000
        );

        // Close Modal
        await driver.wait(
          until.elementLocated(
            By.xpath("/html/body/app-root/div/div/div/pc-status-overlay/pc-overlay/div/div[2]/div/div/app-icon/*[name()='svg']/*[name()='g']/*[name()='path']")
          ),
          10000
        ).click();
        await modalClose(driver, until);

        // C20: Confirm Email Change in Profile Settings
        await changeInformationButton(driver);
        vars["emailChanged"] = "testing_email_change@proton.me";

        await driver.findElement(By.xpath("//input[@placeholder='Email']")).clear();
        await driver.findElement(By.xpath("//input[@placeholder='Email']")).sendKeys(vars["emailChanged"]);
        await saveProfileDataButton(driver);
        await driver.sleep(2000);
        await confirmButton(driver);

        // Confirm Email in ProtonMail
        await driver.sleep(10000);
        await loginToProtonMail(driver, vars);

        // Filter and Select Verification Email
        await driver.wait(until.elementLocated(By.css(".active .text-ellipsis")), 30000);
        await driver.wait(until.elementLocated(By.xpath("//input[@data-testid='search-keyword']")), 30000).click();
        await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'More search options')]")), 30000).click();
        await driver.wait(until.elementLocated(By.id("address")), 30000).click();
        await driver.wait(
          until.elementLocated(By.xpath("//li[@class='dropdown-item'][contains(.,'testing_email_change@proton.me')]")),
          30000
        ).click();
        await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Search')]")), 30000).click();
        await driver.wait(
          until.elementLocated(By.xpath("//span[contains(.,'You have requested an email change for Proficloud.io')]")),
          30000
        ).click();

        // Confirm Email Change via Link
        await driver.sleep(2000);
        const iframe = await driver.wait(until.elementLocated(By.css('iframe')), 10000);
        await driver.switchTo().frame(iframe);
        await driver.wait(until.elementLocated(By.css("a > div")), 10000).click();

        // Switch to Latest Window
        const windowHandles = await driver.getAllWindowHandles();
        const latestWindow = windowHandles[windowHandles.length - 1];
        await driver.switchTo().window(latestWindow);

        await driver.sleep(2000);
        await driver.wait(until.elementLocated(By.xpath("//button")), 10000).click();

        // Log In with Updated Email
        await driver.wait(until.elementLocated(By.id("username")), 50000);
        await driver.findElement(By.id("username")).sendKeys(vars["emailChanged"]);
        await driver.findElement(By.id("password")).sendKeys(vars["password"]);
        await driver.findElement(By.id("kc-login")).click();

        await userMenu(driver, vars);
        await accountSettingsMainMenu(driver);
        await accountSettingsTab(driver);
        await driver.wait(
          until.elementLocated(By.xpath("//div[normalize-space()='testing_email_change@proton.me']")),
          10000
        );

        // Logout and Cleanup
        await logout(driver);
        await windowConfiguration(driver);
        await loginChangeOrgaUserName(driver, vars, until);
        await loginToProtonMail(driver, vars);
        await deleteAllEmails(driver, vars);
        await logOutFromProtonMail(driver);
      }
    );
  } catch (error) {
    throw new Error(`C19 failed: ${error.message}`);
  }
}

module.exports = C19;

if (require.main === module) {
  (async () => {
    try {
      console.log(`🚀 Ejecutando el test`);
      await C19();  // Change here the test name
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
    }
  })();
}
