define([
    'jquery',
    'underscore',
    'backbone',
    'backform'
], function ($, _, Backbone, Backform) {

    var generate_my_form = function(el, model, fields) {
        return new Backform.Form({
            el: $(el),
            model: model,
            fields: fields, // Will get converted to a collection of Backbone.Field models
            events: {
                "submit": function(e) {
                    e.preventDefault();
                    this.model.save()
                    .done(function(result) {
                        alert("Successful!");
                    })
                    .fail(function(error) {
                        alert(error);
                    });
                    return false;
                }
            }
        });
    };
    // returns a function for creating the generic form
    return generate_my_form;

});