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

    var LogModel = Backbone.Model.extend({
        url: function () {
            // This calls Flask path /glitchlogs/<job_dir>/<file>_<serial_number>.txt
            // first finds the path to <job_dir>
            // second finds the path to the <file>_<serial_number>.txt
            // PATH: /glitchlogs/20160907_122250/hardware_monitor_16230931.txt
            url = 'glitchlogs/' + this.job_dir + "/" + this.file + "_" + this.serial_number + ".txt";
            fLog("URL: " + url);
            return url;
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
            this.job_dir = this.options['job_dir'];
            this.file = this.options['file'];
            this.serial_number = this.options['serial_number'];
        }
    });
    return LogModel;
});