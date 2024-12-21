const { Builder, By, until } = require('selenium-webdriver'); // Complete import
const path = require('path');
const assert = require('assert');
const testBase = require('./testBase'); // Common logic for test execution
const {
  windowConfiguration,
  deleteUnregisteredUserInCaseOfExistence,
  loginFerchoAlejandro86,
  userManagementMenu,
  arrowSortByButton,
  lastNameButton,
  countElementsByXPath,
  unregisteredUserCredentials,
  inviteMemberButton,
  inviteMemberButton2,
  roleSelectionDropDownMenu,
  waitingLoadingRingProficloudToDissapear,
  assertText,
  modalClose,
  removeMemberButton,
  getTextByLocator,
  removeMemberButton2,
  logout,
  agreeTerms,
  loginToProtonMail,
  clickFirstMail,
  loginAsUnregisteredUserAndDeleteAccount,
  deleteAllEmails,
  logOutFromProtonMail,
} = require('../utils/sharedFunctions'); // Import reusable functions

async function C608() {
  try {
    await testBase(
      'C608_Invite a user to an organization that is not registered in proficloud and is not part of the same company',
      async (driver) => {
        let vars = {};

        // Configure the window and delete unregistered user if exists
        await windowConfiguration(driver);
        await deleteUnregisteredUserInCaseOfExistence(driver, vars);

        // Log in as 'FerchoAlejandro86'
        await loginFerchoAlejandro86(driver, vars);
        await userManagementMenu(driver);
        await arrowSortByButton(driver);
        await lastNameButton(driver);

        // Wait for the element with the name 'Fernando Admin' to load
        await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'Fernando Admin')]")), 30000);
        await driver.sleep(3000);

        // Check for any extra members in the organization
        let extraMember = await countElementsByXPath(
          driver,
          "/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[1]/app-user-management[1]/div[1]/app-members[1]/flex-col[1]/flex-col[1]/div[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/div[4]/pc-list-item[1]/div[1]/div[1]/div[4]/app-icon[1]/*[name()='svg'][1]"
        );
        console.log('Extra member in the organization found?:', extraMember);

        let retries = 0;
        const maxRetries = 50;

        // Attempt to remove extra member
        while (extraMember > 0 && retries < maxRetries) {
          console.log(`Attempting to remove extra member (Attempt ${retries + 1}/${maxRetries})`);

          try {
            const emailOfExtraMember = await getTextByLocator(
              driver,
              "xpath",
              "//div[4]/pc-list-item/div/div/div/div[2]"
            );

            const protectedEmails = [
              "ferchoalejandro86@gmail.com",
              "testingpxc_viewer@proton.me",
              "testingpxc_editor@proton.me"
            ];

            // Check if the email is protected
            if (protectedEmails.includes(emailOfExtraMember)) {
              console.log("❌ Email is protected. Stopping removal process.");
              return; // Stops the process if email is protected
            }

            // Click to remove the member
            await driver.wait(
              until.elementLocated(
                By.xpath(
                  "/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[1]/app-user-management[1]/div[1]/app-members[1]/flex-col[1]/flex-col[1]/div[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/div[4]/pc-list-item[1]/div[1]/div[1]/div[4]/app-icon[1]/*[name()='svg'][1]"
                )
              ),
              30000
            ).click();

            await removeMemberButton(driver);

            // Clear the email input and enter the email of the extra member
            await driver.wait(until.elementLocated(By.xpath("//input[contains(@placeholder,'email ')]")), 30000);
            await driver.findElement(By.xpath("//input[contains(@placeholder,'email ')]")).clear();
            await driver.findElement(By.xpath("//input[contains(@placeholder,'email ')]")).sendKeys(emailOfExtraMember);

            await removeMemberButton2(driver);
            await waitingLoadingRingProficloudToDissapear(driver);
          } catch (error) {
            console.error(`❌ Error while attempting to remove extra member: ${error.message}`);
          }

          // Recheck if the extra member still exists
          extraMember = await countElementsByXPath(
            driver,
            "/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[1]/app-user-management[1]/div[1]/app-members[1]/flex-col[1]/flex-col[1]/div[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/div[4]/pc-list-item[1]/div[1]/div[1]/div[4]/app-icon[1]/*[name()='svg'][1]"
          );
          console.log('Extra member in the organization found?:', extraMember);

          retries++;
        }

        if (extraMember === 0) {
          console.log("✅ Extra member successfully removed or no action was needed.");
        } else {
          console.log(`❌ Extra member removal failed after ${maxRetries} attempts.`);
        }

        

        await unregisteredUserCredentials(driver, vars);
        await inviteMemberButton(driver);
        await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Email']")), 30000);
        await driver.findElement(By.xpath("//input[@placeholder='Email']")).clear();
        await driver.findElement(By.xpath("//input[@placeholder='Email']")).sendKeys(vars["username"]);
        await roleSelectionDropDownMenu(driver);
        await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Viewer')]")), 30000).click();
        await inviteMemberButton2(driver);
        await driver.sleep(5000);

        // Assert success message
        await assertText(driver, "css", ".pc-status-overlay__message", "We have successfully invited the new member to your organization. For privacy reasons, we are not allowed to send an email to the invitee. Please inform him/her personally.");
        await modalClose(driver);

        // Wait for invitation link and copy it
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'invitation pending')]")), 30000).click();
        const invitationLink = await getTextByLocator(driver, "xpath", "//div[4]/div[2]/div[2]");
        await logout(driver);
        await driver.get(invitationLink);
        await unregisteredUserCredentials(driver, vars);

        // Invited user registration process
        await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Country')]")), 30000);
        await driver.findElement(By.xpath("//span[contains(.,'Country')]")).click();
        await driver.findElement(By.xpath("//span[contains(.,'Spain')]")).click();
        await driver.findElement(By.xpath("//input[@placeholder='First name']")).sendKeys(vars["firstName"]);
        await driver.findElement(By.xpath("//input[@placeholder='Last name']")).sendKeys(vars["lastName"]);
        await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys(vars["password"]);
        await driver.findElement(By.xpath("//input[contains(@placeholder,'Confirm password')]")).sendKeys(vars["password"]);
        await agreeTerms(driver);
        await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Register')]")), 30000).click();

        // Log in to ProtonMail to confirm the registration
        await loginToProtonMail(driver, vars);
        await clickFirstMail(driver);
        await driver.sleep(5000);

        // Switch to the iframe for email verification
        const iframe = await driver.wait(until.elementLocated(By.css('iframe')), 10000);
        await driver.switchTo().frame(iframe);
        await driver.sleep(3000);
        await driver.findElement(By.linkText("Verify E-Mail")).click();
        await driver.sleep(5000);

        // Get all window handles and switch to the latest one
        const windowHandles = await driver.getAllWindowHandles();
        console.log('Window handles:', windowHandles);
        const latestWindow = windowHandles[windowHandles.length - 1]; // Select the last handle
        await driver.switchTo().window(latestWindow);
        console.log('Switched to the latest window.');

        // Final cleanup
        await windowConfiguration(driver);
        await deleteUnregisteredUserInCaseOfExistence(driver, vars);

        await loginToProtonMail(driver, vars);
        await deleteAllEmails(driver);
        await logOutFromProtonMail(driver);
      }
    );
  } catch (error) {
    throw new Error(`C608 failed: ${error.message}`);
  }
}

module.exports = C608;

if (require.main === module) {
  (async () => {
    try {
      console.log(`🚀 Running the test`);
      await C608(); // Change here the test name
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Error running the test:', error.message);
    }
  })();
}
