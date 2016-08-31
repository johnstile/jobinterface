// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'collections/jobs/JobsCollection',
    'views/dashboard/DashBoardView',
    'views/jobs/JobsView',
    'views/jobs/JobView',
    'views/schedule/ScheduleView',
    'views/stations/StationsView'
], function ($, _, Backbone, JobsCollection, DashBoardView, JobsView, JobView, ScheduleView, StationsView) {

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
        $.jobsCollection = new JobsCollection([]);

        var app_router = new AppRouter;

        app_router.on('route:showJobs', function () {

            var jobsView = new JobsView();
            jobsView.render();

        });

        app_router.on('route:showJob', function (job_dir,build) {

            console.log("Show a job_dir:"+job_dir);
            console.log("Show a build:"+build);
            var jobView = new JobView({job_dir:job_dir});
        });

        app_router.on('route:showSchedule', function () {

            var scheduleView = new ScheduleView();
            scheduleView.render();

        });

        app_router.on('route:showStations', function () {

            var stationsView = new StationsView();
            stationsView.render();

        });

        app_router.on('route:defaultAction', function (actions) {

            // We have no matching route, lets display the dashboard page
            var dashboardView = new DashBoardView();
            dashboardView.render();
        });

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});
