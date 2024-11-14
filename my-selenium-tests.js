const { Builder, By, Key, until } = require('selenium-webdriver');
const browserstack = require('browserstack-local');

// Configuración de capacidades para BrowserStack
const capabilities = {
  'bstack:options': {
    'os': 'Windows',
    'osVersion': '10',
    'local': 'false',
    'seleniumVersion': '3.141.59',
    'userName': 'fzuniga_kU2wfa', // Reemplázalo con tu nombre de usuario de BrowserStack
    'accessKey': 'PDSWH3QTgRyFqVWFR1sx', // Reemplázalo con tu clave de acceso de BrowserStack
  },
  'browserName': 'Chrome',
  'browserVersion': 'latest',
};

// Función asíncrona para ejecutar los tests
async function runTest() {
  let driver = await new Builder()
    .usingServer('https://hub-cloud.browserstack.com/wd/hub') // URL de BrowserStack
    .forBrowser('chrome') // Especifica el navegador aquí
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
