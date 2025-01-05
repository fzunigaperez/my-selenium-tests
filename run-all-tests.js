const { sendResultToTestRail, createTestRun } = require('./utils/sharedFunctions'); // Import necessary functions
//─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──
//
//                                                                                     USER MANAGEMENT SERVICE
//
//─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──
// Sing Up
const C13 = require('./testCases/C13');
const C614 = require('./testCases/C614');
// Login
const C15 = require('./testCases/C15');
const C655 = require('./testCases/C655');
const C656 = require('./testCases/C656');
const C16 = require('./testCases/C16');
const C18 = require('./testCases/C18');
const C36 = require('./testCases/C36');
const C580 = require('./testCases/C580');
// Log out
const C90 = require('./testCases/C90');
// Profile Settings
const C19 = require('./testCases/C19');
const C84 = require('./testCases/C84');
// Billing account
const C537 = require('./testCases/C537');
const C706 = require('./testCases/C706');
// User Management
const C608 = require('./testCases/C608');
const C613 = require('./testCases/C613');
const C681 = require('./testCases/C681');
const C609 = require('./testCases/C609');
const C624 = require('./testCases/C624');
const C874 = require('./testCases/C874');
const C625 = require('./testCases/C625');
const C714 = require('./testCases/C714');




const C178 = require('./testCases/C178');




// TestRail Project IDs
const projectIds = {
  "Charge Repay Service": 8,
  "User Management Service": 9,
  "Device Management Service": 3,
  "Emma Service": 5,
  
};

// Test cases grouped by project
const projectsTests = {



  
  "Emma Service": [
    {
      name: 'C178_C179_C180_C646_C181_C184_Combined Dashboard Tests',
      func: C178, // Función principal para todos los casos combinados
    },
  ],
  "Charge Repay Service": [
    // Casos de prueba para Charge Repay...
  ],

    
  "User Management Service": [
    //LogOut
 { name: 'C90_Log out successfully', func: C90 },
 ],
};

// Function to extract Test IDs from sessionName
function extractTestCaseIds(sessionName) {
  const matches = sessionName.match(/C(\d+)/g); // Encuentra todas las ocurrencias de "C" seguido de números
  return matches ? matches.map(id => parseInt(id.slice(1), 10)) : []; // Devuelve los IDs como números
}

// Generate tests with extracted IDs
for (const project in projectsTests) {
  projectsTests[project] = projectsTests[project].map(({ name, func }) => ({
    name,
    func,
    testCaseIds: extractTestCaseIds(name),
  }));
}

const errors = []; // Array para almacenar errores

// Function to execute a test
async function runTest(testFunction, testName, testCaseIds, testRunId) {
  try {
    console.log(`Running test: ${testName}`);
    await testFunction(); // Ejecuta la función de prueba principal
    console.log(`${testName} completed successfully.`);
    // Envía resultados para todos los IDs asociados como exitosos
    for (const testCaseId of testCaseIds) {
      await sendResultToTestRail(testCaseId, 1, 'Test passed successfully.', testRunId);
    }
  } catch (error) {
    console.error(`${testName} failed:`, error.message);
    errors.push({ testName, error: error.message }); // Agrega el error al array
    // Envía resultados para todos los IDs asociados como fallidos
    for (const testCaseId of testCaseIds) {
      await sendResultToTestRail(testCaseId, 5, `Test failed: ${error.message}`, testRunId);
    }
  }
}

async function runProjectTests(projectName) {
  try {
    const projectId = projectIds[projectName];
    const tests = projectsTests[projectName];
    
    if (!tests || tests.length === 0) {
      console.log(`No tests available for project: ${projectName}. Skipping.`);
      return;
    }

    const testCaseIds = tests.flatMap(t => t.testCaseIds);
    if (!testCaseIds || testCaseIds.length === 0) {
      console.error(`No valid test case IDs for project ${projectName}. Skipping Test Run creation.`);
      return;
    }

    console.log(`Creating Test Run in project ${projectId} (${projectName}) with cases:`, testCaseIds);

    const today = new Date();
    const testRunName = `Automated Test Run - ${projectName} - ${today.toISOString().split('T')[0]}`;

    try {
      const testRun = await createTestRun(projectId, testRunName, testCaseIds);
      console.log(`Test Run created successfully:`, testRun);
      const testRunId = testRun.id;

      for (const test of tests) {
        await runTest(test.func, test.name, test.testCaseIds, testRunId);
      }

      console.log(`All tests for project "${projectName}" have been executed.`);
    } catch (error) {
      console.error(`Error creating test run for project "${projectName}":`, error.response?.data || error.message);
      if (error.response?.data?.error === 'Field :case_ids contains unrecognized case IDs.') {
        console.error(`Check the case IDs in TestRail and ensure they exist in the suite.`);
      }
    }
  } catch (error) {
    console.error(`Error while executing tests for project "${projectName}":`, error.message);
  }
}


// Function to execute tests for all projects
async function runAllProjectsTests() {
  for (const projectName in projectIds) {
    await runProjectTests(projectName);
  }
}

// Execute tests for all projects
runAllProjectsTests();
