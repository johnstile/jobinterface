define([
    'underscore',
    'backbone',
], function (_, Backbone) {

    var ConfigModel = Backbone.Model.extend({
        schema: {
            title: {
                type: 'Select',
                options: ['', 'Mr', 'Mrs', 'Ms']
            },
            name: 'Text',
            email: {
                validators: ['required', 'email']
            },
            birthday: 'Date',
            password: 'Password',
            notes: {
                type: 'List',
                listType: 'Text'
            }
        }
    });

    return ConfigModel;

});
