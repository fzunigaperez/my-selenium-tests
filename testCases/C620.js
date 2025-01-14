const { Builder, By, until } = require('selenium-webdriver'); // Selenium WebDriver essentials
const assert = require('assert'); // Assertion module for validations
const testBase = require('./testBase'); // Common test setup
const path = require('path');
const {
  windowConfiguration,
  loginAdmin,
  emmaMenu,
  reports,
  deleteManualReports,
  countElementsByXPath,
  cleanDashboard,
  reportActionsButton,
  clearAndWrite,
  waitingLoadingRingProficloudToDissapear,
  
} = require('../utils/sharedFunctions'); // Reusable shared functions

// Main test function for C620
async function C620() {
  try {
    await testBase('C620_Create a recurring Report', async (driver) => {
      let vars = {}; // Initialize variables container

      await driver.get("https://drive.proton.me/urls/2AMGC31V1W#iLYHvxozVMMA");
      await driver.wait(until.elementLocated(By.xpath("//button[@data-testid='scan-download-button']")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Download finished') or contains(.,'Download abgeschlossen') ]")), 30000);

      

      await windowConfiguration(driver,"EMMA");
      await loginAdmin(driver, vars);
      await emmaMenu(driver);
      await cleanDashboard(driver);
      await reports(driver);
      await deleteManualReports(driver);
      await reportActionsButton(driver);
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Create Recurring Report')]")), 3000).click();
      await uploadFile(driver, '.file-input', 'BS', 'testimlogo.jpg');


      
        

      await driver.wait(until.elementLocated(By.xpath("//div[@data-analytics='modal headline'][contains(.,'Recurring Report')]")), 4000);
      await clearAndWrite(driver,"xpath","//input[@ng-reflect-placeholder='Title']","Testing Recurring Report");
      await clearAndWrite(driver,"xpath","//input[@ng-reflect-placeholder='Subtitle']","Testing Subtitle");
      await clearAndWrite(driver,"xpath","//textarea[@placeholder='Description']",'Just in time for Halloween: The "Spook the Machine" experiment begins: In the eerie atmosphere of Halloween night, people transform into spooky figures and try to scare each other. In this era of Artificial Intelligence (AI), new questions arise: Can machines also be scared? The team at the Center for Humans and Machines at the Max Planck Institute for Human Development invites the public to participate in a spooky experiment. Its objective: to scare AI with terrifying images.');
      // We activate Date Togle
      await driver.sleep(1000);
      await driver.wait(until.elementLocated(By.xpath("(//*[@class='bf'])[1]")), 3000).click();
      await driver.wait(until.elementLocated(By.xpath("(//*[@class='bf'])[1]")), 3000).click();
      await driver.wait(until.elementLocated(By.id("dateFormat")), 3000).click();
      // Selecting american date format
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'DD/MM/YYYY')]")), 30000).click();
      await clearAndWrite(driver,"xpath","//input[@placeholder='Company']","PxC");
      await clearAndWrite(driver,"xpath","//input[@placeholder='Author']","Fernando Alejandro Zuniga Perez");
      await clearAndWrite(driver,"xpath","//input[@placeholder='Mail List']","testingpxc@proton.me,testingpxc_admin@proton.me");
      // We activate Widget Description Togle
      await driver.wait(until.elementLocated(By.xpath("(//*[@class='bf'])[2]")), 3000).click();
      // We activate Statistics Togle
      await driver.wait(until.elementLocated(By.xpath("(//*[@class='bf'])[3]")), 3000).click();
      //We choose recurrance
      await driver.wait(until.elementLocated(By.id("recurrance")), 3000).click();
      await driver.findElement(By.xpath("(//div[@data-analytics='modal headline'][contains(.,'Recurring Report')])[2]"));
      await clearAndWrite(driver,"xpath","//input[@placeholder='Every']","1");
      await driver.wait(until.elementLocated(By.xpath("//span[@class='mdc-button__label'][contains(.,'OK')]")), 3000).click();
      await driver.wait(until.elementLocated(By.xpath("//pc-button[contains(.,'Create')]")), 3000).click();
      await waitingLoadingRingProficloudToDissapear(driver);
      




      await driver.findElement(By.id("title"),20000).clear();
      await driver.findElement(By.id("title"),20000).sendKeys("Testing Dash");
      await driver.sleep(2000);
      await assertText(driver,"css",".dashboard__tab-title","Testing Dash");

      //C179 Editing Dashboard Name

      await driver.findElement(By.id("title"),20000).clear();
      await driver.findElement(By.id("title"),20000).sendKeys("Dashboard edit");
      await driver.sleep(2000);
      await assertText(driver,"css",".dashboard__tab-title","Dashboard edit");

      //C180 Introducing a Dashboard name with a maximum length of 27 characters.

      await driver.findElement(By.id("title"),20000).clear();
      await driver.findElement(By.id("title"),20000).sendKeys("LLLLLLLLLLLLLLLLLLLLLLLLLLL");
      await driver.sleep(2000);
      await assertText(driver,"css",".dashboard__tab-title","LLLLLLLLLLLLLLL...");

      //Returning the original Name of the Dashboard


      await driver.findElement(By.id("title"),20000).clear();
      await driver.findElement(By.id("title"),20000).sendKeys("Testing Dash");
      await driver.sleep(2000);
      await assertText(driver,"css",".dashboard__tab-title","Testing Dash");

      //C181 / C184 Introducing a Dashboard description / Editing a Dashboard description

      await driver.findElement(By.id("description"),5000).clear();
      await driver.findElement(By.id("description"),5000).sendKeys("Edited Description");
      await dashboard(driver);
  

      //Maximize the whole Dashboard

      await driver.wait(until.elementLocated(By.id("sidePanel")), 30000).click();
      await waitUntilXpathNotPresent(driver,"//mat-label[contains(.,'Filter metrics')]")
      await driver.wait(until.elementLocated(By.id("sidePanel")), 30000).click();
      await waitForXPathPresentTimeout(driver,"//mat-label[contains(.,'Filter metrics')]",3000);

             
      await logout(driver);
    });
  } catch (error) {
    throw new Error(`C620 failed: ${error.message}`);
  }
}

/**
 * Sube un archivo a un campo de tipo file.
 * 
 * @param {object} driver - Instancia del WebDriver.
 * @param {string} fileInputSelector - Selector del campo de tipo file.
 * @param {string} mode - Modo de ejecución ('BS' para Browser Stack, 'local' para local).
 * @param {string} fileName - Nombre del archivo a subir.
 */
async function uploadFile(driver, fileInputSelector, mode, fileName) {
    // Genera la ruta base según el modo
    const basePath = mode === 'BS'
        ? 'C:\\Users\\hello\\Downloads' // Ruta para BrowserStack
        : 'C:/Users/Fernando/OneDrive - Phoenix Contact Smart Business GmbH/Datenschutz/Bilder'; // Ruta local

    // Combina la ruta base con el nombre del archivo
    const filePath = path.join(basePath, fileName);

    // Encuentra el campo de tipo file y sube el archivo
    const fileInput = await driver.findElement(By.css(fileInputSelector));
    await fileInput.sendKeys(filePath);

    console.log(`Archivo "${fileName}" subido correctamente desde el modo: ${mode}`);
}



/**
 * Sube un archivo a un campo de tipo file.
 * 
 * @param {object} driver - Instancia del WebDriver.
 * @param {string} fileInputSelector - Selector del campo de tipo file.
 * @param {string} mode - Modo de ejecución ('local' o 'BS').
 * @param {string} fileName - Nombre del archivo a subir.
 */
async function uploadFile(driver, fileInputSelector, mode, fileName) {
    // Genera la ruta base según el modo
    const basePath = mode === 'BS'
        ? 'C:\\Users\\hello\\Downloads' // Ruta para BrowserStack
        : 'C:/Users/Fernando/OneDrive - Phoenix Contact Smart Business GmbH/Datenschutz/Bilder'; // Ruta local

    // Combina la ruta base con el nombre del archivo
    const filePath = path.join(basePath, fileName);

    // Encuentra el campo de tipo file
    const fileInput = await driver.findElement(By.css(fileInputSelector));

    // Usa sendKeys para subir el archivo
    await fileInput.sendKeys(filePath);

    console.log(`Archivo "${fileName}" subido correctamente en modo: ${mode}`);
}





// Allow this file to be executed directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running test C620...');
      await C620(); // Run the test
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      console.error(error.stack);
    }
  })();
}





  

// Export the test function for use in other modules
module.exports = C620;
