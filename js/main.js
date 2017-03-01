/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Example of Require.js boostrap javascript
 */
requirejs.config({
  // Path mappings for the logical module names
  paths: 
 //injector:mainReleasePaths
  {
    'knockout': 'libs/knockout/knockout-3.4.0',
    'jquery': 'libs/jquery/jquery-3.1.0.min',
    'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.0.min',
    'promise': 'libs/es6-promise/es6-promise.min',
    'hammerjs': 'libs/hammer/hammer-2.0.8.min',
    'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.0.min',
    'ojs': 'libs/oj/v2.0.2/debug',
    'ojL10n': 'libs/oj/v2.0.2/ojL10n',
    'ojtranslations': 'libs/oj/v2.0.2/resources',
    'signals': 'libs/js-signals/signals.min',
    'text': 'libs/require/text',
    'service': 'ajax/ajaxCalls'
  }
  //endinjector
  ,
  // Shim configurations for modules that do not expose AMD
  shim: {
    'jquery': {
      exports: ['jQuery', '$']
    }
  }

});

require(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout','ojs/ojrouter',
  'ojs/ojmodule', 'ojs/ojoffcanvas', 'ojs/ojnavigationlist', 'ojs/ojarraytabledatasource','ojs/ojcomponents','ojs/ojinputnumber',
         'ojs/ojchart','ojs/ojselectcombobox'],
  function (oj, ko, $) { // this callback gets executed when all required modules are loaded
    var router = oj.Router.rootInstance;
    router.configure({
      'SchedulerMain': {label: 'SchedulerMain', isDefault: true}
    });

    function RootViewModel() {
      var self = this;
      self.router = router;
    }
    
    oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
    oj.Router.sync().then(
      function () {
        ko.applyBindings(new RootViewModel(), document.getElementById('globalBody'));
      },
      function (error) {
        oj.Logger.error('Error in root start: ' + error.message);
      }
    );
  }
);
