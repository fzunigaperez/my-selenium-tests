const { Builder, By, Key, until } = require('selenium-webdriver');
const browserstack = require('browserstack-local');

// Configuración de capacidades para BrowserStack
const capabilities = {
  'browserstack.user': 'fzuniga_kU2wfa', // Reemplázalo con tu nombre de usuario de BrowserStack
  'browserstack.key': 'PDSWH3QTgRyFqVWFR1sx', // Reemplázalo con tu clave de acceso de BrowserStack
  'browser': 'Chrome', // El navegador que deseas usar
  'browser_version': 'latest', // Versión del navegador
  'os': 'Windows', // Sistema operativo en el que se ejecuta el navegador
  'os_version': '10', // Versión del sistema operativo
  'name': 'Google Search Test', // Nombre del test en BrowserStack
  'build': 'Build 1', // Nombre del build (opcional)
  'browserstack.local': 'false', // Si no estás probando en un entorno local
  'browserstack.debug': 'true', // Habilitar los registros de depuración
};

// Función asíncrona para ejecutar los tests
async function runTest() {
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
