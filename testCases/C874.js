const { Builder, By, until } = require('selenium-webdriver'); // Selenium WebDriver essentials
const assert = require('assert'); // Assertion module for validations
const testBase = require('./testBase'); // Common test setup
const {
  windowConfiguration,
  loginAdmin,
  resetToOriginalUserNameInRoothOrganization,
  userManagementMenu,
  logout,
  waitForUsersToLoad,
  switchToPxcOrganization,
  waitForXPathPresentTimeout,
  switchToOriginalOrganization,
  reloadPage,
} = require('../utils/sharedFunctions'); // Reusable shared functions

// Main test function for C874
async function C874() {
  try {
    await testBase('C874_C646_Search for member works / Scroll Bars are present for users and roles', async (driver) => {
      let vars = {}; // Initialize variables container

      // Step 1: Configure the browser window and login as admin
      await windowConfiguration(driver);
      await loginAdmin(driver, vars);

      // Step 2: Ensure the organization and user name are set correctly
      await resetToOriginalUserNameInRoothOrganization(driver);

      // Step 3: Navigate to User Management
      await userManagementMenu(driver);
      await waitForUsersToLoad(driver);

      // Step 4: Search for specific members and validate results
      const searchInputXPath = "//input"; // XPath for the search input field

      // Function to validate search results
      async function validateSearch(driver, email, expectedName) {
        await driver.findElement(By.xpath(searchInputXPath)).clear(); // Clear previous input
        await driver.findElement(By.xpath(searchInputXPath)).sendKeys(email); // Input the search query

        // Verify the expected result is found
        const elements = await driver.findElements(By.xpath(`//*[contains(text(),'${expectedName}')]`));
        assert(elements.length, `❌ No results found for ${email}`);
        console.log(`✅ Search for "${email}" found "${expectedName}".`);
      }
      
      
      // Validate various searches
      await validateSearch(driver, "rsylvester@phoenixcontact-sb.io", "rsylvester@phoenixcontact-sb.io");
      await validateSearch(driver, "testingpxc_editor@proton.me", "Fernando Editor");
      await validateSearch(driver, "testingpxc_admin@proton.me", "Fernando Zuniga");
      await validateSearch(driver, "testingpxc_viewer@proton.me", "Tester Viewer");
      await reloadPage(driver);
      await waitForUsersToLoad(driver);


      //C646 Scroll Bars are present for users and roles

      await switchToPxcOrganization(driver);
      await waitForUsersToLoad(driver);
      await waitForXPathPresentTimeout(driver,"//div[@class='ng-scrollbar-thumb']",5000);
      await driver.wait(until.elementLocated(By.id("navigation-user-management-service-user-roles")), 30000).click();
      await waitForXPathPresentTimeout(driver,"//div[@class='ng-scrollbar-thumb']",5000);
      await switchToOriginalOrganization(driver);



      // Step 5: Logout after validation
      await logout(driver);
    });
  } catch (error) {
    throw new Error(`C874 failed: ${error.message}`);
  }
}

// Allow this file to be executed directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running test C874...');
      await C874(); // Run the test
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      console.error(error.stack);
    }
  })();
}

// Export the test function for use in other modules
module.exports = C874;
