define([
    'jquery',
    'underscore',
    'backbone',
    'poller',
    'views/sidebar/SidebarView',
    'models/job/JobModel',
    'collections/jobs/JobsCollection',
    'text!templates/jobs/jobsTemplate.html',
    'jquery.tablesorter.combined'
], function ($, _, Backbone, Poller, SidebarView, JobModel, JobsCollection, jobsTemplate) {

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
            "click .btn-stop-build": "stop_job", // Stop job
            "click .btn-toggle-jobs": "toggle_jobs" // Show full or reduced job list
        },
        initialize: function () {
            fLog("init JobsView");
            // When false, only show 10 jobs
            this.show_all_jobs = false;
            // make this a function so I can easily re-call if show_n_jobs changes
            this.instantiate_poller();
        },
        instantiate_poller: function () {
            fLog("instantiate jobsCollection");
            this.jobsCollection = new JobsCollection();
            fLog("listenTo jobsCollection");
            this.listenTo(this.jobsCollection, "reset change add remove", this.render);
            // Custom signal after patching fetch prototype, to show loading
            this.listenTo(this.jobsCollection, "fetch", function () {
                var template = _.template( $('#loading').html() );
                var compiledTemplate = template();
                this.$el.html(compiledTemplate);
                // icon http://ajaxload.info type:Squares Circle, Background:#A3D1FA, Transparent
            });
            // Set data argument to fetch.  e.g. ?show_n_jobs=n
            if (this.show_all_jobs) {
                show_n_jobs = {};  // ?show_n_jobs=null
                this.btn_toggle_jobs_label = "Show 5";
            } else {
                show_n_jobs = {show_n_jobs: 5}; // ?show_n_jobs=n
                this.btn_toggle_jobs_label ="Show All";
            }
            // Poller handles fetch only, this.listenTo above handles render
            var options = {
                delay: 3000, // default 1000ms
                delayed: 0, // run after a delayed (can be true)
                continueOnError: true, // do not stop on error event
                data: show_n_jobs // Fetch option ?show_n_jobs=n
            };
            this.poller = Poller.get(this.jobsCollection, options);
            this.listenTo(this.poller, 'success', function (model) {
                fLog('another successful fetch!');
                // Check if complete
                //that.is_job_running();
            });
            this.listenTo(this.poller, 'complete', function (model) {
                fLog('hurray! we are done!');
            });
            this.listenTo(this.poller, 'error', function (model) {
                fLog('oops! something went wrong');
            });
            this.poller.start();
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
            $('.btn-toggle-jobs').text(this.btn_toggle_jobs_label);

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
            fLog("id:" + id);

            // Find model in collection with these attributes
            var model = this.jobsCollection.findWhere({id: id});

            fLog(model);
            model.set({"action": 'stop'});
            // Send PUT
            model.save();
        },
        toggle_jobs: function () {
            fLog("Toggle show all jobs");
            // Toggle the flag
            this.show_all_jobs = !this.show_all_jobs;

            // Must call this or else the old jobs remain
            this.jobsCollection.remove();

            // Recreate poller
            this.poller.destroy();

            // Start new poller, uses this.show_all_jobs
            this.instantiate_poller();
        },
        close: function () {
            fLog("calling JobsView close()");
            //this.remove();
            this.unbind();
            this.poller.destroy();
            this.jobsCollection.unbind();
        }
    });
    return JobsView;
});
