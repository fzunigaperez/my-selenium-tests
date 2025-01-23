const { sendResultToTestRail, createTestRun } = require('./utils/sharedFunctions'); // Import necessary functions
const fs = require('fs'); // File system for creating report
const nodemailer = require('nodemailer'); // For sending email


// Safe import utility
const loadedModules = new Map();

function safeRequire(path, key) {
  if (loadedModules.has(key)) {
    console.warn(`Warning: Module '${key}' is already loaded. Skipping duplicate declaration.`);
    return loadedModules.get(key);
  }
  const module = require(path); // Correct implementation to prevent self-referencing
  loadedModules.set(key, module);
  return module;
}
//─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──
//
//                                                                                     USER MANAGEMENT SERVICE
//
//─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──

// Sign Up
const C13 = safeRequire('./testCases/C13', 'C13');
const C614 = safeRequire('./testCases/C614', 'C614');
// Login
const C15 = safeRequire('./testCases/C15', 'C15');
const C655 = safeRequire('./testCases/C655', 'C655');
const C656 = safeRequire('./testCases/C656', 'C656');
const C16 = safeRequire('./testCases/C16', 'C16');
const C18 = safeRequire('./testCases/C18', 'C18');
const C36 = safeRequire('./testCases/C36', 'C36');
const C580 = safeRequire('./testCases/C580', 'C580');
// Log out
const C90 = safeRequire('./testCases/C90', 'C90');
// Profile Settings
const C19 = safeRequire('./testCases/C19', 'C19');
const C84 = safeRequire('./testCases/C84', 'C84');
// Billing account
const C537 = safeRequire('./testCases/C537', 'C537');
const C706 = safeRequire('./testCases/C706', 'C706');
// User Management
const C608 = safeRequire('./testCases/C608', 'C608');
const C613 = safeRequire('./testCases/C613', 'C613');
const C681 = safeRequire('./testCases/C681', 'C681');
const C609 = safeRequire('./testCases/C609', 'C609');
const C624 = safeRequire('./testCases/C624', 'C624');
const C874 = safeRequire('./testCases/C874', 'C874');
const C625 = safeRequire('./testCases/C625', 'C625');
const C714 = safeRequire('./testCases/C714', 'C714');
// Organization General
const C611 = safeRequire('./testCases/C611', 'C611');
const C911 = safeRequire('./testCases/C911', 'C911');
// Organization Menu
const C700 = safeRequire('./testCases/C700', 'C700');
const C631 = safeRequire('./testCases/C631', 'C631');

//─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──
//
//                                                                         EMMA SERVICE
//
//─── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ───── ⋆⋅☆⋅⋆ ──

const C178 = safeRequire('./testCases/C178', 'C178');
const C620 = safeRequire('./testCases/C620', 'C620');




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
  //Organization General
  { name: 'C611_643_C626_C699_C892_Leave organization / It should not be possible to leave its root organization as admin if at least another admin is present / Switch organization / Create orga as ADMIN / Message about what characters are allowed in the name of organization has to be displayed', func: C611 },
  { name: 'C911_Search field for organizations works as intended', func: C911 },
  //Organization menu
  { name: 'C700_C701 Create an organization as EDITOR/VIEWER', func: C700 },
  { name: 'C631_C702_C703_Rename organization as admin / Rename organization for EDITOR / VIEWER is not allowed', func: C631 },


  ],
  "Device Management Service": [
    // Add specific test cases for this project if any
  ],
  "Emma Service": [

  // Dashboards
  { name: 'C178_C179_C180_C946_C181_C184_Introducing a Dashboard name / Maximize the whole Dashboard Editing a Dashboard name / Introducing a Dashboard name with a maximum length of 27 characters Introducing a Dashboard description / Editing a Dashboard description', func: C178 },
  // Reports
  { name: 'C620_C651_C1053_Create a recurring Report_Delete a recurring and manual report_Preview of a recurring report creates and downloads a manual report', func: C620 },
 
  

    
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
const successes = []; // Array to store successes

// Function to execute a test
async function runTest(testFunction, testName, testCaseIds, testRunId) {
  try {
    console.log(`Running test: ${testName}`);
    await testFunction(); // Execute the test function
    console.log(`${testName} completed successfully.`);
    successes.push(testName);
    // Send results for all associated Test IDs
    for (const testCaseId of testCaseIds) {
      await sendResultToTestRail(testCaseId, 1, 'Test passed successfully.', testRunId);
    }
  } catch (error) {
    console.error(`${testName} failed:`, error.message);
    errors.push({ testName, error: error.message });
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
  } catch (error) {
    console.error(`Error while executing tests for project "${projectName}":`, error.message);
  }
}

// Function to generate a consolidated report
function generateReport() {
  const report = `
    <h1>Test Execution Report</h1>
    <h2>Summary</h2>
    <p>Total Tests: ${successes.length + errors.length}</p>
    <p>Passed: ${successes.length}</p>
    <p>Failed: ${errors.length}</p>
    <h2>Details</h2>
    <h3>Passed Tests</h3>
    <ul>
      ${successes.map(test => `<li>${test}</li>`).join('')}
    </ul>
    <h3>Failed Tests</h3>
    <ul>
      ${errors.map(err => `<li>${err.testName}: ${err.error}</li>`).join('')}
    </ul>
  `;
  fs.writeFileSync('test_report.html', report); // Save the report as an HTML file
  console.log('Test report generated: test_report.html');
  return report;
}

// Function to send the report via email
async function sendEmailReport(reportHtml) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider
    auth: {
      user: 'zunigapfernando@gmail.com', // Replace with your email
      pass: 'zhbh scmf ljaz fflv' // Replace with your email password
    }
  });

  const mailOptions = {
    from: 'zunigapfernando@gmail.com',
    to: 'fzuniga@phoenixcontact-sb.io', // Replace with recipient email
    subject: 'Test Execution Report',
    html: reportHtml, // Embed the report in the email body
    attachments: [
      {
        filename: 'test_report.html',
        path: './test_report.html'
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
}

// Function to execute tests for all projects
async function runAllProjectsTests() {
  for (const projectName in projectIds) {
    await runProjectTests(projectName);
  }

  // Generate and send the report
  const reportHtml = generateReport();
  await sendEmailReport(reportHtml);
}

// Execute tests for all projects
runAllProjectsTests();