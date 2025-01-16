const { Builder, By, until } = require('selenium-webdriver'); // Selenium WebDriver essentials
const assert = require('assert'); // Assertion module for validations
const testBase = require('./testBase'); // Common test setup
const fuzzysearch = require('fuzzysearch');
//const path = require('path');
//const fs = require('fs');
//const os = require('os');
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
  handleBlobReportDownloadBs,
  handleBlobReportDownload,
  modalClose,
  
} = require('../utils/sharedFunctions'); // Reusable shared functions

// Main test function for C620
async function C620() {
  try {
    await testBase('C620_Create a recurring Report', async (driver) => {
      let vars = {}; // Initialize variables container


      //Downloading the report header for being used later in reports
      await driver.get("https://drive.proton.me/urls/JYFCSERXA8#NjpWqhWe0J8q");
      await driver.wait(until.elementLocated(By.xpath("//button[@data-testid='scan-download-button']")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Download finished') or contains(.,'Download abgeschlossen') ]")), 30000);

      
      //Downloading the report logo for being used later in reports
      await driver.get("https://drive.proton.me/urls/Z4RYVB8HG8#4gJvRmcoqgN1");
      await driver.wait(until.elementLocated(By.xpath("//button[@data-testid='scan-download-button']")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Download finished') or contains(.,'Download abgeschlossen') ]")), 30000);

    
    

      await windowConfiguration(driver,"EMMA");
      await loginAdmin(driver, vars);
      await emmaMenu(driver);
     await cleanDashboard(driver);
       //await createChart(driver, 'EPARBT'); // Energy Pareto Chart Ranked by Time Period
      await createChart(driver, 'EPCTPC'); // Energy Pie Chart Time Period Comparison
      await createChart(driver, 'EBCDSC'); // Energy Bar Chart Data Source Comparison
      await createChart(driver,'EHMDSC');// Energy Heat Map Data Source Comparison  
      //Statistics activated  
      await driver.sleep(3000);
      await driver.wait(until.elementLocated(By.xpath("//*[name()='div' and @id='profi-select-placeholder']//preceding::*[name()='svg'][@class='mdc-switch__icon mdc-switch__icon--off']")), 2000).click();
      await waitingLoadingRingProficloudToDissapear(driver);
      await driver.wait(until.elementLocated(By.xpath("(//*[@name='comments'])[1]")), 3000).click();
      await clearAndWrite(driver,"xpath","//textarea[@placeholder='Comments']","This comment should be in the report");

      tableData = await extractTableData(driver);



 
     
 
      await reports(driver);
      await deleteManualReports(driver);
      await deleteRecurringReports(driver);
      await reportActionsButton(driver);
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Create Recurring Report')]")), 3000).click();
      await uploadFile(driver, '.file-input', 'local', 'reportHeader.png');


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
      await uploadFile(driver, '#logo-upload-container .file-input', 'local', 'pxcLogo.jpg');
      
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
      await handleBlobReportDownloadBs(driver,"recurringReport");
      await driver.sleep(3000);
      await modalClose(driver);
    

      await logout(driver);


        await driver.get("https://ocr.space/");
        await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Free Online OCR - Convert images and PDF to text (Powered by the OCR API)')]")), 30000);
        await uploadFile(driver,"#imageFile","local","recurringReport.pdf");
        await driver.wait(until.elementLocated(By.id("chkIsDetectOrientation")), 3000).click();
        await driver.wait(until.elementLocated(By.id("engine5")), 3000).click();
        await driver.wait(until.elementLocated(By.linkText("Start OCR!")), 3000).click();
        await driver.wait(until.elementLocated(By.id("sucOrErrMessage")), 30000);
      //  await driver.wait(until.elementLocated(By.xpath("//a[contains(.,'Json')]")), 3000).click();
        await driver.sleep(5000);


        const searchStrings = {
          //Title: reportTitle,
          Subtitle: "Testing Subtitle",
          Description: "At absolute zero temperature, the system is in the state with the minimum thermal energy, the ground state. The constant value (not necessarily zero) of entropy at this point is called the residual entropy of the system. With the exception of non-crystalline solids (e.g. glass) the residual entropy of a system is typically close to zero.",
          Company: "Apple Company",
          Author: "Fernando Alejandro Zuniga Perez",
          WidgetComment: "This comment should be in the report",
          TableData1: tableData[0] ? tableData[0].join(", ") : "",  // Asume que la primera fila será TableData1
          TableData2: tableData[1] ? tableData[1].join(", ") : ""   // Asume que la segunda fila será TableData2
        };

  // Esperamos a que el <textarea> esté presente en la página
  const textarea = await driver.findElement(By.id('txtAreaParsedResult'));
  
  // Obtenemos el valor del <textarea> (el contenido de fullText)
  const fullText = await textarea.getAttribute('value');

  // Normalizamos el texto completo
  const normalizedFullText = normalizeText(fullText);

  await searchTextInTextarea(driver, searchStrings, normalizedFullText); 
 
  

    });
  } catch (error) {
    throw new Error(`C620 failed: ${error.message}`);
  }
}

// Función para eliminar saltos de línea y espacios extras
function normalizeText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

async function searchTextInTextarea(driver, searchStrings, normalizedFullText) {
  // Recorremos las cadenas que queremos buscar
  for (const [key, value] of Object.entries(searchStrings)) {
    // Normalizamos las cadenas a buscar
    const normalizedSearchString = normalizeText(value);

    if (normalizedFullText.includes(normalizedSearchString)) {
      console.log(`Found ${key}:`, value);
    } else {
      console.log(`${key} not found`);
    }
  }
}


async function extractTableData(driver) {
  const allData = [];

  // Espera a que la tabla esté presente
  await driver.wait(until.elementLocated(By.id('statistics')), 10000);

  // Obtiene todas las filas de la tabla
  const rows = await driver.findElements(By.css('#statistics tr'));

  // Recorre cada fila y extrae los datos
  for (let row of rows) {
    const cells = await row.findElements(By.css('td'));
    if (cells.length > 0) {
      const rowData = [];
      for (let cell of cells) {
        const text = await cell.getText();
        rowData.push(text.trim());
      }
      allData.push(rowData);  // Guardamos los datos extraídos
    }
  }

  return allData;  // Asegúrate de devolver los datos extraídos
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
