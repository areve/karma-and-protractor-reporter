describe("the protractor test suite", function() {
	var exec;
	beforeEach(function(){
		exec = require('child_process').exec;
	});
	it("has correct output when running 'grunt protractor_test1 --kap-showTiming=false --kap-useColors=false'", function(done) {
		exec('grunt protractor_test1 --kap-showTiming=false --kap-useColors=false', function(error, stdout, stderr) {

			expect(stdout).toContain(
				"F\n" +
				"the protractor test suite\n" +
				"  is failing when true is expected to be false\n" +
				"    FAILED: Expected true to be false.\n" +
				"    Error: Failed expectation\n" +
				"      at Object.<anonymous> (test\\protractor_test1.spec.js:9:16)\n"
			);

			expect(stdout).toContain(
				"the protractor test suite\n" +
				"  is failing when a function with an error is called\n" +
				"    FAILED: Failed: Some MockError\n" +
				"    Error: Some MockError\n" +
				"      at functionThatWillError (test\\protractor_test1.spec.js:14:10)\n" +
				"      at Object.<anonymous> (test\\protractor_test1.spec.js:12:3)\n" +
				"    From: Task: Run it(\"is failing when a function with an error is called\") in control flow\n" +
				"    From asynchronous test: \n" +
				"    Error\n" +
				"      at Suite.<anonymous> (test\\protractor_test1.spec.js:11:2)\n"
			);

			expect(stdout).toContain(
				"F\n" +
				"the protractor test suite\n" +
				"  with a nested describe\n" +
				"    is failing when true is expected to be false\n" +
				"      FAILED: Expected true to be false.\n" +
				"      Error: Failed expectation\n" +
				"        at Object.<anonymous> (test\\protractor_test1.spec.js:19:17)\n"
			);

			expect(stdout).toContain(
				"F\n" +
				"the protractor test suite\n" +
				"  is pending when pending is present\n" +
				"    FAILED: Failed: => marked PendingIncomplete test\n" +
				"    Error: Failed: => marked PendingIncomplete test\n" +
				"\n" +
				"P\n" +
				"the protractor test suite\n" +
				"  with a nested describe has a pending\n" +
				"    PENDING: Incomplete describe\n"
			);

			expect(stdout).toContain(
				"F\n" +
				"the protractor test suite\n" +
				"  fails when an error occurs\n" +
				"    FAILED: Failed: MockError occurred\n" +
				"    Error: MockError occurred\n" +
				"      at Object.<anonymous> (test\\protractor_test1.spec.js:32:9)\n" +
				"    From: Task: Run it(\"fails when an error occurs\") in control flow\n" +
				"    From asynchronous test: \n" +
				"    Error\n" +
				"      at Suite.<anonymous> (test\\protractor_test1.spec.js:31:2)\n"
			);

			expect(stdout).toContain(
				"P\n" +
				"the protractor test suite\n" +
				"  pending when disabled with xit\n" +
				"    PENDING: Temporarily disabled with xit\n"
			);

			expect(stdout).toContain('Finished 8 specs, 1 passed, 2 pending, 5 failed');
			expect(stdout).toContain("Starting 8 specs\n");
			expect(stderr).toBe('');
			expect(error).not.toBe(null);
			done();
		});
	});

	it("has correct output when running 'grunt protractor_test1 --kap-style=compact --kap-showTiming=false --kap-useColors=false'", function(done) {
		exec('grunt protractor_test1 --kap-style=compact --kap-showTiming=false --kap-useColors=false', function(error, stdout, stderr) {
			expect(stdout).toContain(
				"Starting 8 specs\n" +
				"\n" +
				"the protractor test suite\n" +
				"  is passing when true is expected to be true\n" +
				"    PASSED\n" +
				"  is failing when true is expected to be false\n" +
				"    FAILED: Expected true to be false.\n" +
				"    Error: Failed expectation\n" +
				"      at Object.<anonymous> (test\\protractor_test1.spec.js:9:16)\n" +
				"  is failing when a function with an error is called\n" +
				"    FAILED: Failed: Some MockError\n" +
				"    Error: Some MockError\n" +
				"      at functionThatWillError (test\\protractor_test1.spec.js:14:10)\n" +
				"      at Object.<anonymous> (test\\protractor_test1.spec.js:12:3)\n" +
				"    From: Task: Run it(\"is failing when a function with an error is called\") in control flow\n" +
				"    From asynchronous test: \n" +
				"    Error\n" +
				"      at Suite.<anonymous> (test\\protractor_test1.spec.js:11:2)\n" +
				"  with a nested describe\n" +
				"    is failing when true is expected to be false\n" +
				"      FAILED: Expected true to be false.\n" +
				"      Error: Failed expectation\n" +
				"        at Object.<anonymous> (test\\protractor_test1.spec.js:19:17)\n" +
				"  is pending when pending is present\n" +
				"    FAILED: Failed: => marked PendingIncomplete test\n" +
				"    Error: Failed: => marked PendingIncomplete test\n" +
				"  with a nested describe has a pending\n" +
				"    encountered a declaration exception\n" +
				"      PENDING: Incomplete describe\n" +
				"  fails when an error occurs\n" +
				"    FAILED: Failed: MockError occurred\n" +
				"    Error: MockError occurred\n" +
				"      at Object.<anonymous> (test\\protractor_test1.spec.js:32:9)\n" +
				"    From: Task: Run it(\"fails when an error occurs\") in control flow\n" +
				"    From asynchronous test: \n" +
				"    Error\n" +
				"      at Suite.<anonymous> (test\\protractor_test1.spec.js:31:2)\n" +
				"  pending when disabled with xit\n" +
				"    PENDING: Temporarily disabled with xit\n" +
				"\n" +
				"Finished 8 specs, 1 passed, 2 pending, 5 failed\n"
			);
			done();
		});
	});
});

function dump(text) {
	return JSON.stringify(text).replace(/\\n/g, "\\n\" +\n\"");
}


