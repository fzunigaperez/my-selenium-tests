// run-all-tests.js

const runTest1 = require('./my-selenium-tests.js');
const runTest2 = require('./my-second-selenium-test.js');
const runTest3 = require('./my-third-selenium-test.js');

async function runAllTests() {
  await runTest1();
  await runTest2();
  await runTest3();
}

runAllTests();
