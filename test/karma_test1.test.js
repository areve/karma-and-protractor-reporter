describe("the karma test suite", function() {
	it("is passing when true is expected to be true", function() {
		expect(true).toBe(true);
	});
	it("is failing when true is expected to be false", function() {
		expect(true).toBe(false);
	});
	describe("with a nested describe", function() {
		it("is failing when true is expected to be false", function() {
			expect(true).toBe(false);
		});
	});
	it("is pending when pending is present", function() {
		pending("Incomplete test");
	});
	describe("with a nested describe has a pending", function() {
		pending("Incomplete describe");
		it("is failing when true is expected to be false", function() {
			expect(true).toBe(false);
		});
	});
	it("fails when an error occurs", function() {
		throw new Error("MockError occurred");
	});
	xit("pending when disabled with xit", function() {
		expect(true).toBe(true);
	});
});

