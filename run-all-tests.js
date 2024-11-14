// run-all-tests.js

const C178 = require('./C178');
const C180 = require('./google');


async function runAllTests() {
  await C178();
  await C180();
  
}

runAllTests();
