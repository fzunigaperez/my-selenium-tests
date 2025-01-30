const { Builder, By, until } = require('selenium-webdriver'); // Localrun
const testBase = require('./testBase'); // Common
const {
  windowConfiguration,
  logout,
  activeOrganization,
  settings,
  loginChangeOrgaUserName,
  userManagementMenu,
  getTextByLocator,
  clearAndWrite,
  waitingLoadingRingProficloudToDissapear,
  resetTOriginalNameOrganization,
  renameOrganizationButton1,
  renameOrganizationButton2,
  loginEditor,
  waitUntilXpathNotPresent,
  loginViewer,
} = require('../utils/sharedFunctions'); // BS

// Main test function to rename the organization as an admin and validate permissions for EDITOR and VIEWER roles
async function C631() {
  try {
    await testBase(
      'C631_C702_C703_Rename organization as admin / Rename organization for EDITOR / VIEWER is not allowed',
      async (driver) => {
        let vars = {}; // Container for reusable variables

        // Step 1: Admin renames the organization
        await windowConfiguration(driver, "UMS"); // Window configuration for UMS module
        await loginChangeOrgaUserName(driver, vars); // Login as admin
        await userManagementMenu(driver); // Navigate to user management menu
        await activeOrganization(driver); // Select the active organization
        await settings(driver); // Access the settings menu

        // Save the current name of the active organization
        const originalName = await getTextByLocator(driver, "xpath", "//div[@id='active-organization']/h4");

        // Click to open the rename organization dialog
        orgaID = await getTextByLocator(driver,"css",".expandable-organization__subtitle");
        await driver.wait(until.elementLocated(By.xpath(`//app-icon[@id='settings-organization-settings-icon-${orgaID}']//*[name()='svg']`)), 3000).click();
        await renameOrganizationButton1(driver);

        // Verify that the rename organization dialog is displayed
        await getTextByLocator(driver, "css", ".pc-overlay__title", "Rename Organization");

        // Enter the new organization name
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Organization Name')]")), 3000).click();
        await clearAndWrite(driver, "xpath", "//input[@placeholder='Organization Name']", "Renamed Organization");

        // Confirm the rename action
        await renameOrganizationButton2(driver);

        // Wait for the loading spinner to disappear
        await waitingLoadingRingProficloudToDissapear(driver);

        // Retrieve the new name of the active organization
        const editedName = await getTextByLocator(driver, "xpath", "//div[@id='active-organization']/h4");

        // Click outside to deselect
        await driver.wait(until.elementLocated(By.css(".ng-native-scrollbar-hider")), 3000).click();
        console.log(originalName + "/" + editedName);

        // Validate that the organization name was updated
        if (originalName !== editedName) {
          console.log("The organization name was successfully edited.");
        } else {
          throw new Error("The organization name was NOT edited.");
        }

        // Restore the original organization name
        await resetTOriginalNameOrganization(driver);

        // Log out as admin
        await logout(driver);

        // Step 2: Verify EDITOR cannot rename the organization
        await windowConfiguration(driver, "UMS"); // Reconfigure window for UMS module
        await loginEditor(driver, vars); // Login as editor
        await waitUntilXpathNotPresent(driver, "//span[contains(.,'User Management')]"); // Verify "User Management" is not accessible
        await logout(driver); // Logout editor

        // Step 3: Verify VIEWER cannot rename the organization
        await windowConfiguration(driver, "UMS"); // Reconfigure window for UMS module
        await loginViewer(driver, vars); // Login as viewer
        await waitUntilXpathNotPresent(driver, "//span[contains(.,'User Management')]"); // Verify "User Management" is not accessible
        await logout(driver); // Logout viewer
      }
    );
  } catch (error) {
    throw new Error(`C631 failed: ${error.message}`);
  }
}

// Export the function for use in other modules
module.exports = C631;

// Execute the function if this script is run directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running the test'); // Log the start of the test
      await C631(); // Execute the main test function
      console.log('✅ Test completed successfully.'); // Log successful completion
    } catch (error) {
      console.error('❌ Error running the test:', error.message); // Log any errors
    }
  })();
}
