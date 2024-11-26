

// When it is necessary to wait when a new page loads

await driver.sleep(1000);
await driver.wait(until.elementLocated(By.id("username")), 30000);