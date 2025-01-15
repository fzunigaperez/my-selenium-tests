const { Builder, By, until } = require('selenium-webdriver'); // Selenium WebDriver essentials
const assert = require('assert'); // Assertion module for validations
const testBase = require('./testBase'); // Common test setup
const path = require('path');
const fs = require('fs');
const os = require('os');
const {
  windowConfiguration,
  loginAdmin,
  emmaMenu,
  reports,
  deleteManualReports,
  cleanDashboard,
  reportActionsButton,
  clearAndWrite,
  waitingLoadingRingProficloudToDissapear,
  getCurrentDate,
  createChart,
  uploadFile,
  deleteRecurringReports,
  editButton,
  previewButton,
  waitForXPathPresentTimeout,
  downloadButton,
  logout,
  
} = require('../utils/sharedFunctions'); // Reusable shared functions

// Main test function for C620
async function C620() {
  try {
    await testBase('C620_Create a recurring Report', async (driver) => {
      let vars = {}; // Initialize variables container

      //Downloading the testim logo for being used later in reports
      await driver.get("https://drive.proton.me/urls/JYFCSERXA8#NjpWqhWe0J8q");
      await driver.wait(until.elementLocated(By.xpath("//button[@data-testid='scan-download-button']")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Download finished') or contains(.,'Download abgeschlossen') ]")), 30000);

      

      await windowConfiguration(driver,"EMMA");
      await loginAdmin(driver, vars);
      await emmaMenu(driver);
      /*await cleanDashboard(driver);
       //await createChart(driver, 'EPARBT'); // Energy Pareto Chart Ranked by Time Period
      await createChart(driver, 'EPCTPC'); // Energy Pie Chart Time Period Comparison
      await createChart(driver, 'EBCDSC'); // Energy Bar Chart Data Source Comparison
      await createChart(driver,'EHMDSC'); // Energy Heat Map Data Source Comparison
      //Statistics activated
      await driver.wait(until.elementLocated(By.xpath("//*[name()='div' and @id='profi-select-placeholder']//preceding::*[name()='svg'][@class='mdc-switch__icon mdc-switch__icon--off']")), 2000).click();
      await waitingLoadingRingProficloudToDissapear(driver);
      await driver.wait(until.elementLocated(By.xpath("(//*[@name='comments'])[1]")), 3000).click();
      await clearAndWrite(driver,"xpath","//textarea[@placeholder='Comments']","This comment should be in the report");*/
    

 
      await reports(driver);
      await deleteManualReports(driver);
      await deleteRecurringReports(driver);
      await reportActionsButton(driver);
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Create Recurring Report')]")), 3000).click();
      await uploadFile(driver, '.file-input', 'BS', 'reportHeader.png');


      reportTitle = "Phoenix Contact Recurring Report";
      reportSubtitle = "Testing Subtitle";
      reportDescription = 'At absolute zero temperature, the system is in the state with the minimum thermal energy, the ground state. The constant value (not necessarily zero) of entropy at this point is called the residual entropy of the system. With the exception of non-crystalline solids (e.g. glass) the residual entropy of a system is typically close to zero.';
      dateOfToday = await getCurrentDate('/');
      reportCompany = "Apple Company";
      reportAuthor = "Fernando Alejandro Zuniga Perez"  
      reportMailList = "testingpxc@proton.me,testingpxc_admin@proton.me"

      await driver.wait(until.elementLocated(By.xpath("//div[@data-analytics='modal headline'][contains(.,'Recurring Report')]")), 4000);
      await clearAndWrite(driver,"xpath","//input[@ng-reflect-placeholder='Title']", reportTitle);
      await clearAndWrite(driver,"xpath","//input[@ng-reflect-placeholder='Subtitle']",reportSubtitle);
      await clearAndWrite(driver,"xpath","//textarea[@placeholder='Description']", reportDescription);
      await driver.sleep(2000);
      
     // await driver.wait(until.elementLocated(By.xpath(`(//div[@data-analytics="modal"]//div[@class='bf' and contains(@style, 'background-color: var(--background-content);')])[1]`)), 3000).click();
      //await driver.wait(until.elementLocated(By.xpath("(//*[@class='bf'])[1]")), 3000).click();
      await driver.wait(until.elementLocated(By.id("dateFormat")), 3000).click();
      // Selecting american date format
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'DD/MM/YYYY')]")), 30000).click();
      await clearAndWrite(driver,"xpath","//input[@placeholder='Company']",reportCompany);
      await clearAndWrite(driver,"xpath","//input[@placeholder='Author']", reportAuthor);
      await clearAndWrite(driver,"xpath","//input[@placeholder='Mail List']",reportMailList);
      // We activate Widget Description Togle
      await driver.wait(until.elementLocated(By.xpath(`(//div[@data-analytics="modal"]//div[@class='bf' and contains(@style, 'background-color: var(--background-content);')])[1]`)), 3000).click();
      // We activate Statistics Togle
      await driver.wait(until.elementLocated(By.xpath(`(//div[@data-analytics="modal"]//div[@class='bf' and contains(@style, 'background-color: var(--background-content);')])[1]`)), 3000).click();
      // We activate Date Togle
    
      await driver.wait(until.elementLocated(By.xpath(`(//div[@data-analytics="modal"]//div[@class='bf' and contains(@style, 'background-color: var(--background-content);')])[1]`)), 3000).click();
      //We choose recurrance
      await driver.wait(until.elementLocated(By.id("recurrance")), 3000).click();
      await driver.findElement(By.xpath("(//div[@data-analytics='modal headline'][contains(.,'Recurring Report')])[2]"));
      await clearAndWrite(driver,"xpath","//input[@placeholder='Every']","1");
      await driver.wait(until.elementLocated(By.xpath("//span[@class='mdc-button__label'][contains(.,'OK')]")), 3000).click();
      await driver.wait(until.elementLocated(By.xpath("//pc-button[contains(.,'Create')]")), 3000).click();
      await waitingLoadingRingProficloudToDissapear(driver);

      await driver.wait(until.elementLocated(By.xpath("//flex-col[@class='recurring-report-item ng-star-inserted']//app-icon[@name='more']//*[name()='svg']")), 30000).click();
      await editButton(driver);
      await previewButton(driver);
      await waitForXPathPresentTimeout(driver,"//span[contains(.,'Report is ready for download.')]",60000);
      await downloadButton(driver);

      await handleBlobReportDownloadBs(driver);


      








     

             
      await logout(driver);
    });
  } catch (error) {
    throw new Error(`C620 failed: ${error.message}`);
  }
}





async function handleBlobReportDownload(driver) {
    try {
        // Obtener el manejador de ventanas
        const originalWindow = await driver.getWindowHandle();
        const newWindow = await driver.wait(async () => {
            const handles = await driver.getAllWindowHandles();
            return handles.length > 1 ? handles.find(handle => handle !== originalWindow) : null;
        }, 10000);

        // Cambiar al nuevo contexto
        await driver.switchTo().window(newWindow);

        // Esperar a que la página cargue completamente
        await driver.wait(
            async () => {
                const readyState = await driver.executeScript('return document.readyState;');
                return readyState === 'complete';
            },
            20000 // Tiempo aumentado
        );

        // Verificar si el Blob URL es directamente accesible
        const currentUrl = await driver.getCurrentUrl();
        if (!currentUrl.startsWith('blob:')) {
            throw new Error('No se encontró un Blob URL válido.');
        }
        console.log(`Blob URL directo: ${currentUrl}`);

        // Extraer y procesar el contenido del blob dentro del navegador
        const pdfContent = await driver.executeAsyncScript(async (blobUrl, callback) => {
            try {
                const response = await fetch(blobUrl);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const blob = await response.blob();

                if (blob.size === 0) {
                    callback({ error: 'El Blob está vacío.' });
                    return;
                }

                console.log(`Tamaño del Blob: ${blob.size} bytes`);

                // Convertir Blob a ArrayBuffer
                const arrayBuffer = await blob.arrayBuffer();
                const byteArray = Array.from(new Uint8Array(arrayBuffer));
                callback({ data: byteArray });
            } catch (err) {
                callback({ error: err.message });
            }
        }, currentUrl);

        if (pdfContent.error) {
            throw new Error(`Error al descargar el Blob: ${pdfContent.error}`);
        }

        // Convertir los datos del ArrayBuffer en un Buffer y guardar el archivo
        const buffer = Buffer.from(pdfContent.data);

        // Determinar la carpeta de descargas del usuario
        const downloadsFolder = path.join(os.homedir(), 'Downloads');
        const filePath = path.join(downloadsFolder, 'reporte.pdf');

        fs.writeFileSync(filePath, buffer);
        console.log(`Archivo PDF guardado en ${filePath}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}


async function handleBlobReportDownloadBs(driver) {
  try {
      const originalWindow = await driver.getWindowHandle();
      const newWindow = await driver.wait(async () => {
          const handles = await driver.getAllWindowHandles();
          return handles.length > 1 ? handles.find(handle => handle !== originalWindow) : null;
      }, 10000);

      await driver.switchTo().window(newWindow);

      await driver.wait(
          async () => {
              const readyState = await driver.executeScript('return document.readyState;');
              return readyState === 'complete';
          },
          20000
      );

      const currentUrl = await driver.getCurrentUrl();
      if (!currentUrl.startsWith('blob:')) {
          throw new Error('No se encontró un Blob URL válido.');
      }
      console.log(`Blob URL directo: ${currentUrl}`);

      // Extraer el contenido del Blob
      const pdfContent = await driver.executeAsyncScript(async (blobUrl, callback) => {
          try {
              const response = await fetch(blobUrl);
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              const blob = await response.blob();

              if (blob.size === 0) {
                  callback({ error: 'El Blob está vacío.' });
                  return;
              }

              const arrayBuffer = await blob.arrayBuffer();
              const byteArray = Array.from(new Uint8Array(arrayBuffer));
              callback({ data: byteArray });
          } catch (err) {
              callback({ error: err.message });
          }
      }, currentUrl);

      if (pdfContent.error) {
          throw new Error(`Error al descargar el Blob: ${pdfContent.error}`);
      }

      // Guardar el archivo localmente
      const buffer = Buffer.from(pdfContent.data);
      fs.writeFileSync('reporte.pdf', buffer);
      console.log('Archivo descargado localmente como reporte.pdf');
  } catch (error) {
      console.error(`Error: ${error.message}`);
  }
}


module.exports = uploadFile;





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
