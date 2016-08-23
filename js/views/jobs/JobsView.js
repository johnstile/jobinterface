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
], function ($, _, Backbone, SidebarView, JobModel, JobsCollection, JobFormView, jobsTemplate) {

    var JobsView = Backbone.View.extend({

        el: $("#page"),
        events: {
            "click #job-new-button": "show_job_form",
            "click .btn-delete-build": "delete_job", // Remove job
            "click .btn-stop-build": "stop_job" // Stop job
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


            var template = _.template(jobsTemplate);
            var compiledTemplate = template(data);
            this.$el.html(compiledTemplate);
            //$("#page").append(compiledTemplate);  // Creates an empty list and full list.

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

            return this;

        },
        show_job_form: function () {
            console.log("show_job_form")
            var jobModel = new JobModel();
            var jobFormView = new JobFormView({model: jobModel});
            jobFormView.render();
        },
        delete_job: function (e) {
            console.log("delete_job");
            that = this;
            var $btn = $(document.activeElement);
            var id = parseInt($btn.attr("data-id"));

            // Must get
            console.log(this.collection);
            console.log("id:", id);

            // Find model in collection with these attributes
            var model = this.collection.findWhere({ id: id });
            console.log(model);
            // Send DELETE
            model.destroy(
                {
                    success: function (model, response) {
                        console.log("Success");
                        //that.collection.remove(model);
                        //that.show_stations();
                        that.render()
                    },
                    error: function (model, response) {
                        console.log("Error");
                    }
                }
            );

            //this.collection
        },
        stop_job: function(e) {
            console.log("stop_job")
            that = this;
            var $btn = $(document.activeElement);
            var id = parseInt($btn.attr("data-id"));

            // Must get
            console.log(this.collection);
            console.log("id:", id);

            // Find model in collection with these attributes
            var model = this.collection.findWhere({ id: id });
            console.log(model);
            model.set({"action": 'stop'});
            // Send PUT
            model.save();
        }
    });

    return JobsView;
});
