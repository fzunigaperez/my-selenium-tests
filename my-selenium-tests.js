const { Builder, By, Key, until } = require('selenium-webdriver');

// Definir la función asíncrona para ejecutar la prueba
async function runTest() {
  // Configura las capacidades de BrowserStack
  const capabilities = {
    'bstack:options': {
      os: "Windows",
      osVersion: "10",
      browserName: "chrome", // Usa minúsculas para el nombre del navegador
      browserVersion: "latest", // O especifica la versión
      userName: "fzuniga_kU2wfa", // Reemplaza con tu nombre de usuario de BrowserStack
      accessKey: "PDSWH3QTgRyFqVWFR1sx", // Reemplaza con tu clave de acceso de BrowserStack
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
