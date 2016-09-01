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

        app_router.on('route:showJobs', function () {

            var jobsView = new JobsView();
        });

        app_router.on('route:showJob', function (job_dir, build) {

            console.log("Show a job_dir:" + job_dir);
            console.log("Show a build:" + build);
            var jobView = new JobView({job_dir: job_dir});
        });

        app_router.on('route:showSchedule', function () {

            var scheduleView = new ScheduleView();
        });

        app_router.on('route:showStations', function () {

            var stationsView = new StationsView();

        });

        app_router.on('route:defaultAction', function (actions) {

            var dashboardView = new DashBoardView();

        });

        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});
