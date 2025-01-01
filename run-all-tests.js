const { sendResultToTestRail, createTestRun } = require('./utils/sharedFunctions'); // Importa createTestRun

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
//Log out
const C90 = require('./testCases/C90');
//Profile Settings
const C19 = require('./testCases/C19');
const C84 = require('./testCases/C84');
//Billing account
const C537 = require('./testCases/C537');
const C706 = require('./testCases/C706');
//User Management
const C608 = require('./testCases/C608');
const C613 = require('./testCases/C613');
const C681 = require('./testCases/C681');
const C609 = require('./testCases/C609');
const C624 = require('./testCases/C624');
const C874 = require('./testCases/C874');
const C625 = require('./testCases/C625');
const C714 = require('./testCases/C714');



// Función para extraer los Test IDs de sessionName
function extractTestCaseIds(sessionName) {
  const matches = sessionName.match(/C(\d+)/g); // Encuentra todas las coincidencias de C seguido de dígitos
  return matches ? matches.map(id => parseInt(id.slice(1), 10)) : []; // Retorna los IDs como números
}

// Construcción del array tests con el formato original
const sessionNames = [
  //SignUp
 // { name: 'C13_C575_C697_C22_C895_C1024 Sign up in the proficloud with valid email and password / Sign UP with an already existing E-Mail / Introduce a wrong password before user deletion / Delete user / If the user enter an invalid email, and correcte it later, it is should be possible to REGISTER to Proficloud or create Billing account / Check and uncheck the Terms and Licences Agreement should not alter the registered button', func:C13 },
  //{ name: 'C614_Sign UP if two passwords are not the same should not be possible', func: C614 },
  /*Login
  { name: 'C15_Login with right credentials as ADMIN', func: C15 },
  { name: 'C655_Login with right credentials as EDITOR', func: C655 },
  { name: 'C656_Login with right credentials as VIEWER', func: C656 },
  { name: 'C16_Login with wrong credentials', func: C16 },
  { name: 'C18_Login with valid email but wrong password', func: C18 },
  { name: 'C36_Login with wrong credentials (10 wrong attempts)', func: C36 },
  { name: 'C580_Password forgotten', func: C580 },
  //LogOut
  { name: 'C90_Log out successfully', func: C90 },
  //Profile Settings
  { name: 'C19_C20_C21_C678 Add name and surname to the general information / Confirm email change in profile settings / Edit name and surname to the general information / Email change should not be possible if the email is already registered in proficloud', func: C19 },
  { name: 'C84_Download User CA certificate', func: C84 },
  //Billing Account
  { name: 'C537_Edit a billing account as an ADMIN', func: C537 },
  { name: 'C706_C707_Edit a billing account as an EDITOR not allowed / Edit a billing account as an VIEWER not allowed', func: C706},
  //User Management
  { name: 'C608_Invite a user to an organization that is not registered in proficloud and is not part of the same company', func: C608 },
  { name: 'C613_C610_C882_C871_Invite member to an organization that is already registered to proficloud as ADMIN / Remove member from orgnization / Members cannot be invited more than 1 time to Proficloud / Inviting user to an organization of the same domain should be possible without data security message', func: C613 },
  { name: 'C681_C682_C683_C684_C695_C696_C679_C680_C632_C633_Inviting an user to an organization as EDITOR/VIEWER is not allowed and User Management menu is hidden / Remove member from organization not allowed as EDITOR / Change user roles is not allowed for EDITOR/VIEWER / Editor/Viewer can NOT access to User Management / Viewer/Editor rights check', func: C681 },
  { name: 'C609_Sorting users by first name, last name, email, invited, role.', func: C609 },
  { name: 'C624_C677_Sorting users by first name, last name, email, invited, role. / ADMIN can access to USER MANAGEMENT', func: C624 },
 */ { name: 'C874_C646_Search for member works / Scroll Bars are present for users and roles', func: C874 },
 // { name: 'C625_Roles page shows a summary of numbers of Admins, Editors and Viewers.', func: C625 },
  { name: 'C714 After deleting user invitation the invitation link should not be valid anymore NEW', func: C714 }

 

];

const tests = sessionNames.map(({ name, func }) => ({
  name,
  func,
  testCaseIds: extractTestCaseIds(name), // Extrae una lista de IDs
}));

// Función para ejecutar una prueba
async function runTest(testFunction, testName, testCaseIds, testRunId) {
  try {
    console.log(`Running test: ${testName}`);
    await testFunction(); // Ejecuta la función del test
    console.log(`${testName} completed successfully.`);
    // Enviar resultados para todos los Test IDs asociados
    for (const testCaseId of testCaseIds) {
      await sendResultToTestRail(testCaseId, 1, 'Test passed successfully.', testRunId);
    }
  } catch (error) {
    console.error(`${testName} failed:`, error.message);
    // Enviar resultados para todos los Test IDs asociados como fallidos
    for (const testCaseId of testCaseIds) {
      await sendResultToTestRail(testCaseId, 5, `Test failed: ${error.message}`, testRunId);
    }
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
    const testRun = await createTestRun(projectId, testRunName, tests.flatMap(t => t.testCaseIds));
    const testRunId = testRun.id; // Obtener el ID del nuevo Test Run
    console.log(`Test Run created successfully with ID: ${testRunId}`);

    // Ejecutar todas las pruebas
    for (const test of tests) {
      await runTest(test.func, test.name, test.testCaseIds, testRunId);
    }

    console.log('All tests have been executed.');
  } catch (error) {
    console.error('Error while executing tests:', error.message);
  }
}

// Ejecutar todas las pruebas
runAllTests();
