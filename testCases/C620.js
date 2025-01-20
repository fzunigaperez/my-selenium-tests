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
 
  modalClose,
  getTextByLocator,
  
  
} = require('../utils/sharedFunctions'); // Reusable shared functions

// Main test function for C620
async function C620() {
  try {
    await testBase('C620_Create a recurring Report', async (driver) => {
      let vars = {}; // Initialize variables container


      // Downloading the report header for being used later in reports
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

    
      await createChart(driver, 'EPCTPC'); // Energy Pie Chart Time Period Comparison
      await createChart(driver, 'EBCDSC'); // Energy Bar Chart Data Source Comparison
      await createChart(driver,'EHMDSC');// Energy Heat Map Data Source Comparison  

      //We choose Yesterday in orther to avoid values probles

      await driver.wait(until.elementLocated(By.xpath("(//app-icon[contains(@name,'calendar')])[2]")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//div[@class='range-item ng-star-inserted'][contains(.,'Yesterday')]")), 30000).click();



      //Statistics activated  
      await driver.sleep(3000);
      await driver.wait(until.elementLocated(By.xpath("//*[name()='div' and @id='profi-select-placeholder']//preceding::*[name()='svg'][@class='mdc-switch__icon mdc-switch__icon--off']")), 2000).click();
      await waitingLoadingRingProficloudToDissapear(driver);
      await driver.wait(until.elementLocated(By.xpath("(//*[@name='comments'])[1]")), 3000).click();
      await clearAndWrite(driver,"xpath","//textarea[@placeholder='Comments']","This comment should be in the report");

      //Getting some chart information

      chartTitle1 = await getTextByLocator(driver,"xpath","(//div[contains(@class,'description ng-star-inserted')])[1]");
      chartTitle2 = await getTextByLocator(driver,"xpath","(//div[contains(@class,'description ng-star-inserted')])[2]");
      chartTitle3 = await getTextByLocator(driver,"xpath","(//div[contains(@class,'description ng-star-inserted')])[3]");
      deviceName1 = await getTextByLocator(driver,"xpath","//div[@title='PH 1 Machine Park 1 - Ea+'][normalize-space()='PH 1 Machine Park 1 - Ea+']");
      deviceName2 = await getTextByLocator(driver,"xpath","//div[@title='PH 1 Machine Park 2 - Ea+'][normalize-space()='PH 1 Machine Park 2 - Ea+']");







      const tableData = await extractDynamicTableText(driver);
        
      console.log('Table Data:');
      console.table(tableData);
     
 
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
      await uploadFile(driver, '#logo-upload-container .file-input', 'BS', 'pxcLogo.jpg');
      
    
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

      await driver.get("https://status.ocr.space/");
      await driver.wait(until.elementLocated(By.xpath("//h4[contains(.,'API Access Points')]")), 30000);
      ocrStatus = await getTextByLocator(driver,"xpath",'.//*[contains(concat(" ",normalize-space(@class)," ")," systems ")][(count(preceding-sibling::*)+1) = 3]//tr[(count(preceding-sibling::*)+1) = 1]/*[contains(concat(" ",normalize-space(@class)," ")," tb_b_right ")][(count(preceding-sibling::*)+1) = 3]');
      
      if (ocrStatus = "ON") {
        console.log("The OCR service is available, thus the text cann go for OCR identification")
 
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
      reportTitle,reportSubtitle,reportDescription,reportCompany,reportAuthor,dateOfToday,chartTitle1,chartTitle2,chartTitle3,
      deviceName1,deviceName2,
    
    
    };

  // Esperamos a que el <textarea> esté presente en la página
  const textarea = await driver.findElement(By.id('txtAreaParsedResult'));
  
  // Obtenemos el valor del <textarea> (el contenido de fullText)
  const fullText = await textarea.getAttribute('value');

  // Normalizamos el texto completo
  const normalizedFullText = normalizeText(fullText);
  console.log (normalizedFullText);

  await searchTextInTextarea(driver, searchStrings, normalizedFullText); 



  // Convertir la tabla en un objeto de búsqueda
  const searchStrings2 = {};
  tableData.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const key = `Row${rowIndex + 1}_Col${colIndex + 1}`;
      searchStrings2[key] = cell;
    });
  });

 

  console.log('Search Strings:', searchStrings2);
  console.log (normalizedFullText);



  await searchTextInTextarea(driver, searchStrings2, normalizedFullText); 

}
else{

  console.log('The OCR identificaction service is not available')
    
}

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
  let totalSearchStrings = Object.entries(searchStrings).length;
  let matchesCount = 0;

  // Iterate through the strings we want to search
  for (const [key, value] of Object.entries(searchStrings)) {
      const normalizedSearchString = normalizeText(value);

      if (normalizedFullText.includes(normalizedSearchString)) {
          matchesCount++;
          console.log(`Found ${key}:`, value);
      } else {
          console.log(`${key} not found`);
      }
  }

  const matchPercentage = (matchesCount / totalSearchStrings) * 100;
  console.log(`Matches found: ${matchesCount}/${totalSearchStrings} (${matchPercentage.toFixed(2)}%)`);

  if (matchPercentage >= 80) {
      console.log("At least 80% of the strings were found.");
      return true; // Success
  } else {
      console.error("Less than 80% of the strings were found. Failing...");
      throw new Error("Search criteria not met: At least 80% of the strings were not found.");
  }
}




/**
 * Extracts the text from all cells of a table using XPath format,
 * processes specific values (rounding, removing commas and units), and removes certain rows.
 * @param {WebDriver} driver - The Selenium WebDriver instance.
 * @returns {Promise<Array<Array<string>>>} A two-dimensional array with the table's text content.
 */
async function extractDynamicTableText(driver) {
  let tableData = [];
  
  // Calculate the number of rows
  const rows = await driver.findElements(By.xpath('//tr'));
  const rowCount = rows.length;

  // Calculate the number of columns in the first row
  const firstRowColumns = await driver.findElements(By.xpath('//tr[1]//td | //tr[1]//th'));
  const columnCount = firstRowColumns.length;

  // Iterate over each row and column to extract the data
  for (let rowIndex = 2; rowIndex <= rowCount; rowIndex++) { // Start from row 2
      let rowData = [];
      
      for (let colIndex = 2; colIndex <= columnCount; colIndex++) { // Start from column 2
          const cellXPath = `//tr[${rowIndex}]//td[${colIndex}]//div[1]`;

          try {
              const cellElement = await driver.findElement(By.xpath(cellXPath));
              const cellText = await cellElement.getText();
              rowData.push(cellText);
          } catch (error) {
              // Handle empty or non-existent cells
              rowData.push('');
          }
      }

      tableData.push(rowData);
  }

  // Process the table: round, clean, and remove rows as requested
  tableData = tableData.map((row, index) => {
      return row.map(value => {
          // Process row 8 (zero-based index 7)
          if (index === 7 || index === 8) {
              // Remove commas and 'kWh', then round to 2 decimals
              const cleanedValue = value.replace(/[\s,]*kWh/g, '').replace(/,/g, '');
            const numericValue = parseFloat(cleanedValue);
            return !isNaN(numericValue) ? numericValue.toFixed(2) : value;
          }

          // Round values for rows 1-4 and 7
          if ([0, 1, 2, 3, 6].includes(index)) {
              const numericValue = parseFloat(value.replace(/,/g, ''));
              return !isNaN(numericValue) ? numericValue.toFixed(2) : value;
          }

          // Return unmodified for other rows
          return value;
      });
  });

  // Remove rows 5 and 6 (indices 4 and 5 in zero-based indexing)
  tableData.splice(4, 2);

  return tableData;
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
