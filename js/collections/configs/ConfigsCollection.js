define([
    'jquery',
    'underscore',
    'backbone',
    'models/config/ConfigModel'
], function ($, _, Backbone, ConfigModel) {

    var ConfigsCollection = Backbone.Collection.extend({

        model: ConfigModel,

        initialize: function (models, options) {
        },

        url: 'confs'

    });

    return ConfigsCollection;

});
