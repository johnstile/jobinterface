define([
    'jquery',
    'underscore',
    'backbone',
    'poller',
    'views/jobs/JobView',
    'models/dut/DutModel',
    'collections/duts/DutsCollection',
    'text!templates/jobs/jobTemplate.html',
    'jquery.tablesorter.combined'
], function ($, _, Backbone, Poller, JobView, DutModel, DutCollection, jobTemplate) {

    // Enable/disable logging
    var gDebug = true;

    function fLog(rMsg) {
        // If the browser does not have a console, don't print to it
        if (gDebug && window.console) {
            console.log(rMsg);
        }
    }

    var JobView = Backbone.View.extend({

        el: $("#page"),
        events: {},
        initialize: function (options) {
            _.extend(this, _.pick(options, "job_dir"));
            _.extend(this, _.pick(options, "build"));
            _.bindAll(this, 'render');
            that = this;
            // Get the job_dir, pass to collection
            this.options = options;
            this.job_dir = this.options['job_dir'];
            this.build = this.options['build'];

            console.log("init JobView with: ", this.job_dir);
            this.dutCollection = new DutCollection({job_dir: this.job_dir});

            this.dutCollection.fetch().done(function () {
                that.render();
            });
            var options = {
                delay: 3000, // default 1000ms
                delayed: 3000, // run after a delayed (can be true)
                continueOnError: true // do not stop on error event
            };
            this.poller = Poller.get(this.dutCollection, options);
            this.poller.on('success', function (model) {
                console.info('another successful fetch!');
                that.render();
            });
            this.poller.on('complete', function (model) {
                console.info('hurray! we are done!');
            });
            this.poller.on('error', function (model) {
                console.error('oops! something went wrong');
            });
            this.poller.start();
        },
        is_job_running: function () {
            fLog("calling JobView is_job_running()");
            // Test to defeat polling
            var result = this.dutCollection.where({all_iterations_complete:0});
            fLog("result.length:" + result.length);
            if (result.length > 0) {
                fLog("Not all DUTS Complete. Continue Polling");
            } else {
                fLog("All DUTS Complete. Stop Polling");
                this.poller.destroy();
            }
        },
        render: function () {
            fLog("calling JobView render()");

            //$('.menu li').removeClass('active');
            //$('.menu li a[href="' + window.location.hash + '"]').parent().addClass('active');

            fLog("Called JobView.render()");
            fLog(JSON.stringify(this.dutCollection));

            // Test to defeat polling
            this.is_job_running();

            var template = _.template(jobTemplate);
            var compiledTemplate = template({dutCollection: this.dutCollection.models});
            this.$el.html(compiledTemplate);

            // Must add  tablesorter after collection is populated, or else we loose sort.
            $(document).ready(function () {
                $("#jobTable").tablesorter({
                    headers: {
                        1: {sorter: "integer"},
                        2: {sorter: "integer"},
                        3: {sorter: "integer"},
                        4: {sorter: "integer"}
                    }
                });
            });

            // // add the sidebar
            // var sidebarView = new SidebarView();
            // sidebarView.render();

            return this;
        }
    });

    return JobView;
});
