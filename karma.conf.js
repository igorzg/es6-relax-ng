
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
            }
        },
        browsers: ['Chrome'],
        plugins: [
            'karma-*'
        ]
    });

};
