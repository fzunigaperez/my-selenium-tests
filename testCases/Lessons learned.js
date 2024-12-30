//  Best Practice wait and click

await driver.wait(until.elementLocated(By.xpath("registrationlink")), 30000).click();

//❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤

//XPATH SOLUTION for being fast using JAvA SCRIPT 

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

//Asi se llama a la funcion, la constante puede tomar cualquier nombre y despues se puede usar en cualquier parte del codigo

const numElements = await countElementsByXPath(driver, "//div[@class='example']");
console.log('Number of elements found:', numElements);
 

  // Verificar si el error es de usuario inválido
  if (invalidUser > 0) {
    
    console.log("", invalidUser);

    return;
  }
  else{

    console.log("");
  }

 


//❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤


// When it is necessary to wait when a new page loadssw

await driver.sleep(1000);
await driver.wait(until.elementLocated(By.id("username")), 30000);

//❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤
//xpathCount Function 

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
    return; 
  }

  // Si el usuario existe, se procede con la eliminación de la cuenta
  console.log("The user exists, therefore the account has to be deleted.");





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
  }

  //❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤

  // Cambiar el contexto al iframe  necesario para click on mail 
  await driver.sleep(3000);
  const iframe = await driver.wait(until.elementLocated(By.css('iframe')), 10000);
await driver.switchTo().frame(iframe);

//❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤
// Assert element not present

const buttonRegisterDisabled = await driver.findElements(By.xpath("//*[@disabled=\'true\'][contains(.,\'Register\')]"));
assert(!buttonRegisterDisabled.length);

//❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤



  //Clear a text

  await driver.findElement(By.xpath("//input[contains(@placeholder,\'Email\')]")).clear();
//❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤

//Wait for Xpath to appear

async function waitForElementByXPath(driver, xpath, timeout) {
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