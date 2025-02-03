
const { Builder, By, until } = require('selenium-webdriver'); // Selenium WebDriver essentials
const assert = require('assert'); // Assertion module for validations
const testBase = require('./testBase'); // Common test setup
const moment = require('moment'); 

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
  sendMessageLogToBrowserStack,
  switchToExtraOrganization,
  

} = require('../utils/sharedFunctions'); // Reusable shared functions

// Main test function for C1056
async function C1056() {
  try {
    await testBase('C1056_Recurring reports are sent according with their configuration', async (driver) => {
      let vars = {}; // Initialize variables container

      

      await windowConfiguration(driver, "EMMA");
      await loginAdmin(driver, vars);
      await emmaMenu(driver);
      await switchToExtraOrganization(driver,"Manager Orga");
      await driver.wait(until.elementLocated(By.xpath("//div[@class='mat-mdc-tooltip-trigger dashboard__tab-title'][contains(.,'Recurring Reports')]")), 30000).click();
      await reports(driver);

      await waitForXPathPresentTimeout(driver,"//div[@title='Daily Recurring Report']",10000);
      await waitForXPathPresentTimeout(driver,"//div[@title='Weekly Recurring Report']",10000);

      //We open the dropdown menu to see if the recurring reports are being generated
      await driver.wait(until.elementLocated(By.xpath("//flex-col[@class='reports__existing']//flex-col//flex-col[1]//flex-row[1]//div[3]//app-icon[1]//*[name()='svg']")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//flex-col[@class='reports__existing']//flex-col//flex-col[2]//flex-row[1]//div[3]//app-icon[1]//*[name()='svg']")), 30000).click();

      //If the report should be present, then we check if it has been generated. 

      let dailyXPath = getXPathPreviousDay();
        let weeklyXPath = getXPathWeeklyReport();

        // Verificar la presencia del elemento diario
        try {
            let isDailyPresent = await waitForXPathPresentTimeout(driver, dailyXPath, 10000);
            if (isDailyPresent) {
                let dailyElement = await driver.findElement(By.xpath(dailyXPath));
                console.log(await dailyElement.getText());
            }
        } catch (error) {
            console.error("Daily report not found:", error.message);
        }

        // Verificar la presencia del elemento semanal solo si no es null
        if (weeklyXPath) {
            try {
                let isWeeklyPresent = await waitForXPathPresentTimeout(driver, weeklyXPath, 10000);
                if (isWeeklyPresent) {
                    let weeklyElement = await driver.findElement(By.xpath(weeklyXPath));
                    console.log(await weeklyElement.getText());
                }
            } catch (error) {
                console.error("Weekly report not found:", error.message);
            }
        }

      
     
      // C651 Delete a recurring and manual report
      await deleteManualReports(driver);
      await deleteRecurringReports(driver);
      await reportActionsButton(driver);
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Create Recurring Report')]")), 3000).click();
      await uploadFile(driver, '.file-input', 'BS', 'reportHeader.png');

      const reportTitle = "Phoenix Contact Recurring Report";
      const reportSubtitle = "Testing Subtitle";
      const reportDescription = "At absolute zero temperature, the system is in the state with the minimum thermal energy, the ground state. The constant value (not necessarily zero) of entropy at this point is called the residual entropy of the system. With the exception of non-crystalline solids (e.g. glass) the residual entropy of a system is typically close to zero.";
      const dateOfToday = await getCurrentDate('/');
      const reportCompany = "Apple Company";
      const reportAuthor = "Fernando Alejandro Zuniga Perez";
      const reportMailList = "testingpxc@proton.me,testingpxc_admin@proton.me";

      await driver.wait(until.elementLocated(By.xpath("//div[@data-analytics='modal headline'][contains(.,'Recurring Report')]")), 4000);
      await clearAndWrite(driver, "xpath", "//input[@ng-reflect-placeholder='Title']", reportTitle);
      await clearAndWrite(driver, "xpath", "//input[@ng-reflect-placeholder='Subtitle']", reportSubtitle);
      await clearAndWrite(driver, "xpath", "//textarea[@placeholder='Description']", reportDescription);
      await driver.sleep(2000);
      await uploadFile(driver, '#logo-upload-container .file-input', 'BS', 'pxcLogo.jpg');

      await driver.wait(until.elementLocated(By.id("dateFormat")), 3000).click();
      // Select American date format
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'DD/MM/YYYY')]")), 30000).click();
      await clearAndWrite(driver, "xpath", "//input[@placeholder='Company']", reportCompany);
      await clearAndWrite(driver, "xpath", "//input[@placeholder='Author']", reportAuthor);
      await clearAndWrite(driver, "xpath", "//input[@placeholder='Mail List']", reportMailList);

      // Activate toggles
      await driver.wait(until.elementLocated(By.xpath(`(//div[@data-analytics="modal"]//div[@class='bf' and contains(@style, 'background-color: var(--background-content);')])[1]`)), 3000).click();

      // Choose recurrence
      await driver.wait(until.elementLocated(By.id("recurrance")), 3000).click();
      await driver.findElement(By.xpath("(//div[@data-analytics='modal headline'][contains(.,'Recurring Report')])[2]"));
      await clearAndWrite(driver, "xpath", "//input[@placeholder='Every']", "1");
      await driver.wait(until.elementLocated(By.xpath("//span[@class='mdc-button__label'][contains(.,'OK')]")), 3000).click();
      await driver.wait(until.elementLocated(By.xpath("//pc-button[contains(.,'Create')]")), 3000).click();
      await waitingLoadingRingProficloudToDissapear(driver);

      await driver.wait(until.elementLocated(By.xpath("//flex-col[@class='recurring-report-item ng-star-inserted']//app-icon[@name='more']//*[name()='svg']")), 30000).click();
      await editButton(driver);
      await previewButton(driver);
      await waitForXPathPresentTimeout(driver, "//span[contains(.,\"Report is ready for download.\")]", 120000);

      await downloadButton(driver);

      // C1053 Preview of a recurring report creates and downloads a manual report
      await handleBlobReportDownloadBs(driver, "recurringReport");
      await driver.sleep(3000);
      await modalClose(driver);
      //We delete the reports, in order to do not cause undesired emails
      await deleteManualReports(driver);
      await deleteRecurringReports(driver);

      await logout(driver);

      // OCR validation
      await driver.get("https://status.ocr.space/");
      await driver.wait(until.elementLocated(By.xpath("//h4[contains(.,'API Access Points')]")), 30000);
      const ocrStatus = await getTextByLocator(driver, "xpath", './/*[contains(concat(" ",normalize-space(@class)," ")," systems ")][(count(preceding-sibling::*)+1) = 3]//tr[(count(preceding-sibling::*)+1) = 1]/*[contains(concat(" ",normalize-space(@class)," ")," tb_b_right ")][(count(preceding-sibling::*)+1) = 3]');

      if (ocrStatus === "UP") {
        await sendMessageLogToBrowserStack(driver,"The OCR service is available, the text can proceed for OCR identification.");
       // console.log("The OCR service is available, the text can proceed for OCR identification.");

        await driver.get("https://ocr.space/");
        await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Free Online OCR - Convert images and PDF to text (Powered by the OCR API)')]")), 30000);
        await uploadFile(driver, "#imageFile", "BS", "recurringReport.pdf");
        await driver.wait(until.elementLocated(By.id("chkIsDetectOrientation")), 3000).click();
        await driver.wait(until.elementLocated(By.id("chkIsOneColumnOnly")), 3000).click();
        await driver.wait(until.elementLocated(By.id("engine5")), 3000).click();
        await driver.wait(until.elementLocated(By.linkText("Start OCR!")), 3000).click();
        await driver.wait(until.elementLocated(By.id("sucOrErrMessage")), 30000);
       


        const searchStrings = {
          reportTitle, reportSubtitle, reportDescription, reportCompany, reportAuthor, dateOfToday, chartTitle1, chartTitle2, chartTitle3,
          deviceName1, deviceName2
        };

        const textarea = await driver.findElement(By.id('txtAreaParsedResult'));
        const fullText = await textarea.getAttribute('value');
        const normalizedFullText = normalizeText(fullText);

        // console.log(normalizedFullText);
        // await searchTextInTextarea(driver, searchStrings, normalizedFullText);

        // const searchStrings2 = {};
        // tableData.forEach((row, rowIndex) => {
        //   row.forEach((cell, colIndex) => {
        //     const key = `Row${rowIndex + 1}_Col${colIndex + 1}`;
        //     searchStrings2[key] = cell;
        //   });
        // });

        // console.log('Search Strings:', searchStrings2);
        // console.log(normalizedFullText);
        // await searchTextInTextarea(driver, searchStrings2, normalizedFullText);

      } else {
        console.log('The OCR identification service is not available.');
      }

    });
  } catch (error) {
    throw new Error(`C1056 failed: ${error.message}`);
  }
}

// Normalize text by removing extra spaces and line breaks
function normalizeText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

// Search for specific strings in OCR results
async function searchTextInTextarea(driver, searchStrings, normalizedFullText) {
  let totalSearchStrings = Object.entries(searchStrings).length;
  let matchesCount = 0;

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
    return true;
  } else {
    throw new Error("Search criteria not met: At least 80% of the strings were not found.");
  }
}

// Extract text from a dynamic table
async function extractDynamicTableText(driver) {
  let tableData = [];

  const rows = await driver.findElements(By.xpath('//tr'));
  const rowCount = rows.length;
  const firstRowColumns = await driver.findElements(By.xpath('//tr[1]//td | //tr[1]//th'));
  const columnCount = firstRowColumns.length;

  for (let rowIndex = 2; rowIndex <= rowCount; rowIndex++) {
    let rowData = [];

    for (let colIndex = 2; colIndex <= columnCount; colIndex++) {
      const cellXPath = `//tr[${rowIndex}]//td[${colIndex}]//div[1]`;

      try {
        const cellElement = await driver.findElement(By.xpath(cellXPath));
        const cellText = await cellElement.getText();
        rowData.push(cellText);
      } catch (error) {
        rowData.push('');
      }
    }

    tableData.push(rowData);
  }

  tableData = tableData.map((row, index) => {
    return row.map(value => {
      if (index === 7 || index === 8) {
        const cleanedValue = value.replace(/[\s,]*kWh/g, '').replace(/,/g, '');
        const numericValue = parseFloat(cleanedValue);
        return !isNaN(numericValue) ? numericValue.toFixed(2) : value;
      }

      if ([0, 1, 2, 3, 6].includes(index)) {
        const numericValue = parseFloat(value.replace(/,/g, ''));
        return !isNaN(numericValue) ? numericValue.toFixed(2) : value;
      }

      return value;
    });
  });

  tableData.splice(4, 2);
  return tableData;
}

if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Running test C1056...');
      await C1056();
      console.log('✅ Test completed successfully.');
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      console.error(error.stack);
    }
  })();
}

module.exports = C1056;



function getXPathPreviousDay() {
    // Obtener la fecha del día anterior en formato YYYY-MM-DD
    const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
    
    // Construir el XPath con la fecha dinámica
    const xpath = `//div[@class='recurring-report-name'][contains(.,'Daily Recurring Report - ${yesterday}')]`;
    
    return xpath;
}

function getXPathWeeklyReport() {
    const today = moment().day(); // Obtener el día de la semana (0 = domingo, 6 = sábado)
    if ([1, 3, 5].includes(today)) { // Lunes (1), Miércoles (3) o Viernes (5)
        const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
        return `//div[@class='recurring-report-name'][contains(.,'Weekly Recurring Report - ${yesterday}')]`;
    }
    return null;
}