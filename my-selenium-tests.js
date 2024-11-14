const { Builder, By, Key, until } = require('selenium-webdriver');
const browserstack = require('browserstack-local');

async function runTest() {
  // Configura las capacidades
  const capabilities = {
    'bstack:options': {
      os: "Windows",
      osVersion: "10",
      browserName: "chrome", // Asegúrate de que esté escrito en minúsculas
      browserVersion: "latest", // O una versión específica si lo prefieres
      userName: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
    },
  };

  // Imprimir las capacidades para depurar
  console.log("Capacidades:", JSON.stringify(capabilities, null, 2));

  try {
    // Inicializa el driver de Selenium con las capacidades de BrowserStack
    let driver = await new Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub') // URL de BrowserStack
      .withCapabilities(capabilities)
      .build();

    // Navega a la página de ejemplo
    await driver.get('http://www.google.com');

    // Encuentra el campo de búsqueda (por ejemplo, "q") y realiza una búsqueda
    let element = await driver.findElement(By.name('q'));
    await element.sendKeys('Hello World');
    await element.submit();

    // Espera hasta que el título de la página contenga 'Hello World'
    await driver.wait(until.titleContains('Hello World'), 10000);
  } catch (error) {
    console.error("Error en la ejecución del test:", error);
  } finally {
    // Cierra el navegador después de completar las pruebas
    await driver.quit();
  }
}

// Ejecuta la función asíncrona
runTest();
