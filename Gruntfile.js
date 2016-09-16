module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-protractor-runner');
	grunt.loadNpmTasks('grunt-jasmine-nodejs');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	var kapStyle = grunt.option('kap-style');
	var kapStackStyle = grunt.option('kap-stackStyle');
	var kapUseColors = grunt.option('kap-useColors');
	var kapShowTiming = grunt.option('kap-showTiming');

	grunt.initConfig({
		watch: {
			all: {
				files: ['src/**/*', 'test/**/*', '*.js'],
				tasks: ['default'],
				options: {
					spawn: true,
					atBegin: true
				}
			}
		},
		browserSync: {
			example: {},
			options: {
				src : [
					'test/**/*.html'
				],
				server: {
					baseDir: "test"
				},
				logLevel: "warn",
				open: false,
				notify: false,
				watchTask: true,
				ghostMode: false
			}
		},
		karma: {
			options: {
				frameworks: ['jasmine'],
				reporters: ['kap'],
				plugins: [
					'karma-jasmine',
					'karma-phantomjs-launcher',
					require('./src/karma-and-protractor-reporter') // 'kap' in normal usage use instead
				],
				kap: {
					useColors: kapUseColors + "" !== 'false',
					showTiming: kapShowTiming + "" !== 'false',
					style: kapStyle,
					stackStyle: kapStackStyle
				},
				browsers: ['PhantomJS'],
				singleRun: true,
				port: 9999,
				logLevel: 'WARN',
				concurrency: Infinity,
			},
			karma_test1: { options: { files: [ 'test/karma_test1.test.js'] } }
		},
		eslint: {
			kap: {
				options: {
					configFile: 'eslint-kap.conf.js',
				},
				src: [
					'src/**/*.js'
				]
			},
			jasmine_nodejs: {
				options: {
					configFile: 'eslint-jasmine_nodejs.conf.js',
				},
				src: [
					'test/*.kaptest.js'
				]
			},
			karma: {
				options: {
					configFile: 'eslint-karma.conf.js',
				},
				src: [
					'test/karma*.test.js'
				]
			},
			protractor: {
				options: {
					configFile: 'eslint-protractor.conf.js',
				},
				src: [
					'test/protractor*.spec.js'
				]
			}
		},
		protractor: {
			protractor_test1: {
				options: {
					args: {
						specs: [
							'test/protractor_test1.spec.js'
						]
					}
				}
			},
			protractor_test2: {
				options: {
					args: {
						specs: [
							'test/protractor_test2.spec.js'
						]
					}
				}
			},
			options: {
				webdriverManagerUpdate: false,
				configFile: "protractor.conf.js",
				keepAlive: false,
				noColor: false,
				args: {
					capabilities: {
						"browserName": "phantomjs",
						"phantomjs.binary.path": require("phantomjs").path,
						"phantomjs.ghostdriver.cli.args": ["--loglevel=DEBUG"],
						kapUseColors: kapUseColors + "",
						kapShowTiming: kapShowTiming + "",
						kapStyle: kapStyle,
						kapStackStyle: kapStackStyle
					},
					kap: {
						"foobar": "baz"
					}
				}
			}
		},
		jasmine_nodejs: {
			options: {
				defaultTimeout: 30000,
				specNameSuffix: ".kaptest.js"
			},
			test: {
				specs: 'test/*.kaptest.js'
			}
		}
	});

	grunt.registerTask('default', ['eslint', 'jasmine_nodejs']);
	grunt.registerTask('karma_test1', ['karma:karma_test1']);
	grunt.registerTask('protractor_test1', ['browserSync:example', 'protractor:protractor_test1']);
	grunt.registerTask('protractor_test2', ['browserSync:example', 'protractor:protractor_test2']);
	grunt.registerTask('dev', ['watch']);
};

// commands used by tests
// grunt karma_test1 --kap-style=compact
// grunt karma_test1 --kap-style=dots
// grunt protractor_test1 --kap-style=compact
// grunt protractor_test1 --kap-style=dots

// command used for screenshot
// grunt protractor_test2 --kap-style=dots
