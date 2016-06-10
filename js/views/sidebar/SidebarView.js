define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/sidebar/sidebarTemplate.html'
], function($, _, Backbone, sidebarTemplate){

  var SidebarView = Backbone.View.extend({
    el: $(".sidebar"),

    render: function(){

      var that = this;

      var backbone_ad = { site_url : "http://www.backbonejs.org" ,
                          image_url : "./imgs/backbone_logo.png",
                          title : "Backbone.js",
                          description: "Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface." };

      var require_ad = {  site_url : "http://www.requirejs.org" ,
                          image_url : "./imgs/require_logo.png",
                          title : "Require.js",
                          description: "RequireJS is a JavaScript file and module loader. It is optimized for in-browser use, but it can be used in other JavaScript environments, like Rhino and Node." };

      var flask_ad = {  site_url : "http://flask.pocoo.org/" ,
                          image_url : "http://flask.pocoo.org/static/badges/flask-powered.png",
                          title : "Flask powered",
                          description: "Flask is a microframework for Python based on Werkzeug, Jinja 2 and good intentions." };

      var data = {
        ads: [backbone_ad, require_ad, flask_ad ]
      };

      var compiledTemplate = _.template( sidebarTemplate, data );
    
      $(".sidebar").append(compiledTemplate);
    }

  });

  return SidebarView;
  
});
