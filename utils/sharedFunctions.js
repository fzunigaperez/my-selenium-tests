const { By, until } = require('selenium-webdriver');
const assert = require('assert'); // Import the assert module
const axios = require('axios'); // Necessary to send test results
// const { sendResultToTestRail } = require('../utils/sharedFunctions');


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


// Function to log in to ProtonMail
async function loginToProtonMail(driver, vars, until = {}) {
  try {
    // Navigate to the login URL
    await driver.get("https://mail.proton.me/");
    await driver.sleep(10000);  // Remove this because of Zacualpan

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
        10000
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

        const maxWaitTime = 5000; // 5 seconds
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
  console.log("Waiting the Inbox button to appear");
  await driver.wait(until.elementLocated(By.css(".active .text-ellipsis")), 60000);
  console.log("Inbox button appeared");

}


// Function to accept cookies
async function acceptCookies(driver) {
  try {
    const cookiesXPath = "//h2[normalize-space()='This website uses cookies']";
    const acceptButtonXPath = "//button[@id='ga-opt-out-false']";

    // Wait up to 3 seconds for the cookies banner to appear
    const timeout = 3000; // 3 seconds in milliseconds
    const interval = 500; // 500 ms check interval
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
    // Wait for the button to be located and visible (max wait time: 5 seconds)
    const loginButton = await driver.wait(
      until.elementLocated(By.id("login-button")),
      5000 // Maximum wait time in milliseconds
    );

    // Check if the button is displayed
    if (await loginButton.isDisplayed()) {
      // Click the button
      await loginButton.click();
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
  let attempts = 0; // Contador de intentos
  const maxAttempts = 10; // Número máximo de intentos
  const waitTime = 2000; // Tiempo de espera entre intentos (2 segundos)

  while (attempts < maxAttempts) {
    console.log(`Intento ${attempts + 1} de ${maxAttempts}`);

    try {
      // Espera hasta que el elemento esté visible en la página
      const element = await driver.wait(until.elementLocated(By.xpath("//h4")), waitTime);
      vars["emptyName"] = await element.getText();
      console.log(`Organización encontrada: ${vars["emptyName"]}`);

      // Si el texto no está vacío, termina la función
      if (vars["emptyName"] && vars["emptyName"] !== "") {
        console.log("Nombre de la organización encontrado.");
        return vars["emptyName"];
      }
    } catch (error) {
      console.log("El elemento no está disponible en este intento. Intentando nuevamente...");
    }

    // Incrementa el contador de intentos y espera antes del siguiente intento
    attempts++;
    if (attempts < maxAttempts) {
      await driver.sleep(waitTime);
    }
  }

  // Si no se encuentra un texto válido después de 10 intentos, devuelve un mensaje
  console.log("No se pudo encontrar el nombre de la organización después de 10 intentos.");
  return null; // Retorna null si no encuentra un valor válido
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

async function windowConfiguration(driver) {
  await driver.get("https://proficloud.io/testrun");
  await driver.manage().window().maximize();
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

async function loginRegisteredUser(driver, vars) {
  await acceptCookies(driver);
  await loginLandingPageButton(driver);
  await registeredUserCredentials(driver, vars);
  await driver.sleep(1000);
  await driver.wait(until.elementLocated(By.id("username")), 50000);
  await driver.findElement(By.id("username")).sendKeys(vars["username"]);
  await driver.findElement(By.id("password")).sendKeys(vars["password"]);
  await driver.findElement(By.id("kc-login")).click();
  await driver.sleep(1000);
  await isTheOrganizationNameEmpty(driver, vars);
  await roothOrganizationTest(driver, vars);
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
    
    await userMenu(driver,vars);  
    await accountSettingsMainMenu(driver);
    await accountSettingsTab(driver);
    await changeInformationButton(driver);
    await driver.sleep(1000);

    await driver.findElement(By.xpath("//input[@placeholder='Email']")).clear();
    await driver.findElement(By.xpath("//input[@placeholder='Email']")).sendKeys("change_orga_name@proton.me");
    await saveProfileDataButton(driver);
    await driver.sleep(1000);
    await confirmButton(driver);
    await modalClose(driver,until);
    // Time to wait in order to get the mail
    await driver.sleep(10000);

    await loginToProtonMail(driver,vars,until);
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
  await userMenu(driver,vars);  
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
  await roothOrganizationTest(driver, vars);
}

  async function deleteUnregisteredUserInCaseOfExistence(driver, vars) {
  await windowConfiguration(driver);  
  await loginUnregisteredUser(driver, vars); 
  await driver.sleep(2000);
  const invalidUser = await driver.findElements(By.xpath("//span[@class='kc-feedback-text'][contains(.,'Invalid username or password.')]"));
  const emailVerificationNeeded = await driver.findElements(By.xpath("//span[contains(.,'You need to verify your email address to activate your account.')]"));

  // Obtener la cantidad de elementos encontrados
  console.log('Cantidad de elementos encontrados para "Invalid username or password":', invalidUser.length);
  console.log('Cantidad de elementos encontrados para "Email verification needed":', emailVerificationNeeded.length);

  // Verificar si el error es de usuario inválido
  if (invalidUser.length > 0) {
    console.log("The user does not exist, no other measures have to be taken.");
    return;
  }

  // Verificar si es necesario verificar el correo electrónico
  if (emailVerificationNeeded.length > 0) {
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

async function emailVerification(driver,vars,until) {

  await loginToProtonMail(driver, vars,until);
  await driver.wait(until.elementLocated(By.css(".active .text-ellipsis")), 60000);
  await driver.findElement(By.css(".active .text-ellipsis")).click();
  await driver.wait(until.elementLocated(By.css(".item-subject > .inline-block")), 60000);
  await driver.findElement(By.css(".item-subject > .inline-block")).click();
  await driver.sleep(3000);
  const iframe = await driver.wait(until.elementLocated(By.css('iframe')), 10000);
  await driver.switchTo().frame(iframe);
  await driver.findElement(By.linkText("Verify E-Mail")).click();
  await driver.sleep(5000);
  // Obtener todos los manejadores de ventanas y seleccionar el último
  const windowHandles = await driver.getAllWindowHandles();
  console.log('Manejadores de ventanas:', windowHandles);
  // Cambiar a la ventana más reciente
  const latestWindow = windowHandles[windowHandles.length - 1]; // Seleccionar el último manejador
  await driver.switchTo().window(latestWindow);
  console.log('Cambiado a la ventana más reciente.');

  //await driver.sleep(2000);
  //const loginDataPagePresent = await driver.findElements(By.xpath("//h1[normalize-space()='Login']"));

  //console.log('Cantidad de elementos encontrados para "loginDataPagePresent":', loginDataPagePresent.length);

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

async function resetBillingAccountInformation(driver,until) {
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
    await billingInformationTab(driver,until);
    await editBillingAccountButton(driver,until);

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
    await waitingLoadingRingProficloudToDissapear(driver,until);

    return;
  } else {
    console.log("No reset necessary");
  }
}
 
async function editBillingAccountButton(driver,until) {
  
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,\'Edit Billing Account\')]")), 50000)
  await driver.findElement(By.xpath("//span[contains(.,\'Edit Billing Account\')]")).click()
  await driver.sleep(1000)
}
  




async function loginAsUnregisteredUserAndDeleteAccount(driver,vars) {
  
  await windowConfiguration(driver, vars);
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
  await driver.sleep(500);
  await driver.wait(until.elementLocated(By.xpath("//div[@data-analytics='modal headline'][contains(.,'Confirmation required')]")), 30000);
  //Enter Mail 
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
  await driver.sleep(500);
  await driver.wait(until.elementLocated(By.xpath("//div[@data-analytics='modal headline'][contains(.,'Confirmation required')]")), 30000);
  //We enter now the correct credentials for deleting the account
  await driver.findElement(By.xpath("//input[contains(@placeholder,\'Email\')]")).clear();
  await driver.findElement(By.xpath("//input[contains(@placeholder,\'Email\')]")).sendKeys(vars["username"]);
  //Click on delete button 3
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Delete account')]")), 30000);
  await driver.findElement(By.xpath("//span[contains(.,'Delete account')]")).click();
  await waitingLoadingRingProficloudToDissapear(driver);
}


async function fProtonMail(driver, vars = {}) {
  try {
      // Navegar a la URL de inicio de sesión
      await driver.get("https://mail.proton.me/");
      await driver.sleep(10000);  //Remove this because of Zacualpan

      // Verificar si el usuario está autenticado o si necesita iniciar sesión
      //const isLoggedIn = await driver.findElements(By.xpath("//button[contains(.,'New message')]"));

      const xpath = "//button[contains(.,'New message')]";

// Usar executeScript para buscar el elemento rápidamente
const isLoggedIn = await driver.executeScript((xpath) => {
const result = document.evaluate(
    xpath, 
    document, 
    null, 
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, 
    null
  );
  return result.snapshotLength; // Retorna la cantidad de elementos encontrados
}, xpath);

console.log('Are we already inside of ProtonMail?:', isLoggedIn);

  

      if (isLoggedIn > 0) {
          console.log("Usuario ya autenticado. Procediendo directamente a 'Proton Mail Plus'.");

          const elementToClick = await driver.wait(
              until.elementLocated(By.xpath("//div[@class='text-ellipsis'][contains(.,'Proton Mail Plus')]")),
              10000
          );

          await driver.wait(until.elementIsVisible(elementToClick), 2000);
          await elementToClick.click();
          console.log("Clic en 'Proton Mail Plus' exitoso.");

      } else {
          console.log("Usuario no autenticado. Procediendo con inicio de sesión.");

          // Variables de usuario
          vars["mailUsername"] = "testingpxc_admin@proton.me";
          vars["mailPassword"] = "Proficloud2022!";

          // Esperar a que el campo de usuario esté disponible
          const usernameField = await driver.wait(until.elementLocated(By.id("username")), 10000);
          await usernameField.sendKeys(vars["mailUsername"]);

          // Esperar a que el campo de contraseña esté disponible y enviar los datos
          const passwordField = await driver.wait(until.elementLocated(By.id("password")), 10000);
          await passwordField.sendKeys(vars["mailPassword"]);

          // Clic en el botón de inicio de sesión
          const submitButton = await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 10000);
          await submitButton.click();
          console.log("Credenciales ingresadas. Esperando a 'Proton Mail Plus'...");

          // Esperar a que 'Proton Mail Plus' esté disponible
          try {
            console.log("Esperando a que 'Proton Mail Plus' esté disponible...");
        
            // Tiempo máximo de espera (en milisegundos)
            const maxWaitTime = 10000; // 30 segundos
            const pollInterval = 1000; // Revisar cada 1 segundo
            let elapsedTime = 0;
            let elementToClick = null;
        
            // Bucle para comprobar repetidamente si el elemento aparece
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
                    return result.snapshotLength; // Retorna la cantidad de elementos encontrados
                  }, xpath);
                  




                if (elements > 0) {
                    elementToClick = elements[0];
                    break; // Salir del bucle si el elemento se encuentra
                }
                await driver.sleep(pollInterval); // Esperar antes de volver a comprobar
                elapsedTime += pollInterval;
            }
        
            if (elementToClick) {
                console.log("'Proton Mail Plus' encontrado. Procediendo a hacer clic.");
                await driver.wait(until.elementIsVisible(elementToClick), 1000);
                await elementToClick.click();
                console.log("Clic en 'Proton Mail Plus' exitoso.");
            } else {
                console.log("'Proton Mail Plus' no apareció dentro del tiempo de espera permitido. Continuando sin clic.");
            }
        } catch (error) {
            console.error("Ocurrió un error al verificar o hacer clic en 'Proton Mail Plus':", error);
        }
        
      }
  } catch (err) {
      console.error("Ocurrió un error:", err);
  }
}

 async function modalClose(driver, until) {
  await driver.wait(until.elementLocated(By.id("modal-close")), 5000).click();
  
 }

 async function settings(driver, until) {
  await driver.wait(until.elementLocated(By.xpath("//div[@class='profile-menu_icon-text__text'][contains(.,'Settings')]")), 5000).click();
  
 }

 async function billingInformationTab(driver,until) {
  await driver.wait(until.elementLocated(By.xpath("//span[@class='mdc-tab__text-label'][contains(.,'Billing Information')]")), 10000).click();
  
 }
  
  
 async function resetToOriginalUserNameInRoothOrganization(driver,vars) {

  await userMenu(driver,vars);  
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

      // Asserting the precense of Success Message
      await driver.sleep(1000);
      await driver.wait(until.elementTextIs(driver.findElement(By.xpath('//pc-overlay/div/div[2]/div/div[2]/div')), "Your profile has been successfully updated."), 5000);
      console.log("El texto esperado está presente!");
      await modalClose(driver, until);

      await driver.wait(until.elementTextIs(driver.findElement(By.xpath("//flex-col/div/div[2]/div[2]")), "Fernando Zuniga"), 5000);
    }
} catch (error) {
    console.error("Error while fetching the user name:", error.message);
}

  
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
    const elementLocator = By.css(".item-subject > .inline-block");
    const firstMail = await driver.wait(until.elementLocated(elementLocator),60000);
    await driver.wait(until.elementIsVisible(firstMail), 60000);
    await firstMail.click();

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
    await driver.wait(until.elementLocated(By.xpath("//span[contains(text(),'Inbox')]")), 30000);
  
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
      return;
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
  
    // Select all emails
    const selectAllButton = await driver.wait(
      until.elementLocated(By.id("idSelectAll")),
      30000
    );
    await driver.sleep(2000);
    await driver.wait(until.elementIsEnabled(selectAllButton), 30000);
    await selectAllButton.click();
  
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
  
   
  
  async function confirmLinkUrlToggleIsOff(driver, vars, until) {

    
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
  
    return elementCount;
  }

  
  async function agreeTerms(driver) {
    await driver.findElement(By.id("mat-mdc-checkbox-1-input")).click();
    await driver.sleep(2000);
  }

  async function waitUntilXpathNotPresent(driver, xpathName) {
    // Espera hasta que el elemento no esté presente
    await driver.wait(async () => {
      const desiredXpath = await driver.findElements(By.xpath(xpathName)); // Busca el elemento usando el xpath proporcionado
      return desiredXpath.length === 0; // Si el número de elementos es 0, entonces no está presente
    }, 15000); // Esperar hasta 15 segundos
    console.log(`El elemento con XPath "${xpathName}" ya no está presente en la página.`);
  }

  async function waitingLoadingRingProficloudToDissapear(driver) {

    await waitUntilXpathNotPresent(driver, "//div[contains(@class,'pc-status-overlay__icon-container')]");  
    await driver.sleep(4000);
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
  return false; // The element was not found within the defined time
}

async function assertElementNotPresent(driver, elementSelector, selectorType = 'css', timeout = 5000) {
  try {
      // Select the type of selector that will be used
      let locator;
      switch (selectorType) {
          case 'id':
              locator = By.id(elementSelector);
              break;
          case 'class':
              locator = By.className(elementSelector);
              break;
          case 'name':
              locator = By.name(elementSelector);
              break;
          case 'xpath':
              locator = By.xpath(elementSelector);
              break;
          case 'css':
          default:
              locator = By.css(elementSelector);
              break;
      }

      // Wait for the element to be located on the page (within the timeout period)
      await driver.wait(until.elementLocated(locator), timeout);
      
      // If the element is found, fail the test and log a failure message
      console.log(`Failure: Element with selector ${elementSelector} was found, but it shouldn't have been.`);
      throw new Error(`Element with selector ${elementSelector} should not be present.`);
  } catch (error) {
      // If the element is not found within the timeout, we expect a TimeoutError
      if (error.name === 'TimeoutError') {
          // Element is not present, which is the expected behavior, log success message
          console.log(`Success: Element with selector ${elementSelector} was not found, as expected.`);
          return;
      }
      // Rethrow any other errors
      throw error;
  }
}


module.exports = {
  createTestRun,
  sendResultToTestRail,
  acceptCookies,
  loginLandingPageButton,
  adminCredentials,
  unregisteredUserCredentials,
  registeredUserCredentials,
  changeOrgaUserNameCredentials,
  isTheOrganizationNameEmpty,
  roothOrganizationTest,
  switchToOriginalOrganization,
  modalClose,
  activeOrganization,
  changeInformationButton,
  saveProfileDataButton,
  logout,
  userMenu,
  accountSettingsMainMenu,
  accountSettingsTab,
  windowConfiguration,
  settings,
  billingInformationTab,
  resetBillingAccountInformation,
  resetToOriginalUserNameInRoothOrganization,
  loginAdmin,
  loginEditor,
  loginViewer,
  editBillingAccountButton,
  loginRegisteredUser,
  loginUnregisteredUser,
  loginChangeOrgaUserName,
  loginToProtonMail,
  logOutFromProtonMail,
  checkFailedLoginEmail,
  deleteAllEmails,
  enterRegistrationData,
  agreeTerms,
  confirmButton,
  emailVerification,
  confirmLinkUrlToggleIsOff,
  deleteUnregisteredUserInCaseOfExistence,
  loginAsUnregisteredUserAndDeleteAccount,
  waitUntilXpathNotPresent,
  waitForXPathPresentTimeout,
  countElementsByXPath,
  waitingLoadingRingProficloudToDissapear,
  assertElementNotPresent,
  
};