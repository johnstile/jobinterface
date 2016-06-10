define([
    'jquery',
    'underscore',
    'backbone',
    'backform',
    'collections/configs/ConfigsCollection',
    'models/config/ConfigModel',
    'text!templates/configs/configsTemplate.html'
], function ($, _, Backbone, Backform, ConfigsCollection, ConfigModel, configsTemplate) {

    //var configsListView;

    var ConfigsView = Backbone.View.extend({

        el: $("#page"),
        events: {
            // using a class
            "click .conf-edit-button": "show_conf_form",
            // using an id
            "click #conf-edit-button": "show_conf_form"
        },
        initialize: function () {

            var that = this;

            var onErrorHandler = function (collection, response, options) {
                alert(response.responseText);
            };

            var onDataHandler = function (collection, response, options) {
                that.render();
            };
            that.collection = new ConfigsCollection([]);
            that.collection.fetch({success: onDataHandler, error: onErrorHandler});
        },

        render: function () {
            // Main Menu
            $('.menu li').removeClass('active');
            $('.menu li a[href="' + window.location.hash + '"]').parent().addClass('active');

            var data = {
                confs: this.collection.models,
                _: _
            };

            // Main View
            var compiledTemplate = _.template(configsTemplate, data);
            this.$el.html(compiledTemplate);
            return this;
        },
        show_conf_form: function (e) {
            console.log("calling  show_conf_form");
            /*
            // Get clicked model from colleciton
            element = $(e.currentTarget);
            console.log("clicked:", element.attr('id'));
            mymodel = this.collection.getByCid(element.attr('id'));
            */

            // TOY PERSON
            var person = new Backbone.Model({
                id: 101,
                firstName: "Annie",
                lastName: "Employee"
            });
            // TOY FIELDS
            var formFields = [{
                name: "id",
                label: "Id",
                control: "uneditable-input"
            }, {
                name: "firstName",
                label: "First Name",
                control: "input"
            }, {
                name: "lastName",
                label: "Last Name",
                control: "input"
            }, {
                name: "submitButton",
                label: "Save to server",
                control: "button"
            }];
            // Instantiate the form
            var form = new Backform.Form({
                el: $("#form"),
                fields: formFields,
                model: person
            });
            // ERROR HERE
            form.render();


            //$("#form").html(form.el);
        }

    });
    return ConfigsView;
});
