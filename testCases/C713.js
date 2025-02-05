const { Builder, By, until } = require('selenium-webdriver');  // Localrun 
const testBase = require('./testBase');  //Common
const { windowConfiguration, loginAdmin, logout, loginToProtonMailRecurringReports,  } = require('../utils/sharedFunctions');// BS.


async function C713() {
  try {
    await testBase('C713_C720_C1052_Create a manual report / Downlaod a manual report / Export one or all widgets', async (driver) => {
      let vars = {};

      await windowConfiguration(driver, "EMMA");      
      await loginAdmin(driver, vars);
      await emmaMenu(driver);
      await cleanDashboard(driver);

      await createChart(driver, 'EPCTPC'); // Energy Pie Chart Time Period Comparison


      const reportTitle = "Phoenix Contact Recurring Report C620";
      const reportSubtitle = "Testing Subtitle";
      const reportDescription = "At absolute zero temperature, the system is in the state with the minimum thermal energy, the ground state. The constant value (not necessarily zero) of entropy at this point is called the residual entropy of the system. With the exception of non-crystalline solids (e.g. glass) the residual entropy of a system is typically close to zero.";
      const dateOfToday = await getCurrentDate('/');
      const reportCompany = "Apple Company";
      const reportAuthor = "Fernando Alejandro Zuniga Perez";


    });
  } catch (error) {
    throw new Error(`C713 failed: ${error.message}`);
  }
}





module.exports = C713;


if (require.main === module) {
  (async () => {
    try {
      console.log(`'🚀 Running the test `);
      await C713();   // Change here the test name
      
      console.log('✅ Test successfully completed.');
    } catch (error) {
      console.error('❌ Error running the test:', error.message);
    }
  })();
}
