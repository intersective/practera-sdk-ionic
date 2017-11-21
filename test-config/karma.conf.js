var webpackConfig = require('./webpack.test.js');

module.exports = function (config) {
  var appBase    = 'src/';       // transpiled app JS and map files
  var appSrcBase = appBase;      // app source TS files

  var _config = {
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: './karma-test-shim.js', watched: true },
    ],
    preprocessors: {
      './karma-test-shim.js': ['webpack', 'sourcemap'],
    },

    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },
    webpackServer: {
      noInfo: true
    },

    client: {
      clearContext: false
    },
    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    reporters: ['kjhtml', 'dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    resolve: {
      extensions: ['.js', '.ts']
    }
  };

  config.set(_config);
};
