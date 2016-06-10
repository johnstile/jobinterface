define([
    'jquery',
    'underscore',
    'backbone',
    'views/sidebar/SidebarView',
    'models/job/JobModel',
    'collections/jobs/JobsCollection',
    'views/jobs/JobFormView',
    'text!templates/jobs/jobsTemplate.html',
    'jquery.tablesorter.combined'
], function ($, _, Backbone, SidebarView, JobModel, JobsCollection, JobFormView,jobsTemplate) {

    var JobsView = Backbone.View.extend({

        el: $("#page"),
        events: {
            "click #job-new-button": "show_job_form"
            //"click .button-down": "tranistionDown",
        },
        initialize: function () {

            var that = this;

            var onErrorHandler = function (collection, response, options) {
                alert(response.responseText);
            };

            var onDataHandler = function (collection, response, options) {
                that.render();
            };

            that.collection = $.jobsCollection;
            that.collection.fetch({success: onDataHandler, error: onErrorHandler});


        },

        render: function () {

            $('.menu li').removeClass('active');
            $('.menu li a[href="' + window.location.hash + '"]').parent().addClass('active');

            console.log(this.collection);
            var data = {
                jobs: this.collection.models,
                _: _
            };

            var compiledTemplate = _.template(jobsTemplate, data);
            this.$el.html(compiledTemplate);

            // Must add  tablesorter after collection is populated, or else we loose sort.
            $(document).ready(function () {
                $("#jobsTable").tablesorter({
                    headers: {
                        2: {sorter: "bool"},
                        1: {sorter: "integer"},
                        5: {sorter: "integer"},
                        6: {sorter: "string"}
                    }
                });
            });

            // add the sidebar
            var sidebarView = new SidebarView();
            sidebarView.render();

        },
        show_job_form: function () {
            console.log("foo")
            var jobModel = new JobModel();
            var jobFormView = new JobFormView({ model: jobModel});
            jobFormView.render();
        }
    });

    return JobsView;
});
