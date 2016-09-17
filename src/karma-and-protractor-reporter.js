(function() {
    'use strict';

    var KapReporter = require('./kap-reporter');

    module.exports = {
        'reporter:kap': ['type', KapReporter.karma],
        KapReporter: KapReporter
    };
})();
