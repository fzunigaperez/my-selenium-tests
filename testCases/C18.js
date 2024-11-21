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

  let driver;
  let vars = {};
  await testBase('C18 Login with valid email but wrong password'), async (driver) => {
  
    // Inicializar el navegador con capacidades
    driver = await new Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub') // Configuración del servidor remoto (BrowserStack)
      .withCapabilities(capabilities) // Aplicar capacidades
      .build();

    // Configuración inicial de la ventana y cookies
    await windowConfiguration(driver); // Configurar la URL inicial y maximizar la ventana
    await acceptCookies(driver); // Aceptar cookies si aparece el banner
    await loginLandingPageButton(driver); // Navegar al botón de inicio de sesión

    // Intento de login con credenciales inválidas
    const username = "testingpxc_admin@proton.me";
    const wrongPassword = "1234554";
    await driver.wait(until.elementLocated(By.id("username")), 5000);
    await driver.findElement(By.id("username")).sendKeys(username); // Ingresar usuario
    await driver.findElement(By.id("password")).sendKeys(wrongPassword); // Ingresar contraseña incorrecta
    await driver.findElement(By.id("kc-login")).click(); // Intentar iniciar sesión

    // Verificar mensaje de error
    const feedbackText = await driver.findElement(By.css(".kc-feedback-text")).getText();
    if (feedbackText !== "Invalid username or password.") {
      throw new Error("Expected invalid credentials message not found.");
    }
    console.log("Login failed as expected with invalid credentials.");

    // Verificar correo sobre intento fallido en Proton Mail
    
    
    await loginToProtonMail(driver, vars); // Iniciar sesión en Proton Mail
    await checkFailedLoginEmail(driver); // Verificar correo de intento fallido

    // Eliminar todos los correos (opcional)
    await deleteAllEmails(driver); // Limpiar bandeja de entrada

  }
}

// Exportar la función para ser utilizada como test case
module.exports = C18;
