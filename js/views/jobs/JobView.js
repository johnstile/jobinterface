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

            fLog("init with JobView:" + this.job_dir + ", Build:" + this.build);
            fLog("instantiate dutCollection");
            this.dutCollection = new DutCollection({job_dir: this.job_dir});
            fLog("listenTo dutCollection");
            this.listenTo(this.dutCollection, "reset change add remove", this.render);
            // Custom signal after patching fetch prototype, to show loading
            this.listenTo(this.jobsCollection, "fetch", function () {
                var template = _.template($('#loading').html());
                var compiledTemplate = template();
                this.$el.html(compiledTemplate);
                // icon http://ajaxload.info type:Squares Circle, Background:#A3D1FA, Transparent
            });

            // Poller handles fetch only, this.listenTo above handles render
            var options = {
                delay: 3000, // default 1000ms
                delayed: 0, // run after a delayed (can be true)
                continueOnError: false // do not stop on error event
            };
            this.poller = Poller.get(this.dutCollection, options);
            this.listenTo(this.poller, 'success', function (model) {
                console.info('another successful fetch!');
                // Check if complete
                that.is_job_running();
            });
            this.listenTo(this.poller, 'complete', function (model) {
                console.info('hurray! we are done!');
            });
            this.listenTo(this.poller, 'error', function (model, response) {
                fLog('oops! something went wrong');
                fLog(response.responseJSON.error);
                alert(response.responseJSON.error);
            });
            this.poller.start();
        },
        is_job_running: function () {
            fLog("calling JobView is_job_running()");
            // Test to defeat polling
            var result = this.dutCollection.where({all_iterations_complete: 0});
            fLog("result.length:" + result.length);
            if (result.length > 0) {
                fLog("Not all DUTS Complete. Continue Polling");
            } else {
                fLog("All DUTS Complete. Stop Polling");
                this.poller.destroy();
            }
        },
        render: function () {
            fLog("Called JobView.render()");
            fLog(JSON.stringify(this.dutCollection));

            var template = _.template(jobTemplate);
            var compiledTemplate = template({
                dutCollection: this.dutCollection.models,
                job_dir: this.job_dir,
                build_number: this.build
            });

            this.$el.html(compiledTemplate);

            // Must add  table sorter after collection is populated, or else we loose sort.
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

            //this.$el.find('#build_dir').text(this.job_dir);
            this.$el.find('#build_number').text(this.build);
            // // add the sidebar
            // var sidebarView = new SidebarView();
            // sidebarView.render();

            return this;
        },
        close: function () {
            fLog("calling JobView close()");
            this.remove();
            this.unbind();
            this.poller.destroy();
        }
    });

    return JobView;
});
