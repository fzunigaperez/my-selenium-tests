const { sendResultToTestRail, createTestRun } = require('./utils/sharedFunctions'); // Importa createTestRun

const C15 = require('./testCases/C15');
const C655 = require('./testCases/C655');
const C656 = require('./testCases/C656');
const C16 = require('./testCases/C16');
const C18 = require('./testCases/C18'); 
const C36 = require('./testCases/C36'); 
const C580 = require('./testCases/C580');

const C90 = require('./testCases/C90');


// Función para extraer el testCaseId de sessionName
function extractTestCaseId(sessionName) {
  const match = sessionName.match(/^C(\d+)_/);
  return match ? parseInt(match[1], 10) : null;
}

// Construcción del array tests con el formato original
const sessionNames = [
  { name: 'C90_Log out successfully', func: C90 },
  { name: 'C15_Login with right credentials as ADMIN', func: C15 },
  { name: 'C655_Login with right credentials as EDITOR', func: C655 },
  { name: 'C656_Login with right credentials as VIEWER', func: C656 },
  { name: 'C16_Login with wrong credentials', func: C16 },
  { name: 'C18_Login with valid email but wrong password', func: C18 },
  { name: 'C36_Login with wrong credentials (10 wrong attempts)', func: C36 },
  { name: 'C580_Password forgotten', func: C580 }
  
];

const tests = sessionNames.map(({ name, func }) => ({
  name: name.split('_')[0],
  func,
  testCaseId: extractTestCaseId(name),
}));

// Función para ejecutar una prueba
async function runTest(testFunction, testName, testCaseId, testRunId) {
  try {
    console.log(`Running test: ${testName}`);
    await testFunction(); // Ejecuta la función del test
    console.log(`${testName} completed successfully.`);
    // Enviar resultado a TestRail (pasado)
    await sendResultToTestRail(testCaseId, 1, 'Test passed successfully.', testRunId);
  } catch (error) {
    console.error(`${testName} failed:`, error.message);
    // Enviar resultado a TestRail (fallido)
    await sendResultToTestRail(testCaseId, 5, `Test failed: ${error.message}`, testRunId);
  }
}

// Función para ejecutar todas las pruebas
async function runAllTests() {
  try {
    const projectId = 9; // ID del proyecto "User Management"
    const today = new Date();
    const testRunName = `Automated Test Run - ${today.toISOString().split('T')[0]}`; // Nombre basado en la fecha

    // Crear un nuevo Test Run en TestRail
    console.log(`Creating Test Run in project ${projectId}...`);
    const testRun = await createTestRun(projectId, testRunName, tests.map(t => t.testCaseId));
    const testRunId = testRun.id; // Obtener el ID del nuevo Test Run
    console.log(`Test Run created successfully with ID: ${testRunId}`);

    // Ejecutar todas las pruebas
    for (const test of tests) {
      await runTest(test.func, test.name, test.testCaseId, testRunId);
    }

    console.log('All tests have been executed.');
  } catch (error) {
    console.error('Error while executing tests:', error.message);
  }
}

// Ejecutar todas las pruebas
runAllTests();
