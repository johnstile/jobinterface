define([
    'jquery',
    'underscore',
    'backbone',
    'models/schedule/ScheduleModel'
], function ($, _, Backbone, ScheduleModel) {

    var SchedulesCollection = Backbone.Collection.extend({
        url: 'jobs',
        model: ScheduleModel
    });

    return SchedulesCollection;
});