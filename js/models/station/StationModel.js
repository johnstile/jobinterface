define([
    'underscore',
    'backbone'
], function (_, Backbone) {

    var StationModel = Backbone.Model.extend({
        urlRoot: 'stations'
    });

    return StationModel;
});
