var Angular2App = require('angular-cli/lib/broccoli/angular2-app');

module.exports = function(defaults) {
    return new Angular2App(defaults, {
        vendorNpmFiles: [
            // 'systemjs/dist/system-polyfills.js',
            'systemjs/dist/**/*.js',
            'zone.js/dist/**/*.+(js|js.map)',
            'es6-shim/es6-shim.js',
            'reflect-metadata/**/*.+(js|js.map)',
            'rxjs/**/*.+(js|js.map)',
            '@angular/**/*.+(js|js.map)',
            '@angular2-material/**/*.+(js|js.map)',
            'core-js/**/*.+(js|js.map)',
            'angularfire2/**/*.js',
            'angular2-localstorage/**/*.js',
            'angular2-in-memory-web-api/**/*',
            'firebase/**/*.js',
            'angular2-data-table/**/*',
            'ng2-material/**/*',
            'ng2-material-dropdown/**/*',
            'hammerjs/**/*.js',
            'materialize-css/dist/css/*.css',
            'materialize-css/dist/js/*.js',
            'materialize-css/dist/fonts/roboto/*',
            'angular2-materialize/dist/*',
            'jquery/dist/jquery.min.js',
        ]
    });
};