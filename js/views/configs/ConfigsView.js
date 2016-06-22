define([
    'jquery',
    'underscore',
    'backbone',
    'backform',
    'collections/configs/ConfigsCollection',
    'models/config/ConfigModel',
    'text!templates/configs/configsTemplate.html', 'bootstrap'
], function ($, _, Backbone, Backform, ConfigsCollection, ConfigModel, configsTemplate) {

    //var configsListView;

    var ConfigsView = Backbone.View.extend({

        el: $("#page"),
        events: {
            // using a class
            "click .conf-edit-button": "show_conf_form",
            // using an id
            "click #conf-edit-button": "show_conf_form",
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
                //_: _
            };

            var template = _.template(configsTemplate);
            var compiledTemplate = template(data);
            this.$el.html(compiledTemplate);

            return this;
        },
        show_conf_form: function (e) {
            console.log("calling  show_conf_form");

            // Get clicked model from colleciton
            element = $(e.currentTarget);
            console.log("clicked:", element.attr('id'));
            mymodel = this.collection.get(element.attr('id'));
            if (typeof mymodel == 'undefined') {
                var mymodel = new Backbone.Model({
                    urlRoot: '/confs',
                    id: "new_file.json",
                    conf: {
                        "Netbooter": {
                            "ipv4 address": "192.168.60.189",
                            "off time": 5,
                            "port 1": {
                                "device mac address": "00:1C:AB:00:52:E8",
                                "device ipv6 address": null,
                                "g2 model": 816,
                                "max boot time": 30
                            }
                        },
                        "Parameters": {
                            "network interface": "eth0",
                            "power cycle enabled": true,
                            "generator channels": [1, 2],
                            "pass audio tolerance": 1,
                            "delay input": 0,
                            "never clear meters": true,
                            "debug mode": false,
                            "glitch test enabled": false,
                            "stop on failure": false,
                            "notch filter frequency": 1000,
                            "iterations": 25,
                            "delay output": 0,
                            "delay matrix": 0,
                            "glitch monitor time": 1,
                            "pass audio test enabled": true,
                            "glitch threshold": -90,
                            "signal generator frequency": 1000,
                            "notch filter quality": 10,
                            "test output channels": ["odd", "even"],
                            "pass audio level": -14
                        }
                    }
                });
            }

            var formFields = [
                {name: "id", label: "Id", control: "input"},
                {name: 'conf.Netbooter.ipv4 address', label: "NB IP", control: "input"},
                {name: 'conf.Netbooter.off time', label: "NB off time", control: "input"},
                {name: 'conf.Netbooter.port 1.device mac address', label: "NB port 1 DUT mac", control: "input"},
                {name: 'conf.Netbooter.port 1.device ipv6 address', label: "NB port 1 DUT ipv6", control: "input"},
                {name: 'conf.Netbooter.port 1.g2 model', label: "NB port 1 DUT g2 model", control: "input"},
                {name: 'conf.Netbooter.port 1.max boot time', label: "NB port 1 max boot time", control: "input"},
                {name: 'conf.Parameters.network interface', label: "Param network interface", control: "input"},
                {name: 'conf.Parameters.power cycle enabled', label: "Param power cycle enabled", control: "checkbox"},
                {name: 'conf.Parameters.generator channels', label: "Param generator channels", control: "input"},
                {name: 'conf.Parameters.pass audio tolerance', label: "Param pass audio tolerance", control: "input"},
                {name: 'conf.Parameters.delay input', label: "Param delay input", control: "input"},
                {name: 'conf.Parameters.never clear meters', label: "Param never clear meters", control: "checkbox"},
                {name: 'conf.Parameters.debug mode', label: "Param debug mode", control: "checkbox"},
                {name: 'conf.Parameters.glitch test enabled', label: "Param glitch test enabled", control: "checkbox"},
                {name: 'conf.Parameters.stop on failure', label: "Param stop on failure", control: "checkbox"},
                {
                    name: 'conf.Parameters.notch filter frequency',
                    label: "Param notch filter frequency",
                    control: "input"
                },
                {name: 'conf.Parameters.iterations', label: "Param iterations", control: "input"},
                {name: 'conf.Parameters.delay output', label: "Param delay output", control: "input"},
                {name: 'conf.Parameters.delay matrix', label: "Param delay matrix", control: "input"},
                {name: 'conf.Parameters.glitch monitor time', label: "Param glitch monitor time", control: "input"},
                {
                    name: 'conf.Parameters.pass audio test enabled',
                    label: "Param pass audio test enabled",
                    control: "checkbox"
                },
                {name: 'conf.Parameters.glitch threshold', label: "Param glitch threshold", control: "input"},
                {
                    name: 'conf.Parameters.signal generator frequency',
                    label: "Param signal generator frequency",
                    control: "input"
                },
                {name: 'conf.Parameters.notch filter quality', label: "Param notch filter quality", control: "input"},
                {name: 'conf.Parameters.test output channels', label: "Param test output channels", control: "input"},
                {name: 'conf.Parameters.pass audio level', label: "Param pass audio level", control: "input"},
                {name: 'foobar', id:'foobar', label: 'foobar', control: "button"}

            ];
            // Instantiate the form
            var form = new Backform.bootstrap2({
                el: $("#page"),
                fields: formFields,
                model: mymodel,
                events: {
                    "submit": function (e) {
                        console.log("fooo")
                    },
                }
            });
            form.render();
            form.$el.on("submit", function() {alert("Browser validation passed")});

        }

    });

    return ConfigsView;
})
;
