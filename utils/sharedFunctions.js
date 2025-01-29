const { By, until } = require('selenium-webdriver');
const assert = require('assert'); // Import the assert module
const axios = require('axios'); // Necessary to send test results
const path = require('path');
const fs = require('fs');
const os = require('os');
const { allowedNodeEnvironmentFlags } = require('process');
const { all } = require('axios');
require('dotenv').config(); // Cargar variables de entorno

//const C714 = require('../testCases/C714');  NEVER NEVER NEVER DECLARE HERE A TEST CASE otherwhise couses a lot of problems


/**
 * Configures the browser window and navigates to the appropriate environment.
 * @param {WebDriver} driver - Instance of the Selenium WebDriver.
 * @param {string} service - The service for which the environment will be configured (EMMA, UMS, etc.).
 */
async function windowConfiguration(driver, service = 'TEST_ENV') {
  // Map the services to their environment variables
  const serviceEnvs = {
    EMMA: process.env.EMMA_ENV || 'STG', // Default STG
    UMS: process.env.UMS_ENV || 'DEV', // Default PROD
    TEST_ENV: process.env.TEST_ENV || 'STG', // Default general
  };

  // Select the environment based on the service
  const serviceEnv = serviceEnvs[service] || serviceEnvs.TEST_ENV;

  // URLs by environment
  const urls = {
    PROD: process.env.PROD_URL,
    STG: process.env.STG_URL,
    DEV: process.env.DEV_URL,
  };

  const targetUrl = urls[serviceEnv] || urls.PROD; // Default PROD if nothing matches
  console.log(`🌍 Executing in the environment: ${serviceEnv} (${targetUrl}) for service: ${service}`);

  // Navigate to the URL and maximize the window
  await driver.get(targetUrl);
  await driver.manage().window().maximize();

  return serviceEnv;  // 🔥 
}


// Function to create a Test Run in TestRail
async function createTestRun(projectId, testRunName, testCaseIds = []) {
  const url = `https://testingpxc.testrail.io/index.php?/api/v2/add_run/${projectId}`;
  const auth = {
    username: process.env.TESTRAIL_USERNAME, // Set your environment variables
    password: process.env.TESTRAIL_API_KEY
  };

  const data = {
    name: testRunName,
    include_all: testCaseIds.length === 0, // Include all cases if the list is empty
    case_ids: testCaseIds // List of case IDs, optional
  };

  try {
    const response = await axios.post(url, data, { auth });
    console.log('Test run created successfully:', response.data);
    return response.data; // Return the details of the Test Run (such as its ID)
  } catch (error) {
    console.error('Error creating test run:', error.message);
    throw error;
  }
}


// Function to send results to TestRail
async function sendResultToTestRail(testCaseId, status, comment = '', testRunId) {
  const url = `https://testingpxc.testrail.io/index.php?/api/v2/add_result_for_case/${testRunId}/${testCaseId}`;
  const auth = {
    username: process.env.TESTRAIL_USERNAME,
    password: process.env.TESTRAIL_API_KEY
  };

  const data = {
    status_id: status,
    comment: comment
  };

  try {
    const response = await axios.post(url, data, { auth });
    console.log('TestRail result sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending test result to TestRail:', error.message);
    throw error;
  }
}

async function usersTab(driver) {

  await driver.wait(until.elementLocated(By.xpath("//span[@class='mdc-tab__text-label'][contains(.,'Users')]")), 30000).click();
  
}

async function subscriptionsTab(driver) {

  await driver.wait(until.elementLocated(By.xpath("//span[@class='mdc-tab__text-label'][contains(.,'Subscriptions')]")), 30000).click();
  
}

async function assignDevicesButton(driver) {

  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Assign Devices')]")), 30000).click();
  
}


async function waitForUsersToLoad(driver) {

await driver.sleep(1000);
let usersPresent= await driver.wait(until.elementLocated(By.xpath("/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[1]/app-user-management[1]/div[1]/app-members[1]/flex-col[1]/flex-col[1]/div[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/div[1]/pc-list-item[1]/div[1]/div[1]")), 30000);
await driver.wait(until.elementIsVisible(usersPresent),5000);
await driver.sleep(1000);

}


// Function to log in to ProtonMail
async function loginToProtonMail(driver,vars) {
  try {
    // Navigate to the login URL
    await driver.get("https://mail.proton.me/");
    await driver.sleep(1000);  // Remove this because of Zacualpan

    // Verify if the user is authenticated or needs to log in
    const xpath = "//button[contains(.,'New message')]";

    // Use executeScript to quickly search for the element
    const isLoggedIn = await driver.executeScript((xpath) => {
      const result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      return result.snapshotLength; // Return the number of elements found
    }, xpath);

    console.log('Are we already inside of ProtonMail?:', isLoggedIn);

    if (isLoggedIn > 0) {
      console.log("User already authenticated. Proceeding directly to 'Proton Mail Plus'.");

      const elementToClick = await driver.wait(
        until.elementLocated(By.xpath("//div[@class='text-ellipsis'][contains(.,'Proton Mail Plus')]")),
        5000
      );

      await driver.wait(until.elementIsVisible(elementToClick), 2000);
      await elementToClick.click();
      console.log("Click on 'Proton Mail Plus' successful.");
    } else {
      console.log("User not authenticated. Proceeding with login.");

      // User variables
      vars["mailUsername"] = "testingpxc_admin@proton.me";
      vars["mailPassword"] = "Proficloud2022!";

      // Wait for the username field to be available
      const usernameField = await driver.wait(until.elementLocated(By.id("username")), 10000);
      await usernameField.sendKeys(vars["mailUsername"]);

      // Wait for the password field to be available and send data
      const passwordField = await driver.wait(until.elementLocated(By.id("password")), 10000);
      await passwordField.sendKeys(vars["mailPassword"]);

      // Click the login button
      const submitButton = await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 10000);
      await submitButton.click();
      console.log("Credentials entered. Waiting for 'Proton Mail Plus'...");

      // Wait for 'Proton Mail Plus' to be available
      try {
        console.log("Waiting for 'Proton Mail Plus' to be available...");

        const maxWaitTime = 1000; // 5 seconds
        const pollInterval = 1000; // Check every 1 second
        let elapsedTime = 0;
        let elementToClick = null;

        while (elapsedTime < maxWaitTime) {
          const xpath = "//div[@class='text-ellipsis'][contains(.,'Proton Mail Plus')]";

          const elements = await driver.executeScript((xpath) => {
            const result = document.evaluate(
              xpath,
              document,
              null,
              XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
              null
            );
            return result.snapshotLength; // Return the number of elements found
          }, xpath);

          if (elements > 0) {
            elementToClick = elements[0];
            break; // Exit loop if element is found
          }
          await driver.sleep(pollInterval); // Wait before checking again
          elapsedTime += pollInterval;
        }

        if (elementToClick) {
          console.log("'Proton Mail Plus' found. Proceeding to click.");
          await driver.wait(until.elementIsVisible(elementToClick), 1000);
          await elementToClick.click();
          console.log("Click on 'Proton Mail Plus' successful.");
        } else {
          console.log("'Proton Mail Plus' did not appear within the allowed time. Continuing without clicking.");
        }

     

      } catch (error) {
        console.error("An error occurred while checking or clicking 'Proton Mail Plus':", error);
      }
    }
  } catch (err) {
    console.error("An error occurred:", err);
  }
  console.log("Waiting for Inbox to appear")
  await driver.wait(until.elementLocated(By.xpath("//span[@class='text-ellipsis'][contains(.,'Inbox')]")), 60000);
  console.log("Inbox to appeared we are indise of Proton Mail")
  

}

async function sortByEmails(driver) {
  try {
    // Encuentra todos los elementos de email con el XPath (aumenta de 2 en 2)
    let emails = [];
    let index = 1;
    while (true) {
      try {
        let emailElement = await driver.findElement(
          By.xpath(`(//pc-list-item/div/div/div/div[2])[${index}]`)
        );
        let email = await emailElement.getText();
        if (email) emails.push(email);
        index += 2; // Aumenta de 2 en 2
      } catch (err) {
        break; // Salir cuando no haya más elementos
      }
    }

    // Ordenar los emails alfabéticamente (A-Z)
    emails.sort((a, b) => a.localeCompare(b));

    // Asignar valores numéricos a las letras iniciales de los emails
    let emailsWithValues = emails.map((email) => {
      let firstLetter = email[0].toLowerCase(); // Primera letra del email
      let numericValue = firstLetter.charCodeAt(0) - 96; // Convertir letra a valor (a=1, b=2, ..., z=26)
      return { email, numericValue };
    });

    // Verificar si los emails están ordenados de menor a mayor
    let isSorted = emailsWithValues.every((item, index, array) => 
      index === 0 || item.email >= array[index - 1].email
    );

    // Imprimir resultados
    console.table(
      emailsWithValues.map((item, index) => ({
        Index: index + 1, // Índice humano (empezando en 1)
        Email: item.email,
        NumericValue: item.numericValue
      }))
    );

    console.log(`¿Están los emails ordenados alfabéticamente (A-Z)? ${isSorted ? 'Sí' : 'No'}`);

    // Si no están ordenados, detener el programa
    if (!isSorted) {
      console.error('❌ Los emails no están ordenados alfabéticamente. Deteniendo el programa.');
      await forceFailStatus(driver);
    }
  } catch (error) {
    console.error('Error al ordenar los emails:', error);
    process.exit(1); // Terminar el proceso con un código de error
  }
}

async function sortByRole(driver) {
  try {
    // Encuentra todos los elementos de roles con el XPath (aumenta de 1 en 1)
    let roles = [];
    let index = 1;
    while (true) {
      try {
        let roleElement = await driver.findElement(
          By.xpath(`//div[${index}]/pc-list-item/div/div/div[3]/div[2]`)
        );
        let role = await roleElement.getText();
        if (role) roles.push(role);
        index += 1; // Aumenta de 1 en 1
      } catch (err) {
        break; // Salir cuando no haya más elementos
      }
    }

    // Asignar valores numéricos a los roles
    let roleValues = roles.map((role) => {
      let numericValue;
      if (role.toLowerCase() === 'admin') numericValue = 1;
      else if (role.toLowerCase() === 'editor') numericValue = 2;
      else if (role.toLowerCase() === 'viewer') numericValue = 3;
      else numericValue = 999; // Valor alto para roles desconocidos

      return { role, numericValue };
    });

    // Ordenar los roles por sus valores numéricos
    roleValues.sort((a, b) => a.numericValue - b.numericValue);

    // Verificar si los roles están ordenados de menor a mayor
    let isSorted = roleValues.every((item, index, array) => 
      index === 0 || item.numericValue >= array[index - 1].numericValue
    );

    // Imprimir resultados
    console.table(
      roleValues.map((item, index) => ({
        Index: index + 1, // Índice humano (empezando en 1)
        Role: item.role,
        NumericValue: item.numericValue
      }))
    );

    console.log(`¿Están los roles ordenados correctamente (Admin, Editor, Viewer)? ${isSorted ? 'Sí' : 'No'}`);

    // Si no están ordenados, detener el programa
    if (!isSorted) {
      console.error('❌ Los roles no están ordenados correctamente. Deteniendo el programa.');
      await forceFailStatus(driver);
    }
  } catch (error) {
    console.error('Error al ordenar los roles:', error);
    process.exit(1); // Terminar el proceso con un código de error
  }
}

async function sortByInvitedStatus(driver) {
  try {
    // Encuentra todos los elementos de invitación con el XPath (aumenta de 1 en 1)
    let invitedStatuses = [];
    let index = 1;
    while (true) {
      try {
        let invitedElement = await driver.findElement(
          By.xpath(`//div[${index}]/pc-list-item/div/div/div[2]`)
        );
        let status = await invitedElement.getText();

        // Ignorar si el texto contiene "(you)"
        if (status.toLowerCase().includes('(you)')) {
          index += 1;
          continue;
        }

        invitedStatuses.push(status ? status.trim() : '');
        index += 1; // Aumenta de 1 en 1
      } catch (err) {
        break; // Salir cuando no haya más elementos
      }
    }

    // Asignar valores numéricos a los estados de invitación
    let invitedValues = invitedStatuses.map((status) => {
      let numericValue;
      if (status === '') numericValue = 1; // Sin información
      else if (status.toLowerCase() === '(invitation pending)') numericValue = 2;
      else numericValue = 999; // Valor alto para estados desconocidos

      return { status, numericValue };
    });

    // Verificar que los primeros estén vacíos y los últimos tengan "(invitation pending)"
    let isSorted = invitedValues.every((item, index, array) => 
      index === 0 || item.numericValue >= array[index - 1].numericValue
    );

    // Imprimir resultados
    console.table(
      invitedValues.map((item, index) => ({
        Index: index + 1, // Índice humano (empezando en 1)
        Status: item.status,
        NumericValue: item.numericValue
      }))
    );

    console.log(`¿Están los estados de invitación ordenados correctamente (vacío, luego "(invitation pending)")? ${isSorted ? 'Sí' : 'No'}`);

    // Si no están ordenados, detener el programa
    if (!isSorted) {
      console.error('❌ Los estados de invitación no están ordenados correctamente. Deteniendo el programa.');
      await forceFailStatus(driver);
    }
  } catch (error) {
    console.error('Error al ordenar los estados de invitación:', error);
    process.exit(1); // Terminar el proceso con un código de error
  }
}

async function reports(driver) {

  await scrollToElementByXPath(driver,"//div[@role='tab'][contains(.,'Reports')]");
  await driver.wait(until.elementLocated(By.xpath("//span[@class='mdc-tab__content'][contains(.,'Reports')]")), 5000).click();
  await driver.sleep(1000);
  
  
  
}
async function reloadPage(driver) {

    // Reload (refresh) the page
    await driver.navigate().refresh();
    await waitForXPathPresentTimeoutNoStop(driver,"//h4",10000);
  
}

// Function to accept cookies
async function acceptCookies(driver) {
  try {
    const cookiesXPath = "//h2[normalize-space()='This website uses cookies']";
    const acceptButtonXPath = "//button[@id='ga-opt-out-false']";

    // Wait up to 3 seconds for the cookies banner to appear
    const timeout = 2000; // 2 seconds in milliseconds
    const interval = 100; // 100 ms check interval
    let bannerFound = false;
    const startTime = Date.now();

    while ((Date.now() - startTime) < timeout) {
      bannerFound = await driver.executeScript((xpath) => {
        const result = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        return result.snapshotLength > 0;
      }, cookiesXPath);

      if (bannerFound) break;

      // Wait 500 ms before checking again
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    if (bannerFound) {
      console.log("Cookies banner detected.");

      // Try clicking the accept cookies button
      const acceptButtonClicked = await driver.executeScript((xpath) => {
        const result = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );

        if (result.snapshotLength > 0) {
          result.snapshotItem(0).click();
          return true;
        }
        return false;
      }, acceptButtonXPath);

      if (acceptButtonClicked) {
        console.log("Cookies accepted.");
      } else {
        console.warn("Accept button not found.");
      }
    } else {
      console.log("Cookies banner not found within 3 seconds.");
    }
  } catch (error) {
    console.warn("Error while handling cookies banner, continuing execution:", error.message);
  }
}




async function loginLandingPageButton(driver) {
  try {

    
    // Wait for the button to be located and visible (max wait time: 2 seconds)
    await driver.sleep(2000);
    loginButton = await countElementsByXPath(driver,"//a[@id='login-button']");

    // Check if the button is displayed
    if (loginButton > 0) {
      // Click the button
      await driver.wait(until.elementLocated(By.id("login-button")), 2000).click();
      console.log("The 'Land page login-button' was clicked successfully.");
    }
  } catch (error) {
    console.error("The Lang Page login-button' does not exist or is not visible:", error.message);
  }
}

async function adminCredentials(driver, vars = {}) {
  vars["username"] = "testingpxc_admin@proton.me";
  vars["password"] = "Proficloud2022!";
  console.log("Credentials set:", vars);
}

async function registeredUserCredentials(driver, vars = {}) {
  vars["username"] = "testingpxc@proton.me";
  vars["password"] = "Proficloud2022!";
  console.log("Credentials set:", vars);
}

async function unregisteredUserCredentials(driver, vars = {}) {
  vars["username"] = "noregistered_user@proton.me";
  vars["password"] = "Proficloud2022!";
  vars["firstName"] = "Unregistered"
  vars["lastName"] = "User"
  console.log("Credentials set:", vars);
}

async function changeOrgaUserNameCredentials(driver, vars = {}) {
  vars["username"] = "change_orga_name@proton.me";
  vars["password"] = "Proficloud2022!";
  console.log("Credentials set:", vars);
}

async function isTheOrganizationNameEmpty(driver, vars) {
  let attempts = 0; // Counter for attempts
  const maxAttempts = 10; // Maximum number of attempts
  const waitTime = 1000; // Wait time between attempts (1 second)

  while (attempts < maxAttempts) {
    console.log(`Attempt ${attempts + 1} of ${maxAttempts}`);

    try {
      // Wait until the element is visible on the page
      const element = await driver.wait(until.elementLocated(By.xpath("//h4")), waitTime);
      vars["emptyName"] = await element.getText();
      console.log(`Organization found: ${vars["emptyName"]}`);

      // If the text is not empty, end the function
      if (vars["emptyName"] && vars["emptyName"] !== "") {
        console.log("Organization name found.");
        return vars["emptyName"];
      }
    } catch (error) {
      console.log("The element is not available in this attempt. Trying again...");
    }

    // Increment the attempt counter and wait before the next attempt
    attempts++;
    if (attempts < maxAttempts) {
      await driver.sleep(waitTime);
    }
  }

  // If no valid text is found after 10 attempts, return a message
  console.log("Could not find the organization name after 10 attempts.");
  return null; // Return null if no valid value is found
}



async function roothOrganizationTest(driver, vars) {
  const xpath = "//h4[contains(.,'Rooth Organization')]";

  // Use executeScript to quickly find the element using XPath
  const rightOrganization = await driver.executeScript((xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    return result.snapshotLength; // Return the number of elements found
  }, xpath);

  console.log('Are we in the Rooth Organization?', rightOrganization);

  // Check if we are in the correct organization
  if (rightOrganization > 0) {
    console.log("We are in the Rooth Organization");
    return;
  } else {
    console.log("We are not in the Rooth Organization, thus we need to switch the organization");
    await switchToOriginalOrganization(driver);
  }
}

async function switchToOriginalOrganization(driver) {
  await activeOrganization(driver);
  await driver.sleep(1000);
  await driver
    .findElement(By.xpath("//div[@class='profile-menu_icon-text__text'][contains(.,'Rooth Organization')]"))
    .click();
  await driver.sleep(1000);
  await waitingLoadingRingProficloudToDissapear(driver);
  await driver.wait(until.elementLocated(By.id("routeTitle")), 30000);
}


async function switchToPxcOrganization(driver) {
  await activeOrganization(driver);
  await driver.sleep(1000);
  await driver
    .findElement(By.xpath("//div[@class='profile-menu_icon-text__text'][contains(.,'Phoenix Contact Smart Bus...')]"))
    .click();
  await driver.sleep(1000);
  await waitingLoadingRingProficloudToDissapear(driver);
  await driver.wait(until.elementLocated(By.id("routeTitle")), 30000);
}

async function activeOrganization(driver) {
  await driver.findElement(By.xpath("//div[@id='active-organization']/h4")).click();
}

async function accountSettingsMainMenu(driver) {

  const settingsButton = await driver.wait(until.elementLocated(By.xpath("//div[@class='profile-menu_icon-text__text'][contains(.,'Account Settings')]")),30000);

  // Click the 'Settings' element
  await settingsButton.click();
  
}

async function accountSettingsTab(driver) {

  const settingsButtonTab = await driver.wait(until.elementLocated(By.xpath("//span[@class='mdc-tab__text-label'][contains(.,'Account settings')]")),30000);

  // Click the 'Settings' element
  await settingsButtonTab.click();
  
}

async function changeInformationButton(driver) {

  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Change Information')]")), 30000);
  await driver.findElement(By.xpath("//span[contains(.,'Change Information')]")).click();
  
}

async function logout(driver) {

  await deviceManagementMenu(driver);
  await userMenu(driver);
  await driver
    .findElement(By.xpath("//div[@class='profile-menu_icon-text__text'][contains(.,'Logout')]"))
    .click();
  await driver.sleep(1000);
}

async function confirmButton(driver) {
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Confirm')]")), 30000).click();
}

async function userMenu(driver) {
  await driver.wait(until.elementLocated(By.xpath("//div[@id='proficloud-user-icon']")), 30000);
  await driver.findElement(By.xpath("//div[@id='proficloud-user-icon']")).click();
}





/**
 * Gets the current date in the specified format with a customizable separator.
 * @param {string} separator - The separator to use between day, month, and year (e.g., '/' or '.').
 * @returns {string} Date in the format DD/MM/YYYY or DD.MM.YYYY depending on the separator.
 */
function getCurrentDate(separator = '/') {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0'); // Add leading zero if necessary
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0
  const year = today.getFullYear();
  return `${day}${separator}${month}${separator}${year}`;
}



async function loginAdmin(driver, vars) {
  await acceptCookies(driver);
  await loginLandingPageButton(driver);
  await adminCredentials(driver, vars);
  await driver.sleep(1000);
  await driver.wait(until.elementLocated(By.id("username")), 50000);
  await driver.findElement(By.id("username")).sendKeys(vars["username"]);
  await driver.findElement(By.id("password")).sendKeys(vars["password"]);
  await driver.findElement(By.id("kc-login")).click();
  //await driver.sleep(1000);
  await isTheOrganizationNameEmpty(driver, vars);
  await roothOrganizationTest(driver, vars);
}

async function loginEditor(driver, vars) {
  await acceptCookies(driver);
  await loginLandingPageButton(driver);
  vars["username"] = "testingpxc_editor@proton.me";
  vars["password"] = "Proficloud2022!";
  console.log("Credentials set for EDITOR:", vars);

  // Log in
  await driver.wait(until.elementLocated(By.id("username")), 5000);
  await driver.findElement(By.id("username")).sendKeys(vars["username"]);
  await driver.findElement(By.id("password")).sendKeys(vars["password"]);
  await driver.findElement(By.id("kc-login")).click();

  // Wait for page to load
  
  await isTheOrganizationNameEmpty(driver, vars);

  // Assert the correct page is loaded
  const pageTitle = await driver.findElement(By.xpath("//div[@id='routeTitle']")).getText();
  assert.strictEqual(pageTitle, "Device Management Service");

  // Check if in the right organization
  await roothOrganizationTest(driver, vars);
}

async function loginViewer(driver, vars) {
  await acceptCookies(driver);
  await loginLandingPageButton(driver);

  vars["username"] = "testingpxc_viewer@proton.me";
  vars["password"] = "Proficloud2022!";
  console.log("Credentials set for VIEWER:", vars);

  // Log in
  await driver.wait(until.elementLocated(By.id("username")), 5000);
  await driver.findElement(By.id("username")).sendKeys(vars["username"]);
  await driver.findElement(By.id("password")).sendKeys(vars["password"]);
  await driver.findElement(By.id("kc-login")).click();

  // Espera hasta que el nombre de la organización esté disponible
  console.log("Esperando el nombre de la organización...");
  await driver.wait(until.elementLocated(By.xpath("//h4")), 10000); // Máximo 10 segundos para encontrar el elemento
  await isTheOrganizationNameEmpty(driver, vars);

  // Verifica que la página correcta se cargó
  console.log("Validando el título de la página...");
  const pageTitleElement = await driver.wait(
    until.elementLocated(By.xpath("//div[@id='routeTitle']")),
    10000
  );
  const pageTitle = await pageTitleElement.getText();
  assert.strictEqual(pageTitle, "Device Management Service", "El título de la página no coincide.");

  // Verifica la organización correcta
  console.log("Validando la organización...");
  await roothOrganizationTest(driver, vars);
}

async function scrollToElementByXPath(driver,xpath) {
  const element = await driver.findElement(By.xpath(xpath),5000);

  // Ensure the element is visible
  await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", element);

  // Wait until the element is visible
  await driver.wait(until.elementIsVisible(element), 10000);

  await driver.sleep(1000);
  
}

async function loginFerchoAlejandro86(driver, vars) {
  await acceptCookies(driver);
  await loginLandingPageButton(driver);
  vars["username"] = "ferchoalejandro86@gmail.com";
  vars["password"] = "Proficloud2020!";
  console.log("Credentials set for ferchoalejandro86:", vars);

  // Log in
  await driver.wait(until.elementLocated(By.id("username")), 5000);
  await driver.findElement(By.id("username")).clear();
  await driver.findElement(By.id("username")).sendKeys(vars["username"]);
  await driver.findElement(By.id("password")).clear();
  await driver.findElement(By.id("password")).sendKeys(vars["password"]);
  await driver.findElement(By.id("kc-login")).click();

  // Wait for page to load
  
  await isTheOrganizationNameEmpty(driver, vars);

  // Assert the correct page is loaded
  //const pageTitle = await driver.findElement(By.xpath("//div[@id='routeTitle']")).getText();
  //assert.strictEqual(pageTitle, "Device Management Service");

}


async function loginRegisteredUser(driver, vars, isC714 = false) {
  // Accept cookies
  await acceptCookies(driver);

  // Navigate to login page
  await loginLandingPageButton(driver);

  // Enter registered user credentials
  await registeredUserCredentials(driver, vars);
  await driver.sleep(1000);

  // Fill in login form
  await driver.wait(until.elementLocated(By.id("username")), 50000);
  await driver.findElement(By.id("username")).sendKeys(vars["username"]);
  await driver.findElement(By.id("password")).sendKeys(vars["password"]);
  await driver.findElement(By.id("kc-login")).click();
  await driver.sleep(1000);



  // If this is the C714 scenario, skip additional checks
  if (isC714) {
    console.log("C714 scenario detected: Skipping additional organization checks.");
    return;
  }
    // Check if organization name or initials are empty
    await isTheOrganizationNameEmpty(driver, vars);

  // Perform organization validation for other scenarios
  console.log("Performing additional organization validation.");
  //await roothOrganizationTest(driver, vars);
}



async function loginUnregisteredUser(driver,vars) {
  await acceptCookies(driver);
  await loginLandingPageButton(driver);
  await unregisteredUserCredentials(driver,vars);
  //await driver.sleep(5000);
  await driver.wait(until.elementLocated(By.id("username")), 50000);
  await driver.findElement(By.id("username")).sendKeys(vars["username"]);
  await driver.findElement(By.id("password")).sendKeys(vars["password"]);
  await driver.findElement(By.id("kc-login")).click();
}


async function loginChangeOrgaUserName(driver, vars) {
  await acceptCookies(driver);
  await loginLandingPageButton(driver);
  await changeOrgaUserNameCredentials(driver, vars);
  await driver.sleep(1000);
  await driver.wait(until.elementLocated(By.id("username")), 50000);
  await driver.findElement(By.id("username")).sendKeys(vars["username"]);
  await driver.findElement(By.id("password")).sendKeys(vars["password"]);
  await driver.findElement(By.id("kc-login")).click();


  await driver.sleep(2000);
  
  
 
 const xpath = "//span[@class='kc-feedback-text'][contains(.,'Invalid username or password.')]";

// Usar executeScript para buscar el elemento rápidamente
const invalidUser = await driver.executeScript((xpath) => {
const result = document.evaluate(
    xpath, 
    document, 
    null, 
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, 
    null
  );
  return result.snapshotLength; // Retorna la cantidad de elementos encontrados
}, xpath);

console.log('Cantidad de elementos encontrados para "Invalid username or password":', invalidUser);

  // Verificar si el error es de usuario inválido
  if (invalidUser > 0) {
    console.log("The user does not exist because the email was Changed threfore we need to return to the original");
    vars ["emailChanged"] = "testing_email_change@proton.me"
    vars ["password"] = "Proficloud2022!"
    await driver.findElement(By.id("username")).clear();
    await driver.findElement(By.id("username")).sendKeys(vars["emailChanged"]);
    await driver.findElement(By.id("password")).clear();
    await driver.findElement(By.id("password")).sendKeys(vars["password"]);
    await driver.findElement(By.id("kc-login")).click();
    
    await userMenu(driver);  
    await accountSettingsMainMenu(driver);
    await accountSettingsTab(driver);
    await changeInformationButton(driver);
    await driver.sleep(1000);

    await driver.findElement(By.xpath("//input[@placeholder='Email']")).clear();
    await driver.findElement(By.xpath("//input[@placeholder='Email']")).sendKeys("change_orga_name@proton.me");
    await saveProfileDataButton(driver);
    await driver.sleep(1000);
    await confirmButton(driver);
    await modalClose(driver);
    // Time to wait in order to get the mail
    await driver.sleep(10000);

    await loginToProtonMail(driver,vars);
    //Filtering the mail since there are 2 mails and only one has the verificaton link
    await driver.wait(until.elementLocated(By.css(".active .text-ellipsis")), 60000);
    await driver.wait(until.elementLocated(By.xpath("//input[@data-testid='search-keyword']")), 30000).click();
    await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'More search options')]")), 30000).click();
    await driver.wait(until.elementLocated(By.id("address")), 30000).click();
    
    await driver.wait(until.elementLocated(By.xpath("//li[@class='dropdown-item'][contains(.,'change_orga_name@proton.me')]")), 30000).click();
    await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Search')]")), 30000).click();
    await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'You have requested an email change for Proficloud.io')]")), 30000).click();
    
    
    await driver.sleep(2000);
    const iframe = await driver.wait(until.elementLocated(By.css('iframe')), 10000);
    await driver.switchTo().frame(iframe);
    await driver.wait(until.elementLocated(By.css("a > div")), 10000).click();
    //Accepting the last email change confirmation
    
    // Obtener todos los manejadores de ventanas y seleccionar el último
    const windowHandles = await driver.getAllWindowHandles();
    console.log('Manejadores de ventanas:', windowHandles);
  // Cambiar a la ventana más reciente
    const latestWindow = windowHandles[windowHandles.length - 1]; // Seleccionar el último manejador
    await driver.switchTo().window(latestWindow);
    console.log('Cambiado a la ventana más reciente.');

    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button")), 10000).click();

  //Login with the original credentials after the email change verification

  await changeOrgaUserNameCredentials(driver, vars);
  await driver.sleep(1000);
  await driver.wait(until.elementLocated(By.id("username")), 50000);
  await driver.findElement(By.id("username")).sendKeys(vars["username"]);
  await driver.findElement(By.id("password")).sendKeys(vars["password"]);
  await driver.findElement(By.id("kc-login")).click();
  await userMenu(driver);  
  await accountSettingsMainMenu(driver);
  await accountSettingsTab(driver);
  await driver.wait(until.elementLocated(By.xpath("//div[normalize-space()='change_orga_name@proton.me']")), 10000);
  await logout(driver);



    return;
  }
  else{

    console.log("The original user eMail is there, therefore no changes are necessary");
  }

  await isTheOrganizationNameEmpty(driver, vars);
  await resetTOriginalNameOrganization(driver);
  await roothOrganizationTest(driver, vars);
}

async function resetTOriginalNameOrganization(driver) {

  resetOrganizationName = await getTextByLocator(driver,"xpath","//div[@id='active-organization']/h4");
  if (resetOrganizationName !== 'Change Orga Name') {
      await activeOrganization(driver);
      await settings(driver);
      await driver.wait(until.elementLocated(By.css(".expandable-organization__subtitle")), 5000).click();
      orgaID = await getTextByLocator(driver,"css",".expandable-organization__subtitle");
      await driver.wait(until.elementLocated(By.xpath(`//app-icon[@id='settings-organization-settings-icon-${orgaID}']//*[name()='svg']`)), 3000).click();
      await renameOrganizationButton1(driver);
      await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Organization Name')]")), 3000).click();
      await clearAndWrite(driver,"xpath","//input[@placeholder='Organization Name']","Rooth Organization");
      await renameOrganizationButton2(driver);
      await waitingLoadingRingProficloudToDissapear(driver);

  }
  else{
      console.log("The name of the orga is Change Orga Name:) Verified");

  }
  await deviceManagementMenu(driver);
}

async function deleteManualReports(driver) {

  manualReportPresent = await countElementsByXPath(driver,"//div[@class='ng-star-inserted']//div[1]//flex-row[1]//div[2]//app-icon[1]//*[name()='svg']");
  while (manualReportPresent > 0){

    console.log("There is at least one manualReport and therefore we need to delete them")
    await driver.wait(until.elementLocated(By.xpath("//div[@class='ng-star-inserted']//div[1]//flex-row[1]//div[2]//app-icon[1]//*[name()='svg']")), 30000).click();
    await emmaDeleteButton(driver);
    await waitingLoadingRingProficloudToDissapear(driver);
    manualReportPresent = await countElementsByXPath(driver,"//div[@class='ng-star-inserted']//div[1]//flex-row[1]//div[2]//app-icon[1]//*[name()='svg']");
  }
  
}

async function deleteRecurringReports(driver) {

  recurringReportPresent = await countElementsByXPath(driver,"//flex-col[@class='reports__existing']//flex-col//flex-col[1]//flex-row[1]//div[4]//app-icon[1]//*[name()='svg']");
  while (recurringReportPresent > 0){

    console.log("There is at least one manualReport and therefore we need to delete them")
    await driver.wait(until.elementLocated(By.xpath("//flex-col[@class='reports__existing']//flex-col//flex-col[1]//flex-row[1]//div[4]//app-icon[1]//*[name()='svg']")), 30000).click();
    await emmaDeleteButton(driver);
    await waitingLoadingRingProficloudToDissapear(driver);
    recurringReportPresent = await countElementsByXPath(driver,"//flex-col[@class='reports__existing']//flex-col//flex-col[1]//flex-row[1]//div[4]//app-icon[1]//*[name()='svg']");

  }
  
}


async function cleanDashboard(driver) {

  widgetPresent = await countElementsByXPath(driver,'.//*[contains(concat(" ",normalize-space(@class)," ")," topbar-item ")]//*[contains(concat(" ",normalize-space(@class)," ")," mat-mdc-menu-trigger ")]/*[contains(concat(" ",normalize-space(@class)," ")," ng-star-inserted ")]');
  while (widgetPresent > 0){

    console.log(`There are this number of widget(s) present: ${widgetPresent}.....proceding to delete`);
    await driver.wait(until.elementLocated(By.xpath('.//*[contains(concat(" ",normalize-space(@class)," ")," topbar-item ")]//*[contains(concat(" ",normalize-space(@class)," ")," mat-mdc-menu-trigger ")]/*[contains(concat(" ",normalize-space(@class)," ")," ng-star-inserted ")]')), 30000).click();
    await emmaDeleteButton(driver);
    await driver.wait(until.elementLocated(By.xpath("//div[@data-analytics='modal headline'][contains(.,'Delete Widget')]")), 5000);
    await confirmButton(driver);
    await driver.sleep(500);
    widgetPresent = await countElementsByXPath(driver,'.//*[contains(concat(" ",normalize-space(@class)," ")," topbar-item ")]//*[contains(concat(" ",normalize-space(@class)," ")," mat-mdc-menu-trigger ")]/*[contains(concat(" ",normalize-space(@class)," ")," ng-star-inserted ")]');
    
   
  }
  
}

async function reportActionsButton(driver) {
  await driver.wait(until.elementLocated(By.xpath('//pc-button[@mattooltip="Report actions"]')), 30000).click();
    
  
}



    async function deleteUnregisteredUserInCaseOfExistence(driver, vars) {
    await windowConfiguration(driver,"UMS");  
    await loginUnregisteredUser(driver, vars); 
    await driver.sleep(2000);
    invalidUser = await countElementsByXPath(driver,"//span[@class='kc-feedback-text'][contains(.,'Invalid username or password.')]");
    emailVerificationNeeded = await countElementsByXPath(driver,"//span[contains(.,'You need to verify your email address to activate your account.')]");

    // Obtener la cantidad de elementos encontrados
    console.log('Cantidad de elementos encontrados para "Invalid username or password":', invalidUser);
    console.log('Cantidad de elementos encontrados para "Email verification needed":', emailVerificationNeeded);

    // Verificar si el error es de usuario inválido
    if (invalidUser > 0) {
      console.log("The user does not exist, no other measures have to be taken.");
      return;
    }

    // Verificar si es necesario verificar el correo electrónico
    if (emailVerificationNeeded > 0) {
      console.log("You need to verify your email address.");
      
      await emailVerification(driver,vars);
      await loginAsUnregisteredUserAndDeleteAccount(driver,vars) 
            
      return; 
    }

  // Si el usuario existe, se procede con la eliminación de la cuenta
  console.log("The user exists, therefore the account has to be deleted.");
  await driver.sleep(2000);
  await logout(driver);
  await driver.sleep(2000);
  await loginAsUnregisteredUserAndDeleteAccount(driver,vars);

}

async function emailVerification(driver,vars) {

  await loginToProtonMail(driver, vars);
  await driver.wait(until.elementLocated(By.css(".active .text-ellipsis")), 60000);
  await driver.findElement(By.css(".active .text-ellipsis")).click();
  await driver.wait(until.elementLocated(By.css(".item-subject > .inline-block")), 60000);
  await driver.findElement(By.css(".item-subject > .inline-block")).click();
  await driver.sleep(3000);
  const iframe = await driver.wait(until.elementLocated(By.css('iframe')), 10000);
  await driver.switchTo().frame(iframe);
  await driver.sleep(5000);
  await driver.findElement(By.linkText("Verify E-Mail")).click();
  await driver.sleep(5000);
  // Obtener todos los manejadores de ventanas y seleccionar el último
  const windowHandles = await driver.getAllWindowHandles();
  console.log('Manejadores de ventanas:', windowHandles);
  // Cambiar a la ventana más reciente
  const latestWindow = windowHandles[windowHandles.length - 1]; // Seleccionar el último manejador
  await driver.switchTo().window(latestWindow);
  console.log('Cambiado a la ventana más reciente.');



  const loginDataPagePresent = await waitForXPathPresentTimeout(driver, "//h1[normalize-space()='Login']", 10000);


  if (loginDataPagePresent) {
    console.log("Log out not necessary");
  } else {
    console.log("Log out necessary");
    await logout(driver);
  }
}
  
async function saveProfileDataButton(driver) {

  await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'SAVE PROFILE DATA')]")), 30000);
  await driver.findElement(By.xpath("//button[contains(.,'SAVE PROFILE DATA')]")).click();
  
}

async function resetBillingAccountInformation(driver) {
  // Wait until the "Edit Billing Account" element is located
  await driver.wait(
    until.elementLocated(By.xpath("//*[contains(text(),'Edit Billing Account')]")),
    5000
  );

  // XPath to check if the billing account reset is necessary
  const xpath = "//div[normalize-space()='AR']";

  // Use executeScript to quickly check for the element
  const isBillingAccountResetNecessary = await driver.executeScript((xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    return result.snapshotLength; // Return the number of elements found
  }, xpath);

  console.log('Does Billing Account need an edit reset?:', isBillingAccountResetNecessary);

  if (isBillingAccountResetNecessary > 0) {
    console.log("Reset necessary");

    // Navigate to the billing information tab and click the edit button
    await billingInformationTab(driver);
    await editBillingAccountButton(driver);

    // Update Email
    await driver.findElement(By.xpath("//input[@placeholder='Email']")).clear();
    await driver.findElement(By.xpath("//input[@placeholder='Email']")).sendKeys("fzuniga@phoenixcontact-sb.io");

    // Update First Name
    await driver.findElement(By.xpath("//input[@placeholder='First Name']")).clear();
    await driver.findElement(By.xpath("//input[@placeholder='First Name']")).sendKeys("Fernando");

    // Update Last Name
    await driver.findElement(By.xpath("//input[@placeholder='Last Name']")).clear();
    await driver.findElement(By.xpath("//input[@placeholder='Last Name']")).sendKeys("Zuniga");

    // Update Company Name
    await driver.findElement(By.xpath("//input[@placeholder='Company Name']")).clear();
    await driver.findElement(By.xpath("//input[@placeholder='Company Name']")).sendKeys("Rooth Company");

    // Update Address Line 1
    await driver.findElement(By.xpath("//input[@placeholder='Address Line 1']")).clear();
    await driver.findElement(By.xpath("//input[@placeholder='Address Line 1']")).sendKeys("Rügenerstrasse 14");

    // Update Postal Code
    await driver.findElement(By.xpath("//input[@placeholder='Postal Code']")).clear();
    await driver.findElement(By.xpath("//input[@placeholder='Postal Code']")).sendKeys("13355");

    // Update City
    await driver.findElement(By.xpath("//input[contains(@placeholder,'City')]")).clear();
    await driver.findElement(By.xpath("//input[contains(@placeholder,'City')]")).sendKeys("Berlin");

    // Update Country
    await driver.findElement(By.xpath("//mat-label[contains(.,'Country')]")).click();
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Germany')]")), 30000);
    await driver.findElement(By.xpath("//span[contains(.,'Germany')]")).click();

    // Update VAT Number
    await driver.findElement(By.xpath("//input[@placeholder='VAT number']")).clear();
    await driver.findElement(By.xpath("//input[@placeholder='VAT number']")).sendKeys("123456");

    // Click on "Update billing account"
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//span[contains(.,'Update billing account')]")).click();

    // Wait for the loading ring to disappear
    await waitingLoadingRingProficloudToDissapear(driver);

    return;
  } else {
    console.log("No reset necessary");
  }
}
 
async function editBillingAccountButton(driver) {
  
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,\'Edit Billing Account\')]")), 50000)
  await driver.findElement(By.xpath("//span[contains(.,\'Edit Billing Account\')]")).click()
  await driver.sleep(1000)
}
  




async function loginAsUnregisteredUserAndDeleteAccount(driver,vars) {
  
  await windowConfiguration(driver, "UMS");
  await loginUnregisteredUser(driver,vars);
  await isTheOrganizationNameEmpty(driver, vars);
  await userMenu(driver);
  await accountSettingsMainMenu(driver);
  //Click on delete button 1
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Delete Account')]")), 30000);
  await driver.findElement(By.xpath("//span[contains(.,'Delete Account')]")).click();
  //Click on delete button 2
  await driver.sleep(500);
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Delete account')]")), 30000);
  await driver.findElement(By.xpath("//span[contains(.,'Delete account')]")).click();
  await driver.sleep(2000);
  await driver.wait(until.elementLocated(By.xpath("//div[@data-analytics='modal headline'][contains(.,'Confirmation required')]")), 30000);
  //Enter Mail 
  await driver.sleep(2000);
  await driver.wait(until.elementLocated(By.xpath("//input[contains(@placeholder,\'Email\')]")), 30000);

  //C697 Introduce a wrong password before user deletion 
  await driver.findElement(By.xpath("//input[contains(@placeholder,\'Email\')]")).sendKeys("thiIs@badMail");
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Delete account')]")), 30000);
  await driver.findElement(By.xpath("//span[contains(.,'Delete account')]")).click();
  await driver.wait(until.elementLocated(By.xpath("//span[@class='pc-status-overlay__message'][contains(.,'It was not possible to delete your account. The email you provided was incorrect.')]")), 30000);
  //Closing the warning message
  const element = await driver.wait(until.elementLocated(By.xpath("/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/pc-status-overlay[1]/pc-overlay[1]/div[1]/div[2]/div[1]/div[1]/app-icon[1]/*[name()='svg'][1]")), 30000);
  await element.click();

  await driver.sleep(2000);
  await driver.wait(until.elementLocated(By.css('[name="cross"]')), 30000).click();
  await driver.sleep(2000);

  //Click on delete button 1
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Delete Account')]")), 30000);
  await driver.findElement(By.xpath("//span[contains(.,'Delete Account')]")).click();
  //Click on delete button 2
  await driver.sleep(500);
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Delete account')]")), 30000);
  await driver.findElement(By.xpath("//span[contains(.,'Delete account')]")).click();
  await driver.sleep(2000);
  await driver.wait(until.elementLocated(By.xpath("//div[@data-analytics='modal headline'][contains(.,'Confirmation required')]")), 30000);
  //We enter now the correct credentials for deleting the account
  await driver.findElement(By.xpath("//input[contains(@placeholder,\'Email\')]")).clear();
  await driver.findElement(By.xpath("//input[contains(@placeholder,\'Email\')]")).sendKeys(vars["username"]);
  //Click on delete button 3
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Delete account')]")), 30000);
  await driver.findElement(By.xpath("//span[contains(.,'Delete account')]")).click();
  await waitingLoadingRingProficloudToDissapear(driver);
}


async function sortByLastName(driver) {
  try {
    // Encuentra todos los elementos del XPath
    let elements = await driver.findElements(By.xpath("//div[pc-list-item]"));

    let names = [];

    for (let element of elements) {
      let fullText = await element.getText();

      // Dividir las líneas del texto (suponiendo que el formato sea "Nombre\nCorreo\nRol")
      let lines = fullText.split('\n');
      if (lines.length < 1) continue;

      let fullName = lines[0]; // Primera línea como nombre completo
      let email = lines.length > 1 ? lines[1] : ''; // Segunda línea como correo electrónico, si existe
      let lastName;

      // Si el nombre completo contiene números, ignorarlo
      if (/\d/.test(fullName)) continue;

      // Si el nombre completo es un correo electrónico, ignorarlo
      if (fullName.includes('@')) continue;

      // Si el nombre completo contiene "von", ignorarlo
      if (fullName.toLowerCase().includes(' von ')) continue;

      // Extraer el apellido del nombre completo
      if (fullName && fullName.includes(' ')) {
        let parts = fullName.trim().split(' ');
        lastName = parts[parts.length - 1].toLowerCase(); // Usar la última palabra como apellido

        // Si el apellido contiene números, ignorarlo
        if (/\d/.test(lastName)) continue;
      } else {
        continue; // Ignorar si no hay un nombre válido
      }

      names.push({ fullName, lastName });
    }

    // Convertir la primera letra de cada apellido a un valor numérico (A=1, B=2, ..., Z=26)
    let lastNameValues = names.map((n) => {
      let firstLetter = n.lastName[0]; // Primera letra del apellido
      let numericValue = firstLetter.charCodeAt(0) - 96; // Convertir letra a valor (a=1, b=2, ..., z=26)
      return { ...n, numericValue };
    });

    // Verificar si los valores están ordenados de menor a mayor
    let isSorted = lastNameValues.every(
      (item, index, array) => index === 0 || item.numericValue >= array[index - 1].numericValue
    );

    // Imprimir resultados
    console.table(
      lastNameValues.map((n, index) => ({
        Index: index + 1, // Índice humano (empezando en 1)
        Name: n.fullName,
        LastName: n.lastName,
        NumericValue: n.numericValue,
      }))
    );

    console.log(`¿Están los nombres ordenados alfabéticamente por apellido (A-Z)? ${isSorted ? 'Sí' : 'No'}`);

    // Si no están ordenados, detener el programa
    if (!isSorted) {
      console.error('❌ Los nombres no están ordenados alfabéticamente. Deteniendo el programa.');
      await forceFailStatus(driver);
    }
  } catch (error) {
    console.error('Error en la verificación del orden:', error);
    process.exit(1); // Terminar el proceso con un código de error
  }
}

async function sortByFirstName(driver) {
  try {
    // Encuentra todos los elementos del XPath
    let elements = await driver.findElements(By.xpath("//div[pc-list-item]"));

    let names = [];

    for (let element of elements) {
      let fullText = await element.getText();

      // Dividir las líneas del texto (suponiendo que el formato sea "Nombre\nCorreo\nRol")
      let lines = fullText.split('\n');
      if (lines.length < 1) continue;

      let fullName = lines[0]; // Primera línea como nombre completo
      let email = lines.length > 1 ? lines[1] : ''; // Segunda línea como correo electrónico, si existe
      let firstName;

      // Si el nombre completo contiene números, ignorarlo
      if (/\d/.test(fullName)) continue;

      // Si el nombre completo es un correo electrónico, ignorarlo
      if (fullName.includes('@')) continue;

      // Si el nombre completo contiene "von", ignorarlo
      if (fullName.toLowerCase().includes(' von ')) continue;

      // Extraer el primer nombre del nombre completo
      if (fullName && fullName.includes(' ')) {
        let parts = fullName.trim().split(' ');
        firstName = parts[0].toLowerCase(); // Usar la primera palabra como nombre

        // Si el primer nombre contiene números, ignorarlo
        if (/\d/.test(firstName)) continue;
      } else {
        continue; // Ignorar si no hay un nombre válido
      }

      names.push({ fullName, firstName });
    }

    // Ordenar los nombres por primer nombre en orden alfabético (A-Z)
    names.sort((a, b) => a.firstName.localeCompare(b.firstName));

    // Convertir la primera letra de cada primer nombre a un valor numérico (A=1, B=2, ..., Z=26)
    let sortedNames = names.map((n) => {
      let firstLetter = n.firstName[0]; // Primera letra del primer nombre
      let numericValue = firstLetter.charCodeAt(0) - 96; // Convertir letra a valor (a=1, b=2, ..., z=26)
      return { ...n, numericValue };
    });

    // Verificar si los valores están ordenados de menor a mayor
    let isSorted = sortedNames.every(
      (item, index, array) => index === 0 || item.numericValue >= array[index - 1].numericValue
    );

    // Imprimir resultados
    console.table(
      sortedNames.map((n, index) => ({
        Index: index + 1, // Índice humano (empezando en 1)
        Name: n.fullName,
        FirstName: n.firstName,
        NumericValue: n.numericValue,
      }))
    );

    console.log(`¿Están los nombres ordenados alfabéticamente por primer nombre (A-Z)? ${isSorted ? 'Sí' : 'No'}`);

    // Si no están ordenados, detener el programa
    if (!isSorted) {
      console.error('❌ Los nombres no están ordenados alfabéticamente. Deteniendo el programa.');
      await forceFailStatus(driver);
    }
  } catch (error) {
    console.error('Error al ordenar los nombres por primer nombre:', error);
    process.exit(1); // Terminar el proceso con un código de error
  }
}

async function createOrganizationButton1(driver) {

  await driver.wait(until.elementLocated(By.xpath("//div[@class='profile-menu_icon-text__text'][contains(.,'New organization')]")), 30000).click();

  }

  async function createOrganizationButton2(driver) {

    await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Create')]")), 30000).click();
  
    }

 async function modalClose(driver) {
  await driver.wait(until.elementLocated(By.id("modal-close")), 5000).click();
  
 }

 async function settings(driver) {
  await driver.wait(until.elementLocated(By.xpath("//div[@class='profile-menu_icon-text__text'][contains(.,'Settings')]")), 5000).click();
  
 }

 async function billingInformationTab(driver) {
  await driver.wait(until.elementLocated(By.xpath("//span[@class='mdc-tab__text-label'][contains(.,'Billing Information')]")), 10000).click();
  
 }
  
  
 async function resetToOriginalUserNameInRoothOrganization(driver, vars = {}) {
  console.log("Vars object at the start:", vars);

  await userMenu(driver);  
  await accountSettingsMainMenu(driver);
  await accountSettingsTab(driver);

  try {
      vars["userName"] = await driver.findElement(By.xpath("//flex-col/div/div[2]/div[2]")).getText();
      console.log(`The actual user Name is: ${vars["userName"]}`);
      
      if (vars["userName"] === 'Fernando Zuniga') {
          console.log("The user name is the right one");
      } else {
          console.log("A change in the user name has to take place");

          vars["originalName"] = "Fernando";
          vars["originalSurname"] = "Zuniga";

          await changeInformationButton(driver);
          await driver.sleep(1000);
          await driver.wait(until.elementLocated(By.xpath("//input[contains(@placeholder,'First name')]")), 30000);
          
          await driver.findElement(By.xpath("//input[contains(@placeholder,'First name')]")).clear();
          await driver.findElement(By.xpath("//input[contains(@placeholder,'First name')]")).sendKeys(vars["originalName"]);
          await driver.findElement(By.xpath("//input[contains(@placeholder,'Last name')]")).clear();
          await driver.findElement(By.xpath("//input[contains(@placeholder,'Last name')]")).sendKeys(vars["originalSurname"]);
          await saveProfileDataButton(driver);

          // Asserting the presence of Success Message
          await driver.sleep(1000);
          await driver.wait(until.elementTextIs(driver.findElement(By.xpath('//pc-overlay/div/div[2]/div/div[2]/div')), "Your profile has been successfully updated."), 5000);
          console.log("Expected text is present!");
          await modalClose(driver);

          await driver.wait(until.elementTextIs(driver.findElement(By.xpath("//flex-col/div/div[2]/div[2]")), "Fernando Zuniga"), 5000);
      }
  } catch (error) {
      console.error("Error while fetching the user name:", error.message);
  }
}



      async function forceFailStatus(driver) {

        let failureFoundInTest = undefined; 
        failureFoundInTest(); // Esto generará un error
    
      }
      




  async function logOutFromProtonMail(driver) {
    await driver.findElement(By.css(".my-auto > .m-auto")).click()
    await driver.sleep(1000)
    await driver.findElement(By.xpath("//button[contains(.,\'Sign out\')]")).click()
    await driver.sleep(1000)
    await driver.wait(until.elementLocated(By.css(".sign-layout-title")), 30000)
  }
  
  async function checkFailedLoginEmail(driver) {
    await driver.sleep(5000);  
    await clickFirstMail(driver);

    await driver.wait(until.elementLocated(By.css(".message-conversation-summary-header > span")), 10000);
    const emailSubject = await driver.findElement(By.css(".message-conversation-summary-header > span")).getText();
    if (emailSubject !== "Failed login attempt detected") {
      throw new Error("Failed login email not found in Proton Mail.");
    }
    console.log("Failed login email detected as expected.");
  }
  
  async function deleteAllEmails(driver) {
    console.log("Deleting all emails...");
  
    // Wait until "Inbox" is located
    await driver.wait(until.elementLocated(By.xpath("//span[contains(text(),'Inbox')]")), 60000);
  
    // Check if the "More" button exists
    const xpath = "//span[normalize-space()='More']";
  
    const buttonMorePresent = await driver.executeScript((xpath) => {
      const result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      return result.snapshotLength; // Returns the number of elements found
    }, xpath);
  
    console.log("Is the 'More' button present?:", buttonMorePresent);
  
    // Verify if the error is due to an invalid user
    if (buttonMorePresent > 0) {
      await driver.wait(until.elementLocated(By.xpath("//span[normalize-space()='More']")), 30000).click();
      
    } else {
      console.log("It is not necessary to do anything.");
    }
  
    // Click on "All mail"
    const allMailButton = await driver.wait(
      until.elementLocated(By.xpath("//span[contains(text(),'All mail')]")),
      30000
    );
    await driver.wait(until.elementIsEnabled(allMailButton), 30000);
    await allMailButton.click();
    await driver.sleep(2000);


    noMessagesFound = await countElementsByXPath(driver,"//h3[contains(@data-testid,'empty-view-placeholder--empty-title')]");

    if (noMessagesFound > 0)
    {
      await sendMessageLogToBrowserStack(driver,"There are no mails to delete, so we can break the normal flow");
    }
    else
    {
  
    // Select all emails
    const selectAllButton = await driver.wait(
      until.elementLocated(By.id("idSelectAll")),
      30000
    );
    await driver.sleep(2000);
    await driver.wait(until.elementIsEnabled(selectAllButton), 30000);
    await selectAllButton.click();
    await driver.sleep(1000);
  
    // Move to trash
    const moveToTrashButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(.,'Move to trash')]")),
      30000
    );
    await driver.wait(until.elementIsEnabled(moveToTrashButton), 30000);
    await moveToTrashButton.click();
  
    // Navigate to the trash folder
    const trashButton = await driver.wait(
      until.elementLocated(By.xpath("//span[@class='text-ellipsis'][contains(.,'Trash')]")),
      30000
    );
    await driver.wait(until.elementIsEnabled(trashButton), 30000);
    await trashButton.click();
  
    // Select all in the trash folder
    const selectAllTrashButton = await driver.wait(
      until.elementLocated(By.id("idSelectAll")),
      30000
    );
    await driver.sleep(2000);
    await driver.wait(until.elementIsEnabled(selectAllTrashButton), 30000);
    await selectAllTrashButton.click();
  
    // Delete permanently
    const deletePermanentlyButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(.,'Delete permanently')]")),
      30000
    );
    await driver.wait(until.elementIsEnabled(deletePermanentlyButton), 30000);
    await driver.sleep(1000);
    await deletePermanentlyButton.click();
  
    // Confirm deletion
    const confirmDeleteButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(),'Delete')]")),
      30000
    );
    await driver.wait(until.elementIsVisible(confirmDeleteButton), 30000);
    await confirmDeleteButton.click();
  
    // Wait until "No messages found" confirmation appears
    const noMessagesFound = await driver.wait(
      until.elementLocated(By.xpath("//h3[contains(@data-testid,'empty-view-placeholder--empty-title')]")),
      30000
    );
    await driver.wait(until.elementIsVisible(noMessagesFound), 30000);
  }

  }


  async function switchToExtraOrganization(driver, organizationName) {
    await activeOrganization(driver);
    await driver.findElement(By.xpath(`//div[contains(@title,'${organizationName}')]`)).click();
    await driver.wait(until.elementLocated(By.id("routeTitle")), 30000);
    await driver.sleep(1000);
    await waitingLoadingRingProficloudToDissapear(driver);
    await driver.wait(until.elementLocated(By.id("routeTitle")), 30000);
    await driver.wait(until.elementLocated(By.xpath(`//h4[contains(.,'${organizationName}')]`)), 30000);
}

  async function usersLeftMenu(driver) {

    await driver.wait(until.elementLocated(By.id("navigation-user-management-service-users")), 30000).click();
    
  }
  
  
    async function eliminateExtraOrganizationsAdmin(driver) {
      await activeOrganization(driver);
      await driver.sleep(1000);
      extraOrganization = await countElementsByXPath(driver, "(//div[@class='profile-menu_icon-text__text'][contains(.,'Leave this Organization')])");
      await activeOrganization(driver);
  
      while (extraOrganization > 0) {
          await switchToExtraOrganization(driver,"Leave this Organization");
          await userManagementMenu(driver);
          await usersLeftMenu(driver);
          await driver.sleep(2000);
          noDesiredUser = await countElementsByXPath(driver, "//div[@id='outlet']/app-user-management/div/app-members/flex-col/flex-col/div/ng-scrollbar/div/div/div/div/div[2]/pc-list-item/div/div");
  
          while (noDesiredUser > 0) {
              const { lastDynamicXPath, mailText } = await getEmailofUndesiredUserAndHamburgerClick(driver);
  
              if (!lastDynamicXPath) {
                  console.error("No dynamic XPath found for the icon.");
                  break;
              }
  
              console.log(`An undesired user was found (✖╭╮✖)", ${mailText}`);
              await driver.wait(until.elementLocated(By.xpath(lastDynamicXPath)), 30000).click();
              await removeMemberButton(driver);
              await driver.findElement(By.xpath("//input[contains(@placeholder,'email ')]")).clear();
              await driver.findElement(By.xpath("//input[contains(@placeholder,'email ')]")).sendKeys(mailText);
              await removeMemberButton2(driver);
              await driver.sleep(6000);
              noDesiredUser = await countElementsByXPath(driver, "//div[@id='outlet']/app-user-management/div/app-members/flex-col/flex-col/div/ng-scrollbar/div/div/div/div/div[2]/pc-list-item/div/div");
          }
  
          await activeOrganization(driver);
          await settings(driver);
          await driver.wait(until.elementLocated(By.xpath("/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[1]/app-account-management[1]/flex-col[1]/app-user-settings[1]/flex-col[1]/flex-col[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/mat-tab-group[1]/div[1]/mat-tab-body[1]/div[1]/div[1]/app-expandable-organisation[1]/div[1]/div[1]/flex-row[1]/flex-row[1]/div-relative[1]/app-icon[1]/*[name()='svg'][1]")), 30000).click();
          await leaveOrganizationButton1(driver);
          await leaveOrganizationButton2(driver);
          await waitingLoadingRingProficloudToDissapear(driver);
          await driver.get("https://app.proficloud.io/services/account/user-settings");
          await reloadPage(driver);
          await driver.sleep(4000);
          await activeOrganization(driver);
          await driver.sleep(1000);
          extraOrganization = await countElementsByXPath(driver, "(//div[@class='profile-menu_icon-text__text'][contains(.,'Leave this Organization')])");
          await activeOrganization(driver);
      }
  }
  
  async function eliminateExtraOrganizationsEditor(driver) {
    await activeOrganization(driver);
    await driver.sleep(1000);
    extraOrganization = await countElementsByXPath(driver, "(//div[@class='profile-menu_icon-text__text'][contains(.,'Z Z')])[1]");
    await activeOrganization(driver);

    while (extraOrganization > 0) {
        await switchToExtraOrganization(driver,"Z Z");
        await userManagementMenu(driver);
        await usersLeftMenu(driver);
        await driver.sleep(2000);
        noDesiredUser = await countElementsByXPath(driver, "//div[@id='outlet']/app-user-management/div/app-members/flex-col/flex-col/div/ng-scrollbar/div/div/div/div/div[2]/pc-list-item/div/div");

        while (noDesiredUser > 0) {
            const { lastDynamicXPath, mailText } = await getEmailofUndesiredUserAndHamburgerClick(driver);

            if (!lastDynamicXPath) {
                console.error("No dynamic XPath found for the icon.");
                break;
            }

            console.log(`An undesired user was found (✖╭╮✖)", ${mailText}`);
            await driver.wait(until.elementLocated(By.xpath(lastDynamicXPath)), 30000).click();
            await removeMemberButton(driver);
            await driver.findElement(By.xpath("//input[contains(@placeholder,'email ')]")).clear();
            await driver.findElement(By.xpath("//input[contains(@placeholder,'email ')]")).sendKeys(mailText);
            await removeMemberButton2(driver);
            await driver.sleep(6000);
            noDesiredUser = await countElementsByXPath(driver, "//div[@id='outlet']/app-user-management/div/app-members/flex-col/flex-col/div/ng-scrollbar/div/div/div/div/div[2]/pc-list-item/div/div");
        }

        await activeOrganization(driver);
        await settings(driver);
        await driver.wait(until.elementLocated(By.xpath("/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[1]/app-account-management[1]/flex-col[1]/app-user-settings[1]/flex-col[1]/flex-col[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/mat-tab-group[1]/div[1]/mat-tab-body[1]/div[1]/div[1]/app-expandable-organisation[1]/div[1]/div[1]/flex-row[1]/flex-row[1]/div-relative[1]/app-icon[1]/*[name()='svg'][1]")), 30000).click();
        await leaveOrganizationButton1(driver);
        await leaveOrganizationButton2(driver);
        await waitingLoadingRingProficloudToDissapear(driver);
        await driver.get("https://app.proficloud.io/services/account/user-settings");
        await reloadPage(driver);
        await driver.sleep(4000);
        await activeOrganization(driver);
        await driver.sleep(1000);
        extraOrganization = await countElementsByXPath(driver, "(//div[@class='profile-menu_icon-text__text'][contains(.,'Z Z')])[1]");
        await activeOrganization(driver);
    }
}


async function eliminateExtraOrganizationsEditor(driver) {
    await activeOrganization(driver);
    await driver.sleep(1000);
    extraOrganization = await countElementsByXPath(driver, "(//div[@class='profile-menu_icon-text__text'][contains(.,'Z Z')])[1]");
    await activeOrganization(driver);

    while (extraOrganization > 0) {
        await switchToExtraOrganization(driver,"Z Z");
        await userManagementMenu(driver);
        await usersLeftMenu(driver);
        await driver.sleep(2000);
        noDesiredUser = await countElementsByXPath(driver, "//div[@id='outlet']/app-user-management/div/app-members/flex-col/flex-col/div/ng-scrollbar/div/div/div/div/div[2]/pc-list-item/div/div");

        while (noDesiredUser > 0) {
            const { lastDynamicXPath, mailText } = await getEmailofUndesiredUserAndHamburgerClick(driver);

            if (!lastDynamicXPath) {
                console.error("No dynamic XPath found for the icon.");
                break;
            }

            console.log(`An undesired user was found (✖╭╮✖)", ${mailText}`);
            await driver.wait(until.elementLocated(By.xpath(lastDynamicXPath)), 30000).click();
            await removeMemberButton(driver);
            await driver.findElement(By.xpath("//input[contains(@placeholder,'email ')]")).clear();
            await driver.findElement(By.xpath("//input[contains(@placeholder,'email ')]")).sendKeys(mailText);
            await removeMemberButton2(driver);
            await driver.sleep(6000);
            noDesiredUser = await countElementsByXPath(driver, "//div[@id='outlet']/app-user-management/div/app-members/flex-col/flex-col/div/ng-scrollbar/div/div/div/div/div[2]/pc-list-item/div/div");
        }

        await activeOrganization(driver);
        await settings(driver);
        await driver.wait(until.elementLocated(By.xpath("/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[1]/app-account-management[1]/flex-col[1]/app-user-settings[1]/flex-col[1]/flex-col[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/mat-tab-group[1]/div[1]/mat-tab-body[1]/div[1]/div[1]/app-expandable-organisation[1]/div[1]/div[1]/flex-row[1]/flex-row[1]/div-relative[1]/app-icon[1]/*[name()='svg'][1]")), 30000).click();
        await leaveOrganizationButton1(driver);
        await leaveOrganizationButton2(driver);
        await waitingLoadingRingProficloudToDissapear(driver);
        await driver.get("https://app.proficloud.io/services/account/user-settings");
        await reloadPage(driver);
        await driver.sleep(4000);
        await activeOrganization(driver);
        await driver.sleep(1000);
        extraOrganization = await countElementsByXPath(driver, "(//div[@class='profile-menu_icon-text__text'][contains(.,'Z Z')])[1]");
        await activeOrganization(driver);
    }
}
  
  

  async function getEmailofUndesiredUserAndHamburgerClick(driver) {
    const baseXPathWithoutIndex = "/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[1]/app-user-management[1]/div[1]/app-members[1]/flex-col[1]/flex-col[1]/div[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/div";
    const itemXPath = "/pc-list-item[1]/div[1]/div[1]/div[4]/app-icon[1]/*[name()='svg'][1]";

    const mailBaseXPath = "//div[@id='outlet']/app-user-management/div/app-members/flex-col/flex-col/div/ng-scrollbar/div/div/div/div/div";
    const mailItemXPath = "/pc-list-item/div/div/div/div[2]";

    let index = 1;
    let lastDynamicXPath = "";
    let lastMailXPath = "";
    let mailText = "";

    // Find last dynamic XPath
    while (true) {
        const dynamicXPath = `${baseXPathWithoutIndex}[${index}]${itemXPath}`;
        const elements = await driver.findElements(By.xpath(dynamicXPath));

        if (elements.length > 0) {
            lastDynamicXPath = dynamicXPath;
            index++;
        } else {
            break;
        }
    }

    // Find last mail XPath
    index = 1;
    while (true) {
        const dynamicMailXPath = `${mailBaseXPath}[${index}]${mailItemXPath}`;
        const elements = await driver.findElements(By.xpath(dynamicMailXPath));

        if (elements.length > 0) {
            lastMailXPath = dynamicMailXPath;
            index++;
        } else {
            break;
        }
    }

    if (lastMailXPath) {
        const lastMailElement = await driver.findElement(By.xpath(lastMailXPath));
        mailText = await lastMailElement.getText();
    }

    return { lastDynamicXPath, mailText };
}

  async function leaveOrganizationButton1(driver) {
    await driver.sleep(1000);
    button1= await driver.wait(until.elementLocated(By.id("leave")), 2000);
    await driver.wait(until.elementIsVisible(button1),2000).click();

    
  }

  async function leaveOrganizationButton2(driver) {

    await driver.sleep(1000);
    button2= await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Leave Organization')]")), 2000);
    await driver.wait(until.elementIsVisible(button2),2000).click();
    
  }

  async function confirmLinkUrlToggleIsOff(driver) {

    
    const xpath ="//a[contains(text(), 'All settings')]";

    
    const allSettingsButton = await driver.executeScript((xpath) => {
    const result = document.evaluate(
        xpath, 
        document, 
        null, 
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, 
        null
      );
      return result.snapshotLength; // Retorna la cantidad de elementos encontrados
    }, xpath);
    
    console.log('Is the All Settings button in Proton Mail present?:', allSettingsButton);
    
      // Verificar si el error es de usuario inválido
      if (allSettingsButton > 0) {

        console.log("The allSetingsButton is present, thus we DONT need to uncovered it and we can just click on it");
        await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'All settings')]")), 30000).click();
        
        
        return;
      }
      else{
    
        console.log("The allSetingsButton is NOT present, thus we need to uncovered it and then click on it");
        
        await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'Toggle settings')]")), 30000).click();
        await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'All settings')]")), 30000).click();
      }

      await driver.wait(until.elementLocated(By.xpath("//h1[contains(.,'Dashboard')]")), 30000)
      await driver.wait(until.elementLocated(By.xpath("//span[@title='Messages and composing']")), 30000).click();
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Confirm link URLs')]")), 30000);
      await driver.sleep(2000);

      const xpath1 = "//*[@class='toggle-container toggle-container--checked']";

      
      const numberOfTogglesActivated = await driver.executeScript((xpath1) => {
      const result = document.evaluate(
          xpath1, 
          document, 
          null, 
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, 
          null
        );
        return result.snapshotLength; // Retorna la cantidad de elementos encontrados
      }, xpath1);
      
      console.log('Number of toggle elements:', numberOfTogglesActivated);
  

    if (numberOfTogglesActivated == 6) {
    console.log("All good the link confirmation is deactivated and thus standard conditions");
    return;
  }

  
  if (numberOfTogglesActivated > 6) {
    console.log("Link confirmation is ACTIVATED, thus we need to deactivate for avoiding problems");
    await driver.wait(until.elementLocated(By.xpath("//span[normalize-space()='Confirm link URLs']")), 30000).click();

    return; 
  }

}

  

  async function enterRegistrationData(driver, vars) {
    
    //REGISTRATION

        // C895 If the user enter an invalid email, and correct it later, it is should be possible to REGISTER to Proficloud or create Billing account.

      
        
       await driver.findElement(By.xpath("//input[@placeholder=\'Organization name\']")).sendKeys("Unregistered Orga");
       await driver.findElement(By.xpath("//input[@placeholder=\'Email\']")).sendKeys("thisEmailNotValid@");
       await driver.findElement(By.xpath("//div[@class=\'title\'][contains(.,\'Registration\')]")).click();
       await driver.sleep(1000);
     
       await driver.findElements(By.xpath("//app-icon[@name=\'warning\']//*[name()=\'svg\']//*[name()=\'path\' and contains(@class,\'ng-star-in\')]"));
         
       await driver.findElement(By.xpath("//input[@placeholder=\'Email\']")).clear();
       await driver.findElement(By.xpath("//input[@placeholder=\'Email\']")).sendKeys(vars["username"]);
       await driver.findElement(By.id("mat-select-value-1")).click();
       await driver.findElement(By.xpath("//span[contains(.,\'Spain\')]")).click();
       await driver.findElement(By.xpath("//input[@placeholder=\'First name\']")).sendKeys(vars["firstName"]);
       await driver.findElement(By.xpath("//input[@placeholder=\'Last name\']")).sendKeys(vars["lastName"]);
       await driver.findElement(By.xpath("//input[@placeholder=\'Password\']")).sendKeys(vars["password"]);
       await driver.findElement(By.xpath("//input[contains(@placeholder,\'Confirm password\')]")).sendKeys(vars["password"]);
       await driver.sleep(1000);


       // C1024  Check and uncheck the Terms and Licences Agreement should not alter the registered button
       await driver.findElements(By.xpath("//*[@disabled=\'true\'][contains(.,\'Register\')]"));

       // Agree terms
       await agreeTerms(driver);
       //Assert that Register button is deactivated
       const buttonRegisterDisabled = await driver.findElements(By.xpath("//*[@disabled=\'true\'][contains(.,\'Register\')]"));
       assert(!buttonRegisterDisabled.length);
       await agreeTerms(driver);
       await driver.findElements(By.xpath("//*[@disabled=\'true\'][contains(.,\'Register\')]"));
       await agreeTerms(driver);
       assert(!buttonRegisterDisabled.length);
       await driver.findElement(By.xpath("//span[contains(.,\'Register\')]")).click();
       
  }

  async function countElementsByXPath(driver, xpath) {
    const elementCount = await driver.executeScript((xp) => {
      const result = document.evaluate(
        xp,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      return result.snapshotLength;
    }, xpath);
  
    console.log(`XPath: ${xpath}, Elements Found: ${elementCount}`);
  
    return elementCount;
  }
  
async function testEmpro3Name(driver) {

  editeName = await getTextByLocator(driver,"xpath","//div[@id='device-list-item-f8be7a9a-9212-4ad2-86ed-8fd383968e01']/app-device-item/div/flex-col[2]/flex-row-between-center/div") 
  if (editeName === "empro 3") {
    sendMessageLogToBrowserStack(driver,"The device has its original name");
    

  }
  else
  {
    sendMessageLogToBrowserStack(driver,"The device has not its original name and thus has to be edited");
    await clearAndWrite(driver,"id","mat-input-0","Testing Name");
    await driver.wait(until.elementLocated(By.css("#f8be7a9a-9212-4ad2-86ed-8fd383968e01-more > .ng-star-inserted")), 30000).click();
    await clearAndWrite(driver,"id","add-device-name","empro 3");
    await saveChangesButton(driver);
    await reloadPage(driver);


  }
}


async function editDeviceButton(driver) {


  await driver.wait(until.elementLocated(By.xpath("//div[normalize-space()='EDIT DEVICE']")), 30000).click();
  
}

async function saveChangesButton(driver) {


  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'save changes')]")), 30000).click();
  
}



  async function assertXpathNotPresent(driver, xpath) {
    await driver.sleep(1000);
  
    // Guardamos el resultado retornado por countElementsByXPath
    const elementCount = await countElementsByXPath(driver, xpath);
  
    if (elementCount > 0) {
      console.log(`We have a problem: the element ${xpath} was found.`);
      await forceFailStatus(driver);  // Cierra el navegador
    } else {
      console.log(`All good: the element: ${xpath} is not present in the page`);
    }
  }
  


/**
 * Converts a CSS selector to its equivalent XPath.
 *
 * @param {string} css - The CSS selector to convert.
 * @returns {string} The equivalent XPath expression.
 */
/**
 * Converts a CSS selector to its equivalent XPath.
 *
 * @param {string} css - The CSS selector to convert.
 * @returns {string} The equivalent XPath expression.
 */
function cssToXPath(css) {
  if (!css) {
      throw new Error("The CSS selector cannot be empty.");
  }

  let xpath = css
      // Replace class selectors (.class-name) with [contains(concat(" ", normalize-space(@class), " "), " class-name ")]
      .replace(/\.(\w+)/g, '//*[contains(concat(" ", normalize-space(@class), " "), " $1 ")]')
      // Replace ID selectors (#id) with [@id='id']
      .replace(/#(\w+)/g, "//*[@id='$1']")
      // Replace attribute selectors ([attr=value])
      .replace(/\[([\w-]+)([*^$~|]?=)["']?([^\]"']+)["']?\]/g, (match, attr, operator, value) => {
          switch (operator) {
              case "=": return `//*[@${attr}='${value}']`;
              case "*=": return `//*[contains(@${attr}, '${value}')]`;
              case "^=": return `//*[starts-with(@${attr}, '${value}')]`;
              case "$=": return `//*[substring(@${attr}, string-length(@${attr}) - string-length('${value}') + 1) = '${value}']`;
              case "~=": return `//*[contains(concat(" ", @${attr}, " "), " ${value} ")]`;
              case "|=": return `//*[starts-with(concat(@${attr}, '-'), '${value}-')]`;
              default: return `//*[@${attr}]`;
          }
      })
      // Replace descendant combinators (space) with //
      .replace(/\s+/g, "//")
      // Replace child combinators (>) with /
      .replace(/>/g, "/");

  // Ensure XPath starts with .
  if (!xpath.startsWith(".")) {
      xpath = `.${xpath}`;
  }

  return xpath;
}

/**
* Converts an ID or CSS selector to its equivalent XPath.
*
* @param {string} selector - The ID or CSS selector to convert.
* @param {string} type - The type of selector: "id" or "css".
* @returns {string} The equivalent XPath expression.
*/
function convertToXPath(selector, type) {
  switch (type.toLowerCase()) {
      case 'id':
          return `//*[@id='${selector}']`; // Convert ID to XPath
      case 'css':
          return cssToXPath(selector); // Convert CSS to XPath
      default:
          throw new Error(`Unsupported selector type: ${type}`);
  }
}

/**
* Master function to assert that an element is not present.
*
* @param {object} driver - The Selenium WebDriver instance.
* @param {string} type - The type of selector: "xpath", "css", or "id".
* @param {string} selector - The element selector.
* @returns {Promise<void>} Resolves if the element is not present, otherwise throws an error.
*/
async function assertElementNotPresent(driver, type, selector) {
  let xpath;

  // Convert selector if it is CSS or ID, otherwise use XPath directly.
  if (type.toLowerCase() === 'css' || type.toLowerCase() === 'id') {
      xpath = convertToXPath(selector, type);
  } else if (type.toLowerCase() === 'xpath') {
      xpath = selector;
  } else {
      throw new Error(`Unsupported selector type: ${type}`);
  }

  // Use the existing assertXpathNotPresent function with the generated XPath.
  await assertXpathNotPresent(driver, xpath);
}

  


    
  

  
  async function agreeTerms(driver) {
    await driver.findElement(By.id("mat-mdc-checkbox-1-input")).click();
    await driver.sleep(2000);
  }

  async function waitUntilXpathNotPresent(driver, xpathName) {
    // Waits until the element is no longer present
    await driver.wait(async () => {
      const elementCount = await countElementsByXPath(driver, xpathName); // Uses countElementsByXPath to count the elements
      return elementCount === 0; // If the number of elements is 0, it is no longer present
    }, 60000); // Wait up to 15 seconds
  
    console.log(`The element with XPath "${xpathName}" is no longer present on the page.`);
  }
  

  async function waitingLoadingRingProficloudToDissapear(driver) {

    await waitUntilXpathNotPresent(driver, "//div[contains(@class,'pc-status-overlay__icon-container')]");  
    await driver.sleep(2000);
  }
  
  async function waitForXPathPresentTimeout(driver, xpath, timeout) {
    const pollInterval = 1000; // Polling interval in milliseconds (1 second)
    const endTime = Date.now() + timeout;

    console.log(`Starting to wait for the element with XPath: "${xpath}" for up to ${timeout / 1000} seconds.`);

    while (Date.now() < endTime) {
        try {
            const elementCount = await driver.executeScript((xp) => {
                const result = document.evaluate(
                    xp,
                    document,
                    null,
                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                    null
                );
                return result.snapshotLength;
            }, xpath);

            if (elementCount > 0) {
                console.log(`Element with XPath: "${xpath}" found. Number of matches: ${elementCount}`);
                return true; // The element was found
            } else {
                console.log(`Element with XPath: "${xpath}" not found. Checking again in ${pollInterval / 1000} second(s).`);
            }
        } catch (err) {
            console.error(`Error during XPath evaluation: ${err}`);
        }

        // Wait 1 second before checking again
        await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    console.log(`Timed out after ${timeout / 1000} seconds. The element with XPath: "${xpath}" was not found.`);

    // Invoke the forceFailStatus function to stop the program
    await forceFailStatus(driver);

    return false; // The element was not found within the defined time
}


async function waitForXPathPresentTimeoutNoStop(driver, xpath, timeout) {
  const pollInterval = 1000; // Polling interval in milliseconds (1 second)
  const endTime = Date.now() + timeout;

  console.log(`Starting to wait for the element with XPath: "${xpath}" for up to ${timeout / 1000} seconds.`);

  while (Date.now() < endTime) {
      try {
          const elementCount = await driver.executeScript((xp) => {
              const result = document.evaluate(
                  xp,
                  document,
                  null,
                  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                  null
              );
              return result.snapshotLength;
          }, xpath);

          if (elementCount > 0) {
              console.log(`Element with XPath: "${xpath}" found. Number of matches: ${elementCount}`);
              return true; // The element was found
          } else {
              console.log(`Element with XPath: "${xpath}" not found. Checking again in ${pollInterval / 1000} second(s).`);
          }
      } catch (err) {
          console.error(`Error during XPath evaluation: ${err}`);
      }

      // Wait 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  console.log(`Timed out after ${timeout / 1000} seconds. The element with XPath: "${xpath}" was not found.`);

  // Invoke the forceFailStatus function to stop the program
 // await forceFailStatus(driver);

  //return false; // The element was not found within the defined time
}

async function sendMessageLogToBrowserStack(driver,message) {

  await driver.executeScript(`console.log("${message}")`);
  console.log(`Mensaje enviado a BrowserStack: "${message}"`);
}


/**
 * Validates that the text of an element identified by a selector matches the expected value.
 * Waits up to 5 seconds for the text to appear.
 * 
 * @param {WebDriver} driver - The instance of the WebDriver.
 * @param {string} locatorType - The type of locator: 'xpath', 'css', 'id', 'name', 'class', 'tag'.
 * @param {string} locatorValue - The value of the selector.
 * @param {string} expectedText - The text expected to be found.
 */
async function assertText(driver, locatorType, locatorValue, expectedText) {
  try {
    let locator;

    // Determine the appropriate locator
    switch (locatorType.toLowerCase()) {
      case 'xpath':
        locator = By.xpath(locatorValue);
        break;
      case 'css':
        locator = By.css(locatorValue);
        break;
      case 'id':
        locator = By.id(locatorValue);
        break;
      case 'name':
        locator = By.name(locatorValue);
        break;
      case 'class':
        locator = By.className(locatorValue);
        break;
      case 'tag':
        locator = By.tagName(locatorValue);
        break;
      default:
        throw new Error(`❌ Invalid locator type: "${locatorType}"`);
    }

    // Wait for the element to be visible and the text to match
    const element = await driver.wait(until.elementLocated(locator), 5000, `Element not found using ${locatorType}: "${locatorValue}"`);
    await driver.wait(until.elementTextIs(element, expectedText), 5000, `Text "${expectedText}" not found within 5 seconds.`);

    // Get the actual text and validate
    const actualText = await element.getText();
    if (actualText === expectedText) {
      console.log(`✅ The text matches: "${actualText}"`);
    } else {
      throw new Error(`❌ The text does not match. Expected: "${expectedText}", but got: "${actualText}"`);
    }
  } catch (error) {
    console.error(`❌ Error validating text: ${error.message}`);
    throw error;
  }
}



async function deviceManagementMenu(driver) {

  const oldMenuCount = await countElementsByXPath(driver, "//span[contains(.,'Device Management Service')]");

  if (oldMenuCount > 0) {
    await driver.findElement(By.xpath("//span[contains(.,'Device Management Service')]",10000)).click();
  } else {
    console.log("The usal menu is hidden thus we have to give click in the arrow to expand it")
    await arrowLeftSideMenu(driver);
    const energyServiceElement = await driver.findElement(By.xpath("//span[contains(.,'Device Management Service')]"),5000);
    await energyServiceElement.click();
  }
}


async function devicesByAssigment(driver) {

  await driver.wait(until.elementLocated(By.xpath("//span[@class='mdc-tab__text-label'][contains(.,'Devices')]")), 30000).click();
  
}


async function userManagementMenu(driver) {

await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'User Management Service')]")), 30000).click();
    
}

async function emmaDeleteButton(driver) {
  await driver.sleep(500);
  await driver.wait(until.elementLocated(By.xpath("//span[@class='mat-mdc-menu-item-text'][contains(.,'Delete')]")), 30000).click();

  
}

async function serviceStoreMenu(driver) {

  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Service Store')]")), 10000).click();
  }

  

async function emmaMenu(driver) {
  
    const oldMenuCount = await countElementsByXPath(driver, "//flex-col[@id='energy-management-service']/div/div[2]/div");

    if (oldMenuCount > 0) {
      await driver.findElement(By.xpath("//flex-col[@id='energy-management-service']/div/div[2]/div")).click();
    } else {
      await arrowLeftSideMenu(driver);
      const energyServiceElement = await driver.findElement(By.xpath("//span[contains(.,'Energy Management Service')]"));
      await energyServiceElement.click();
    }
    await driver.wait(until.elementLocated(By.xpath("//div[@role='tab'][contains(.,'Dashboard')]")), 10000);
  }

async function arrowLeftSideMenu(driver) {
  arrowMinimized = await countElementsByXPath(driver,'//*[contains(concat(" ",normalize-space(@class)," ")," navigation_control-expand-icon--minimized ")]/*[contains(concat(" ",normalize-space(@class)," ")," ng-star-inserted ")]')
  if (arrowMinimized > 0 ){
    await driver.wait(until.elementLocated(By.css(".navigation_control-expand-icon--minimized > .ng-star-inserted")), 10000).click();
  }
}

async function arrowSortByButton(driver) {
  await driver.wait(until.elementLocated(By.css(".pc-icon-dropdown__right-icon > .ng-star-inserted")), 30000);
  await driver.findElement(By.css(".pc-icon-dropdown__right-icon > .ng-star-inserted")).click();
}

async function lastNameButton(driver) {
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'last name')]")), 30000).click();
}

async function firstNameButton(driver) {
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'first name')]")), 30000).click();
  
  
}

async function emailNameButton(driver) {
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'email')]")), 30000).click();

}

async function roleNameButton(driver) {
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'role')]")), 30000).click();

}


async function invitedNameButton(driver) {

  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'invited')]")), 30000).click();

  
}


async function removeMemberButton(driver) {
  await driver.sleep(1000);
  await driver.findElement(By.xpath("//div[contains(text(),'remove member')]",2000)).click();
  await driver.sleep(500);
  await driver.wait(until.elementLocated(By.xpath("//div[@data-analytics='modal headline'][contains(.,'Remove Member')]")), 30000);
}

async function removeMemberButton2(driver) {

  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'remove member')]")), 30000).click();
  
  await driver.sleep(2000);
}

async function inviteMemberButton(driver) {

  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Invite Member')]")), 30000).click();
  await driver.sleep(2000);
}

async function inviteMemberButton2(driver) {

  await driver.wait(until.elementLocated(By.xpath("(//span[contains(.,'Invite Member')])[4]")), 30000).click();
  await driver.sleep(2000);
}

async function roleSelectionDropDownMenu(driver) {

  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Role')]")), 30000).click();
  
}

async function inviteMember(driver, mail, role) {
  try {

      await userManagementMenu(driver);

      // Click the "Invite Member" button
      await inviteMemberButton(driver);

      // Clear the email input field and enter the provided email
      const emailInput = await driver.findElement(By.xpath("//input[@placeholder='Email']"));
      await driver.wait(until.elementIsVisible(emailInput), 2000);
      await emailInput.clear();
      await emailInput.sendKeys(mail);

      // Select the role from the dropdown menu
      await roleSelectionDropDownMenu(driver);
      const roleElement = await driver.findElement(By.xpath(`//span[contains(.,'${role}')]`));
      await driver.wait(until.elementIsVisible(roleElement), 2000);
      await roleElement.click();

      // Click the second button to send the invitation
      await inviteMemberButton2(driver);

      // Wait for the loading spinner to disappear
      await waitingLoadingRingProficloudToDissapear(driver);

      console.log(`Member successfully invited with email: ${mail} and role: ${role}`);
  } catch (error) {
      console.error(`Error inviting member with email: ${mail} and role: ${role} - ${error.message}`);
      throw error; // Rethrow the error for the caller to handle
  }
}





/**
 * Retrieves and returns the text of an element identified by a specific locator.
 *
 * @param {WebDriver} driver - The WebDriver instance.
 * @param {string} locatorType - The type of locator: 'xpath', 'css', 'id', 'name', 'class', 'tag'.
 * @param {string} locatorValue - The selector's value.
 * @returns {Promise<string>} - The text of the element.
 */
async function getTextByLocator(driver, locatorType, locatorValue) {
  try {
    let element;
    switch (locatorType.toLowerCase()) {
      case 'xpath':
        element = await driver.findElement(By.xpath(locatorValue));
        break;
      case 'css':
        element = await driver.findElement(By.css(locatorValue));
        break;
      case 'id':
        element = await driver.findElement(By.id(locatorValue));
        break;
      case 'name':
        element = await driver.findElement(By.name(locatorValue));
        break;
      case 'class':
        element = await driver.findElement(By.className(locatorValue));
        break;
      case 'tag':
        element = await driver.findElement(By.tagName(locatorValue));
        break;
      default:
        throw new Error(`❌ Invalid locator type: "${locatorType}"`);
    }

    // Get the text of the element
    const text = await element.getText();
    console.log(`✅ Text found: "${text}"`);
    return text;
  } catch (error) {
    console.error(`❌ Error retrieving the text: ${error.message}`);
    throw error;
  }
}

async function clickFirstMail(driver){
await driver.sleep(1000);
await driver.wait(until.elementLocated(By.css(".item-subject > .inline-block")), 60000).click();
}

async function clickSecondMail(driver){

  await driver.sleep(1000);
  await driver.wait(until.elementLocated(By.css(".item-container-wrapper:nth-child(2) > .flex-1")), 60000).click();
  }


async function removeRegisteredUserNew(driver, vars) {
  console.log("Removing registered user...");

  // Sort by Last Name
  await arrowSortByButton(driver);
  await lastNameButton(driver);

  // Verify initial state
  assert(
    await driver.findElement(By.xpath("//div[5]/pc-list-item/div/div/div/div")).getText() === "Registered Zuser in Proficloud"
  );
  assert(
    await driver.findElement(By.xpath("//h4[contains(.,'Rooth Organization')]")).getText() === "Rooth Organization"
  );
  
  vars["extraMember"] = await driver.findElements(By.xpath(
    "/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[2]/app-user-management[1]/div[1]/app-members[1]/flex-col[1]/flex-col[1]/div[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/div[5]/pc-list-item[1]/div[1]/div[1]/div[4]/app-icon[1]/*[name()='svg'][1]"
  )).length;

  console.log("Extra member invitations present?:", vars["extraMember"]);

  // Remove all extra members if found
  while (vars["extraMember"] > 0) {
    await driver.findElement(By.xpath(
      "/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[2]/app-user-management[1]/div[1]/app-members[1]/flex-col[1]/flex-col[1]/div[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/div[5]/pc-list-item[1]/div[1]/div[1]/div[4]/app-icon[1]/*[name()='svg'][1]"
    )).click();

    await removeMemberButton(driver);

    vars["emailOfExtraMember"] = await driver
      .findElement(By.xpath("//div[5]/pc-list-item/div/div/div/div[2]"))
      .getText();

    await driver.findElement(By.xpath("//input[contains(@placeholder,'email ')]")).sendKeys(
      vars["emailOfExtraMember"]
    );

    await removeMemberButton2(driver);
    await waitingLoadingRingProficloudToDissapear(driver);

    vars["extraMember"] = await driver.findElements(By.xpath(
      "/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[2]/app-user-management[1]/div[1]/app-members[1]/flex-col[1]/flex-col[1]/div[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/div[5]/pc-list-item[1]/div[1]/div[1]/div[4]/app-icon[1]/*[name()='svg'][1]"
    )).length;

    console.log("Remaining extra members:", vars["extraMember"]);
  }

  console.log("All extra members removed successfully.");
}


async function removeOldMemberInvitationsRoothOrga (driver) {

  await userManagementMenu(driver);
        await arrowSortByButton(driver);
        await lastNameButton(driver);

        // Wait for the element with the name 'Fernando Admin' to load
        await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'Fernando Zuniga')]")), 30000);
        await driver.sleep(3000);

        // Check for any extra members in the organization
        let extraMember = await countElementsByXPath(
          driver,
          "/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[1]/app-user-management[1]/div[1]/app-members[1]/flex-col[1]/flex-col[1]/div[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/div[5]/pc-list-item[1]/div[1]/div[1]/div[4]/app-icon[1]/*[name()='svg'][1]"
        );
        console.log('Extra member in the organization found?:', extraMember);

        let retries = 0;
        const maxRetries = 50;

        // Attempt to remove extra member
        while (extraMember > 0 && retries < maxRetries) {
          console.log(`Attempting to remove extra member (Attempt ${retries + 1}/${maxRetries})`);

          try {
            const emailOfExtraMember = await getTextByLocator(
              driver,
              "xpath",
              "//div[5]/pc-list-item/div/div/div/div[2]"
            );

            const protectedEmails = [
              "rsylvester@phoenixcontact-sb.io",
              "testingpxc_viewer@proton.me",
              "testingpxc_editor@proton.me",
              "testingpxc_admin@proton.me"
            ];

            // Check if the email is protected
            if (protectedEmails.includes(emailOfExtraMember)) {
              console.log("❌ Email is protected. Stopping removal process.");
              return; // Stops the process if email is protected
            }

            // Click to remove the member
            await driver.wait(
              until.elementLocated(
                By.xpath(
                  "/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[1]/app-user-management[1]/div[1]/app-members[1]/flex-col[1]/flex-col[1]/div[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/div[5]/pc-list-item[1]/div[1]/div[1]/div[4]/app-icon[1]/*[name()='svg'][1]"
                )
              ),
              30000
            ).click();

            await removeMemberButton(driver);

            // Clear the email input and enter the email of the extra member
            await driver.wait(until.elementLocated(By.xpath("//input[contains(@placeholder,'email ')]")), 30000);
            await driver.findElement(By.xpath("//input[contains(@placeholder,'email ')]")).clear();
            await driver.findElement(By.xpath("//input[contains(@placeholder,'email ')]")).sendKeys(emailOfExtraMember);

            await removeMemberButton2(driver);
            await waitingLoadingRingProficloudToDissapear(driver);
          } catch (error) {
            console.error(`❌ Error while attempting to remove extra member: ${error.message}`);
          }

          // Recheck if the extra member still exists
          extraMember = await countElementsByXPath(
            driver,
            "/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[1]/app-user-management[1]/div[1]/app-members[1]/flex-col[1]/flex-col[1]/div[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/div[5]/pc-list-item[1]/div[1]/div[1]/div[4]/app-icon[1]/*[name()='svg'][1]"
          );
          console.log('Extra member in the organization found?:', extraMember);

          retries++;
        }

        if (extraMember === 0) {
          console.log("✅ Extra member successfully removed or no action was needed.");
        } else {
          console.log(`❌ Extra member removal failed after ${maxRetries} attempts.`);
        }
  
}


async function removeOldMemberInvitationsRoothOrgaDev (driver) {

  await userManagementMenu(driver);
        await arrowSortByButton(driver);
        await lastNameButton(driver);

        // Wait for the element with the name 'Fernando Admin' to load
        await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'Fernando Zuniga')]")), 30000);
        await driver.sleep(3000);

        // Check for any extra members in the organization
        let extraMember = await countElementsByXPath(
          driver,
          "(//*[@ng-reflect-name='more'])[6]"
        );
        console.log('Extra member in the organization found?:', extraMember);

        let retries = 0;
        const maxRetries = 50;

        // Attempt to remove extra member
        while (extraMember > 0 && retries < maxRetries) {
          console.log(`Attempting to remove extra member (Attempt ${retries + 1}/${maxRetries})`);

          try {
            const emailOfExtraMember = await getTextByLocator(
              driver,
              "xpath",
              "//div[6]/pc-list-item/div/div/div/div[2]"
            );

            const protectedEmails = [
              "rsylvester@phoenixcontact-sb.io",
              "testingpxc_viewer@proton.me",
              "testingpxc_editor@proton.me",
              "testingpxc_admin@proton.me"
            ];

            // Check if the email is protected
            if (protectedEmails.includes(emailOfExtraMember)) {
              console.log("❌ Email is protected. Stopping removal process.");
              return; // Stops the process if email is protected
            }

            // Click to remove the member
            await driver.wait(
              until.elementLocated(
                By.xpath(
                  "(//*[@ng-reflect-name='more'])[6]"
                )
              ),
              30000
            ).click();

            await removeMemberButton(driver);

            // Clear the email input and enter the email of the extra member
            await driver.wait(until.elementLocated(By.xpath("//input[contains(@placeholder,'email ')]")), 30000);
            await driver.findElement(By.xpath("//input[contains(@placeholder,'email ')]")).clear();
            await driver.findElement(By.xpath("//input[contains(@placeholder,'email ')]")).sendKeys(emailOfExtraMember);

            await removeMemberButton2(driver);
            await waitingLoadingRingProficloudToDissapear(driver);
          } catch (error) {
            console.error(`❌ Error while attempting to remove extra member: ${error.message}`);
          }

          // Recheck if the extra member still exists
          extraMember = await countElementsByXPath(
            driver,
            "(//*[@ng-reflect-name='more'])[6]"
          );
          console.log('Extra member in the organization found?:', extraMember);

          retries++;
        }

        if (extraMember === 0) {
          console.log("✅ Extra member successfully removed or no action was needed.");
        } else {
          console.log(`❌ Extra member removal failed after ${maxRetries} attempts.`);
        }
  
}

async function changeFrameAndClickonProficloudEmail(driver) {
  try {
      // Wait for the iframe to load and switch to it
      await driver.sleep(2000); // Short delay to ensure smooth transitions
      const iframe = await driver.wait(until.elementLocated(By.css('iframe')), 10000);
      await driver.switchTo().frame(iframe);

      console.log("Clicking the button from Proficloud (e.g., Accept invitation / Join Organization)");
      await driver.wait(until.elementLocated(By.css("a > div")), 10000).click();

      // Handle the new window or tab that opens
      const windowHandles = await driver.getAllWindowHandles();
      console.log('Window handles found:', windowHandles);
      const latestWindow = windowHandles[windowHandles.length - 1];
      await driver.switchTo().window(latestWindow);

      console.log('Switched to the most recent window.');
  } catch (error) {
      console.error("An error occurred while handling the Proficloud email:", error);
  }
}

async function viewerRoleReset(driver) {

  await driver.findElement(By.xpath("//input"),5000).sendKeys("Viewer");
  await driver.sleep(2000);
  let roleOfViewerUser = await driver.findElement(By.css(".pc-list-item__type")).getText();
  console.log("Role of viewer user at the beginning of the test:", roleOfViewerUser);
   
  
  if (roleOfViewerUser !== "Viewer") {

      console.log("Viewer role different than VIEWER some changes has to be taken");
      await driver.findElement(By.css(".pc-list-item__action-button > .ng-star-inserted")).click();
      await driver.sleep(1000);
      await driver.findElement(By.xpath("//div[contains(text(),\'change role\')]")).click();
      await driver.sleep(1000);
      assert(await driver.findElement(By.css(".pc-overlay__title")).getText() == "Change members role");
      await roleSelectionField(driver);
      await driver.findElement(By.xpath("//span[contains(.,\'Viewer\')]"),2000).click();
      await driver.findElement(By.xpath("//span[contains(.,\'Apply role\')]"),2000).click();
      await waitingLoadingRingProficloudToDissapear(driver);
      await driver.sleep(1000);
      assert(await driver.findElement(By.css(".pc-list-item__type")).getText() == "Viewer");
      
    } else {
  
      console.log("Viewer member has the viewer role :) ");
  }
  await driver.findElement(By.xpath("//input")).clear();
  await deviceManagementMenu(driver);
  await userManagementMenu(driver);
  await waitForUsersToLoad(driver);
  
}

async function roleSelectionField(driver) {
  try {
      // Locate the role selection field
      console.log("Waiting for the 'Role' field to be present...");
      let roleSelection = await driver.wait(
          until.elementLocated(By.xpath("//mat-label[contains(.,'Role')]")),
          30000
      );

      // Ensure it is visible and interactive
      console.log("Waiting for the 'Role' field to be visible...");
      await driver.wait(until.elementIsVisible(roleSelection), 5000);

      // Perform the click
      console.log("Clicking on the 'Role' field...");
      await roleSelection.click();

      console.log("'Role' field selected successfully.");
      return roleSelection;
  } catch (error) {
      console.error("Error interacting with the 'Role' field:", error.message);
      throw error;
  }
}


async function dashboard(driver) {

  await driver.wait(until.elementLocated(By.xpath("//span[@class='mdc-tab__content'][contains(.,'Dashboard')]")), 30000);
  await driver.findElement(By.xpath("//span[@class='mdc-tab__content'][contains(.,'Dashboard')]")).click();
  await driver.sleep(1000);
  
}

async function clearAndWrite(driver, selectorType, selectorValue, text) {
  let element;

  try {
    // Select the element based on the selector type
    switch (selectorType) {
      case "xpath":
        element = await driver.findElement(By.xpath(selectorValue));
        break;
      case "id":
        element = await driver.findElement(By.id(selectorValue));
        break;
      case "css":
        element = await driver.findElement(By.css(selectorValue));
        break;
      case "name":
        element = await driver.findElement(By.name(selectorValue));
        break;
      default:
        throw new Error("Unsupported selector type: " + selectorType);
    }

    // Ensure the element is interactable
    await driver.wait(async () => {
      const isDisplayed = await element.isDisplayed();
      const isEnabled = await element.isEnabled();
      return isDisplayed && isEnabled;
    }, 10000, `Element ${selectorValue} is not interactable`);

    // Clear the element and write the text
    await element.clear();
    await element.sendKeys(text);

    // Wait for the element's value to match the input text
    await driver.wait(async () => {
      const value = await element.getAttribute("value");
      return value === text;
    }, 5000, `Text '${text}' was not written within the timeout`);
  } catch (error) {
    console.error(`Error in clearAndWrite: ${error.message}`);
    throw error;
  }
}



async function dataDisplayedCheck(driver) {

  await driver.wait(until.elementLocated(By.id("chartRendered")), 60000)
  
}

async function editButton(driver) {

  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Edit')]")), 3000).click();

  }

async function previewButton(driver) {

  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Preview')]")), 3000).click();
  
}


async function downloadButton(driver) {

  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Download')]")), 3000).click();
  
}


async function createChart(driver, initials) {
  try {

    await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'New Widget')]")), 30000).click();

    // Step 1: Select "Unit"
    await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Unit')]")), 2000).click();
    if (initials.startsWith('E')) {
      await driver.wait(until.elementLocated(By.xpath("//mat-option[contains(.,'Energy')]")), 2000).click();
    } else if (initials.startsWith('P')) {
      await driver.wait(until.elementLocated(By.xpath("//mat-option[contains(.,'Power')]")), 2000).click();
    }

    // Step 2: Select "Graph Type"
    await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Graph Type')]")), 2000).click();
    const graphType = initials.slice(1, 3);

    const graphOptions = {
      BC: "//mat-option[contains(.,'Bar chart')]",
      PC: "//mat-option[contains(.,'Pie chart')]",
      PA: "//mat-option[contains(.,'Pareto chart')]",
      HM: "//mat-option[contains(.,'Heat map')]",
      LDC: "//mat-option[contains(.,'Load Duration Curve')]",
      LC: "//mat-option[contains(.,'Line chart')]"
    };

    if (graphOptions[graphType]) {
      await driver.wait(until.elementLocated(By.xpath(graphOptions[graphType])), 2000).click();
    } else {
      throw new Error("Invalid graph type");
    }

    // Step 3: Select "Comparison Type" (skip if Heat Map)
    if (graphType !== 'HM') {
      await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Comparison Type')]")), 2000).click();
      const comparisonType = initials.slice(3, 6);

      if (graphType === 'PA') {
        const paretoOptions = {
          RBD: "//mat-option[contains(.,'Ranked by Data Source')]",
          RBT: "//mat-option[contains(.,'Ranked by Time Period')]"
        };

        if (paretoOptions[comparisonType]) {
          await driver.wait(until.elementLocated(By.xpath(paretoOptions[comparisonType])), 2000).click();
        } else {
          throw new Error("Invalid comparison type for Pareto Chart");
        }
      } else {
        const comparisonOptions = {
          DSC: "//mat-option[contains(.,'Data source comparison')]",
          TPC: "//mat-option[contains(.,'Time period comparison')]"
        };

        if (comparisonOptions[comparisonType]) {
          await driver.wait(until.elementLocated(By.xpath(comparisonOptions[comparisonType])), 2000).click();
        } else {
          throw new Error("Invalid comparison type");
        }
      }
    }

    // Step 4: Select "Data Source(s)"
    await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Data Source(s)']")), 2000).click();

    if (graphType === 'HM') {
      // For Heat Map, only select the specific data source
      await driver.wait(until.elementLocated(By.xpath("//flex-row[contains(.,'PH 1 Machine Park 1 - Ea+ electrical-energy')]")), 2000).click();
    } else {
      const comparisonType = initials.slice(3, 6);
      if (comparisonType === 'DSC') {
        if (initials.startsWith('E')) {
          await driver.wait(until.elementLocated(By.xpath("//flex-row[contains(.,'PH 1 Machine Park 1 - Ea+ electrical-energy')]")), 2000).click();
          await driver.wait(until.elementLocated(By.xpath("//flex-row[contains(.,'PH 1 Machine Park 2 - Ea+ electrical-energy')]")), 2000).click();
        } else if (initials.startsWith('P')) {
          await driver.wait(until.elementLocated(By.xpath("//flex-row[contains(.,'PH 1 Machine Park 1 - P electrical-power')]")), 2000).click();
          await driver.wait(until.elementLocated(By.xpath("//flex-row[contains(.,'PH 1 Machine Park 2 - P electrical-power')]")), 2000).click();
        }
      } else if (comparisonType === 'TPC') {
        if (initials.startsWith('E')) {
          await driver.wait(until.elementLocated(By.xpath("//flex-row[contains(.,'PH 1 Machine Park 1 - Ea+ electrical-energy')]")), 2000).click();
        } else if (initials.startsWith('P')) {
          await driver.wait(until.elementLocated(By.xpath("//flex-row[contains(.,'PH 1 Machine Park 1 - P electrical-power')]")), 2000).click();
        }
      } else if (comparisonType === 'RBT' || comparisonType === 'RBD') {
        await driver.wait(until.elementLocated(By.xpath("//span[@class='group-header'][contains(.,'All')]")), 2000).click();
      }
    }

    // In case of comparison type is not Time Period comparison we need to click on DONE
    if (graphType !== 'HM') {
      const comparisonType = initials.slice(3, 6);
      if (comparisonType === 'DSC' || comparisonType === 'RBT' || comparisonType === 'RBD') {
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Done')]")), 3000).click();
      }
    }

    // Step 5: Create the widget
    await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Create Widget')]")), 2000).click();
    await waitingLoadingRingProficloudToDissapear(driver);
    await dataDisplayedCheck(driver);

    console.log(`Chart successfully created: ${initials}`);
  } catch (error) {
    throw new Error(`Error in createChart(${initials}): ${error.message}`);
  }
}


async function handleBlobReportDownload(driver, fileName) {
  try {
      // Get the window handler
      const originalWindow = await driver.getWindowHandle();
      const newWindow = await driver.wait(async () => {
          const handles = await driver.getAllWindowHandles();
          return handles.length > 1 ? handles.find(handle => handle !== originalWindow) : null;
      }, 10000);

      // Switch to the new context
      await driver.switchTo().window(newWindow);

      // Wait for the page to fully load
      await driver.wait(
          async () => {
              const readyState = await driver.executeScript('return document.readyState;');
              return readyState === 'complete';
          },
          20000 // Increased timeout
      );

      // Verify if the Blob URL is directly accessible
      const currentUrl = await driver.getCurrentUrl();
      if (!currentUrl.startsWith('blob:')) {
          throw new Error('No valid Blob URL found.');
      }
      console.log(`Direct Blob URL: ${currentUrl}`);

      // Extract and process the blob content within the browser
      const pdfContent = await driver.executeAsyncScript(async (blobUrl, callback) => {
          try {
              const response = await fetch(blobUrl);
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              const blob = await response.blob();

              if (blob.size === 0) {
                  callback({ error: 'The Blob is empty.' });
                  return;
              }

              console.log(`Blob size: ${blob.size} bytes`);

              // Convert Blob to ArrayBuffer
              const arrayBuffer = await blob.arrayBuffer();
              const byteArray = Array.from(new Uint8Array(arrayBuffer));
              callback({ data: byteArray });
          } catch (err) {
              callback({ error: err.message });
          }
      }, currentUrl);

      if (pdfContent.error) {
          throw new Error(`Error downloading the Blob: ${pdfContent.error}`);
      }

      // Convert ArrayBuffer data into a Buffer and save the file
      const buffer = Buffer.from(pdfContent.data);

      // Determine the user's downloads folder
      const downloadsFolder = path.join(os.homedir(), 'Downloads');
      const filePath = path.join(downloadsFolder, fileName);

      fs.writeFileSync(filePath, buffer);
      console.log(`PDF file saved at ${filePath}`);
  } catch (error) {
      console.error(`Error: ${error.message}`);
  }
}

async function handleBlobReportDownloadBs(driver, fileName) {
  try {
      // Get the window handle
      const originalWindow = await driver.getWindowHandle();
      const newWindow = await driver.wait(async () => {
          const handles = await driver.getAllWindowHandles();
          return handles.length > 1 ? handles.find(handle => handle !== originalWindow) : null;
      }, 10000);

      // Switch to the new context
      await driver.switchTo().window(newWindow);

      // Wait for the page to fully load
      await driver.wait(
          async () => {
              const readyState = await driver.executeScript('return document.readyState;');
              return readyState === 'complete';
          },
          20000 // Increased timeout
      );

      // Verify if the Blob URL is directly accessible
      const currentUrl = await driver.getCurrentUrl();
      if (!currentUrl.startsWith('blob:')) {
          throw new Error('No valid Blob URL found.');
      }
      console.log(`Direct Blob URL: ${currentUrl}`);

      // Execute the download directly from the Blob URL
      await driver.executeScript(async (blobUrl, fileName) => {
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }, currentUrl, fileName);

      console.log(`The file should be downloaded as ${fileName} to the default folder.`);

      // Switch back to the original window
      await driver.switchTo().window(originalWindow);
      console.log('Regresado a la ventana original.');
  } catch (error) {
      console.error(`Error: ${error.message}`);
  }
}




/**
 * Uploads a file to a file input field.
 * 
 * @param {object} driver - WebDriver instance.
 * @param {string} fileInputSelector - Selector for the file input field.
 * @param {string} mode - Execution mode ('BS' for BrowserStack, 'local' for local execution).
 * @param {string} fileName - Name of the file to upload.
 */
async function uploadFile(driver, fileInputSelector, mode, fileName) {
  // Generate the base path according to the mode
  const basePath = mode === 'BS'
      ? 'C:\\Users\\hello\\Downloads' // Path for BrowserStack
      : 'C:/Users/Fernando/Downloads'; // Local path

  // Combine the base path with the file name
  const filePath = path.join(basePath, fileName);

  // Locate the file input field and upload the file
  const fileInput = await driver.findElement(By.css(fileInputSelector));
  await fileInput.sendKeys(filePath);

  console.log(`File "${fileName}" successfully uploaded from mode: ${mode}`);
}

async function renameOrganizationButton1(driver) {
    
  await driver.wait(until.elementLocated(By.xpath("//flex-row-start-center[contains(.,'Rename Organization')]")), 30000).click();    
}


async function renameOrganizationButton2(driver) {

  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Rename Organization')]")), 30000).click();

  
}

/**
 * Waits for the title of the page to match the expected title within a timeout.
 * @param {WebDriver} driver - The Selenium WebDriver instance.
 * @param {string} expectedTitle - The expected title of the page.
 * @param {number} timeoutInSeconds - Maximum time to wait in seconds (default is 600 seconds).
 * @throws {Error} If the title does not match within the timeout.
 */
async function waitForTitle(driver, expectedTitle, timeoutInSeconds = 600) {
  try {
    await driver.wait(
      until.titleIs(expectedTitle), // Condition: title matches the expectedTitle
      timeoutInSeconds * 1000, // Convert seconds to milliseconds
      `Title did not match '${expectedTitle}' within ${timeoutInSeconds} seconds`
    );
    console.log(`The title '${expectedTitle}' is now displayed.`);
  } catch (error) {
    console.error(`Failed to match the title '${expectedTitle}': ${error.message}`);
    throw error;
  }
}

async function resetAssignedDevicesForEditorViewer(driver, role) {
  console.log("Role: " + role);

  // Check if the user 'rsylvester@phoenixcontact-sb.io' is open in the member list
  const richardUserOpen = await countElementsByXPath(driver, "(//div[@class='member-list-content__value'][contains(.,'rsylvester@phoenixcontact-sb.io')])");
  console.log(richardUserOpen);

  if (richardUserOpen > 0) {
    // Click on the 'rsylvester@phoenixcontact-sb.io' user if present
    await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'rsylvester@phoenixcontact-sb.io')]")), 30000).click();
  }

  // Navigate based on the provided role
  if (role === "editor") {
    await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'Fernando Editor')]")), 30000).click();
  } else if (role === "viewer") {
    await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'Tester Viewer')]")), 30000).click();
  }

  // Open the device assignment section
  await devicesByAssigment(driver);
  await driver.sleep(1000);

  // Check for assigned devices
  const devicesAssigned1 = await countElementsByXPath(driver, "//div[@class='pc-table__item__column'][contains(.,'PH 1 Machine Park 1')]");
  const devicesAssigned2 = await countElementsByXPath(driver, "//div[@class='pc-table__item__column'][contains(.,'PH 1 Machine Park 2')]");
  const devicesAssigned3 = await countElementsByXPath(driver, "//div[@class='pc-table__item__column'][contains(.,'empro 3')]");

  // If any devices are assigned, remove the assignments
  if (devicesAssigned1 > 0 || devicesAssigned2 > 0 || devicesAssigned3 > 0) {
    await assignDevicesButton(driver);

    // Click the selection input twice to deselect all assigned devices
    const selectionInput = By.id("rbac-assignment-selection-tall-input");
    await driver.wait(until.elementLocated(selectionInput), 3000).click();
    await driver.sleep(3000);
    await driver.wait(until.elementLocated(selectionInput), 3000).click();

    // Save the changes and wait for the process to finish
    await saveAssigmentButton(driver);
    await waitingLoadingRingProficloudToDissapear(driver);
  }

  // Re-select the user based on the role after resetting assignments
  if (role === "editor") {
    await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'Fernando Editor')]")), 30000).click();
  } else if (role === "viewer") {
    await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'Tester Viewer')]")), 30000).click();
  }
}


async function assignDevicesForEditorViewer(driver, role) {
  console.log("Role: " + role);

  // Check if the user 'rsylvester@phoenixcontact-sb.io' is open in the member list
  const richardUserOpen = await countElementsByXPath(driver, "(//div[@class='member-list-content__value'][contains(.,'rsylvester@phoenixcontact-sb.io')])");
  console.log(richardUserOpen);

    // Navigate based on the provided role
    if (role === "editor") {
      await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'Fernando Editor')]")), 30000).click();
    } else if (role === "viewer") {
      await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'Tester Viewer')]")), 30000).click();
    }
  
    // Open the device assignment section
    await devicesByAssigment(driver);
    await assignDevicesButton(driver);
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.xpath("//label[contains(.,'PH 1 Machine Park 1')]")), 30000).click();
    await driver.wait(until.elementLocated(By.xpath("//label[contains(.,'PH 1 Machine Park 2')]")), 30000).click();
    await driver.wait(until.elementLocated(By.xpath("//label[contains(.,'empro 3')]")), 30000).click();
    await saveAssigmentButton(driver);
    await waitingLoadingRingProficloudToDissapear(driver);

    //Click on devices by editor

    //await driver.wait(until.elementLocated(By.xpath("//div[2]/span[2]/span")), 30000).click();
    await devicesByAssigment(driver);

    await waitForXPathPresentTimeout(driver,"//div[normalize-space()='PH 1 Machine Park 1']",5000);
    await waitForXPathPresentTimeout(driver,"//div[normalize-space()='PH 1 Machine Park 2']",5000);
    await waitForXPathPresentTimeout(driver,"//div[normalize-space()='empro 3']",5000);

    // Navigate based on the provided role
    if (role === "editor") {
      await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'Fernando Editor')]")), 30000).click();
    } else if (role === "viewer") {
      await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'Tester Viewer')]")), 30000).click();
    }




}

async function saveAssigmentButton(driver) {

  await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Save assignment')]")), 30000).click();
  await waitForXPathPresentTimeout(driver,"//pc-list-item/div/div",5000);
  
}


// Function to log in to ProtonMail
async function loginToProtonMailRecurringReports(driver,vars) {
  try {
    // Navigate to the login URL
    await driver.get("https://mail.proton.me/");
    await driver.sleep(1000);  // Remove this because of Zacualpan

    // Verify if the user is authenticated or needs to log in
    const xpath = "//button[contains(.,'New message')]";

    // Use executeScript to quickly search for the element
    const isLoggedIn = await driver.executeScript((xpath) => {
      const result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      return result.snapshotLength; // Return the number of elements found
    }, xpath);

    console.log('Are we already inside of ProtonMail?:', isLoggedIn);

    if (isLoggedIn > 0) {
      console.log("User already authenticated. Proceeding directly to 'Proton Mail Plus'.");

      const elementToClick = await driver.wait(
        until.elementLocated(By.xpath("//div[@class='text-ellipsis'][contains(.,'Proton Mail Plus')]")),
        5000
      );

      await driver.wait(until.elementIsVisible(elementToClick), 2000);
      await elementToClick.click();
      console.log("Click on 'Proton Mail Plus' successful.");
    } else {
      console.log("User not authenticated. Proceeding with login.");

      // User variables
      vars["mailUsername"] = "recurringReports@proton.me";
      vars["mailPassword"] = "Proficloud2022!";

      // Wait for the username field to be available
      const usernameField = await driver.wait(until.elementLocated(By.id("username")), 10000);
      await usernameField.sendKeys(vars["mailUsername"]);

      // Wait for the password field to be available and send data
      const passwordField = await driver.wait(until.elementLocated(By.id("password")), 10000);
      await passwordField.sendKeys(vars["mailPassword"]);

      // Click the login button
      const submitButton = await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 10000);
      await submitButton.click();
      console.log("Credentials entered. Waiting for 'Proton Mail Plus'...");

      // Wait for 'Proton Mail Plus' to be available
      try {
        console.log("Waiting for 'Proton Mail Plus' to be available...");

        const maxWaitTime = 1000; // 5 seconds
        const pollInterval = 1000; // Check every 1 second
        let elapsedTime = 0;
        let elementToClick = null;

        while (elapsedTime < maxWaitTime) {
          const xpath = "//div[@class='text-ellipsis'][contains(.,'Proton Mail Plus')]";

          const elements = await driver.executeScript((xpath) => {
            const result = document.evaluate(
              xpath,
              document,
              null,
              XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
              null
            );
            return result.snapshotLength; // Return the number of elements found
          }, xpath);

          if (elements > 0) {
            elementToClick = elements[0];
            break; // Exit loop if element is found
          }
          await driver.sleep(pollInterval); // Wait before checking again
          elapsedTime += pollInterval;
        }

        if (elementToClick) {
          console.log("'Proton Mail Plus' found. Proceeding to click.");
          await driver.wait(until.elementIsVisible(elementToClick), 1000);
          await elementToClick.click();
          console.log("Click on 'Proton Mail Plus' successful.");
        } else {
          console.log("'Proton Mail Plus' did not appear within the allowed time. Continuing without clicking.");
        }

     

      } catch (error) {
        console.error("An error occurred while checking or clicking 'Proton Mail Plus':", error);
      }
    }
  } catch (err) {
    console.error("An error occurred:", err);
  }
  console.log("Waiting for Inbox to appear")
  await driver.wait(until.elementLocated(By.xpath("//span[@class='text-ellipsis'][contains(.,'Inbox')]")), 60000);
  console.log("Inbox to appeared we are indise of Proton Mail")
  

}


module.exports = {
  acceptCookies,
  accountSettingsMainMenu,
  accountSettingsTab,
  activeOrganization,
  adminCredentials,
  agreeTerms,
  arrowLeftSideMenu,
  arrowSortByButton,
  assertElementNotPresent,
  assertText,
  assertXpathNotPresent,
  assignDevicesForEditorViewer,
  assignDevicesButton,
  billingInformationTab,
  changeFrameAndClickonProficloudEmail,
  changeInformationButton,
  changeOrgaUserNameCredentials,
  checkFailedLoginEmail,
  cleanDashboard,
  clearAndWrite,
  clickFirstMail,
  clickSecondMail,
  confirmButton,
  confirmLinkUrlToggleIsOff,
  countElementsByXPath,
  createChart,
  createOrganizationButton1,
  createOrganizationButton2,
  createTestRun,
  dashboard,
  dataDisplayedCheck,
  deleteAllEmails,
  deleteManualReports,
  deleteRecurringReports,
  deleteUnregisteredUserInCaseOfExistence,
  devicesByAssigment,
  deviceManagementMenu,
  downloadButton,
  editButton,
  editDeviceButton,
  editBillingAccountButton,
  eliminateExtraOrganizationsEditor,
  eliminateExtraOrganizationsAdmin,
  emailNameButton,
  emailVerification,
  emmaDeleteButton,
  emmaMenu,
  enterRegistrationData,
  firstNameButton,
  forceFailStatus,
  getCurrentDate,
  getEmailofUndesiredUserAndHamburgerClick,
  getTextByLocator,
  handleBlobReportDownload,
  handleBlobReportDownloadBs,
  invitedNameButton,
  inviteMember,
  inviteMemberButton,
  inviteMemberButton2,
  isTheOrganizationNameEmpty,
  lastNameButton,
  leaveOrganizationButton1,
  leaveOrganizationButton2,
  loginAdmin,
  loginAsUnregisteredUserAndDeleteAccount,
  loginChangeOrgaUserName,
  loginEditor,
  loginFerchoAlejandro86,
  loginLandingPageButton,
  loginRegisteredUser,
  loginToProtonMail,
  loginToProtonMailRecurringReports,
  loginUnregisteredUser,
  loginViewer,
  logOutFromProtonMail,
  logout,
  modalClose,
  previewButton,
  reloadPage,
  renameOrganizationButton1,
  renameOrganizationButton2,
  removeMemberButton,
  removeMemberButton2,
  removeOldMemberInvitationsRoothOrga,
  removeOldMemberInvitationsRoothOrgaDev,
  removeRegisteredUserNew,
  reports,
  reportActionsButton,
  resetAssignedDevicesForEditorViewer,
  resetTOriginalNameOrganization,
  resetBillingAccountInformation,
  resetToOriginalUserNameInRoothOrganization,
  roleNameButton,
  roleSelectionDropDownMenu,
  roleSelectionField,
  roothOrganizationTest,
  saveAssigmentButton,
  saveChangesButton,
  saveProfileDataButton,
  scrollToElementByXPath,
  sendMessageLogToBrowserStack,
  sendResultToTestRail,
  serviceStoreMenu,
  settings,
  sortByEmails,
  sortByFirstName,
  sortByLastName,
  sortByRole,
  sortByInvitedStatus,
  subscriptionsTab,
  switchToExtraOrganization,
  switchToOriginalOrganization,
  switchToPxcOrganization,
  testEmpro3Name,
  uploadFile,
  usersTab,
  unregisteredUserCredentials,
  usersLeftMenu,
  userManagementMenu,
  userMenu,
  viewerRoleReset,
  waitForTitle,
  waitForXPathPresentTimeout,
  waitForXPathPresentTimeoutNoStop,
  waitUntilXpathNotPresent,
  waitForUsersToLoad,
  waitingLoadingRingProficloudToDissapear,
  windowConfiguration
  
};
