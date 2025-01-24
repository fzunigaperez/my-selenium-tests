module.exports = {
  'bstack:options': {
    'os': 'Windows',
    'osVersion': '10',
    'local': 'false', // Habilitar BrowserStack Local para redirigir descargas a tu máquina local
    'seleniumVersion': '4.21.0', // Asegúrate de usar una versión compatible
    'userName': process.env.BROWSERSTACK_USERNAME,
    'accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
    'idleTimeout': 90, // Tiempo de espera inactivo configurado a 90 segundos
    'console': 'verbose', // Capturar todos los logs de la consola
    'networkLogs': true, // Capturar logs de red
    'debug': true, // Activar la grabación visual
  },
  'browserName': 'Chrome',
  'browserVersion': 'latest',
  'goog:chromeOptions': {
    prefs: {
      'download.prompt_for_download': false, // Deshabilitar los diálogos de descarga
      'download.directory_upgrade': true, // Permitir cambios automáticos en la carpeta de descarga
      'safebrowsing.enabled': true, // Activar la protección contra contenido inseguro
    }
  }
};
