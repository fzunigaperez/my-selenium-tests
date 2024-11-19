const C90 = require('./testCases/C90');
const C15 = require('./testCases/C15');
// Agrega aquí más tests según sea necesario.

async function runTest(testFunction, testName) {
  try {
    console.log(`Running test: ${testName}`);
    await testFunction();
    console.log(`${testName} completed successfully.`);
  } catch (error) {
    console.error(`${testName} failed:`, error.message);
  }
}

async function runAllTests() {
  const tests = [
    { name: 'C90', func: C90 },
    { name: 'C15', func: C15 },
    // Agrega aquí más tests según sea necesario.
  ];

  for (const test of tests) {
    await runTest(test.func, test.name);
  }

  console.log('All tests have been executed.');
}

runAllTests();  
