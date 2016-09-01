define([
    'jquery',
    'underscore',
    'backbone',
    'models/schedule/ScheduleModel'
], function ($, _, Backbone, StationModel) {

    var StationsCollection = Backbone.Collection.extend({
        url: 'stations',
        model: StationModel,
        initialize: function () {
            this.listenTo(this.model, 'add', function (model) {
                console.log('something got added');
            });
            this.listenTo(this.model, 'remote', function (model) {
                console.log('something got removed');
            });
            this.listenTo(this.model, 'change', function (model) {
                console.log('something got changed');
            });
        }
    });

    return StationsCollection;
});
