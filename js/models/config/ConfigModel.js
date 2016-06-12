define([
    'underscore',
    'backbone',
], function (_, Backbone) {


    var ConfigModel = Backbone.Model.extend({
        url: function () {
            var base = 'confs';
            if (this.isNew()) return base;
            return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
        }
    });
    return ConfigModel;

});
