const { Builder, By, until } = require('selenium-webdriver');
const testBase = require('./testBase');
const {
  acceptCookies,
  windowConfiguration,
  loginLandingPageButton,
  loginToProtonMail,
  checkFailedLoginEmail,
  deleteAllEmails,
} = require('../utils/sharedFunctions'); // Importar funciones compartidas





async function C18() {

  await testBase('C18 Login with valid email but wrong password', async (driver) => {
  

    await windowConfiguration(driver); // Configure the initial URL and maximize window
    await acceptCookies(driver); // Accept cookies if the banner appears
    await loginLandingPageButton(driver); // Navigate to the login button
  
    // Attempt to login with invalid credentials
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
    await loginToProtonMail(driver); // Log into Proton Mail
    await checkFailedLoginEmail(driver); // Verify email notification about failed login attempt
  
    // Optionally, delete all emails
    await deleteAllEmails(driver);
  });
  
}

// Exportar la función para ser utilizada como test case
module.exports = C18;
