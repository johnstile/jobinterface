define([
    'jquery',
    'underscore',
    'backbone',
    'views/sidebar/SidebarView',
    'collections/jobs/JobsCollection',
    'text!templates/dashboard/dashboardTemplate.html'
], function ($, _, Backbone, SidebarView, JobsCollection, dashboardTemplate) {

    var DashBoardView = Backbone.View.extend({
        el: $("#page"),

        render: function () {

            $('.menu li').removeClass('active');
            $('.menu li a[href="#"]').parent().addClass('active');

            this.$el.html(dashboardTemplate);

            var sidebarView = new SidebarView();
            sidebarView.render();

            return this;
        }

    });

    return DashBoardView;

});
