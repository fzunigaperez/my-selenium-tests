// run-all-tests.js

const C178 = require('.testCases/C178');   
const C180 = require('.testCases/google');


async function runAllTests() {
  await C178();
  await C180();
  
}

runAllTests();
