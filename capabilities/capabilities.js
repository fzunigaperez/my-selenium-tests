module.exports = {
  'bstack:options': {
    'os': 'Windows',
    'osVersion': '10',
    'local': 'false', // No habilitar BrowserStack Local
    'seleniumVersion': '4.21.0', // Versión compatible de Selenium
    'userName': process.env.BROWSERSTACK_USERNAME,
    'accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
    'idleTimeout': 90, // Tiempo de espera inactivo configurado a 90 segundos
    'networkLogs': true, // Capturar logs de red
    'debug': true, // Habilitar depuración visual
    'consoleLogs': 'verbose', // Capturar todos los logs de consola
    'sessionName': 'C90_Log out successfully', // Nombre de la sesión
    'useW3C': true, // Usar protocolo W3C
  },
  'browserName': 'Chrome',
  'browserVersion': 'latest', // Última versión disponible
  'goog:chromeOptions': {
    prefs: {
      'download.prompt_for_download': false, // Deshabilitar diálogos de descarga
      'download.directory_upgrade': true, // Permitir cambios automáticos en la carpeta de descarga
      'safebrowsing.enabled': true, // Activar la protección contra contenido inseguro
      'profile.default_content_setting_values.automatic_downloads': 1, // Permitir descargas automáticas
      'profile.default_content_setting_values.popups': 0, // Deshabilitar popups
      'credentials_enable_service': false, // Deshabilitar el gestor de credenciales
      'password_manager_enabled': false, // Deshabilitar el gestor de contraseñas
    },
    args: [
      '--disable-dev-shm-usage', // Evitar problemas en entornos limitados
      '--ignore-certificate-errors', // Ignorar errores SSL
      '--no-sandbox', // Deshabilitar el sandbox para entornos virtualizados
      '--disable-gpu', // Deshabilitar GPU si no es compatible
      '--disable-extensions', // Evitar conflictos por extensiones
    ],
  },
};
