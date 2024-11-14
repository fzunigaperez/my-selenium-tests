const { Builder, By, Key, until } = require('selenium-webdriver');
const browserstack = require('browserstack-local');

// Configura el navegador para usar BrowserStack
let capabilities = {
  'bstack:options': {
    os: 'Windows',
    osVersion: '10',
    browserName: 'Chrome',
    browserVersion: 'latest',
    userName: process.env.BROWSERSTACK_USERNAME,  // Usa la variable de entorno
    accessKey: process.env.BROWSERSTACK_ACCESS_KEY  // Usa la variable de entorno
  }
};

let driver = new Builder()
  .usingServer('https://hub-cloud.browserstack.com/wd/hub') // URL de BrowserStack
  .withCapabilities(capabilities)
  .build();

// Tu código de Selenium aquí para interactuar con el navegador en BrowserStack


  try {
    await driver.get('http://www.example.com');
    let element = await driver.findElement(By.name('q'));
    await element.sendKeys('Hello World');
    await element.submit();
    await driver.wait(until.titleContains('Hello World'), 10000);
  } finally {
    await driver.quit();
  }
}

runTest();
