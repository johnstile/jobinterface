// Filename: views/jobs/list
define([
    'jquery',
    'underscore',
    'backbone',
    'models/job/JobModel',
    'text!templates/jobs/jobsListTemplate.html'

], function ($, _, Backbone, JobModel, jobsListTemplate) {
    var JobFormView = Backbone.View.extend({
        el: $("#jobs-list"),
        events: {
            "click #job-start": "start_job"
            //"click .button-down": "tranistionDown",
        },
        render: function () {
            mystuff = "<form>" +
                "<table border='1'>" +
                "<tr><td>Station:<INPUT TYPE=string name='station'></td></tr>" +
                "<tr><td>DUT SN:<INPUT TYPE=string name='serialno'></td></tr>" +
                "<tr><td><INPUT TYPE=submit value='Go' name='job-start'></td></tr>" +
                "</table>"
            "</form>";
            console.log(mystuff);
            $("#jobs-list").html(mystuff);

            return this;
        },
        start_job: function (opts) {
            console.log('Starting job');

        }
    });
    return JobFormView;
});
