describe("the karma test suite", function() {
	var exec;
	beforeEach(function(){
		exec = require('child_process').exec;
	});
	it("has correct output when running 'grunt karma_test1 --kap-showTiming=false --kap-useColors=false'", function(done) {
		exec('grunt karma_test1 --kap-showTiming=false --kap-useColors=false', function(error, stdout, stderr) {
			expect(stdout).toContain(
				"F\n" +
				"the karma test suite\n" +
				"  is failing when true is expected to be false\n" +
				"    FAILED: Expected true to be false.\n" +
				"      at test/karma_test1.test.js:6:20\n"
			);
			expect(stdout).toContain(
				"F\n" +
				"the karma test suite\n" +
				"  with a nested describe\n" +
				"    is failing when true is expected to be false\n" +
				"      FAILED: Expected true to be false.\n" +
				"        at test/karma_test1.test.js:10:21\n"
			);
			expect(stdout).toContain(
				"P\n" +
				"the karma test suite\n" +
				"  is pending when pending is present\n" +
				"    PENDING\n"
			);
			expect(stdout).toContain(
				"P\n" +
				"the karma test suite\n" +
				"  with a nested describe has a pending\n" +
				"    PENDING\n"
			);
			expect(stdout).toContain(
				"F\n" +
				"the karma test suite\n" +
				"  fails when an error occurs\n" +
				"    FAILED: Error: MockError occurred in test/karma_test1.test.js (line 23)\n" +
				"      at test/karma_test1.test.js:23:40\n"
			);
			expect(stdout).toContain(
				"P\n" +
				"the karma test suite\n" +
				"  pending when disabled with xit\n" +
				"    PENDING\n"
			);

			//~ console.log(JSON.stringify(stdout));
			expect(stdout).toContain("Starting 7 specs\n");
			expect(stdout).toContain('Finished 7 specs, 1 passed, 3 pending, 3 failed');
			expect(stderr).toBe('');
			expect(error).not.toBe(null);
			done();
		});
	});
	it("has correct output when running 'grunt karma_test1 --kap-stackStyle=summary --kap-showTiming=false --kap-useColors=false'", function(done) {
		exec('grunt karma_test1 --kap-stackStyle=summary --kap-showTiming=false --kap-useColors=false', function(error, stdout, stderr) {
			expect(stdout).toContain(
				"F\n" +
				"the karma test suite\n" +
				"  is failing when true is expected to be false\n" +
				"    FAILED: Expected true to be false.\n"
			);
			done();
		});
	});
	it("has correct output when running 'grunt karma_test1 --kap-style=compact --kap-showTiming=false --kap-useColors=false --kap-showTiming=false'", function(done) {
		exec('grunt karma_test1 --kap-style=compact --kap-showTiming=false --kap-useColors=false', function(error, stdout, stderr) {
			//console.log(dump(stdout));
			expect(stdout).toContain(
				"Starting 7 specs\n" +
				"\n" +
				"the karma test suite\n" +
				"  is passing when true is expected to be true\n" +
				"    PASSED\n" +
				"  is failing when true is expected to be false\n" +
				"    FAILED: Expected true to be false.\n" +
				"      at test/karma_test1.test.js:6:20\n" +
				"  with a nested describe\n" +
				"    is failing when true is expected to be false\n" +
				"      FAILED: Expected true to be false.\n" +
				"        at test/karma_test1.test.js:10:21\n" +
				"  is pending when pending is present\n" +
				"    PENDING\n" +
				"  with a nested describe has a pending\n" +
				"    encountered a declaration exception\n" +
				"      PENDING\n" +
				"  fails when an error occurs\n" +
				"    FAILED: Error: MockError occurred in test/karma_test1.test.js (line 23)\n" +
				"      at test/karma_test1.test.js:23:40\n" +
				"  pending when disabled with xit\n" +
				"    PENDING\n" +
				"\n" +
				"Finished 7 specs, 1 passed, 3 pending, 3 failed\n"
			);
			done();
		});
	});
});

function dump(text) {
	return JSON.stringify(text).replace(/\\n/g, "\\n\" +\n\"");
}