(function() {
    'use strict';
    var KarmaKapReporter = require('./kap-reporter').karma;
    module.exports = {
      'reporter:kap': ['type', KarmaKapReporter]
    };
})();
