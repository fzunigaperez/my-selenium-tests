const { Builder, By, until } = require('selenium-webdriver');

async function runTest() {
  let driver = await new Builder()
    .usingServer('https://hub-cloud.browserstack.com/wd/hub')
    .withCapabilities({
      'bstack:options' : {
        "os" : "Windows",
        "osVersion" : "10",
        "local" : "false",
        "seleniumVersion" : "4.0.0",
      },
      'browserName' : 'Chrome',
      'browserVersion' : 'latest',
      'browserstack.user' : process.env.BROWSERSTACK_USERNAME,
      'browserstack.key' : process.env.BROWSERSTACK_ACCESS_KEY
    })
    .build();

  try {
    await driver.get('http://www.example.com');
    let element = await driver.findElement(By.name('q'));
    await element.sendKeys('Hello World');
    await element.submit();
    await driver.wait(until.titleContains('Hello World'), 10000);
  } finally {
    await driver.quit();
  }
}

runTest();
