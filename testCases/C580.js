const { Builder, By, until } = require('selenium-webdriver'); // Importación completa
const path = require('path');
const assert = require('assert');
const testBase = require('./testBase'); // Lógica común para la ejecución de pruebas
const {
  windowConfiguration,
  acceptCookies,
  loginLandingPageButton,
  logout,
  loginToProtonMail,
} = require('../utils/sharedFunctions'); // Importación de funciones reutilizables



async function C580() {
  await testBase('C580 Password forgotten new', async (driver) => {
    let vars = {}; // Inicializa vars como un objeto vacío

    // Configuración inicial
    console.log('Configurando la ventana...');
    await windowConfiguration(driver);
    console.log("Aceptando cookies...");
    await acceptCookies(driver);
    await loginLandingPageButton(driver);

    // Inicializa las credenciales
    vars.username = "user_testcase_password_forgotten@proton.me"; // Define el usuario
    vars.mailUsername = "user_testcase_password_forgotten@proton.me"; // Correo para login
    vars.mailPassword = "Proficloud2022!"; // Contraseña del correo

    // Generar nueva contraseña aleatoria
    vars.newPassword = generateRandomPassword();
    console.log(`Nueva contraseña generada: ${vars.newPassword}`);

    // Simular el flujo de "olvido de contraseña"
    console.log('Iniciando el flujo de olvido de contraseña...');
    await forgottenPassword(driver, vars);

    // Iniciar sesión con la nueva contraseña
    console.log('Iniciando sesión con la nueva contraseña...');
    await loginWithNewPassword(driver, vars);

    // Cerrar sesión
    console.log('Cerrando sesión...');
    await logout(driver);
  });
}

// Generar contraseña aleatoria
function generateRandomPassword() {
  return Math.random().toString(36).substring(2, 12) + '86F!';
}

// Flujo de "olvido de contraseña"
async function forgottenPassword(driver, vars) {
  console.log('Accediendo a la página de "olvido de contraseña"...');
  await driver.wait(until.elementLocated(By.xpath("//a[contains(.,'Forgot Password?')]")), 30000);
  await driver.findElement(By.id('forgotpasswordlink')).click();
  const pageTitle = await driver.findElement(By.css('.title')).getText();
  assert.strictEqual(pageTitle, 'Forgot Password', 'No se accedió correctamente a la página de olvido de contraseña.');

  console.log('Enviando solicitud para restablecer contraseña...');
  await driver.findElement(By.id('mat-input-0')).sendKeys(vars.username);
  await driver.findElement(By.xpath("//span[contains(.,'Request Reset')]")).click();

  // Esperar confirmación
  console.log('Esperando confirmación de restablecimiento de contraseña...');
  await waitForPasswordResetMessage(driver);

  // Acceder al correo electrónico
  
  await loginToProtonMail(driver, vars);
  // Seleccionar el correo de restablecimiento de contraseña
  console.log('Seleccionando correo de restablecimiento de contraseña...');
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'You have requested a password reset for Proficloud.io')]")), 30000);
  await driver.findElement(By.xpath("//span[contains(.,'You have requested a password reset for Proficloud.io')]")).click();

  // Interactuar con el contenido del correo
  console.log('Accediendo al enlace de restablecimiento...');
  // Localizar el iframe

await driver.sleep(3000);
  const iframe = await driver.wait(until.elementLocated(By.css('iframe')), 10000);

// Cambiar el contexto al iframe
await driver.switchTo().frame(iframe);

// Esperar y localizar el botón "Reset password"
const resetButton = await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'Reset password')]")), 10000);
await resetButton.click();
console.log("El botón 'Reset password' fue clicado exitosamente.");

// Volver al contexto principal
await driver.switchTo().defaultContent();


// Obtener todas las pestañas abiertas
const handles = await driver.getAllWindowHandles();

// Cambiar el control a la nueva pestaña
await driver.switchTo().window(handles[1]); // Cambiar a la segunda pestaña (índice 1)
await driver.wait(until.titleIs('Proficloud.io | NAV.RESET_PASSWORD'), 10000); // Esperar hasta que el título coincida

await driver.findElement(By.id('mat-input-1')).sendKeys(vars.newPassword);
await driver.findElement(By.id('mat-input-2')).sendKeys(vars.newPassword);
await driver.findElement(By.xpath("//span[contains(.,'Reset Password')]")).click();


}

// Esperar el mensaje de confirmación de restablecimiento
async function waitForPasswordResetMessage(driver) {
  const messageLocator = By.xpath("//span[@class='pc-status-overlay__message'][contains(.,'Please check your email for a link to reset your password.')]");
  await driver.wait(until.elementLocated(messageLocator), 30000);
  console.log('Mensaje de confirmación recibido.');
}






// Iniciar sesión con la nueva contraseña
async function loginWithNewPassword(driver, vars) {
  console.log('Accediendo a la página de inicio de sesión...');
  await driver.wait(until.elementLocated(By.id('username')), 30000);
  await driver.findElement(By.id('username')).sendKeys(vars.username);
  await driver.findElement(By.id('password')).sendKeys(vars.newPassword);
  await driver.findElement(By.id('kc-login')).click();

  console.log('Verificando acceso a la página principal...');
  const routeTitle = await driver.findElement(By.id('routeTitle')).getText();
  assert.strictEqual(routeTitle, 'Device Management Service', 'No se accedió correctamente a la página principal.');
}



module.exports = C580;

// Permitir ejecutar el archivo directamente
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Ejecutando el test C580...');
      await C580();
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
    }
  })();
}