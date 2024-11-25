const { sendResultToTestRail } = require('./utils/sharedFunctions'); // Importa la función de envío a TestRail
const C90 = require('./testCases/C90');
const C15 = require('./testCases/C15');

// Función para extraer el testCaseId de sessionName
function extractTestCaseId(sessionName) {
  const match = sessionName.match(/^C(\d+)_/); // Busca el número después de 'C' y antes de '_'
  return match ? parseInt(match[1], 10) : null;
}

// Base para definir las pruebas con sessionNames completos
const sessionNames = [
  { name: 'C90_Log out successfully', func: C90 },
  { name: 'C15_Login with right credentials as ADMIN', func: C15 },
];

// Construcción del array tests con el formato original
const tests = sessionNames.map(({ name, func }) => ({
  name: name.split('_')[0], // Extraemos 'C90' o 'C15' para el campo name
  func,
  testCaseId: extractTestCaseId(name), // Derivamos testCaseId usando la función
}));

// Función para ejecutar una prueba
async function runTest(testFunction, testName, testCaseId) {
  let passed = true;
  try {
    console.log(`Running test: ${testName}`);
    await testFunction(); // Ejecuta la función del test
    console.log(`${testName} completed successfully.`);
  } catch (error) {
    passed = false;
    console.error(`${testName} failed:`, error.message);
  }

  // Determinar el estado para TestRail
  const statusId = passed ? 1 : 5;
  const comment = passed
    ? 'Test passed successfully.'
    : `Test failed: ${testName} encountered an error.`;
  await sendResultToTestRail(testCaseId, statusId, comment);

  if (!passed) throw new Error(`Test ${testName} failed.`);
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

  // Si hubo errores, mostramos un mensaje y salimos con código de error
  if (errors > 0) {
    console.log(`${errors} test(s) failed.`);
    process.exit(1); // Código de salida indicando fallo
  } else {
    console.log('All tests passed successfully.');
  }
}

// Ejecutar todas las pruebas
runAllTests();
