define([
    'underscore',
    'backbone'
], function (_, Backbone) {

    // Enable/disable logging
    var gDebug = true;

    function fLog(rMsg) {
        // If the browser does not have a console, don't print to it
        if (gDebug && window.console) {
            console.log(rMsg);
        }
    }

    var ConsoleLogModel = Backbone.Model.extend({
        url: function () {
            // This calls Flask path /jobconsole/<build_id>
            // first finds the path to <job_dir>
            // second finds the path to the <file>_<serial_number>.txt
            // PATH: /glitchlogs/20160907_122250/hardware_monitor_16230931.txt
            url = 'jobconsole/' + this.build_id;
            fLog("URL: " + url);
            return url;
        },
        // call original Backbone.Model#fetch with `dataType` equal `text` for $.ajax
        fetch: function (options) {
            options = _.extend(options || {}, {
                dataType: 'text'
            });
            this.constructor.__super__.fetch.call(this, options);
        },
        // store response in content attribute
        parse: function (response) {
            return {content: response};
        },
        // // call original Backbone.Model#fetch with `dataType` equal `text` for $.ajax
        // fetch: function (options) {
        //     options = _.extend(options || {}, {
        //         dataType: 'text'
        //     });
        //     this.constructor.__super__.fetch.call(this, options);
        // },
        // store response in content attribute
        // parse: function (response) {
        //     return {content: response};
        // },
        initialize: function (options) {
            this.options = options;
            this.build_id = this.options['build_id'];
        }
    });
    return ConsoleLogModel;
});