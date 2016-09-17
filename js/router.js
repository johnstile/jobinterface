// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'views/dashboard/DashBoardView',
    'views/jobs/JobsView',
    'views/jobs/JobView',
    'views/log/LogView',
    'views/log/ConsoleLogView',
    'views/schedule/ScheduleView',
    'views/stations/StationsView',
    'views/readme/ReadmeView'
], function ($, _, Backbone, DashBoardView, JobsView, JobView, LogView, ConsoleLogView, ScheduleView, StationsView, ReadmeView) {

    // Enable/disable logging
    var gDebug = true;

    function fLog(rMsg) {
        // If the browser does not have a console, don't print to it
        if (gDebug && window.console) {
            console.log(rMsg);
        }
    }

    var AppRouter = Backbone.Router.extend({
        routes: {
            // Define some URL routes
            'jobs': 'showJobs',              // All jobs page
            'jobs/:job_dir/:build': 'showJob', // One job queried by id
            'schedule': 'showSchedule',
            'stations': 'showStations',
            'log/:job_dir/:serial_number/:file': 'showLog',
            'jobconsole/:build_id': 'showConsoleLog',
            'README': 'showReadme',
            // Default
            '*actions': 'defaultAction'
        }
    });

    var initialize = function () {

        var app_router = new AppRouter;
        var currentView = null;

        app_router.on('route:showJobs', function () {
            if (currentView) {
                currentView.close();
            }
            currentView = new JobsView();
        });

        app_router.on('route:showJob', function (job_dir, build) {

            fLog("Show a job_dir:" + job_dir);
            fLog("Show a build:" + build);
            if (currentView) {
                currentView.close();
            }
            currentView = new JobView({job_dir: job_dir, build: build});
        });

        app_router.on('route:showLog', function (job_dir, serial_number, file) {

            // e.g. http://localhost/g2glitch/#/log/20160907_122250/16230931/hardware_monitor
            fLog("Show a job_dir:" + job_dir);
            fLog("Show a serial_number:" + serial_number);
            fLog("Show a file:" + file);
            if (currentView) {
                currentView.close();
            }
            currentView = new LogView({job_dir: job_dir, serial_number:serial_number, file: file});
        });

        app_router.on('route:showConsoleLog', function (build_id) {

            // e.g. http://localhost/g2glitch/#/log/20160907_122250/16230931/hardware_monitor
            fLog("Show a build_id:" + build_id);
            if (currentView) {
                currentView.close();
            }
            currentView = new ConsoleLogView({build_id: build_id});
        });

        app_router.on('route:showSchedule', function () {
            if (currentView) {
                currentView.close();
            }
            currentView = new ScheduleView();
        });

        app_router.on('route:showStations', function () {
            if (currentView) {
                currentView.close();
            }
            currentView = new StationsView();

        });

        app_router.on('route:showReadme', function () {
            if (currentView) {
                currentView.close();
            }
            currentView = new ReadmeView();

        });

        app_router.on('route:defaultAction', function (actions) {
            if (currentView) {
                currentView.close();
            }
            currentView = new DashBoardView();

        });

        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});
