'use strict';

// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md

/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
  '@angular': 'vendor/@angular',
  '@angular/router': 'vendor/@angular/router/bundles/router.umd.js' ,
  '@angular/forms': 'vendor/@angular/forms',
  '@angular/router-deprecated': 'vendor/@angular/router-deprecated',
  'angular2-in-memory-web-api': 'vendor/angular2-in-memory-web-api',
  'rxjs': 'vendor/rxjs',
  'firebase': 'vendor/firebase',
  'angularfire2': 'vendor/angularfire2',
  'angular2-localstorage': 'vendor/angular2-localstorage/dist',
  '@angular2-material': 'vendor/@angular2-material',
  'hammerjs': 'vendor/hammerjs',
  'ng2-material': 'vendor/ng2-material',
  'ng2-material-dropdown': 'vendor/ng2-material-dropdown',
  'materialize-css': 'vendor/materialize-css',
  'materialize': 'vendor/angular2-materialize',
  'angular2-materialize': 'vendor/angular2-materialize',
};

/** User packages configuration. */
const packages: any = {
  'rxjs': { defaultExtension: 'js' },
  'angular2-in-memory-web-api': {
       main: 'index.js',
       defaultExtension: 'js'
    },
    firebase: {
        main: 'firebase.js'
    },
    angularfire2: {
        defaultExtension: 'js',
        main: 'angularfire2.js'
    },
   'angular2-localstorage': {
      format: 'cjs',
      main: 'index.js',
      defaultExtension: 'js'
    },
    'hammerjs': { main: 'hammer.js', defaultExtension: 'js'},
    'ng2-material': { main: 'index.js', defaultExtension: 'js'},
    'ng2-material-dropdown': { main: 'index.js', defaultExtension: 'js'},
    'materialize-css': {
    'main': 'dist/js/materialize'
   },
   'angular2-materialize': {
    'main': 'dist/materialize-directive',
    'defaultExtension': 'js'
   },
   '.': {defaultExtension: 'js'},

};

const materialPackages: string[] = [
  'core',
  'toolbar',
  'icon',
  'button',
  'sidenav',
  'list',
  'card',
  'input',
  'radio',
  'checkbox',

   'grid-list',
   'menu',
   'progress-bar',
   'progress-circle',
   'slider',
   'slide-toggle',
   'button-toggle',
   'tabs',
   'tooltip',
];



materialPackages.forEach((pkg) => {
  packages[`@angular2-material/${pkg}`] = {
    format: 'cjs',
    defaultExtension: 'js',
    main: `${pkg}.js`,
  };
});



////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/forms',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/shared',
  'button-toggle',
  'gestures',
  'live-announcer',
  'portal',
  'overlay',
  /** @cli-barrel */

];



const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js'
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({ defaultJSExtensions: true, map, packages });
