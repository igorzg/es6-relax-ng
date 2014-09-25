
module.exports = function (config) {

    config.set({
        // list of files / patterns to load in the browser
        frameworks: ['jasmine', 'traceur', 'requirejs'],

        traceurPreprocessor: {
            options: {
                modules: 'amd'
            }
        },

        files: [
            'test-main.js',
            {pattern: 'src/**/*.js', included: false},
            {pattern: 'test/*.js', included: false},
            {pattern: 'test/*.xml', included: false},
            {pattern: 'node_modules/es6-shim/es6-shim.js', included: false}
        ],

        preprocessors: {
            'src/**/*.js': ['traceur'],
            'test/*.js': ['traceur']
        },

        customLaunchers: {
            'Chrome_harmony': {
                base: 'Chrome',
                flags: ['--js-flags=--harmony']
            },
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
                browserName: 'safari'
            },
            "SL_IE_9": {
                "base": "SauceLabs",
                "browserName": "Internet Explorer",
                "platform": "Windows 8",
                "version": "9"
            },
            "SL_IE_10": {
                "base": "SauceLabs",
                "browserName": "Internet Explorer",
                "platform": "Windows 8",
                "version": "10"
            },
            "SL_IE_11": {
                "base": "SauceLabs",
                "browserName": "Internet explorer",
                "platform": "Windows 8.1",
                "version": "11"
            }
        },
        browsers: [/*'Firefox',  'Opera', 'Safari', */ 'Chrome'],
        plugins: [
            'karma-*'
        ]
    });

};
