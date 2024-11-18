module.exports = {
  'bstack:options': {
    'os': 'Windows',
    'osVersion': '10',
    'local': 'false',
    'seleniumVersion': '3.141.59',
    'userName': process.env.BROWSERSTACK_USERNAME,
    'accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
  },
  'browserName': 'Chrome',
  'browserVersion': 'latest',
};
