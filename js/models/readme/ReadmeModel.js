define([
    'underscore',
    'backbone'
], function (_, Backbone) {

    // Enable/disable logging
    var gDebug = true;

    function fLog(rMsg) {
        // If the browser does not have a console, don't print to it
        if (gDebug && window.console) {
            console.log(rMsg);
        }
    }

    var ReadmeModel = Backbone.Model.extend({
        url: "./README.md",
        // call original Backbone.Model#fetch with `dataType` equal `text` for $.ajax
        fetch: function (options) {
            options = _.extend(options || {}, {
                dataType: 'text'
            });
            this.constructor.__super__.fetch.call(this, options);
        },
        // store response in content attribute
        parse: function (response) {
            return {content: response};
        },
        initialize: function (options) {},
    });
    return ReadmeModel;
});