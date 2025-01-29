const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const testBase = require('./testBase'); // Common logic for test execution
const {
  windowConfiguration,
  loginAdmin,
  userManagementMenu,
  removeRegisteredUserNew,
  countElementsByXPath,
  assertText,
  logout,
  loginToProtonMail,
  clickFirstMail,
  deleteAllEmails,
  logOutFromProtonMail,
  waitingLoadingRingProficloudToDissapear,
  inviteMemberButton,
  inviteMemberButton2,
  roleSelectionDropDownMenu,
  removeOldMemberInvitationsRoothOrga,
  roothOrganizationTest,
  modalClose,
  changeFrameAndClickonProficloudEmail,
  loginRegisteredUser,
  waitForXPathPresentTimeout,
  
} = require('../utils/sharedFunctions'); // Import reusable functions
const { rootCertificates } = require('tls');

async function C613() {
  try {
    await testBase(
      'C613_C610_C882_C871_Invite member to an organization that is already registered to proficloud as ADMIN / Remove member from orgnization / Members cannot be invited more than 1 time to Proficloud / Inviting user to an organization of the same domain should be possible without data security message',
      async (driver) => {
        let vars = {};

        // Configure the window
        await windowConfiguration(driver,"UMS");

        // Log in as Admin
        await loginAdmin(driver, vars);

    
        // Open User Management Menu
            

        const extraUserInOrganization = await countElementsByXPath(driver,"//div[contains(text(),'Registered Zuser in Proficloud')]");

        if(extraUserInOrganization > 0){

            console.log ("An extra user in the organization was found");
            // Remove extra registered users if they exist
            await removeRegisteredUserNew(driver, vars);
            await userManagementMenu(driver);
            await roothOrganizationTest(driver,vars);
            
        }

        else{
            console.log ("No extra user in the orgnanization");
        }

 
           
    

        // Remove old member invitations
        await removeOldMemberInvitationsRoothOrga(driver, vars);


        //C871 Inviting user to an organization of the same domain should be possible without data security message

        // Invite a new member
        vars["username"] = "testingpxc@proton.me";
        vars["role"] = "Viewer";
        await inviteMemberButton(driver);
        await driver.findElement(By.xpath("//input[@placeholder='Email']")).clear();
        await driver.findElement(By.xpath("//input[@placeholder='Email']")).sendKeys(vars["username"]);
        await roleSelectionDropDownMenu(driver);
        await driver.findElement(By.xpath("//span[contains(.,'Viewer')]")).click();
        await inviteMemberButton2(driver);
        await waitingLoadingRingProficloudToDissapear(driver);

        // C882 Members cannot be invited more than 1 time to Proficloud
        await inviteMemberButton(driver);
        await driver.findElement(By.xpath("//input[@placeholder='Email']")).clear();
        await driver.findElement(By.xpath("//input[@placeholder='Email']")).sendKeys(vars["username"]);
        await roleSelectionDropDownMenu(driver);
        await driver.findElement(By.xpath("//span[contains(.,'Viewer')]")).click();
        await inviteMemberButton2(driver);
        await assertText(
          driver,
          'css',
          '.pc-status-overlay__message',
          'This member has already been invited. You can send him the invitation link personally.'
        );

        await driver.wait(until.elementLocated(By.xpath("/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/pc-status-overlay[1]/pc-overlay[1]/div[1]/div[2]/div[1]/div[1]/app-icon[1]/*[name()='svg'][1]")), 60000).click();
        await modalClose(driver);
    
        // Logout from Proficloud
        await logout(driver);

        // Log in to ProtonMail
        await loginToProtonMail(driver, vars);
        await clickFirstMail(driver);
        await changeFrameAndClickonProficloudEmail(driver);

        //confirming that the user can access to Rooth Orga
        await windowConfiguration(driver,"UMS");
        await loginRegisteredUser(driver,vars);
        await logout(driver);


        //C610 Remove member from organization as ADMIN


        await windowConfiguration(driver,"UMS");
        await loginAdmin(driver,vars);
        await userManagementMenu(driver);
        await removeOldMemberInvitationsRoothOrga(driver);
        await logout(driver);

    
        await loginToProtonMail(driver, vars);
        await clickFirstMail(driver);
        await driver.sleep(2000);
        await waitForXPathPresentTimeout(driver,"//h1[contains(@title,'organization Rooth Organization')]//span[contains(text(),'You have been removed from the Proficloud.io')]",10000);
        
        await deleteAllEmails(driver);
        await logOutFromProtonMail(driver);

        
      }
    );
  } catch (error) {
    throw new Error(`C613 failed: ${error.message}`);
  }
}

module.exports = C613;

if (require.main === module) {
  (async () => {
    try {
      console.log(`🚀 Running the test`);
      await C613();
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Error running the test:', error.message);
    }
  })();
}
