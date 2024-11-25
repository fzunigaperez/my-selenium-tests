//const { sendResultToTestRail } = require('./utils/sharedFunctions'); // Importa la función de envío a TestRail
const C90 = require('./testCases/C90');
const C15 = require('./testCases/C15');
// Agrega aquí más tests según sea necesario.

async function runTest(testFunction, testName, testCaseId) {
  try {
    console.log(`Running test: ${testName}`);
    await testFunction();  // Ejecuta la función del test
    console.log(`${testName} completed successfully.`);
    // Enviar resultado a TestRail (pasado)
    await sendResultToTestRail(testCaseId, 1, 'Test passed successfully.');
  } catch (error) {
    console.error(`${testName} failed:`, error.message);
    // Enviar resultado a TestRail (fallido)
    await sendResultToTestRail(testCaseId, 5, `Test failed: ${error.message}`);
  }
}

async function runAllTests() {
  const tests = [
    { name: 'C90', func: C90, testCaseId: 90 }, // Reemplaza con el ID correcto de TestRail
    { name: 'C15', func: C15, testCaseId: 15 }, // Reemplaza con el ID correcto de TestRail
    // Agrega aquí más tests según sea necesario, asegurándote de incluir los testCaseId
  ];

  for (const test of tests) {
    await runTest(test.func, test.name, test.testCaseId);
  }

  console.log('All tests have been executed.');
}

runAllTests();
