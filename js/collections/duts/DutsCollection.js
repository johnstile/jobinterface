/**
 * Created by jstile on 8/25/16.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'models/dut/DutModel'
], function ($, _, Backbone, DutModel) {

    // Enable/disable logging
    var gDebug = true;

    function fLog(rMsg) {
        // If the browser does not have a console, don't print to it
        if (gDebug && window.console) {
            console.log(rMsg);
        }
    }

    var DutsCollection = Backbone.Collection.extend({
        url: function () {
            // This calls Flask path /job/<job_dir>
            return 'job/' + this.job_dir;
        },
        model: DutModel,
        initialize: function (options) {
            // Get the job_dir
            this.options = options;
            this.job_dir = this.options['job_dir'];
            fLog("init DutCollection with: ", this.job_dir);
        }
    });

    return DutsCollection;
});
