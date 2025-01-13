const { Builder } = require('selenium-webdriver');
const path = require('path');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));

async function testBase(sessionName, testSteps) {
  let driver;

  // Helper function to format and filter the error stack trace
  const formatErrorStack = (error) => {
    const stackLines = error.stack.split('\n');
    // Filter lines relevant to test files
    return stackLines.filter((line) =>
      line.includes('testCases') || line.includes('sharedFunctions')
    );
  };

  // Selector for local or BrowserStack execution
  const selectLocal = "OFF";

  if (selectLocal === "ON") {
    console.log("Local execution enabled.");

    try {
      // Configure the driver for local Chrome execution
      driver = await new Builder().forBrowser('chrome').build();

      console.log(`🚀 Starting local test: ${sessionName}`);
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

      throw error; // Re-throw for debugging
    } finally {
      if (driver) {
        await driver.quit();
        console.log('🗝️  Driver session closed.');
      }
    }
  } else {
    console.log("BrowserStack execution enabled.");

    const capabilities = {
      ...baseCapabilities,
      'bstack:options': {
        ...baseCapabilities['bstack:options'],
        sessionName,
      },
    };

    try {
      // Configure the driver for BrowserStack
      driver = await new Builder()
        .usingServer('https://hub-cloud.browserstack.com/wd/hub')
        .forBrowser('chrome')
        .withCapabilities(capabilities)
        .build();

      console.log(`🚀 Starting test on BrowserStack: ${sessionName}`);
      await testSteps(driver);

      // Mark the session as passed
      const passedStatus = JSON.stringify({
        action: 'setSessionStatus',
        arguments: {
          status: 'passed',
          reason: `${sessionName} test passed successfully`,
        },
      });
      await driver.executeScript(`browserstack_executor: ${passedStatus}`);
      console.log(`✅ ${sessionName} test passed successfully.`);
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

      // Mark the session as failed
      const failedStatus = JSON.stringify({
        action: 'setSessionStatus',
        arguments: {
          status: 'failed',
          reason: `Test failed: ${error.message}`,
        },
      });

      try {
        await driver.executeScript(`browserstack_executor: ${failedStatus}`);
      } catch (executorError) {
        console.error('❌ Failed to update BrowserStack session status:', executorError.message);
      }

      throw error; // Re-throw for debugging
    } finally {
      if (driver) {
        await driver.quit();
        console.log('🗝️  Driver session closed.');
      }
    }
  }
}

module.exports = testBase;
