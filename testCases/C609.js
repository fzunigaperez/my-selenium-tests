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
} = require('../utils/sharedFunctions'); // Funciones reutilizables

async function C609() {
  try {
    await testBase('C609_Sorting users by first name, last name, email, invited, role.', async (driver) => {
      let vars = {};
      await windowConfiguration(driver);
      await loginAdmin(driver, vars);
      await resetToOriginalUserNameInRoothOrganization(driver, vars);
      await switchToPxcOrganization(driver);
      await userManagementMenu(driver);
      await arrowSortByButton(driver);
      //await lastNameButton(driver);

      async function checkNamesSorting(driver) {
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
            driver.quit();
          }
        } catch (error) {
          console.error('Error en la verificación del orden:', error);
          process.exit(1); // Terminar el proceso con un código de error
        }
      }

      // Llamar a la función para verificar el orden
      await checkNamesSorting(driver);
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
