const { Builder, By, until } = require('selenium-webdriver');
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const testBase = require('./testBase');
const {
  windowConfiguration,
  acceptCookies,
  loginLandingPageButton,
} = require('../utils/sharedFunctions');

async function C16() {
  await testBase(
    'C16 Login with wrong credentials_Login with valid email but wrong password',
    async (driver) => {
      // Configuración de la ventana y cookies
      console.log("Configurando la ventana...");
      await windowConfiguration(driver);

      console.log("Aceptando cookies...");
      await acceptCookies(driver);

      console.log("Accediendo al botón de inicio de sesión...");
      await loginLandingPageButton(driver);

      // Escenario 1: Credenciales completamente incorrectas

      console.log("Logging in with completely incorrect credentials...");
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.id("username")), 50000);
      let usernameField = await driver.findElement(By.id("username"));
      let passwordField = await driver.findElement(By.id("password"));
      
      await usernameField.sendKeys("xxx@phoenixcontact-sb.io");
      await passwordField.sendKeys("1234554");
      await driver.findElement(By.id("kc-login")).click();

      // Validar el mensaje de error
      console.log("Validando el mensaje de error...");
      await driver.wait(until.elementLocated(By.css(".kc-feedback-text")), 5000);
      let feedbackTextElement = await driver.findElement(By.css(".kc-feedback-text"));
      let feedbackText = await feedbackTextElement.getText();
      if (feedbackText !== "Invalid username or password.") {
        throw new Error(
          `Unexpected error message for invalid credentials: '${feedbackText}'`
        );
      }
      console.log("Validation passed for invalid credentials.");
    }
  );
}

// Permite ejecutar el archivo directamente
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Ejecutando el test C16...');
      await C16();
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
    }
  })();
}

module.exports = C16;
