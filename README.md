## Clinet side application to work with jobs and configs

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

### Directory Organization
```.
+-- css
+-- imgs
+-- js
|   +-- main.js           Set requirejs aliases, calls app.js
|   +-- app.js            Loads router
|   +-- router.js         Sets routes, starts Backbone history
|   +-- collections       Collections are made of Models
|   |   +-- configs
|   |   +-- jobs
|   +-- libs              3rd party code 
|   |   +-- backbone
|   |   +-- jquery
|   |   +-- require
|   |   +-- underscore
|   +-- models            Objects should be in Models
|   |   +-- config
|   |   +-- job
|   |   +-- owner
|   +-- views             Views bind Collections or Models, and display using templates
|       +-- configs
|       |   +-- config
|       +-- dashboard
|       +-- jobs
|       +-- sidebar
+-- templates             HTML used to present the Views
|   +-- configs
|   +-- dashboard
|   +-- jobs
|   +-- sidebar
+-- sample_data           Sample data 
|   +--  jobs.json        Sample of colleciton request for /jobs
|   +--  configs.json     Sample of colleciton request for /confs
+-- index.html            Start of load, base anchors for content.
```
### App Loading
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
  
