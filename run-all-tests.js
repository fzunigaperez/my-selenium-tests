// run-all-tests.js

//const C178 = require('./testCases/C178');   
//const C180 = require('./testCases/google');
const C90 = require('./testCases/C90');  //the route has to include the name of the file


async function runAllTests() {
  //await C178();
  //await C180();
  await C90();
  
}

runAllTests();
