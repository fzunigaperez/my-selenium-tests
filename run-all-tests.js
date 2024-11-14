// run-all-tests.js

const runTest1 = require('./google');
const runTest2 = require('.capoeira');


async function runAllTests() {
  await runTest1();
  await runTest2();
  
}

runAllTests();
