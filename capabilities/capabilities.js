module.exports = {
  'bstack:options': {
    'os': 'Windows',
    'osVersion': '10',
    'local': 'false',
    'seleniumVersion': '4.21.0',
    'userName': process.env.BROWSERSTACK_USERNAME,
    'accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
    'idleTimeout': 90,
    'networkLogs': true, // Captura logs de red
    'debug': true, // Activar depuración
  },
  'browserstack.console': 'verbose', // Mover fuera de 'bstack:options'
  'browserName': 'Chrome',
  'browserVersion': 'latest',
  'goog:chromeOptions': {
    prefs: {
      'download.prompt_for_download': false,
      'download.directory_upgrade': true,
      'safebrowsing.enabled': true,
    },
  },
};