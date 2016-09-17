define([
    'jquery',
    'underscore',
    'backbone',
    'models/readme/ReadmeModel',
    'text!templates/readme/readmeTemplate.html',
], function ($, _, Backbone, ReadmeModel, readmeTemplate, strapdown) {

    // Enable/disable logging
    var gDebug = true;

    function fLog(rMsg) {
        // If the browser does not have a console, don't print to it
        if (gDebug && window.console) {
            console.log(rMsg);
        }
    }

    var ReadmeView = Backbone.View.extend({
        el: $("#page"),
        events: {},
        initialize: function () {
            fLog("init ReadmeView");
            that = this;
            fLog("instantiate readmeModel");
            this.readmeModel = new ReadmeModel();
            this.listenTo(this.readmeModel, 'change', this.render);
            this.readmeModel.fetch();
        },
        render: function () {
            var that = this;
            fLog("ReadmeView render()");
            // $('.menu li').removeClass('active');
            // $('.menu li a[href="' + window.location.hash + '"]').parent().addClass('active');

            this.$el.html(readmeTemplate);

            template = _.template(this.$el.find("#readme_container").html());
            var compiledTemplate = template( content = this.readmeModel.get('content'));
            this.$el.find("#page").html(compiledTemplate);

            // This is supposed to apply strap down to an element of a page.
            //this.$el.find("#page").strapdown(this.$el.find("#page"));

            return this;

        },
        close: function () {
            fLog("calling StationsView close()");
            this.remove();
            this.unbind();
        }
    });
    return ReadmeView;
});
