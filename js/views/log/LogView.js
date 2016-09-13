define([
    'jquery',
    'underscore',
    'backbone',
    'poller',
    'models/log/LogModel',
    'text!templates/log/logTemplate.html'
], function ($, _, Backbone, Poller, LogModel, logTemplate) {

    // Enable/disable logging
    var gDebug = true;

    function fLog(rMsg) {
        // If the browser does not have a console, don't print to it
        if (gDebug && window.console) {
            console.log(rMsg);
        }
    }

    var LogView = Backbone.View.extend({

        el: $("#page"),
        events: {},
        initialize: function (options) {
            _.extend(this, _.pick(options, "job_dir"));
            _.extend(this, _.pick(options, "file"));
            _.extend(this, _.pick(options, "serial_number"));
            _.bindAll(this, 'render');
            that = this;

            // Get the job_dir, pass to collection
            this.options = options;
            this.job_dir = this.options['job_dir'];
            this.file = this.options['file'];
            this.serial_number = this.options['serial_number'];

            fLog("init LogView: with job_dir:" + this.job_dir + ", file:" + this.file + ", serial_number:" + this.serial_number);
            fLog("instantiate LogModel");
            this.logModel = new LogModel({job_dir: this.job_dir, file: this.file, serial_number:this.serial_number});
            fLog("listenTo logModel");
            this.listenTo(this.logModel, "reset change add remove", this.render);
            // Custom signal after patching fetch prototype, to show loading
            this.listenTo(this.logModel, "fetch", function () {
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
            this.poller = Poller.get(this.logModel, options);
            this.listenTo(this.poller, 'success', function (model) {
                console.info('another successful fetch!');
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
        render: function () {
            fLog("Called logView.render()");
            fLog(JSON.stringify(this.logModel));
            fLog(this.logModel);
            var template = _.template(logTemplate);
            var compiledTemplate = template({logModel: this.logModel});
            this.$el.html(compiledTemplate);

            this.$el.find('#build_dir').text(this.job_dir);
            this.$el.find('#file').text(this.file);

            return this;
        },

        close: function () {
            fLog("calling LogView close()");
            //this.remove();
            this.unbind();
            this.poller.destroy();
        }
    });

    return LogView;
});