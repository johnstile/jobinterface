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
            this.logModel = new LogModel({job_dir: this.job_dir, file: this.file, serial_number: this.serial_number});
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
                fLog(model.message);
                fLog(model.responseJSON.error);
            });
            this.poller.start();
        },
        render: function () {
            fLog("Called logView.render()");
            // fLog("-------------");
            // fLog("Straight data");
            // fLog(this.logModel.get('content'));
            //fLog("-------------");
            //fLog("transform data");
            var log_formatted = this.pack_log_into_html(this.logModel.get('content'));
            // fLog(log_formatted);
            // fLog("-------------");
            var template = _.template(logTemplate);
            var compiledTemplate = template(
                {
                    log_formatted: log_formatted,
                    serial_number: this.serial_number,
                    log_file: this.file,
                    build_dir: this.job_dir
                }
            );
            this.$el.html(compiledTemplate);

            this.$el.find('#build_dir').text(this.job_dir);
            this.$el.find('#file').text(this.file);

            return this;
        },
        //---------------------------------------------
        // Function:
        // Purpose:  Format a raw log into html
        // Takes:    text log object
        // Returns:  html log object
        //---------------------------------------------
        pack_log_into_html: function (log_raw) {
            //
            // start the table
            //
            var LogContents = "";
            LogContents = "<table>\n";
            //
            // body of the table
            //
            var log_array = log_raw.split("\n");
            //
            // Print log size
            //
            fLog(log_array.length);
            //
            // Format text into html with color
            //
            for (var k = 0; k < log_array.length; k++) {
                //
                // We have non-empty content
                // Errors:
                //  'snat detected on bus channel 3'
                //  'No input values returned on channel 73 exiting'
                //  'Unable to ping'
                //  'Iteration %s of %s PASS'
                //
                if (( log_array[k].match(/ERROR/) != null)
                    || ( log_array[k].match(/snat detected on bus channel/) != null )
                    || ( log_array[k].match(/snat detected on bus channel/) != null )
                    || ( log_array[k].match(/No input values returned on channel/) != null )
                    || ( log_array[k].match(/Unable to ping/) != null )
                ) {
                    //
                    // Color Operations to be preformed
                    //
                    LogContents = LogContents
                        + "<tr>\n"
                        + "  <td align='left'>\n"
                        + "    <div class='log_line_error'>\n"
                        + log_array[k] + '\n'
                        + "    </div>"
                        + "  </td>\n"
                        + "</tr>\n";
                } else if (log_array[k].match(/CRITICAL/) != null) {
                    //
                    // Color Operations to be preformed
                    //
                    LogContents = LogContents
                        + "<tr>\n"
                        + "  <td align='left'>\n"
                        + "    <div class='log_line_critical'>\n"
                        + log_array[k] + '\n'
                        + "    </div>\n"
                        + "  </td>\n"
                        + "</tr>\n";
                } else if (log_array[k].match(/Iterations: /) != null) {
                    //
                    // Color Operations to be preformed
                    //
                    LogContents = LogContents
                        + "<tr>\n"
                        + "  <td align='left'>\n"
                        + "    <div class='log_line_checkpoint'>\n"
                        + log_array[k] + '\n'
                        + "    </div>\n"
                        + "  </td>\n"
                        + "</tr>\n";
                } else if (log_array[k].match(/WARNING/) != null) {
                    //
                    // Color Operations to be preformed
                    //
                    LogContents = LogContents
                        + "<tr>\n"
                        + "  <td align='left'>\n"
                        + "    <div class='log_line_warning'>\n"
                        + log_array[k] + '\n'
                        + "    </div>\n"
                        + "  </td>\n"
                        + "</tr>\n";
                } else if (log_array[k].match(/INFO/) != null) {
                    //
                    // Color Operations to be preformed
                    //
                    LogContents = LogContents
                        + "<tr>\n"
                        + "  <td align='left'>\n"
                        + "    <div class='log_line_info'>\n"
                        + log_array[k] + '\n'
                        + "    </div>\n"
                        + "  </td>\n"
                        + "</tr>\n";
                } else if (log_array[k].match(/Bus meter \d* has \d* elements/) != null) {
                    //
                    // Color Operations to be preformed
                    //
                    LogContents = LogContents
                        + "<tr>\n"
                        + "  <td align='left'>\n"
                        + "    <b>\n"
                        + "      <font color='magenta'>\n"
                        + log_array[k] + '\n'
                        + "      </font>\n"
                        + "    </b>\n"
                        + "  </td>\n"
                        + "</tr>\n";
                } else {
                    //
                    // All other text just loads as normal
                    //
                    LogContents = LogContents
                        + "<tr>\n"
                        + "  <td align='left'>\n"
                        + log_array[k]
                        + "  </td>\n"
                        + "</tr>\n";
                }
            }
            //
            // close the table
            //
            LogContents = LogContents
                + "</table>\n";
            return LogContents;
        },
        close: function () {
            fLog("calling LogView close()");
            this.remove();
            this.unbind();
            this.poller.destroy();
        }
    });

    return LogView;
});
