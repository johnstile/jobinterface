define([
    'jquery',
    'underscore',
    'backbone',
    'views/sidebar/SidebarView',
    'models/job/JobModel',
    'collections/jobs/JobsCollection',
    'text!templates/jobs/jobsTemplate.html',
    'jquery.tablesorter.combined'
], function ($, _, Backbone, SidebarView, JobModel, JobsCollection, jobsTemplate) {

    // Enable/disable logging
    var gDebug = true;

    function fLog(rMsg) {
        // If the browser does not have a console, don't print to it
        if (gDebug && window.console) {
            console.log(rMsg);
        }
    }

    var JobsView = Backbone.View.extend({

        el: $("#page"),
        events: {
            "click .btn-delete-build": "delete_job", // Remove job
            "click .btn-stop-build": "stop_job" // Stop job
        },
        initialize: function () {
            fLog("init JobsView");
            fLog("instantiate jobsCollection");
            this.jobsCollection = new JobsCollection();
            fLog("listenTo jobsCollection");
            this.listenTo(this.jobsCollection, "reset change add remove", this.render);
            fLog("fetch jobsCollection");
            this.jobsCollection.fetch();
        },

        render: function () {

            $('.menu li').removeClass('active');
            $('.menu li a[href="' + window.location.hash + '"]').parent().addClass('active');

            fLog(this.jobsCollection);
            var data = {
                jobs: this.jobsCollection.models,
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
        delete_job: function (e) {
            fLog("delete_job");
            that = this;
            var $btn = $(document.activeElement);
            var id = parseInt($btn.attr("data-id"));

            // Must get
            fLog(this.collection);
            fLog("id:", id);

            // Find model in collection with these attributes
            var model = this.jobsCollection.findWhere({id: id});
            fLog(model);
            // Send DELETE
            model.destroy();
        },
        stop_job: function (e) {
            fLog("stop_job")
            that = this;
            var $btn = $(document.activeElement);
            var id = parseInt($btn.attr("data-id"));

            // Must get
            fLog(this.jobsCollection);
            fLog("id:", id);

            // Find model in collection with these attributes
            var model = this.jobsCollection.findWhere({id: id});
            fLog(model);
            model.set({"action": 'stop'});
            // Send PUT
            model.save();
        }
    });
    return JobsView;
});
