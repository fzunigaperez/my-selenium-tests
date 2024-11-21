const { Builder, By, until } = require('selenium-webdriver'); // Importación completa
const path = require('path');
const testBase = require('./testBase');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const {
  windowConfiguration,
  acceptCookies,
  loginLandingPageButton,
  logout,
} = require('../utils/sharedFunctions'); // Importación de funciones reutilizables

async function C36() {
  await testBase(
    'C36 Login with wrong credentials (10 wrong attempts)',
    async (driver) => {
      let vars = {}; // Inicializa vars como un objeto vacío

      // Configuración de la ventana y cookies
      console.log("Configurando la ventana...");
      await windowConfiguration(driver);

      console.log("Aceptando cookies...");
      await acceptCookies(driver);
      await loginLandingPageButton(driver);

      // Realizar 10 intentos fallidos
      const wrongCredentials = { username: "ferchoalejandro86@gmail.com", password: "wwqrewrewewr" };
      console.log(`Probando con credenciales incorrectas: ${JSON.stringify(wrongCredentials)}`);

      for (let i = 0; i < 10; i++) {
        console.log(`Intento ${i + 1} de 10`);
        await loginWithCredentials(driver, wrongCredentials.username, wrongCredentials.password);
        const feedbackText = await driver.findElement(By.css(".kc-feedback-text")).getText();
        if (feedbackText !== "Invalid username or password.") {
          throw new Error(`Mensaje de error inesperado en el intento ${i + 1}: ${feedbackText}`);
        }
        console.log(`Intento ${i + 1} fallido como se esperaba.`);
      }
      // BUG!!!  https://phoenixcontact-sb.slack.com/archives/C03BD2XKABE/p1732019965271359
      // Simular desbloqueo después de un tiempo
     // console.log("Esperando para que expire el bloqueo de la cuenta...");
     // await driver.sleep(65000); // Simula el desbloqueo después de esperar

      /* Intento con credenciales válidas
      onsole.log("Probando con credenciales válidas...");
      await loginWithCredentials(driver, "ferchoalejandro86@gmail.com", "Proficloud2020!");
      const routeTitle = await driver.findElement(By.id("routeTitle")).getText();
      if (routeTitle !== "Device Management Service") {
        throw new Error(`Título inesperado de la ruta: ${routeTitle}`); 
      }
      console.log("Inicio de sesión exitoso con credenciales válidas.");

      // Cierre de sesión
      console.log("Cerrando sesión...");
      await logout(driver);*/

    }
      
  );
}

// Función para iniciar sesión con credenciales específicas
async function loginWithCredentials(driver, username, password) {
  console.log(`Intentando iniciar sesión con usuario: ${username}`);
  await driver.wait(until.elementLocated(By.id("username")), 5000);
  const usernameField = await driver.findElement(By.id("username"));
  const passwordField = await driver.findElement(By.id("password"));
  const loginButton = await driver.findElement(By.id("kc-login"));

  await usernameField.clear();
  await usernameField.sendKeys(username);
  await passwordField.clear();
  await passwordField.sendKeys(password);
  await loginButton.click();

  // Esperar el mensaje de retroalimentación
  await driver.wait(until.elementLocated(By.css(".kc-feedback-text")), 5000);
}

module.exports = C36;

// Permitir ejecutar el archivo directamente
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Ejecutando el test C36...');
      await C36();
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
    }
  })();
}