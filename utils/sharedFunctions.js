const { By, until } = require('selenium-webdriver');
const assert = require('assert'); // Importa el módulo assert
const axios = require('axios'); // Necesary to send test results
//const { sendResultToTestRail } = require('../utils/sharedFunctions');


// Función para crear un Test Run en TestRail
async function createTestRun(projectId, testRunName, testCaseIds = []) {
  const url = `https://testingpxc.testrail.io/index.php?/api/v2/add_run/${projectId}`;
  const auth = {
    username: process.env.TESTRAIL_USERNAME, // Configura tus variables de entorno
    password: process.env.TESTRAIL_API_KEY
  };

  const data = {
    name: testRunName,
    include_all: testCaseIds.length === 0, // Incluye todos los casos si la lista está vacía
    case_ids: testCaseIds // Lista de IDs de casos, opcional
  };

  try {
    const response = await axios.post(url, data, { auth });
    console.log('Test run created successfully:', response.data);
    return response.data; // Retorna los detalles del Test Run (como su ID)
  } catch (error) {
    console.error('Error creating test run:', error.message);
    throw error;
  }
}


// Función para enviar resultados a TestRail
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


async function acceptCookies(driver) {
  try {
    const cookiesXPath = "//h2[normalize-space()='This website uses cookies']";
    const acceptButtonXPath = "//button[@id='ga-opt-out-false']";

    // Esperar un máximo de 3 segundos para el banner de cookies
    const cookiesBanner = await driver.wait(until.elementLocated(By.xpath(cookiesXPath)), 3000);

    if (cookiesBanner) {
      console.log("Cookies banner detected.");
      const acceptButton = await driver.wait(until.elementLocated(By.xpath(acceptButtonXPath)), 3000);
      await acceptButton.click();
      console.log("Cookies accepted.");
    } else {
      console.log("Cookies banner not found.");
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


async function rootOrganizationTest(driver, vars) {
  vars["root"] = await driver.findElements(By.xpath("//h4[contains(.,'Rooth Organization')]")).length;
  if (vars["root"] > 0) {
    console.log("We are in the right organization.");
  } else {
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

async function logout(driver) {
  await userMenu(driver);
  await driver
    .findElement(By.xpath("//div[@class='profile-menu_icon-text__text'][contains(.,'Logout')]"))
    .click();
  await driver.sleep(1000);
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
  await rootOrganizationTest(driver, vars);
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
  await rootOrganizationTest(driver, vars);
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
  await rootOrganizationTest(driver, vars);
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
  await rootOrganizationTest(driver, vars);
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
    await loginToProtonMail(driver, vars);
    await driver.wait(until.elementLocated(By.css(".active .text-ellipsis")), 30000);
    await driver.findElement(By.css(".active .text-ellipsis")).click();
    await driver.wait(until.elementLocated(By.css(".item-subject > .inline-block")), 60000);
    await driver.findElement(By.css(".item-subject > .inline-block")).click();
    await driver.sleep(3000);
    const iframe = await driver.wait(until.elementLocated(By.css('iframe')), 10000);
    await driver.switchTo().frame(iframe);
    await driver.findElement(By.linkText("Verify E-Mail")).click();
    await driver.sleep(10000);
    const windowHandles = await driver.getAllWindowHandles();
    console.log('Manejadores de ventanas:', windowHandles);
    await driver.switchTo().window(windowHandles[1]);
    await logout(driver);
    await loginAsUnregisteredUserAndDeleteAccount(driver,vars) 
    


     
    

    return; 
  }

  // Si el usuario existe, se procede con la eliminación de la cuenta
  console.log("The user exists, therefore the account has to be deleted.");
  await driver.sleep(2000);
  await logout(driver);
  await driver.sleep(2000);

  //HERE FUNCTION TO DELETE THE UNREGSTERED USER

  /*await windowConfiguration(driver, vars);
  await loginUnregisteredUser(driver,vars);
  await isTheOrganizationNameEmpty(driver, vars);
  await userMenu(driver);
  await accountSettingsMainMenu(driver);
  //Click on delete button 1
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Delete Account')]")), 30000);
  await driver.findElement(By.xpath("//span[contains(.,'Delete Account')]")).click();
  //Click on delete button 2
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Delete account')]")), 30000);
  await driver.findElement(By.xpath("//span[contains(.,'Delete account')]")).click();
  //Enter Mail 
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,\'Delete account\')]")), 30000)
  await driver.sleep(1000)
  await driver.findElement(By.xpath("//input[contains(@placeholder,\'Email\')]")).sendKeys(vars["username"])
  //Click on delete button 3
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Delete account')]")), 30000);
  await driver.findElement(By.xpath("//span[contains(.,'Delete account')]")).click();
  await waitingLoadingRingProficloudToDissapear(driver);*/
  await loginAsUnregisteredUserAndDeleteAccount(driver,vars);


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
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Delete account')]")), 30000);
  await driver.findElement(By.xpath("//span[contains(.,'Delete account')]")).click();
  
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,\'Delete account\')]")), 30000);
  //Enter Mail 
  await driver.wait(until.elementLocated(By.xpath("//input[contains(@placeholder,\'Email\')]")), 30000);
  await driver.findElement(By.xpath("//input[contains(@placeholder,\'Email\')]")).sendKeys(vars["username"]);
  //Click on delete button 3
  await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Delete account')]")), 30000);
  await driver.findElement(By.xpath("//span[contains(.,'Delete account')]")).click();
  await waitingLoadingRingProficloudToDissapear(driver);
}




  //await isTheOrganizationNameEmpty(driver, vars);
  //await rootOrganizationTest(driver, vars);



async function loginToProtonMail(driver, vars = {}) {
    await driver.get("https://account.proton.me/login");
       
    vars["mailUsername"] = "testingpxc_admin@proton.me";
    vars["mailPassword"] = "Proficloud2022!";


    // Esperar que el campo de nombre de usuario esté disponible
  const usernameField = await driver.wait(until.elementLocated(By.id("username")), 10000);
  await driver.wait(until.elementIsVisible(usernameField), 10000); // Esperar visibilidad
      
  
      await driver.wait(until.elementLocated(By.id("username")), 10000);
      await driver.findElement(By.id("username")).sendKeys(vars["mailUsername"]);
      await driver.findElement(By.id("password")).sendKeys(vars["mailPassword"]);
      await driver.findElement(By.css('button[type="submit"]')).click();

  //const elementToClickXpath = "//div[@class='text-ellipsis'][contains(.,'Proton Mail Plus')]";   
  const elementToClick = await driver.wait(until.elementLocated(By.xpath("//div[@class='text-ellipsis'][contains(.,'Proton Mail Plus')]")), 30000);
  
  // Esperar a que el elemento esté visible y habilitado
  await driver.wait(until.elementIsVisible(elementToClick), 30000);
  await driver.wait(until.elementIsEnabled(elementToClick), 30000);

  // Hacer clic en el elemento
  await elementToClick.click();
  console.log("El elemento 'Proton Mail Plus' fue encontrado y clicado exitosamente.");
  //Esperamos a la pagina principal
  await driver.sleep(1000);
  await driver.wait(until.elementLocated(By.xpath("//button[normalize-space()='New message']")), 30000);
          
  }


  async function logOutFromProtonMail(driver) {
    await driver.findElement(By.css(".my-auto > .m-auto")).click()
    await driver.sleep(1000)
    await driver.findElement(By.xpath("//button[contains(.,\'Sign out\')]")).click()
    await driver.sleep(1000)
    await driver.wait(until.elementLocated(By.css(".sign-layout-title")), 30000)
  }
  
  async function checkFailedLoginEmail(driver) {
    await driver.sleep(10000);  
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
    console.log("Deleting all mails...");
    // Esperar que se localice "Inbox"
    await driver.wait(until.elementLocated(By.xpath("//span[contains(text(),'Inbox')]")), 60000);

    // Comprobar si existe "Less"
    const lessElements = await driver.findElements(By.xpath("//span[normalize-space()='Less']"));
    if (lessElements.length > 0) {
        // Esperar que el elemento "Less" sea visible (si es necesario interactuar con él en el futuro)
        await driver.wait(until.elementIsEnabled(lessElements[0]), 3000);
    } else {
        // Hacer clic en "More" si "Less" no está visible
        const moreButton = await driver.wait(
            until.elementLocated(By.xpath("//span[normalize-space()='More']")),
            30000
        );
        await driver.wait(until.elementIsEnabled(moreButton), 30000);
        await moreButton.click();
    }

    // Hacer clic en "All mail"
    const allMailButton = await driver.wait(
        until.elementLocated(By.xpath("//span[contains(text(),'All mail')]")),
        30000
    );
    await driver.wait(until.elementIsEnabled(allMailButton), 30000);
    await allMailButton.click();

    // Seleccionar todos los correos
    const selectAllButton = await driver.wait(
        until.elementLocated(By.id("idSelectAll")),
        30000
    );
    await driver.wait(until.elementIsEnabled(selectAllButton), 30000);
    await selectAllButton.click();

    // Mover a la papelera
    const moveToTrashButton = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(.,'Move to trash')]")),
        30000
    );
    await driver.wait(until.elementIsEnabled(moveToTrashButton), 30000);
    await moveToTrashButton.click();

    // Navegar a la papelera
    const trashButton = await driver.wait(
        until.elementLocated(By.xpath("//span[@class='text-ellipsis'][contains(.,'Trash')]")),
        30000
    );
    await driver.wait(until.elementIsEnabled(trashButton), 30000);
    await trashButton.click();

    // Seleccionar todo en la papelera
    const selectAllTrashButton = await driver.wait(
        until.elementLocated(By.id("idSelectAll")),
        30000
    );
    await driver.wait(until.elementIsEnabled(selectAllTrashButton), 30000);
    await selectAllTrashButton.click();

    // Eliminar permanentemente
    const deletePermanentlyButton = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(.,'Delete permanently')]")),
        30000
    );
    await driver.wait(until.elementIsEnabled(deletePermanentlyButton), 30000);
    await deletePermanentlyButton.click();

    // Confirmar eliminación
    const confirmDeleteButton = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(text(),'Delete')]")),
        30000
    );

    await driver.wait(until.elementIsVisible(confirmDeleteButton), 30000);
    await confirmDeleteButton.click();

    const noMessagesFound = await driver.wait(
      until.elementLocated(By.xpath("//h3[contains(@data-testid,'empty-view-placeholder--empty-title')]")),
      30000
    );
    await driver.wait(until.elementIsVisible(noMessagesFound), 30000);
   
  }
  
  async function confirmLinkURLsOn(driver, vars) {
    const settingsLinkXPath = "//a[contains(text(), 'All settings')]";
    const toggleButtonXPath = "//button[contains(., 'Toggle settings')]";
  
    // Verificar y hacer clic en el enlace de configuración o botón de alternar
    const settingsLink = await driver.findElements(By.xpath(settingsLinkXPath));
  
    if (settingsLink.length > 0) {
      await driver.findElement(By.xpath(settingsLinkXPath)).click();
    } else {
      await driver.findElement(By.xpath(toggleButtonXPath)).click();
      await driver.findElement(By.xpath(settingsLinkXPath)).click();
    }
  
    // Esperar a que el dashboard esté cargado
    await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(.,'Dashboard')]")),
      30000
    );
  
    // Navegar a la configuración de mensajes
    await driver.findElement(By.xpath("//span[@title='Messages and composing']")).click();
  
    // Esperar el elemento "Confirm link URLs"
    await driver.wait(
      until.elementLocated(By.xpath("//span[contains(.,'Confirm link URLs')]")),
      30000
    );
    await driver.sleep(2000);
  
      // Comprobar el estado del toggle
      vars["toggleOn"] = await driver.findElements(
        By.xpath("//*[@class='toggle-container toggle-container--checked']")
      ).length;
    
      if (await driver.executeScript("return (arguments[0] == 6)", vars["toggleOn"])) {
        console.log("All good, the settings are as DEFAULT for link confirmation");
      } else {
        console.log("It is necessary to change to DEFAULT CONFIGURATION");
        await driver.findElement(By.xpath("//span[normalize-space()='Confirm link URLs']")).click();
      }
  
    // Navegar a la bandeja de entrada
    await driver.findElement(By.xpath("//span[contains(.,'Inbox')]")).click();
  
    // Esperar al botón de "Nuevo mensaje"
    await driver.wait(
      until.elementLocated(By.xpath("//button[normalize-space()='New message']")),
      30000
    );
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
    await driver.sleep(1000);
  }
  



module.exports = {
  createTestRun,
  sendResultToTestRail,
  acceptCookies,
  loginLandingPageButton,
  adminCredentials,
  unregisteredUserCredentials,
  registeredUserCredentials,
  isTheOrganizationNameEmpty,
  rootOrganizationTest,
  switchToOriginalOrganization,
  activeOrganization,
  logout,
  userMenu,
  accountSettingsMainMenu,
  windowConfiguration,
  loginAdmin,
  loginEditor,
  loginViewer,
  loginRegisteredUser,
  loginUnregisteredUser,
  loginToProtonMail,
  logOutFromProtonMail,
  checkFailedLoginEmail,
  deleteAllEmails,
  enterRegistrationData,
  confirmLinkURLsOn,
  deleteUnregisteredUserInCaseOfExistence,
  loginAsUnregisteredUserAndDeleteAccount,
  waitUntilXpathNotPresent,
  waitingLoadingRingProficloudToDissapear,
};