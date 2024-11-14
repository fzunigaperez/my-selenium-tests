// run-all-tests.js

const C178 = require('./C178');
const runTest2 = require('./google');


async function runAllTests() {
  await C178();
  await runTest2();
  
}

runAllTests();
