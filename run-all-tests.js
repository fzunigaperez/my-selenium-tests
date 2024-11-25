const { sendResultToTestRail } = require('./utils/sharedFunctions'); // Importa la función de envío a TestRail
const C90 = require('./testCases/C90');
const C15 = require('./testCases/C15');
// Agrega aquí más tests según sea necesario.

// Función para extraer el testCaseId de sessionName
function extractTestCaseId(sessionName) {
  const match = sessionName.match(/^C(\d+)_/); // Busca el número después de 'C' y antes de '_'
  return match ? parseInt(match[1], 10) : null;
}

// Base para definir las pruebas con sessionNames completos
const sessionNames = [
  { name: 'C90_Log out successfully', func: C90 },
  { name: 'C15_Log out successfully', func: C15 },
  // Agrega aquí más tests con sus nombres y funciones correspondientes
];

// Construcción del array tests con el formato original
const tests = sessionNames.map(({ name, func }) => ({
  name: name.split('_')[0], // Extraemos 'C90' o 'C15' para el campo name
  func,
  testCaseId: extractTestCaseId(name), // Derivamos testCaseId usando la función
}));

// Función para ejecutar una prueba
async function runTest(testFunction, testName, testCaseId) {
  try {
    console.log(`Running test: ${testName}`);
    await testFunction(); // Ejecuta la función del test
    console.log(`${testName} completed successfully.`);
    // Enviar resultado a TestRail (pasado)
    await sendResultToTestRail(testCaseId, 1, 'Test passed successfully.');
  } catch (error) {
    console.error(`${testName} failed:`, error.message);
    // Enviar resultado a TestRail (fallido)
    await sendResultToTestRail(testCaseId, 5, `Test failed: ${error.message}`);
  }
}

// Función para ejecutar todas las pruebas
async function runAllTests() {
  let errors = 0; // Contador de errores para rastrear fallos

  for (const test of tests) {
    try {
      await runTest(test.func, test.name, test.testCaseId);
    } catch (error) {
      console.error(`Error in test ${test.name}:`, error.message);
      errors++; // Incrementa el contador de errores
    }
  }

  console.log('All tests have been executed.');

  // Si hubo errores, salimos con un código de error
  if (errors > 0) {
    console.log(`${errors} test(s) failed.`);
    process.exit(1); // Código de salida indicando fallo
  } else {
    console.log('All tests passed successfully.');
  }
}

// Ejecutar todas las pruebas
runAllTests();
