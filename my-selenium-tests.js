const { Builder, By, Key, until } = require('selenium-webdriver');

async function runTest() {
  // Agrega la depuración de las variables de entorno antes de configurar el WebDriver
  console.log("BROWSERSTACK_USERNAME:", process.env.BROWSERSTACK_USERNAME);
  console.log("BROWSERSTACK_ACCESS_KEY:", process.env.BROWSERSTACK_ACCESS_KEY);

  // Configura las capacidades de BrowserStack
  const capabilities = {
    'bstack:options': {
      os: "Windows",
      osVersion: "10",
      browserName: "chrome", // Usa minúsculas para el nombre del navegador
      browserVersion: "latest", // O especifica la versión
      userName: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
    },
  };

  // Imprimir las capacidades para verificar que todo esté bien configurado
  console.log('Capacidades a enviar:', JSON.stringify(capabilities, null, 2));

  try {
    // Iniciar WebDriver con las capacidades
    let driver = await new Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub') // Dirección del servidor de BrowserStack
      .withCapabilities(capabilities)
      .build();

    // Navegar a la página de Google
    await driver.get('https://www.google.com');

    // Esperar que el título de la página contenga "Google"
    await driver.wait(until.titleContains('Google'), 10000);
    console.log("Página cargada correctamente");

    // Realizar una búsqueda
    let searchBox = await driver.findElement(By.name('q'));
    await searchBox.sendKeys('Hello World');
    await searchBox.sendKeys(Key.RETURN);

    // Esperar que el título contenga "Hello World"
    await driver.wait(until.titleContains('Hello World'), 10000);
    console.log("Búsqueda completada");

  } catch (error) {
    console.error('Error en la ejecución del test:', error);
  } finally {
    // Cerrar el navegador al final de la prueba
    await driver.quit();
  }
}

// Ejecutar el test
runTest();
