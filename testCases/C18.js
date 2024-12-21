const { Builder, By, until } = require('selenium-webdriver');
const testBase = require('./testBase');
const {
  acceptCookies,
  windowConfiguration,
  loginLandingPageButton,
  loginToProtonMail,
  checkFailedLoginEmail,
  deleteAllEmails,
} = require('../utils/sharedFunctions'); // Import shared functions

async function C18() {
  await testBase('C18 Login with valid email but wrong password', async (driver) => {
    // Configure the initial URL and maximize window
    await windowConfiguration(driver);
    // Accept cookies if the banner appears
    await acceptCookies(driver);
    // Navigate to the login button
    await loginLandingPageButton(driver);

    // Attempt to log in with invalid credentials in Proficloud
    const username = "testingpxc_admin@proton.me";
    const wrongPassword = "1234554";
    await driver.wait(until.elementLocated(By.id("username")), 5000);
    await driver.findElement(By.id("username")).sendKeys(username); // Enter username
    await driver.findElement(By.id("password")).sendKeys(wrongPassword); // Enter incorrect password
    await driver.findElement(By.id("kc-login")).click(); // Attempt login

    // Verify error message
    const feedbackText = await driver.findElement(By.css(".kc-feedback-text")).getText();
    if (feedbackText !== "Invalid username or password.") {
      throw new Error("Expected invalid credentials message not found.");
    }
    console.log("Login failed as expected with invalid credentials.");

    // Check email for failed login attempt
    let vars = {}; // Initialize vars
    await loginToProtonMail(driver, vars); // Log into Proton Mail
    await checkFailedLoginEmail(driver); // Verify email notification about failed login attempt

    // Optionally, delete all emails
    await deleteAllEmails(driver);
  });
}

// Export the function to be used as a test case
module.exports = C18;

if (require.main === module) {
  (async () => {
    try {
      console.log("🚀 Running the test");
      await C18(); // Change here the test name

      console.log("✅ Test completed successfully.");
    } catch (error) {
      console.error("❌ Error while executing the test:", error.message);
    }
  })();
}
