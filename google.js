const { Builder, By, Key, until } = require('selenium-webdriver');
const browserstack = require('browserstack-local');

// Configuración de capacidades para BrowserStack
const capabilities = {
  'bstack:options': {
    'os': 'Windows',
    'osVersion': '10',
    'local': 'false',
    'seleniumVersion': '3.141.59',
    'userName': process.env.BROWSERSTACK_USERNAME, // Usa el nombre de usuario del entorno
    'accessKey': process.env.BROWSERSTACK_ACCESS_KEY, // Usa la clave de acceso del entorno
  },
  'browserName': 'Chrome',
  'browserVersion': 'latest',
};

// Función asíncrona para ejecutar los tests
async function runTest1() {
  let driver = await new Builder()
    .usingServer('https://hub-cloud.browserstack.com/wd/hub') // URL de BrowserStack
    .forBrowser('chrome') // Especifica el navegador aquí
    .withCapabilities(capabilities)
    .build();

  try {
    await driver.get('http://www.google.com');
    
    let element = await driver.findElement(By.name('q'));
    await element.sendKeys('Hello World');
    await element.submit();
    
    await driver.wait(until.titleContains('Hello World'), 10000);
  } finally {
    await driver.quit();
  }
}

module.exports = runTest1;
