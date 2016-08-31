// Main Entry point, only file referenced in header of index.html
// Sets aliases to files used by require.js
// Loads app.js

require.config({
    // Set dependency shortcuts
    paths: {
        require: 'js/libs/require/require.js',
        jquery: 'libs/jquery/jquery-1.12.4',
        underscore: 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        backform: 'libs/backbone/backform',
        poller: 'libs/backbone/backbone.poller',
        bootstrap: 'libs/bootstrap/bootstrap',
        'jquery.tablesorter.combined': 'libs/jquery/jquery.tablesorter.combined',
        templates: '../templates'
    },
    shim: {
        'jquery': {
            exports: '$'
        }
        , 'underscore': {
            exports: '_'
        }
        , 'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
        , 'jquery.tablesorter.combined': {  //<-- tablesorter depends on Jquery and exports nothing
            deps: ['jquery']
        }
        , 'backform' :{
            deps: ['backbone'],
            exports: 'Backform'
        }
        , 'poller': {
            deps: ['backbone'],
            exports: 'Poller'
        }
        , 'bootstrap': {
            deps: ['jquery']
        }
    }
});

require([
    // Load app.js module
    'app'
], function (App) {
    // The "app" dependency is passed in as "App"
    // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
    App.initialize();
});
