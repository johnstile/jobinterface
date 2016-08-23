define([
    'jquery',
    'underscore',
    'backbone',
    'collections/stations/StationsCollection',
    'models/station/StationModel',
    'text!templates/stations/stationsTemplate.html',
    'jquery.tablesorter.combined'
], function ($, _, Backbone, StationsCollection, StationsModel, stationsTemplate) {

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

    var StationsView = Backbone.View.extend({
        el: $("#page"),
        events: {
            // <event-object> <element> : <method to call> passing event-object as arg to method.
            "submit .add_station_form": "add_station", // create StationModel and push to server
            "submit .change_stations_form": "form_submitted", // Determine button that submitted form
            "change this.stationsCollection": "render",
            "click .barcodes_btn": "show_hide_barcodes"
        },
        initialize: function () {
            console.log("init StationsView");
            this.stationsCollection = new StationsCollection();
            //this.stationsCollection.bind('reset', this.addAll );
            this.stationsCollection.on("change", this.render, this);
        },
        render: function () {
            var that = this;

            $('.menu li').removeClass('active');
            $('.menu li a[href="' + window.location.hash + '"]').parent().addClass('active');


            this.stationsCollection.fetch({
                success: function (existing_stations) {
                    that.show_stations(existing_stations);
                },
                error: function () {
                    console.log('error');
                    that.$el.find('#error').html("Error: Can't read list of Stations");
                }
            });
            this.$el.html(stationsTemplate);
            this.show_main();
            return this;
        },
        show_main: function () {
            console.log("Show main layout");
            template = _.template(this.$el.find("#main_layout_template").html());
            var compiledTemplate = template();
            this.$el.find("#page").html(template);
        },
        show_stations: function (s) {
            console.log("Show stations");
            console.log(s);
            template = _.template(this.$el.find("#list-station-form-template").html());
            var compiledTemplate = template(stations = s);
            this.$el.find("#show-stations-area").html(compiledTemplate);

        },
        form_submitted: function (e) {
            //e.preventDefault();
            console.log("Determine action based on which submit button was clicked");

            // REF: http://stackoverflow.com/questions/2066162/how-can-i-get-the-button-that-caused-the-submit-from-the-form-submit-event
            // The clicked button will be the activeElement.
            var $btn = $(document.activeElement);
            console.log("btn id:", $btn.attr("id"));

            // Harvest cid from button name
            var $cid = $btn.attr("id").split(/^.*-/)[1];
            console.log("cid:", $cid);

            // Will be edit/delete/confirm/cancel
            var $choice = $btn.attr("id").split(/-.*/)[0];
            console.log("choice:", $choice);

            // Will be edit or delete
            var $action = $btn.attr("value");
            console.log("action:", $action);

            // Course of action
            if ($btn.attr("id").match(/del-/g)) {
                this.delete_station(e);

            } else if ($btn.attr("id").match(/edit-/g)) {
                this.edit_station(e);

            } else if ($btn.attr("id").match(/cancel-/g)) {
                this.cancel_station(e);

            } else if ($btn.attr("id").match(/confirm-/g)) {
                this.confirm_station(e);

            }
            return false;
        },
        delete_station: function (e) {
            e.preventDefault();
            console.log("Delete Station");

            var $btn = $(document.activeElement);
            console.log($btn.attr("id"));

            // Harvest cid from button name
            var $cid = $btn.attr("id").split(/del-/)[1];
            console.log($cid);

            var $action = $btn.attr("value");

            // Confirm
            this.change_buttons_to_confirm_cancel($cid, $action);

        },
        edit_station: function (e) {
            e.preventDefault();
            console.log("Edit Station");

            var $btn = $(document.activeElement);
            console.log($btn.attr("id"));

            var $cid = $btn.attr("id").split(/edit-/)[1];
            console.log($cid);

            this.$el.find("#alias-" + $cid).attr('readonly', false);
            this.$el.find("#ip-" + $cid).attr('readonly', false);

            var $action = $btn.attr("value");

            // Confirm
            this.change_buttons_to_confirm_cancel($cid, $action);
        },
        cancel_station: function (e) {
            e.preventDefault();
            console.log("Cancel Station");

            var $btn = $(document.activeElement);
            console.log($btn.attr("id"));

            var $cid = $btn.attr("id").split(/cancel-/)[1];
            console.log($cid);

            // At this point they have confirmed an action
            var $action = $btn.attr("value");
            console.log("Action:", $action)

            // Reset the buttons
            this.change_buttons_to_delete_edit($cid);

            // Reset the collection
            this.stationsCollection.reset();

        },
        confirm_station: function (e) {
            e.preventDefault();
            console.log("Confirm Station");

            var $btn = $(document.activeElement);
            console.log($btn.attr("id"));

            // Harvest cid from button name
            var $cid = $btn.attr("id").split(/confirm-/)[1];
            console.log($cid);

            // At this point they have confirmed an action
            var $action = $btn.attr("value");
            console.log("Action:", $action)

            if ($action == 'edit') {
                this.edit_station_for_real(e);
            }

            if ($action == 'del') {
                this.delete_station_for_real($cid);
            }

        },
        edit_station_for_real: function (e) {
            e.preventDefault();
            console.log("Edit Station For Real:");

            // To hold list of modified models
            var mod_list = [];

            // Get form data
            form_data = $(e.currentTarget).serializeObject();
            //console.log(form_data);

            // Look for changed data
            for (var i = 0; i < form_data['alias'].length; i++) {
                var changed = false;

                // Get model from collection (id is the only element they cant change)
                mod = this.stationsCollection.findWhere({id: form_data['id'][i]});
                //console.log(mod);
                if (mod != null) {
                    // Look for a changes
                    if (mod.get('ip') !== form_data['ip'][i]) {
                        console.log("ip change: ", mod.get('ip'), " !== ", form_data['ip'][i]);
                        changed = true;
                    }
                    if (mod.get('alias') !== form_data['alias'][i]) {
                        console.log("alias change: ", mod.get('alias'), " !== ", form_data['alias'][i]);
                        changed = true;
                    }
                    if (changed == true) {
                        mod.set({'ip': form_data['ip'][i], 'alias': form_data['alias'][i]});
                        // Save one model at a time
                        mod.save();
                        // Collect changes in list for smart save
                        //mod_list.push(mod);
                    }
                }
            }
            // Switch the button back to normal
            var $btn = $(document.activeElement);
            console.log($btn.attr("id"));

            // Harvest cid from button name
            var $cid = $btn.attr("id").split(/confirm-/)[1];
            console.log($cid);
            this.change_buttons_to_delete_edit($cid);

        },
        delete_station_for_real: function (cid) {
            console.log("Delete Station For Real");
            that = this;
            var model = this.stationsCollection.get(cid);
            model.destroy(
                {
                    success: function (model, response) {
                        console.log("Success");
                        //that.stationsCollection.remove(model);
                        //that.show_stations();
                        that.render()
                    },
                    error: function (model, response) {
                        console.log("Error");
                    }
                }
            );
        },
        change_buttons_to_confirm_cancel: function (cid, action) {

            // Change button to confirm and cancel
            this.$el.find("#del-" + cid).attr('id', 'confirm-' + cid).attr('value', action).removeClass('delete_station_btn').addClass('confirm_station_btn').html("Confirm");
            this.$el.find("#edit-" + cid).attr('id', 'cancel-' + cid).attr('value', action).removeClass('edit_station_btn').addClass('cancel_station_btn').html("Cancel");
            // Set background
            this.$el.find("#" + cid).css('background-color', 'gray');
            // Disable Add
            this.$el.find("#add_station_btn").attr('disabled', 'true');
            this.$el.find("#ip-new").attr('disabled', 'true');
            this.$el.find("#alias-new").attr('disabled', 'true');
            // Show action
            this.$el.find("#action-" + cid).html(action).css('color', 'red').css('font-weight', 'bold');

        },
        change_buttons_to_delete_edit: function (cid) {
            // Change buttons to delete and edit
            this.$el.find("#confirm-" + cid).attr('id', 'del-' + cid).attr('value', 'del').removeClass('confirm_station_btn').addClass('delete_station_btn').html("Del");
            this.$el.find("#cancel-" + cid).attr('id', 'edit-' + cid).attr('value', 'edit').removeClass('cancel_station_btn').addClass('edit_station_btn').html("Edit");
            // Set background color
            this.$el.find("#" + cid).css('background-color', 'white');
            // Disable field edit for existing
            this.$el.find("#alias-" + cid).attr('readonly', true);
            this.$el.find("#ip-" + cid).attr('readonly', true);
            // Enable Add
            this.$el.find("#add_station_btn").attr('disabled', false);
            this.$el.find("#ip-new").attr('disabled', false);
            this.$el.find("#alias-new").attr('disabled', false);
            // Show action
            this.$el.find("#action-" + cid).html('').css('color', 'white');
        },
        add_station: function (e) {
            e.preventDefault();
            console.log("Add Station");
            // Get form data
            form_data = $(e.currentTarget).serializeObject();
            // Do not allow empty fields
            if ((form_data['alias'] === "") || (form_data['ip'] === "")) {
                alert("fields can't be empty!");
                return;
            }
            // No duplicates alias
            if (this.stationsCollection.find(function (model) {
                    return model.get('alias') === form_data['alias'];
                })) {
                alert("No duplicate aliases");
                return;
            }
            // No duplicate ip
            if (this.stationsCollection.find(function (model) {
                    return model.get('ip') === form_data['ip'];
                })) {
                alert("No duplicate station IDs");
                return;
            }
            // Crate a new model from form data
            var new_station = new StationsModel({'alias': form_data['alias'], 'ip': form_data['ip']});
            // POST to server
            this.stationsCollection.create(new_station);
        },
        show_hide_barcodes: function (e) {
            e.preventDefault();
            console.log("Show Barcodes");
            that = this;

            var btn = $(e.currentTarget);

            if (btn.attr("data-function") === 'show_barcodes') {
                // Get list station ports, and populate the drop down option
                this.station_ports = [];
                $.get(
                    'stationsports',
                    {},
                    function (station_ports) {
                        template = _.template(that.$el.find("#port_barcode_template").html());
                        var compiledTemplate = template(ports = station_ports);
                        that.$el.find("#page").html(compiledTemplate);
                    }
                );
                btn.text("Hide Barcodes").attr('data-function', 'hide_barcodes');
            } else if (btn.attr("data-function") === 'hide_barcodes') {
                btn.attr("data-function", "Show_barcodes").text('Show Barcodes');
                that.show_stations(this.stationsCollection);
                this.render();
            }
        }
    });
    return StationsView;
});

