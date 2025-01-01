const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const testBase = require('./testBase'); // Common logic for test execution
const {
  windowConfiguration,
  loginAdmin,
  userManagementMenu,
  removeRegisteredUserNew,
  countElementsByXPath,
  inviteMemberButton,
  inviteMemberButton2,
  roleSelectionDropDownMenu,
  removeOldMemberInvitationsRoothOrga,
  roothOrganizationTest,
  modalClose,
  loginRegisteredUser,
  logout,
  loginToProtonMail,
  clickFirstMail,
  deleteAllEmails,
  logOutFromProtonMail,
  waitingLoadingRingProficloudToDissapear,
  assertText,
  changeFrameAndClickonProficloudEmail,
} = require('../utils/sharedFunctions'); // Import reusable functions

async function C714() {
  try {
    await testBase(
      'C714 After deleting user invitation the invitation link should not be valid anymore NEW',
      async (driver) => {
        let vars = {}; // Initialize variables

        // Step 1: Configure window and log in as Admin
        await windowConfiguration(driver);
        await loginAdmin(driver, vars);

        // Step 2: Check for extra users in the organization and remove if found
        const extraUserInOrganization = await countElementsByXPath(
          driver,
          "//div[contains(text(),'Registered Zuser in Proficloud')]"
        );

        if (extraUserInOrganization > 0) {
          console.log('An extra user in the organization was found.');
          await removeRegisteredUserNew(driver, vars);
          await userManagementMenu(driver);
          await roothOrganizationTest(driver, vars);
        } else {
          console.log('No extra user in the organization.');
        }

        // Step 3: Remove old member invitations
        await removeOldMemberInvitationsRoothOrga(driver, vars);

        // Step 4: Invite a new member
        vars['username'] = 'testingpxc@proton.me';
        vars['role'] = 'Viewer';
        await inviteMemberButton(driver);
        await driver.findElement(By.xpath("//input[@placeholder='Email']")).clear();
        await driver.findElement(By.xpath("//input[@placeholder='Email']")).sendKeys(vars['username']);
        await roleSelectionDropDownMenu(driver);
        await driver.findElement(By.xpath("//span[contains(.,'Viewer')]")).click();
        await inviteMemberButton2(driver);
        await waitingLoadingRingProficloudToDissapear(driver);

        // Step 5: Remove the new invitation
        await removeOldMemberInvitationsRoothOrga(driver, vars);

        // Step 6: Logout from Proficloud
        await logout(driver);

        // Step 7: Validate the invitation link is invalid
        await loginToProtonMail(driver, vars);
        await clickFirstMail(driver);
        await changeFrameAndClickonProficloudEmail(driver);

        // Attempt login with the invitation link
        
        await loginRegisteredUser(driver, vars, true);
        await driver.sleep(10000);

        // Assert the invitation is invalid
        await assertText(
          driver,
          'css',    
          '.pc-status-overlay__message',
          'There was a problem accepting the invitation.'
        );
        await modalClose(driver);

        // Step 8: Clean up emails and logout from ProtonMail
        await logout(driver);
        await loginToProtonMail(driver, vars);
        await deleteAllEmails(driver);
        await logOutFromProtonMail(driver);
      }
    );
  } catch (error) {
    throw new Error(`C714 failed: ${error.message}`);
  }
}

// Allow direct execution of this file
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running the test C714...');
      await C714();
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Error running the test:', error.message);
    }
  })();
}

module.exports = C714;