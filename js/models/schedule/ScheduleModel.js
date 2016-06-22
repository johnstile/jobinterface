define([
    'underscore',
    'backbone'
], function (_, Backbone) {

    var ScheduleModel = Backbone.Model.extend({

        defaults: {
            sn: "Scan Chassis",
            station: "Scan Station"
        }

    });

    return ScheduleModel;

});
