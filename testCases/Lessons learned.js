

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

  //❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤

  // Cambiar el contexto al iframe  necesario para click on mail 
await driver.switchTo().frame(iframe);