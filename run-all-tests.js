// run-all-tests.js

const C178 = require('./C178');
const runTest2 = require('./capoeira');


async function runAllTests() {
  await C178();
  await runTest2();
  
}

runAllTests();
