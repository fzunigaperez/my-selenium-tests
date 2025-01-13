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
// Organization General
const C611 = require('./testCases/C611');



//─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──
//
//                                                                                     EMMA SERVICE
//
//─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──

const C178 = require('./testCases/C178');




// TestRail Project IDs
const projectIds = {
  "User Management Service": 9,
  "Device Management Service": 3,
  "Emma Service": 5,
  "Charge Repay Service": 8,
};

// Test cases grouped by project
const projectsTests = {
  "User Management Service": [

  //SignUp
  { name: 'C13_C575_C697_C22_C895_C1024 Sign up in the proficloud with valid email and password / Sign UP with an already existing E-Mail / Introduce a wrong password before user deletion / Delete user / If the user enter an invalid email, and correcte it later, it is should be possible to REGISTER to Proficloud or create Billing account / Check and uncheck the Terms and Licences Agreement should not alter the registered button', func:C13 },
  { name: 'C614_Sign UP if two passwords are not the same should not be possible', func: C614 },
  //Login
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
  { name: 'C874_C646_Search for member works / Scroll Bars are present for users and roles', func: C874 },
  { name: 'C625_Roles page shows a summary of numbers of Admins, Editors and Viewers.', func: C625 },
  { name: 'C537_After deleting user invitation the invitation link should not be valid anymore NEW', func: C537 },
  { name: 'C714_After deleting user invitation the invitation link should not be valid anymore NEW', func: C714 },
  { name: 'C611_643_C626_C699_C892_Leave organization / It should not be possible to leave its root organization as admin if at least another admin is present / Switch organization / Create orga as ADMIN / Message about what characters are allowed in the name of organization has to be displayed', func: C611 },

  ],
  "Device Management Service": [
    // Add specific test cases for this project if any
  ],
  "Emma Service": [

  { name: 'C178_C179_C180_C946_C181_C184_Introducing a Dashboard name / Maximize the whole Dashboard Editing a Dashboard name / Introducing a Dashboard name with a maximum length of 27 characters Introducing a Dashboard description / Editing a Dashboard description', func: C178 },

    
  ],

  "Charge Repay Service": [
    // Add specific test cases for this project if any
  ],
};

// Function to extract Test IDs from sessionName
function extractTestCaseIds(sessionName) {
  const matches = sessionName.match(/C(\d+)/g); // Finds all occurrences of C followed by digits
  return matches ? matches.map(id => parseInt(id.slice(1), 10)) : []; // Returns IDs as numbers
}

// Generate tests with extracted IDs
for (const project in projectsTests) {
  projectsTests[project] = projectsTests[project].map(({ name, func }) => ({
    name,
    func,
    testCaseIds: extractTestCaseIds(name),
  }));
}

const errors = []; // Array to store errors

// Function to execute a test
async function runTest(testFunction, testName, testCaseIds, testRunId) {
  try {
    console.log(`Running test: ${testName}`);
    await testFunction(); // Execute the test function
    console.log(`${testName} completed successfully.`);
    // Send results for all associated Test IDs
    for (const testCaseId of testCaseIds) {
      await sendResultToTestRail(testCaseId, 1, 'Test passed successfully.', testRunId);
    }
  } catch (error) {
    console.error(`${testName} failed:`, error.message);
    errors.push({ testName, error: error.message }); // Add the error to the array
    // Send results for all associated Test IDs as failed
    for (const testCaseId of testCaseIds) {
      await sendResultToTestRail(testCaseId, 5, `Test failed: ${error.message}`, testRunId);
    }
  }
}

// Function to execute all tests for a project
async function runProjectTests(projectName) {
  try {
    const projectId = projectIds[projectName];
    const tests = projectsTests[projectName];
    
    if (!tests || tests.length === 0) {
      console.log(`No tests available for project: ${projectName}. Skipping.`);
      return;
    }

    const today = new Date();
    const testRunName = `Automated Test Run - ${projectName} - ${today.toISOString().split('T')[0]}`;

    // Create a new Test Run in TestRail
    console.log(`Creating Test Run in project ${projectId} (${projectName})...`);
    const testRun = await createTestRun(projectId, testRunName, tests.flatMap(t => t.testCaseIds));
    const testRunId = testRun.id; // Get the ID of the new Test Run
    console.log(`Test Run created successfully with ID: ${testRunId}`);

    // Execute all tests for the project
    for (const test of tests) {
      await runTest(test.func, test.name, test.testCaseIds, testRunId);
    }

    console.log(`All tests for project "${projectName}" have been executed.`);

    // Show error summary if any
    if (errors.length) {
      console.log(`Error summary for project "${projectName}":`);
      errors.forEach(err => console.log(`- ${err.testName}: ${err.error}`));
    } else {
      console.log(`All tests for "${projectName}" were executed successfully.`);
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
