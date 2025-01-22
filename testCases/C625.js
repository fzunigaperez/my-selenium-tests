const { Builder, By, until } = require('selenium-webdriver'); // Selenium WebDriver essentials
const assert = require('assert'); // Assertion module for validations
const testBase = require('./testBase'); // Common test setup
const {
  windowConfiguration,
  loginAdmin,
  resetToOriginalUserNameInRoothOrganization,
  userManagementMenu,
  logout,
  activeOrganization,
  settings,
  viewerRoleReset,
} = require('../utils/sharedFunctions'); // Reusable shared functions

// Main test function for C625
async function C625() {
  try {
    await testBase('C625_Roles page shows a summary of Admins, Editors, and Viewers.', async (driver) => {
      let vars = {}; // Initialize variables container

      // Step 1: Configure the browser window and login as admin
      await windowConfiguration(driver,"UMS");
      await loginAdmin(driver, vars);

      // Step 2: Ensure the organization and user name are set correctly
      await resetToOriginalUserNameInRoothOrganization(driver);

      // Step 3: Navigate to User Management and Roles page
      await userManagementMenu(driver);
      await driver.sleep(2000);
      await viewerRoleReset(driver);
      await driver.sleep(1000);
      const rolesTabXPath = "//flex-row[@id='navigation-user-management-service-user-roles']/div";
      await driver.findElement(By.xpath(rolesTabXPath)).click();
      await driver.sleep(2000);

      // Step 4: Validate the presence of role summaries
      const roleSummaryXPaths = {
        Admin: "//label[contains(.,'Admin (2)')]",
        Editor: "//label[contains(.,'Editor (1)')]",
        Viewer: "//label[contains(.,'Viewer (1)')]",
      };

      for (const [role, xpath] of Object.entries(roleSummaryXPaths)) {
        const elements = await driver.findElements(By.xpath(xpath));
        assert(elements.length, `❌ ${role} summary not found.`);
        console.log(`✅ ${role} summary is present.`);
      }

      // Step 5: Extract role numbers
      vars["numberOfAdmins"] = await extractRoleCount(driver, "//label");
      vars["numberOfEditors"] = await extractRoleCount(
        driver,
        "//div[2]/div/pc-input-checkbox/flex-col/mat-checkbox/div/label"
      );
      vars["numberOfViewers"] = await extractRoleCount(
        driver,
        "//div[3]/div/pc-input-checkbox/flex-col/mat-checkbox/div/label"
      );

      console.log(`Admins: ${vars["numberOfAdmins"]}`);
      console.log(`Editors: ${vars["numberOfEditors"]}`);
      console.log(`Viewers: ${vars["numberOfViewers"]}`);

      // Step 6: Verify total members count matches organization info
      vars["totalMembersInOrganization"] = calculateTotalMembers(vars);
      console.log(`Total Members in Organization: ${vars["totalMembersInOrganization"]}`);

      await verifyTotalMembers(driver, vars);

      // Step 7: Logout after validation
      await logout(driver);
    });
  } catch (error) {
    throw new Error(`C625 failed: ${error.message}`);
  }
}

// Helper Function: Extract the count from role summary labels
async function extractRoleCount(driver, xpath) {
  const elementText = await driver.findElement(By.xpath(xpath)).getText();
  return parseInt(elementText.match(/\((\d+)\)/)[1], 10); // Extract the number inside parentheses
}

// Helper Function: Calculate the total number of members
function calculateTotalMembers(vars) {
  return (
    parseInt(vars["numberOfAdmins"], 10) +
    parseInt(vars["numberOfEditors"], 10) +
    parseInt(vars["numberOfViewers"], 10)
  );
}

// Helper Function: Verify total members in organization matches information page
async function verifyTotalMembers(driver, vars) {
  await activeOrganization(driver);
  await settings(driver);
  const infoTabXPath = "//span[@class='mdc-tab__text-label'][contains(.,'Information')]";

  await driver.wait(until.elementLocated(By.xpath(infoTabXPath)), 30000);
  await driver.findElement(By.xpath(infoTabXPath)).click();

  const membersInfoXPath = "//tr[2]/td[2]";
  await driver.wait(until.elementLocated(By.xpath(membersInfoXPath)), 5000);
  const membersInOrgInfo = await driver.findElement(By.xpath(membersInfoXPath)).getText();
  const totalMembersInOrgInfo = parseInt(membersInOrgInfo, 10);

  console.log(`Total Members in Information Page: ${totalMembersInOrgInfo}`);

  assert(
    totalMembersInOrgInfo === vars["totalMembersInOrganization"],
    `❌ Total members count mismatch. Expected: ${vars["totalMembersInOrganization"]}, Found: ${totalMembersInOrgInfo}`
  );

  console.log("✅ Total members count matches.");
}

// Allow this file to be executed directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running test C625...');
      await C625(); // Run the test
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      console.error(error.stack);
    }
  })();
}

// Export the test function for use in other modules
module.exports = C625;
