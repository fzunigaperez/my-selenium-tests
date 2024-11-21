const testBase = require('./testBase');
const { windowConfiguration, loginAdmin, logout } = require('../utils/sharedFunctions');

async function C90() {
  await testBase('C90 Log out successfully', async (driver) => {
    // Configuración de la ventana
    await windowConfiguration(driver);

    // Inicio de sesión
    await loginAdmin(driver);

    // Cierre de sesión
    await logout(driver);
  });
}

module.exports = C90;