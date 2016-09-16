describe("the protractor test suite", function() {
	beforeAll(function() {
		browser.ignoreSynchronization = true;
	});
	it("passing test", function() {
		expect(true).toBe(true);
	});
	it("passing test", function() {
		expect(true).toBe(true);
	});
	it("passing test", function() {
		expect(true).toBe(true);
	});
	it("passing test", function() {
		expect(true).toBe(true);
	});
	it("passing test", function() {
		expect(true).toBe(true);
	});
	describe("with a nested describe", function() {
		it("is failing when a function with an error is called", function() {
		functionThatWillError()
			function functionThatWillError() {
				throw new Error('Some MockError');
			}
		});
	});
	xit("pending when disabled with xit", function() {
		expect(true).toBe(true);
	});
	it("passing test", function() {
		expect(true).toBe(true);
	});
	it("passing test", function() {
		expect(true).toBe(true);
	});
	it("passing test", function() {
		expect(true).toBe(true);
	});
	it("passing test", function() {
		expect(true).toBe(true);
	});
});