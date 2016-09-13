// Creates backbone router 
// Loads router.js
define(
    [
        'jquery',
        'underscore',
        'backbone',
        'router', // Request router.js
    ], function ($, _, Backbone, Router) {

        // Patch Model and Collection fetch method.
        // https://tbranyen.com/post/how-to-indicate-backbone-fetch-progress
        // On first fetch, triggers 'fetch' signal one can listenTo()
        _.each(["Model", "Collection"], function (name) {
            // Cache Backbone constructor.
            var ctor = Backbone[name];
            // Cache original fetch.
            var fetch = ctor.prototype.fetch;

            // Override the fetch method to emit a fetch event.
            ctor.prototype.fetch = function () {
                if (typeof this.inital_fetch == "undefined") {
                    console.log("------First fetch-----");
                    this.inital_fetch = true;
                    // Trigger the fetch event on the instance.
                    this.trigger("fetch", this);
                }
                // Pass through to original fetch.
                return fetch.apply(this, arguments);
            };
        });

        var initialize = function () {
            // Pass in our Router module and call it's initialize function
            Router.initialize();
        };

        return {
            initialize: initialize
        };
    });
