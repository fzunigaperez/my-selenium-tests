const axios = require('axios');
const { By, until } = require('selenium-webdriver');
require('dotenv').config({ path: '../.env' });
const TESTRAIL_ENABLED = process.env.TESTRAIL_ENABLED === 'true';

// Función para enviar resultados a TestRail
async function sendResultToTestRail(testCaseId, status, comment = '') {
  if (!TESTRAIL_ENABLED) {
    console.log(`[Mock] TestRail disabled. Result for ${testCaseId}: Status ${status}, Comment: ${comment}`);
    return;
  }

  const url = `https://testingpxc.testrail.io/index.php?/api/v2/add_result_for_case/37/${testCaseId}`;
  const auth = {
    username: process.env.TESTRAIL_USERNAME,
    password: process.env.TESTRAIL_API_KEY,
  };

  const data = {
    status_id: status, // 1: Passed, 5: Failed
    comment: comment,
  };

  try {
    const response = await axios.post(url, data, { auth });
    console.log('✅ Test result sent successfully:', response.data);
  } catch (error) {
    console.error('❌ Error sending test result to TestRail:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Función para aceptar cookies en la página
async function acceptCookies(driver) {
  try {
    const cookiesXPath = "//h2[normalize-space()='This website uses cookies']";
    const acceptButtonXPath = "//button[@id='ga-opt-out-false']";

    const cookiesBanner = await driver.wait(until.elementLocated(By.xpath(cookiesXPath)), 3000);

    if (cookiesBanner) {
      console.log('Cookies banner detected.');
      const acceptButton = await driver.findElement(By.xpath(acceptButtonXPath));
      await acceptButton.click();
      console.log('Cookies accepted.');
    }
  } catch (error) {
    console.log('No cookies banner found or it timed out.');
  }
}

// Función para configurar la ventana del navegador
async function windowConfiguration(driver) {
  await driver.get('https://proficloud.io/testrun');
  await driver.manage().window().maximize();
  console.log('✅ Browser window configured.');
}

// Función para iniciar sesión como administrador
async function loginAdmin(driver, vars) {
  vars.username = 'testingpxc_admin@proton.me';
  vars.password = 'Proficloud2022!';

  await acceptCookies(driver);
  await driver.findElement(By.id('login-button')).click();

  await driver.wait(until.elementLocated(By.id('username')), 10000);
  await driver.findElement(By.id('username')).sendKeys(vars.username);
  await driver.findElement(By.id('password')).sendKeys(vars.password);
  await driver.findElement(By.id('kc-login')).click();
  console.log('✅ Admin logged in.');
}

// Función para cerrar sesión
async function logout(driver) {
  await driver.wait(until.elementLocated(By.xpath("//div[@id='proficloud-user-icon']")), 10000);
  await driver.findElement(By.xpath("//div[@id='proficloud-user-icon']")).click();

  await driver.wait(until.elementLocated(By.xpath("//div[contains(text(),'Logout')]")), 10000);
  await driver.findElement(By.xpath("//div[contains(text(),'Logout')]")).click();

  await driver.sleep(1000);
  console.log('✅ Logged out successfully.');
}

// Exportar todas las funciones
module.exports = {
  sendResultToTestRail,
  acceptCookies,
  windowConfiguration,
  loginAdmin,
  logout,
};
