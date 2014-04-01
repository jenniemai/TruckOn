# Truck-on SF Food Truck App
# Author Jennie Nguyen
#3/30/14

===== Overview =====

This application provides information on SF Food Truck locations and data. 
It uses the SF Food Truck Schedule Information at SF Data.  You can view the information
in map or list format. 

  == Map View ==
      -- Food Trucks are shown as markers on the map, and are clustered when there are 3 or more near each other.
      -- You can filter the markers on the map by using the Search Box on the Header. In Map View,
          the view is only updated after you move away from the searchbox (on blur). This was decided for
          performance reasons. 

      == Details List == 
        - At the bottom, below the Map, is the list of currently visible trucks on the map.

        You can:
        -- Sort the list
        -- click on a row which will highlight the marker on the map
        -- drag around the map and the list will automatically update in real time. 

    The Map view uses Google Maps to visualize the food truck data. It uses the AngularJS 
    Google Maps directive API for the map, markers, and clustering. The InfoWindow was done using
    Google Maps V3 API directly. I had some issues with performance but more investigation is 
    needed to determine the cause.

  == List View == 
        -- You can type into the searchbox and the list will automatically update realtime. 
        -- Sort the list by clicking on the column headers. 

  == Graphics ==
        -- This app is meant for private use, the icons for the 1) header, 2) marker, and 3) business images are for
           demonstration and are not owned or created by me, thus shouldn't be used before verifying permissions.


=====  Dependencies  =====

  == Node.js, Express, AngularJS, MongoDB, JQuery, Underscore (used by Google Maps Directives)

  == Google Maps, Google Maps Directives

  == DataSF (but you can just use the Mock JSON)

  ## Testing Dependencies

  == Karma, E2E
  == Jasmine

===== Running Truck-On  ======

  1) run 'npm install' to make sure you have all the dependencies

  2) Go to file: server/config.js to configure your server:
 
  IS_UPDATE_FOODTRUCK_LIST = true;  --> set this to true on the first time to populate the DB. The DB will not add duplicates, so 
  subsequent updates will only add new entries. Note that the code is currently reading from JSON although I have code to read from 
  the SODA Web API. The Web API is not a full list and is not reliable. However, you could potentially add a better data source and 
  use this config to regularly check for new data. 

  //Set your mongo connection and port
  DB_CONNECTION = "mongodb://localhost:27017/TruckOn"; 
  SERVER_PORT = 3000;

  2) in foodtruck/, run node: 
      > node server.js

  3) go to localhost:3000/

  NOTE: DB config - MongoSkin has a known issue with EventEmitters (errors are shown when data is retrieved), 
  but does not affect the running of the app. 

  NOTE2: I did not have a chance to incorporate more filtering for schedule data. The data is currently a composite of FoodTruck object.
  It may make sense to make Schedules a collection to do querying on it. 

===== Unit Tests  ======

** Note: Section below is from Angular for information on running tests in Angular, both Unit and E2E. 
## Running unit tests

* start `scripts/test.sh` (on windows: `scripts\test.bat`)
  * a browser will start and connect to the Karma server (Chrome is default browser, others can be captured by loading the same url as the one in Chrome or by changing the `config/karma.conf.js` file)
* to run or re-run tests just change any of your source or test javascript files

### End to end (E2E) testing

Angular ships with a baked-in end-to-end test runner that understands angular, your app and allows
you to write your tests with jasmine-like BDD syntax.

Requires a webserver, node.js + `./scripts/web-server.js` or your backend server that hosts the angular static files.

Check out the
[end-to-end runner's documentation](http://docs.angularjs.org/guide/dev_guide.e2e-testing) for more
info.

* Install the Karma ng-scenario adapter with `npm install -g karma-ng-scenario`
* create your end-to-end tests in `test/e2e/scenarios.js`
* serve your project directory with your http/backend server or node.js + `scripts/web-server.js`
* to run do one of:
  * open `http://localhost:port/test/e2e/runner.html` in your browser
  * run the tests from console with [Karma](http://karma-runner.github.io) via
    `scripts/e2e-test.sh` or `script/e2e-test.bat`


==== Application Directory Layout  ==== 

    server/             --> server files
      data/             --> JSON files that were not available via web
    server.js           --> Node server
    models/             --> Data Models
    services/           --> service files
       dbUtilServices   --> APIs to access DB
       webEndPoints     --> Web Service APIs            
    app/                --> all of the files to be used in production
      css/              --> css files
        styles.css         --> default stylesheet
      img/              --> image files
      index.html        --> app layout file 
      js/               --> javascript files
        app.js          --> application
        controllers.js  --> application controller
        directives.js   --> application directives
        filters.js      --> custom angular filters
        services.js     --> custom angular services
      lib/              --> angular and 3rd party javascript libraries

      partials/         --> partial html templates
        list.html       --> list view
        map.html        --> map view

    config/karma.conf.js        --> config file for running unit tests with Karma
    config/karma-e2e.conf.js    --> config file for running e2e tests with Karma

    scripts/            --> handy shell/js/ruby scripts
      e2e-test.sh       --> runs end-to-end tests with Karma (*nix)
      e2e-test.bat      --> runs end-to-end tests with Karma (windows)
      test.bat          --> autotests unit tests with Karma (windows)
      test.sh           --> autotests unit tests with Karma (*nix)
      web-server.js     --> simple development webserver based on node.js

    test/               --> test source files and libraries
      e2e/              -->
        runner.html     --> end-to-end test runner (open in your browser to run)
        scenarios.js    --> end-to-end specs
      lib/
        angular/                --> angular testing libraries
      unit/                     --> unit level specs/tests
        controllersSpec.js      --> specs for controllers
        directivessSpec.js      --> specs for directives
        filtersSpec.js          --> specs for filters
        servicesSpec.js         --> specs for services

##Links
                NodeJS  [nodejs.org/‎]
             AngularJS  [angularjs.org/‎]
Google Maps Directives  [http://angular-google-maps.org/]
    Google Maps V3 API  [https://developers.google.com/maps/documentation/javascript/]
              MongoDB   [https://www.mongodb.org]
                JQuery  [jquery.com/‎]
             ExpressJS  [expressjs.com/‎]
                 Karma  [karma-runner.github.io/‎]
               Jasmine  [http://jasmine.github.io/]

