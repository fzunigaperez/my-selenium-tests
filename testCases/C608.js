const { Builder, By, until } = require('selenium-webdriver'); // Importación completa
const path = require('path');
const assert = require('assert');
const testBase = require('./testBase'); // Lógica común para la ejecución de pruebas
const {
  windowConfiguration,
  deleteUnregisteredUserInCaseOfExistence,
  loginFerchoAlejandro86,
  userManagementMenu,
  arrowButton,
  lastNameButton,
  countElementsByXPath,
  unregisteredUserCredentials,
  inviteMemberButton,
  inviteMemberButton2,
  roleSelectionDropDownMenu,
  waitingLoadingRingProficloudToDissapear,
  assertText,
  modalClose,
  removeMemberButton,
  getTextByLocator,
  removeMemberButton2,
  logout,
  agreeTerms,
  loginToProtonMail,
  clickFirstMail,
  loginAsUnregisteredUserAndDeleteAccount,
  deleteAllEmails,
  logOutFromProtonMail,
  

} = require('../utils/sharedFunctions'); // Importación de funciones reutilizables

async function C608() {
  try {
    await testBase(
      'C608_Invite a user to an organization that is not registered in proficloud and is not part of the same company ',
      async (driver) => {
        let vars = {};

        //await windowConfiguration(driver);
        //await deleteUnregisteredUserInCaseOfExistence(driver,vars);
        
        
        await windowConfiguration(driver);
        await deleteUnregisteredUserInCaseOfExistence(driver, vars);
        await loginFerchoAlejandro86(driver,vars);
        await userManagementMenu(driver);
        await arrowButton(driver);
        await lastNameButton(driver);
        
        await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'Fernando Admin')]")), 30000);
        await driver.sleep(3000);

        let extraMember = await countElementsByXPath(
          driver,
          "/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[1]/app-user-management[1]/div[1]/app-members[1]/flex-col[1]/flex-col[1]/div[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/div[4]/pc-list-item[1]/div[1]/div[1]/div[4]/app-icon[1]/*[name()='svg'][1]"
        );
        console.log('Extra member in the organization found?:', extraMember);
        
        let retries = 0;
        let maxRetries = 50;
        
        while (extraMember > 0 && retries < maxRetries) {
          console.log(`We have an extra member, attempting to remove it (Attempt ${retries + 1}/${maxRetries})`);
        
          try {
            const emailOfExtraMember = await getTextByLocator(
              driver,
              "xpath",
              "//div[4]/pc-list-item/div/div/div/div[2]"
            );


            const protectedEmails = [
              "ferchoalejandro86@gmail.com",
              "testingpxc_viewer@proton.me",
              "testingpxc_editor@proton.me"
            ];
            
            if (protectedEmails.includes(emailOfExtraMember)) {
              console.log("❌ Email is protected. Stopping removal process.");
              return; // Detiene la ejecución de la función si el correo coincide
            }
        
            await driver
              .wait(
                until.elementLocated(
                  By.xpath(
                    "/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[1]/app-user-management[1]/div[1]/app-members[1]/flex-col[1]/flex-col[1]/div[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/div[4]/pc-list-item[1]/div[1]/div[1]/div[4]/app-icon[1]/*[name()='svg'][1]"
                  )
                ),
                30000
              )
              .click();
        
            await removeMemberButton(driver);
        
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
            "/html[1]/body[1]/app-root[1]/div[1]/div[1]/div[1]/app-root[1]/app-proficloud-shell[1]/div[1]/div[2]/div[1]/app-user-management[1]/div[1]/app-members[1]/flex-col[1]/flex-col[1]/div[1]/ng-scrollbar[1]/div[1]/div[1]/div[1]/div[1]/div[4]/pc-list-item[1]/div[1]/div[1]/div[4]/app-icon[1]/*[name()='svg'][1]"
          );
          console.log('Extra member in the organization found?:', extraMember);
        
          retries++;
        }
        
        if (extraMember === 0) {
          
          console.log("✅ Extra member successfully removed or it was not necessary to do anything");
        } else {
          console.log(`❌ Extra member removal failed after ${maxRetries} attempts.`);
        }
        

    



   
        


        //REMOVE OLD MEMBER INVITATIONS C608


        await unregisteredUserCredentials(driver,vars);
        await inviteMemberButton(driver);
        await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Email']")), 30000);
        await driver.findElement(By.xpath("//input[@placeholder='Email']")).clear();
        await driver.findElement(By.xpath("//input[@placeholder='Email']")).sendKeys(vars["username"]);
        await roleSelectionDropDownMenu(driver);
        await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Viewer')]")), 30000).click();
        await inviteMemberButton2(driver);
        await driver.sleep(5000);
        await assertText (driver,"css",".pc-status-overlay__message","We have successfully invited the new member to your organization. For privacy reasons, we are not allowed to send an email to the invitee. Please inform him/her personally.");
        await modalClose(driver);
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'invitation pending')]")), 30000).click();
        const invitationLink = await getTextByLocator(driver,"xpath","//div[4]/div[2]/div[2]");
        await logout(driver);
        await driver.get(invitationLink);
        await unregisteredUserCredentials(driver,vars);

        //Invited user Registration

        await driver.wait(until.elementLocated(By.xpath("//span[contains(.,\'Country\')]")), 30000)
        await driver.findElement(By.xpath("//span[contains(.,\'Country\')]")).click();
        await driver.findElement(By.xpath("//span[contains(.,\'Spain\')]")).click();
        await driver.findElement(By.xpath("//input[@placeholder=\'First name\']")).sendKeys(vars["firstName"]);
        await driver.findElement(By.xpath("//input[@placeholder=\'Last name\']")).sendKeys(vars["lastName"]);
        await driver.findElement(By.xpath("//input[@placeholder=\'Password\']")).sendKeys(vars["password"]);
        await driver.findElement(By.xpath("//input[contains(@placeholder,\'Confirm password\')]")).sendKeys(vars["password"]);
        await agreeTerms(driver);
        await driver.wait(until.elementLocated(By.xpath("//span[contains(.,'Register')]")), 30000).click();
        
        await loginToProtonMail(driver,vars);
        await clickFirstMail(driver);
        await driver.sleep(5000);
        const iframe = await driver.wait(until.elementLocated(By.css('iframe')), 10000);
  await driver.switchTo().frame(iframe);
  await driver.sleep(3000);
  await driver.findElement(By.linkText("Verify E-Mail")).click();
  await driver.sleep(5000);
  // Obtener todos los manejadores de ventanas y seleccionar el último
  const windowHandles = await driver.getAllWindowHandles();
  console.log('Manejadores de ventanas:', windowHandles);
  // Cambiar a la ventana más reciente
  const latestWindow = windowHandles[windowHandles.length - 1]; // Seleccionar el último manejador
  await driver.switchTo().window(latestWindow);
  console.log('Cambiado a la ventana más reciente.');


  await windowConfiguration(driver);
        await deleteUnregisteredUserInCaseOfExistence(driver, vars);


      await loginToProtonMail(driver,vars);
      await deleteAllEmails(driver);
      await logOutFromProtonMail(driver);
        


        






        

      }
    );
  } catch (error) {
    throw new Error(`C608 failed: ${error.message}`);
  }
}

module.exports = C608;

if (require.main === module) {
  (async () => {
    try {
      console.log(`'🚀 Ejecutando el test`);
      await C608(); // Change here the test name
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
    }
  })();
}
