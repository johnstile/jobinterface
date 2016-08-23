define([
    'underscore',
    'backbone'
], function (_, Backbone) {

    var JobModel = Backbone.Model.extend({
        urlRoot: 'jobs'
    });

    return JobModel;

});
