(function() {
    'use strict';

    var KapReporter = require('./kap-reporter');
    KapReporter['reporter:kap'] = ['type', KapReporter.karma];
    KapReporter['protractor'] = KapReporter;
    module.exports = KapReporter;
})();
