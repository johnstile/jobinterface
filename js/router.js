// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'collections/jobs/JobsCollection',
    'views/dashboard/DashBoardView',
    'views/jobs/JobsView',
    'views/schedule/ScheduleView',
    'views/stations/StationsView'
], function ($, _, Backbone, JobsCollection, DashBoardView, JobsView, ScheduleView, StationsView) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            // Define some URL routes
            'jobs': 'showJobs',              // All jobs page
            'jobs/:id': 'showJob',           // One job queried by id
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

        app_router.on('route:showJob', function (id) {

            console.log("Show a job:"+id);

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
