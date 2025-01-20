module.exports = {
  'bstack:options': {
    'os': 'Windows',
    'osVersion': '10',
    'local': 'false', // Enable BrowserStack Local to redirect downloads to your local machine
    'seleniumVersion': '4.21.0', // Ensure you are using a compatible version
    'userName': process.env.BROWSERSTACK_USERNAME,
    'accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
    'debug': true, // Enable visual recording
    'consoleLogs': 'info', // Capture browser console logs
    'networkLogs': true, // Capture network logs
    'screenshots': true, // Enable screenshots during test runs
  },
  'browserName': 'Chrome',
  'browserVersion': 'latest',
  'browserstack.debug': true,      // Enable visual recording
  'browserstack.console': 'info',  // Capture browser console logs
  'browserstack.networkLogs': true, // Capture network logs
  'goog:chromeOptions': {
    prefs: {
      'download.prompt_for_download': false,         // Disable download dialogs
      'download.directory_upgrade': true,
      'safebrowsing.enabled': true                   // Allow automatic file downloads
    }
  }
};
