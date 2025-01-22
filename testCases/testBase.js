const { Builder } = require('selenium-webdriver');
const path = require('path');
const fs = require('fs');
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));

// Load execution configuration
let config = { executionMode: "browserstack" }; // Default to BrowserStack
try {
  config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config.json'), 'utf-8'));
} catch (error) {
  console.warn("⚠️ Could not load 'config.json'. Using default configuration:", config);
}

async function testBase(sessionName, testSteps) {
  let driver;

  // Helper function to format and filter the error stack trace
  const formatErrorStack = (error) => {
    const stackLines = error.stack.split('\n');
    return stackLines.filter((line) =>
      line.includes('testCases') || line.includes('sharedFunctions')
    );
  };

  if (config.executionMode === "local") {
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

      const focusedStack = formatErrorStack(error);
      focusedStack.forEach((line) => console.error(line));

      if (focusedStack.length > 0) {
        console.error(`🛑 Error likely occurred at: ${focusedStack[0]}`);
      } else {
        console.error('🛑 No relevant stack trace found.');
      }

      throw error;
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
      driver = await new Builder()
        .usingServer('https://hub-cloud.browserstack.com/wd/hub')
        .forBrowser('chrome')
        .withCapabilities(capabilities)
        .build();

      console.log(`🚀 Starting test on BrowserStack: ${sessionName}`);
      await testSteps(driver);

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

      const focusedStack = formatErrorStack(error);
      focusedStack.forEach((line) => console.error(line));

      if (focusedStack.length > 0) {
        console.error(`🛑 Error likely occurred at: ${focusedStack[0]}`);
      } else {
        console.error('🛑 No relevant stack trace found.');
      }

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

      throw error;
    } finally {
      if (driver) {
        await driver.quit();
        console.log('🗝️  Driver session closed.');
      }
    }
  }
}

module.exports = testBase;
