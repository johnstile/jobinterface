define([
    'jquery',
    'underscore',
    'backbone',
    'collections/schedules/SchedulesCollection',
    'models/schedule/ScheduleModel',
    'models/job/JobModel',
    'text!templates/schedule/scheduleTemplate.html',
    'jquery.tablesorter.combined'
], function ($, _, Backbone, ScheduleCollection, ScheduleModel, JobModel, scheduleTemplate) {

    // Converts form submission to json object
    // REF: https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/videos/beginner
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    var ScheduleView = Backbone.View.extend({
        el: $("#page"),
        events: {
            // <event-object> <element> : <method to call> passing event-object as arg to method.
            "click .btn-delete-dut": "delete_dut", // Remove dut from collection
            "change #config-selector": "update_form", // Drop down list of config options
            "submit .schedule_job_form": "form_submitted", // Determine button that submitted form
            "change #fileInput": "upload_config" // Upload ad-hoc config file
        },
        initialize: function () {
            that = this;
            // Holds form data (sn and station)
            this.dutCollection = new ScheduleCollection();
            // Type of tests. 2 static options, one just uploads complete config file.
            this.config_types = {
                "environmental_chamber": "Environmental Chamber",
                "glitch_rack": "Glitch Rack",
                "upload_config": "Upload your config"
            };
            this.config_choice = null;
            // Get list station ports, and populate the drop down option
            this.station_ports = [];
            $.get(
                'stationsports',
                {},
                function (station_ports) {
                    that.station_ports = station_ports;
                }
            );
        },
        render: function () {
            $('.menu li').removeClass('active');
            $('.menu li a[href="' + window.location.hash + '"]').parent().addClass('active');

            this.$el.html(scheduleTemplate);
            this.show_main();
            this.show_config_choices();
            this.show_controls();
            return this;
        },
        show_main: function () {
            console.log("Show main layout");
            template = _.template(this.$el.find("#main_layout_template").html());
            var compiledTemplate = template();
            this.$el.find("#page").html(compiledTemplate);
        },
        show_controls: function () {
            console.log("Draw form buttons");

            // If at least DUT, show Start button
            if (this.dutCollection.length > 0) {
                template_start_btn = _.template(this.$el.find("#start-btn-template").html());
                this.$el.find("#controls").append(template_start_btn);
            }

        },
        show_config_choices: function () {
            console.log("Draw drop-down dialog of test options");
            template = _.template(this.$el.find("#config_select_template").html());
            var compiledTemplate = template(config_types = this.config_types);
            this.$el.find("#config-type-selector-area").html(compiledTemplate);
        },
        update_form: function (e) {
            // Config selection determine if they upload a file or scan devices
            this.config_choice = e.currentTarget.value;
            if ((this.config_choice == 'environmental_chamber')
                || (this.config_choice == 'glitch_rack')
            ) {
                this.show_add_dut_form();
            } else if (this.config_choice == 'upload_config') {
                this.show_file_upload_form();
            } else {
                console.log("Not found:" + this.config_choice);
            }
        },
        show_add_dut_form: function () {
            console.log("Show Add Form");
            // Show input fields for Serial Number and Station
            template = _.template(this.$el.find("#add-form-template").html());
            var compiledTemplate = template(duts = this.dutCollection);
            this.$el.find("#config-options-area").html(compiledTemplate);
            // Populate Station data with drop down list showing stations
            template = _.template($("#port_select_template").html());
            compiledTemplate = template(ports = this.station_ports);
            $(".port_selector").html(compiledTemplate);

            // Add Start button if at least one unit is present.
            this.show_controls()

        },
        form_submitted: function (e) {
            e.preventDefault();
            console.log("Determine action based on which submit button was clicked");

            console.log("Find id of submit button clicked:");
            // REF: http://stackoverflow.com/questions/2066162/how-can-i-get-the-button-that-caused-the-submit-from-the-form-submit-event
            // The clicked button will be the activeElement.
            var $btn = $(document.activeElement);
            //FOR DEBUGGING THIS WAS HELPFUL
            //if (
            //    /* there is an activeElement at all */
            //    $btn.length &&
            //    /* it's a child of the form */
            //    $(e.currentTarget).has($btn) &&
            //    /* it's really a submit element */
            //    $btn.is('button[type="submit"], input[type="submit"], input[type="image"]') &&
            //    /* it has a "name" attribute */
            //    $btn.is('[name]')
            //) {
            //    console.log("Seems, that this element was clicked:", $btn);
            //    /* access $btn.attr("name") and $btn.val() for data */
            //    console.log($btn.attr("value"));
            //    console.log($btn.attr("id"));
            //}

            // Course of action
            if ($btn.attr("id") == 'add_dut_btn') {
                this.add_dut(e);
            } else if ($btn.attr("id") == 'start_test_btn') {
                this.start_test(e);
            }

            return false;
        },
        add_dut: function (e) {
            e.preventDefault();
            console.log("Add clicked");

            // Get form data
            form_data = $(e.currentTarget).serializeObject();

            // Do not allow no selection
            if (!('station' in form_data) || !('sn' in form_data)) {
                alert("Serial Number and Station can not be empty!");
                return;
            }

            // Do not allow empty fields
            if ((form_data['sn'] === "") || (form_data['station'] === "")) {
                alert("fiels can't be empty!");
                return;
            }
            // No duplicate serial numbers
            if (this.dutCollection.find(function (model) {
                    return model.get('sn') === form_data['sn'];
                })) {
                alert("No duplicate serial numbers");
                return;
            }
            // No duplicate station ids
            if (this.dutCollection.find(function (model) {
                    return model.get('station') === form_data['station'];
                })) {
                alert("No duplicate station IDs");
                return;
            }
            // Crate a new model from form data
            var new_dut = new ScheduleModel(form_data);

            // Append to collection
            this.dutCollection.add(new_dut);

            //// HAD TO DEBUG THE DATA TYPE
            //if (this.dutCollection instanceof Backbone.Collection) {
            //    console.log("yay");
            //} else if (this.dutCollection instanceof Backbone.Model) {
            //    console.log("boo");
            //}

            this.show_add_dut_form();

        },
        delete_dut: function (e) {
            e.preventDefault();
            console.log("Delete clicked");
            sn = e.currentTarget['id'];
            console.log(sn);
            dut = this.dutCollection.where({'sn': sn});
            console.log(dut);
            this.dutCollection.remove(dut);
            console.log(this.dutCollection);
            this.show_add_dut_form();
            return false;
        },
        start_test: function (e) {
            e.preventDefault();
            console.log("Start Test Clicked");            // Get form data
            //console.log(this.dutCollection);
            //console.log(this.config_choice);
            //console.log("New Model");
            var new_job = new JobModel({duts: this.dutCollection, conf: this.config_choice});
            //console.log("Post to server");
            $.jobsCollection.create(new_job, {
                error : function(model, response){
                    //console.log(response);
                    alert(response.status);
                },
                success: function(model, response){
                    //console.log(response);
                    alert(response.status);
                }
            });
            this.render()

        },
        show_file_upload_form: function () {
            console.log("show upload form");
            template = _.template(this.$el.find("#upload-form-template").html());
            var compiledTemplate = template(duts = this.dutCollection);
            this.$el.find("#config-options-area").html(compiledTemplate);

        },
        upload_config: function () {
            var upload_config_file = $('input[name="fileInput"]')[0].files[0];
            console.log(upload_config_file);

            f_name = upload_config_file.name;
            f_size = upload_config_file.size;
            f_type = upload_config_file.type;
            console.log("name:" + f_name);
            console.log("size:" + f_size);
            console.log("type:" + f_type);

            var fd = new FormData();
            fd.append('file', upload_config_file);

            // For a ad-hoc job we upload a file.
            // This is not very backbone like.
            $.ajax({
                url: 'jobs', //+ this.model.get('upload_config_file data: data,
                //cache: false,
                contentType: false,
                processData: false,
                data: fd,
                type: 'POST',
                success: function (fd) {
                    //$('#loadingModal').modal('hide');
                    alert("Job Started");
                },
                error: function (fd) {
                    alert('Failed');
                    //$('#loadingModal').modal('hide');
                }
            });

        },

    });
    return ScheduleView;
});

