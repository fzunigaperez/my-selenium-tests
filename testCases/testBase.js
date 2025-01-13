const { Builder } = require('selenium-webdriver');
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));

async function testBase(sessionName, testSteps) {
  let driver;

  const formatErrorStack = (error) => {
    const stackLines = error.stack.split('\n');
    // Filter lines relevant to test files
    return stackLines.filter((line) =>
      line.includes('testCases') || line.includes('sharedFunctions')
    );
  };

  try {
    console.log("Local execution enabled.");
    driver = await new Builder().forBrowser('chrome').build();

    console.log(`🚀 Starting test: ${sessionName}`);
    await testSteps(driver);

    console.log(`✅ Test '${sessionName}' completed successfully.`);
  } catch (error) {
    console.error(`❌ Test '${sessionName}' failed: ${error.message}`);
    console.error('🔍 Relevant error stack:');

    // Log only relevant lines from the stack trace
    const focusedStack = formatErrorStack(error);
    focusedStack.forEach((line) => console.error(line));

    // Highlight the first relevant line
    if (focusedStack.length > 0) {
      console.error(`🛑 Error likely occurred at: ${focusedStack[0]}`);
    } else {
      console.error('🛑 No relevant stack trace found.');
    }

    throw error; // Re-throw for further debugging
  } finally {
    if (driver) {
      await driver.quit();
      console.log('🗝️  Driver session closed.');
    }
  }
}

module.exports = testBase;
