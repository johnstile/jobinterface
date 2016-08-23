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

            // This will be called when an item is added. pushed or unshifted
            this.on('add', function (model) {
                console.log('something got added');
            });
            // This will be called when an item is removed, popped or shifted
            this.on('remove', function (model) {
                console.log('something got removed');
            });
            // This will be called when an item is updated
            this.on('change', function (model) {
                console.log('something got changed');
            });
        },

    });

    return StationsCollection;
});
