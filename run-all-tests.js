// run-all-tests.js

//const C178 = require('./testCases/C178');   
//const C180 = require('./testCases/google');
const C90new = require('./testCases/C90new');  //the route has to include the name of the file
const C90 = require('./testCases/C90'); 

async function runAllTests() {
  //await C178();
  //await C180();
  await C90new();
  await C90();
}

runAllTests();
