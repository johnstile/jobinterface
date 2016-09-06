// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'poller',
    'collections/jobs/JobsCollection',
    'views/dashboard/DashBoardView',
    'views/jobs/JobsView',
    'views/jobs/JobView',
    'views/schedule/ScheduleView',
    'views/stations/StationsView'
], function ($, _, Backbone, Poller, JobsCollection, DashBoardView, JobsView, JobView, ScheduleView, StationsView) {

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
            'jobs/:job_dir/:build': 'showJob',           // One job queried by id
            'schedule': 'showSchedule',
            'stations': 'showStations',
            // Default
            '*actions': 'defaultAction'
        }
    });

    var initialize = function () {

        // Collections to share across views
        //$.jobsCollection = new JobsCollection([]);

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
            currentView = new JobView({job_dir: job_dir});
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
