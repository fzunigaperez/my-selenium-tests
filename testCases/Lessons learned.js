

// When it is necessary to wait when a new page loadss

await driver.sleep(1000);
await driver.wait(until.elementLocated(By.id("username")), 30000);