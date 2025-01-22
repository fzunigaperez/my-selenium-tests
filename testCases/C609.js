const { Builder, By } = require('selenium-webdriver'); // Importación completa y precisa
const path = require('path');
const assert = require('assert'); // Importación de funciones de aserción
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const testBase = require('./testBase'); // Common
const {
  windowConfiguration,
  loginAdmin,
  resetToOriginalUserNameInRoothOrganization,
  switchToPxcOrganization,
  userManagementMenu,
  arrowSortByButton,
  lastNameButton,
  sortByLastName,
  sortByFirstName,
  firstNameButton,
  sortByEmails,
  emailNameButton,
  roleNameButton,
  sortByRole,
  invitedNameButton,
  sortByInvitedStatus,
  logout,
  
} = require('../utils/sharedFunctions'); // Funciones reutilizables

async function C609() {
  try {
    await testBase('C609_Sorting users by first name, last name, email, invited, role.', async (driver) => {
      let vars = {};


      await windowConfiguration(driver,"UMS");
      await loginAdmin(driver, vars);
      await resetToOriginalUserNameInRoothOrganization(driver, vars);
      await switchToPxcOrganization(driver);
      await userManagementMenu(driver);
      await arrowSortByButton(driver);
      await lastNameButton(driver);
      await driver.sleep(1000);
      await sortByLastName(driver);
      await arrowSortByButton(driver);
      await firstNameButton(driver);
      await driver.sleep(1000);
      await sortByFirstName(driver);
      await arrowSortByButton(driver);
      await emailNameButton(driver);
      await driver.sleep(1000);
      await sortByEmails(driver);
      await arrowSortByButton(driver);
      await roleNameButton(driver);
      await driver.sleep(1000);
      await sortByRole(driver);
      await arrowSortByButton(driver);
      await invitedNameButton(driver);
      await sortByInvitedStatus(driver);
      await logout(driver	);




      


    });
  } catch (error) {
    throw new Error(`C609 failed: ${error.message}`);
  }
}

// Permite ejecutar este archivo directamente
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Ejecutando el test C609...');
      await C609(); // Cambia aquí el nombre del test si tienes varios
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
      console.error(error.stack);
    }
  })();
}

module.exports = C609;
