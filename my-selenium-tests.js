const { Builder, By, Key, until } = require('selenium-webdriver');
const browserstack = require('browserstack-local');

// Función asíncrona para ejecutar los tests
async function runTest() {
  // Configura el navegador para usar BrowserStack
  let capabilities = {
    'bstack:options': {
      os: "Windows",
      osVersion: "10",
      browserName: "chrome",
      browserVersion: "latest",
      userName: process.env.BROWSERSTACK_USERNAME,  // Usa la variable de entorno
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY  // Usa la variable de entorno
    }
  };

  // Inicializa el driver de Selenium con las capacidades de BrowserStack
  let driver = await new Builder()
    .usingServer('https://hub-cloud.browserstack.com/wd/hub') // URL de BrowserStack
    .withCapabilities(capabilities)
    .build();

  try {
    // Navega a la página de ejemplo
    await driver.get('http://www.google.com');
    
    // Encuentra el campo de búsqueda (por ejemplo, "q") y realiza una búsqueda
    let element = await driver.findElement(By.name('q'));
    await element.sendKeys('Hello World');
    await element.submit();
    
    // Espera hasta que el título de la página contenga 'Hello World'
    await driver.wait(until.titleContains('Hello World'), 10000);
  } finally {
    // Cierra el navegador después de completar las pruebas
    await driver.quit();
  }
}

// Ejecuta la función asíncrona
runTest();

