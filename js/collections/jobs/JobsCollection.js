define([
    'jquery',
    'underscore',
    'backbone',
    'models/job/JobModel'
], function ($, _, Backbone, JobModel) {

    var JobsCollection = Backbone.Collection.extend({

        url: 'jobs',

        model: JobModel,

        initialize: function (models, options) {
            this.fetch({success: this.onDataHandler, error: this.onErrorHandler});
        },

        onErrorHandler: function (collection, response, options) {
                alert(response.responseText);
        },

        onDataHandler: function (collection, response, options) {
                // Event here!
                console.log("Trigger event for views to hear?")
        }

    });

    return JobsCollection;
});
