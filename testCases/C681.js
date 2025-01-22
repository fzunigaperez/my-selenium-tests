"use strict";
const { Builder, By, until } = require('selenium-webdriver'); // Importación completa y precisa
const path = require('path');
const assert = require('assert'); // Import the assert module
const baseCapabilities = require(path.resolve(__dirname, '../capabilities/capabilities'));
const testBase = require('./testBase');  //Common
const {
  windowConfiguration,
  loginEditor,
  loginViewer,
  logout,
  assertXpathNotPresent,
} = require('../utils/sharedFunctions'); // Importación de funciones reutilizables

async function C681() {
  try {
    await testBase(
      'C681_C682_C683_C684_C695_C696_C679_C680_C632_C633_Inviting an user to an organization as EDITOR/VIEWER is not allowed and User Management menu is hidden / Remove member from organization not allowed as EDITOR / Change user roles is not allowed for EDITOR/VIEWER / Editor/Viewer can NOT access to User Management / Viewer/Editor rights check',
      async (driver) => {
        let vars = {};

     
        await windowConfiguration(driver,"UMS");
        await loginEditor(driver, vars);
        await assertXpathNotPresent(driver,"//span[contains(.,'User Management Service')]");
     
    
        await logout(driver);

        await windowConfiguration(driver,"UMS");
        await loginViewer(driver, vars);
        await assertXpathNotPresent(driver,"//span[contains(.,'User Management Service')]");
        await logout(driver);
      }
    );
  } catch (error) {
    throw new Error(`C681 failed: ${error.message}`);
  }
}

// Permite ejecutar este archivo directamente
if (require.main === module) {
  (async () => {
    try {
      console.log('🚀 Ejecutando el test C681...');
      await C681(); // Cambia aquí el nombre del test si tienes varios
      console.log('✅ Test completado con éxito.');
    } catch (error) {
      console.error('❌ Error al ejecutar el test:', error.message);
      console.error(error.stack);
    }
  })();
}

module.exports = C681;
