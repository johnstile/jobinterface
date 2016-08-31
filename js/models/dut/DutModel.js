define([
    'underscore',
    'backbone'
], function (_, Backbone) {

    var DutModel = Backbone.Model.extend({
        //urlRoot: 'job/<job_dir>'
    });
    return DutModel;
});