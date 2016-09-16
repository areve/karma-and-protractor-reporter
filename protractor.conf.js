(function() {
	exports.config = {
		jasmineNodeOpts: {
			print: function() {}
		},
		onPrepare: function() {
			var capabilities = getCapabilities();

			var KapReporter = require('./src/kap-reporter');
			jasmine.getEnv().addReporter(new KapReporter({
				useColors: capabilities['kapUseColors'] !== 'false',
				showTiming: capabilities['kapShowTiming'] !== 'false',
				style: capabilities['kapStyle'],
				stackStyle: capabilities['kapStackStyle']
			}));

			function getCapabilities() {
				var args = {};
				for (var i = 0; i < process.argv.length; i++) {
					if (process.argv[i].indexOf('--capabilities.') === 0) {
						args[process.argv[i].substring('--capabilities.'.length)] = process.argv[i + 1];
						i++;
					}
				}
				return args;
			}
	   }
	};
}());