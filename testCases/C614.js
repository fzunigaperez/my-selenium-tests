const { Builder, By, until } = require('selenium-webdriver'); // Importación completa
const assert = require('assert');
const testBase = require('./testBase'); // Lógica común para la ejecución de pruebas
const {
  windowConfiguration,
  acceptCookies,
  unregisteredUserCredentials,
  agreeTerms,
  
} = require('../utils/sharedFunctions'); // Importación de funciones reutilizables

async function C614() {
  try {
    await testBase(
      'C614 Sign UP if two passwords are not the same should not be possible',
      async (driver) => {
        let vars = {};

        // Configurar ventana (entorno de pruebas)
        await windowConfiguration(driver,"UMS");
        await unregisteredUserCredentials(driver, vars);

        // Registrar usuario con contraseñas diferentes
        
        vars["passwordFake"] = "ProficloudFake2022!";
        

        // Aceptar cookies si es necesario
        await acceptCookies(driver);

        // Click en el botón de registro en la página de aterrizaje
        
        await driver.wait(until.elementLocated(By.id("registration-button")), 30000).click();
        await driver.sleep(500);
        await driver.wait(until.elementLocated(By.xpath("//input[@placeholder=\'Email\']")), 30000);
        await driver.findElement(By.xpath("//input[@placeholder=\'Email\']")).sendKeys(vars["username"]);
        await driver.findElement(By.id("mat-select-value-1")).click();
        await driver.findElement(By.xpath("//span[contains(.,\'Spain\')]")).click();
        await driver.findElement(By.xpath("//input[@placeholder=\'First name\']")).sendKeys(vars["firstName"]);
        await driver.findElement(By.xpath("//input[@placeholder=\'Last name\']")).sendKeys(vars["lastName"]);
        await driver.findElement(By.xpath("//input[@placeholder=\'Password\']")).sendKeys(vars["password"]);
        await driver.findElement(By.xpath("//input[contains(@placeholder,\'Confirm password\')]")).sendKeys(vars["passwordFake"]);
        await driver.sleep(1000);

        
        

        // Aceptar los términos y condiciones
        await agreeTerms(driver,vars);

        // Intentar registrar
        await driver.findElement(By.xpath("//pc-button[contains(.,'Register')]")).click();

        // Esperar el mensaje de error por contraseñas no coincidentes
        await driver.wait(until.elementLocated(By.css(".password-message-error")), 10000);

        // Verificar que el mensaje de error sea correcto
        const errorMessage = await driver.findElement(By.css(".password-message-error")).getText();
        assert.strictEqual(errorMessage, "The confirmation must match the password.", "El mensaje de error no coincide.");
        console.log("✅ La prueba C614 se completó correctamente.");
      }
    );
  } catch (error) {
    throw new Error(`C614 failed: ${error.message}`);
  }
}

module.exports = C614;

if (require.main === module) {
  (async () => {
    try {
      console.log(`🚀 Ejecutando el test`);
      await C614(); // Change here the test name
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
    }
  })();
}
