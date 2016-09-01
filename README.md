## Browser application to view, stop, and start test scripts on the server.

### Purpose:
  Web interface to a job controller daemon.

### Attribution:
  Based on tutorial from [Thomas Davis](https://github.com/thomasdavis/backbonetutorials)

### Libraries:

[Requirejs](http://requirejs.org/) : Manage page loading requirements

[Backbone](http://backbonejs.org) : Model View Presenter API

[Underscore](http://underscorejs.org) : Used for HTML templating

[JQuery](https://jquery.com/) : JavaScript library

[tablesorter](http://mottie.github.io/tablesorter/): Table sorting

[Backform.js](https://amiliaapp.github.io/backform/): Handle forms client side.

[backbone.poller.js](https://github.com/uzikilon/backbone-poller): Polling for updates

### Directory Organization
```.
+-- css
+-- imgs
+-- js
|   +-- main.js           Set requirejs aliases, calls app.js
|   +-- app.js            Loads router
|   +-- router.js         Sets routes, starts Backbone history
|   +-- collections       Collections are made of Models
|   |   +-- duts          List of Devices Under Test.
|   |   +-- jobs          List of script instances
|   |   +-- schedules     List of duts to be used in a Job. 
|   |   +-- stations      List of remote power switches
|   |
|   +-- libs              3rd party code 
|   |   +-- backbone
|   |   |   +-- backbone.js         Version 1.3.3
|   |   |   +-- backbone.poller.js  For Polling collection
|   |   |   +-- bbackform.js        For fancy forms
|   |   +-- jquery
|   |   |   +-- jquery-1.12.4.js    Version 1.12.4
|   |   |   +-- jquery.tablesorter.combined.js  For fancy tables
|   |   +-- require
|   |   |   +-- require.js          Version 2.2.0
|   |   +-- underscore
|   |       +-- underscore.js       Version 1.8.3
|   |
|   +-- models            Objects should be in Models
|   |   +-- dut           Device Under Test
|   |   +-- job           A Jenkins build 
|   |   +-- schedule      A set of duts, configs, and remote power switches 
|   |   +-- station       A remote power switch ip and name
|   +-- views             Views bind Collections or Models, and display using templates
|       +-- dashboard     Shows summery. Useless at the moment.
|       +-- jobs          Shows all Jenkins builds
|       +-- schedule      Show form to scheudle a jenkins build
|       +-- stations      Shows the current list of remote power siwtches and their names & ip.
|       +-- sidebar       Not used
+-- templates             HTML used to present the Views
|   +-- dashboard
|   +-- jobs
|   +-- schedule
|   +-- stations
|   +-- sidebar
+-- sample_data           Sample data 
|   +--  jobs.json        Sample of colleciton request for /jobs
|   +--  stations.json    Sample of colleciton request for /stations
+-- index.html            Start of load, base anchors for content.
```
### App Loading
```.
  index.html
    loads master css  (which loads other css files)
    feeds underscore the main.js
  js/main.js
    Sets requirejs aliases to resources
    loads app.js
  js/app.js
    loads router.js
    calls initialize
  js/router.js
    defines initialize (called by app.js)
    setups routes to #/jobs, #/configs, and default $/*actions
    initialize calls Backbone.history.start
  
```
