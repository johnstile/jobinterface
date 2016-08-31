/**
 * Created by jstile on 8/25/16.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'models/dut/DutModel'
], function ($, _, Backbone, DutModel) {

    var DutsCollection = Backbone.Collection.extend({

        url : function() {
            // This calls Flask path /job/<job_dir>
            return 'job/' + this.job_dir;
        },

        model: DutModel,

        initialize: function(options) {
            // Get the job_dir
            this.options = options;
            this.job_dir = this.options['job_dir'];
            console.log("init DutCollection with: ", this.job_dir);
            this.fetch({success: this.onDataHandler, error: this.onErrorHandler});
        },

        onErrorHandler: function (collection, response, options) {
                alert(response.responseText);
        },

        onDataHandler: function (collection, response, options) {
                // Event here!
                console.log("Trigger event for views to hear?")
                console.log(collection);
        }

    });

    return DutsCollection;
});
