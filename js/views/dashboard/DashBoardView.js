define([
    'jquery',
    'underscore',
    'backbone',
    'views/sidebar/SidebarView',
    'collections/jobs/JobsCollection',
    'text!templates/dashboard/dashboardTemplate.html'
], function ($, _, Backbone, SidebarView, JobsCollection, dashboardTemplate) {

    // Enable/disable logging
    var gDebug = true;

    function fLog(rMsg) {
        // If the browser does not have a console, don't print to it
        if (gDebug && window.console) {
            console.log(rMsg);
        }
    }

    var DashBoardView = Backbone.View.extend({
        el: $("#page"),
        initialize: function () {
            console.log("init DashBoardView");
            this.render();
        },
        render: function () {

            $('.menu li').removeClass('active');
            $('.menu li a[href="#"]').parent().addClass('active');

            this.$el.html(dashboardTemplate);
            var sidebarView = new SidebarView();
            sidebarView.render();
            return this;
        },
        close: function () {
            fLog("calling DashBoardView close()");
            //this.remove();
            this.unbind();
        }
    });

    return DashBoardView;
});
