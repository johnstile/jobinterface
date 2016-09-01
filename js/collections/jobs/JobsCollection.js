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
            console.log("init JobsCollection");
        }
    });

    return JobsCollection;
});
