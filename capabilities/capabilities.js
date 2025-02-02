////////////////////////////////////////////////////////////////////////////////
// This configzration works fine with FILES DOWNLOAD
////////////////////////////////////////////////////////////////////////////////
module.exports = {
  'bstack:options': {
    'os': 'Windows',
    'osVersion': '10',
    'local': 'false', // Habilitar BrowserStack Local para redirigir descargas a tu máquina local
    'seleniumVersion': '4.21.0', // Asegúrate de usar una versión compatible
    'userName': process.env.BROWSERSTACK_USERNAME,
    'accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
    'idleTimeout': 90, // Establece el tiempo de espera a 300 segundos (5 minutos)
    'networkLogs': true
  },
  'browserName': 'Chrome',
  'browserVersion': 'latest',
  'browserstack.debug': true,      // Habilitar la grabación visual
  'browserstack.console': 'info',  // Capturar logs de la consola del navegador
  'networkLogs': true, // Capturar logs de red
  'goog:chromeOptions': {
    prefs: {
      'download.prompt_for_download': false,         // Deshabilitar los diálogos de descarga
      'download.directory_upgrade': true,
      'safebrowsing.enabled': true                   // Permitir descargas automáticas de archivos
    }
  }
};
