
module.exports = function (config) {


    config.set({
        // list of files / patterns to load in the browser
        frameworks: ['jasmine', 'traceur', 'requirejs'],

        traceurPreprocessor: {
            options: {
                modules: 'amd'
            }
        },
        logLevel: config.LOG_DEBUG,
        files: [
            'test-main.js',
            {pattern: 'src/**/*.js', included: false},
            {pattern: 'test/**/*.js', included: false},
            {pattern: 'test/**/*.xml', included: false},
            {pattern: 'test/**/*.rng', included: false},
            {pattern: 'node_modules/es6-shim/es6-shim.js', included: false}
        ],

        preprocessors: {
            'src/**/*.js': ['traceur'],
            'test/*.js': ['traceur']
        },

        customLaunchers: {
            'SL_Chrome': {
                base: 'SauceLabs',
                browserName: 'chrome'
            },
            'SL_Firefox': {
                base: 'SauceLabs',
                browserName: 'firefox'
            },
            'SL_Opera': {
                base: 'SauceLabs',
                browserName: 'opera'
            },
            'SL_Safari': {
                base: 'SauceLabs',
                browserName: 'safari',
                platform: 'OS X 10.9'
            },
            "SL_IE_10": {
                base: "SauceLabs",
                browserName: "Internet Explorer",
                platform: "Windows 8",
                version: "10"
            },
            "SL_IE_11": {
                base: "SauceLabs",
                browserName: "Internet explorer",
                platform: "Windows 8.1",
                version: "11"
            }
        },
        reporters: ['dots', 'saucelabs'],
        browsers: [/*'Firefox',  'Opera', 'Safari', */ 'Chrome'],
        plugins: [
            'karma-*'
        ],
        browserNoActivityTimeout: 1000000
    });


    if (!process.env.SAUCE_USERNAME) {
        process.env.SAUCE_USERNAME = 'igorzg1987';
        process.env.SAUCE_ACCESS_KEY = 'f58c7ebd-7331-4138-ad49-bb83a778f08c';
    }
    if (process.env.TRAVIS) {
        config.sauceLabs.build = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';
        config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
    }
};
