define([
    'jquery',
    'underscore',
    'backbone',
    'require',
    'text!templates/sidebar/sidebarTemplate.html'
], function ($, _, Backbone, require, sidebarTemplate) {

    var SidebarView = Backbone.View.extend({
        el: $(".sidebar"),

        render: function () {

            var that = this;

            var require_ad = {
                site_url: "http://www.requirejs.org",
                image_url: "./imgs/require_logo.png",
                title: "Require.js "+requirejs.version,
                description: "RequireJS is a JavaScript file and module loader. It is optimized for in-browser use, but it can be used in other JavaScript environments, like Rhino and Node."
            };

            var backbone_ad = {
                site_url: "http://www.backbonejs.org",
                image_url: "./imgs/backbone_logo.png",
                title: "Backbone.js "+ Backbone.VERSION,
                description: "Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface."
            };

            var underscore_ad = {
                site_url: "http://underscorejs.org/",
                image_url: "./imgs/underscore.png",
                title: "Underscore.js "+ _.VERSION,
                description: "Underscore.js Templating library"
            };

            var jquery_ad = {
                site_url: "https://jquery.com/",
                image_url: "./imgs/jquery-icon.png",
                title: "Jquery "+ $().jquery,
                description: "Jquery.js is a cross-platform JavaScript library designed to simplify the client-side scripting of HTML"
            };

            var flask_ad = {
                site_url: "http://flask.pocoo.org/",
                image_url: "http://flask.pocoo.org/static/badges/flask-powered.png",
                title: "Flask powered",
                description: "Flask is a microframework for Python based on Werkzeug, Jinja 2 and good intentions."
            };

            var data = {
                ads: [require_ad, backbone_ad, underscore_ad, jquery_ad, flask_ad]
            };

            var template = _.template(sidebarTemplate);
            var compiledTemplate =template(data);
            $(".sidebar").append(compiledTemplate); // this works
            //$.el.append(compiledTemplate); // Err: Uncaught TypeError: Cannot read property 'append' of undefined
            //this.$el.append(compiledTemplate); // No error, doesn't work
            //this.$el.html(compiledTemplate); // No error. doesn't work.

            return this;
        }

    });

    return SidebarView;

});
