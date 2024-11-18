// run-all-tests.js

//const C178 = require('./testCases/C178');   
//const C180 = require('./testCases/google');
//const C90new = require('./testCases/C90new');  //the route has to include the name of the file
const C90 = require('./testCases/C90'); 
const C15 = require('./testCases/C15'); 

async function runAllTests() {
  
  await C90();
  await C15();
}

runAllTests();
