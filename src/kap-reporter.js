var colors = require('colors');

module.exports = KapReporter;
KapReporter.karma = KarmaKapReporter;
KarmaKapReporter.$inject = ['baseReporterDecorator', 'formatError', 'config'];

function KarmaKapReporter(baseReporterDecorator, formatError, config) {
	baseReporterDecorator(this);

	var kap, counter, divider, suites, suiteLookup, prevTime;
	this.onBrowserStart = onBrowserStart;
	this.onSpecComplete = onSpecComplete;
	this.onRunComplete = onRunComplete;
	this.onExit = onExit;

	this.onBrowserRegister = noop;
	this.onRunStart = noop;
	this.onBrowserChange = noop;
	this.onBrowserComplete = noop;
	this.onBrowserError = noop;
	this.onBrowserLog = noop;

	initialize();

	function initialize() {
		var regexLoaded = /^\s*loaded@https?:\/\/[^\/]*\//g;
		var regexHost = /https?:\/\/[^\/]*\/base\//g;
		var regexHostStart = /^https?:\/\/[^\/]*\/base\//g;
		var regexNoCache = /\?[a-f0-9]{40}/g;
		counter = 0;
		divider = '_.#~$$~#._';
		suites = 0;
		suiteLookup = {};
		kap = new KapReporter(config.kap);
		kap.cleanStackLine = function(line) {
			if (this.stackStyle === 'default') {
				return line.stack;
			}

			var highlight = true;
			if (regexLoaded.test(line)) highlight = false;
			if (this.stackStyle === 'highlight') {
				if (highlight) {
					var result = this.highlightRegex(line, [regexHostStart, regexNoCache]);
					return result;
				} else {
					return line.stack;
				}
			} else { // 'summary'
				if (highlight) {
					var cleanLine = line
						.replace(regexHostStart, this.indent + 'at ')
						.replace(regexNoCache, '');
					return cleanLine.stackHighlight;
				} else {
					return null;
				}
			}
		}
		kap.cleanMessage = function(message) {
			return message
				.replace(regexHost, '')
				.replace(regexNoCache, '');
		}
	}

	function noop() {}
	function onBrowserStart(browser, info) {
		parseSpecs(info.specs);
		kap.jasmineStarted({
			totalSpecsDefined: info.total,
			message: browser.name
		});
		prevTime = new Date();

		function parseSpecs(specs, prefix) {
			prefix = prefix || '';
			for (var k in specs) {
				if (k !== '_') {
					var id = "suite" + (++suites);
					suiteLookup[prefix + k] = id;
					parseSpecs(specs[k], prefix + k + divider);
				}
			}
		}
	}
	function onSpecComplete(browser, result) {
		var i, key;
		var id = "spec" + ++counter;
		var suiteLen = result.suite.length;

		key = "";
		for (i = 0; i < suiteLen; i++) {
			key += result.suite[i];
			kap.suiteStarted({
				id: suiteLookup[key],
				startTime: prevTime,
				description: result.suite[i]
			});
			key += divider;
		}

		kap.specStarted({
			id: id,
			startTime: prevTime,
			description: result.description,
			status: 'running'
		});
		var failedExpectations = [];
		for (i = 0; i < result.log.length; i++) {
			var lines = result.log[i].split(/\r\n|\n/g);
			var message = lines.shift();
			var stack = lines.join('\n');
			failedExpectations.push({
				message: message,
				stack: stack
			});
		}
		kap.specDone({
			id: id,
			endTime: new Date(),
			description: result.description,
			status: result.skipped ? 'pending' : result.success ? 'passed' : 'failed',
			pendingReason: result.skipped ? null : null,
			failedExpectations: failedExpectations,
			passedExpectations: []
		});
		key = "";
		for (i = 0; i < suiteLen; i++) {
			key += result.suite[i];
			kap.suiteDone({
				id: suiteLookup[key],
				endTime: new Date(),
				description: result.suite[i]
			});
			key += divider;
		}
		prevTime = new Date();
	}
	function onRunComplete() {
		kap.jasmineDone({});
	}
	function onExit(callback) {
		callback();
	}
}

function KapReporter(opt) {
	opt = opt || {};

	// options
	this.indent = '  ';
	this.showId = false;
	this.style = 'dots'; // dots | compact | normal
	this.addSpacing = true;
	this.showPending = true;
	this.showFailed = true;
	this.showPassed = false;
	this.stackStyle = 'summary'; // summary | highlight | default | none
	this.showTiming = true;
	this.passDot = '*';
	this.failDot = 'F';
	this.pendingDot = 'P';
	this.useColors = true;
	this.colors = {
		passed: ['green', 'bold'],
		failed: ['red', 'bold'],
		pending: ['yellow', 'bold'],
		other: ['cyan', 'bold'],
		base: ['reset'],
		stack: ['red'],
		stackHighlight: ['red', 'bold']
	};

	for (var k in opt) {
		if (this.hasOwnProperty(k)) {
			if (opt[k] !== null && opt[k] !== undefined) {
				this[k] = opt[k];
			}
		}
	}

	// initialize
	this.suites = {};
	this.specs = {};
	this.writtenDescription = {};
	this.itemStack = [];
	colors.setTheme(this.colors);
	colors.enabled = this.useColors;
	this.regexBaseDir = new RegExp(escapeRegExp(process.cwd()) + '[\\\\\\/]', 'g');
	function escapeRegExp(str) {
		return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
	}
}

KapReporter.prototype = {
	jasmineStarted: jasmineStarted,
	jasmineDone: jasmineDone,
	suiteStarted: suiteStarted,
	suiteDone: suiteDone,
	specStarted: specStarted,
	specDone: specDone,
	indentation: indentation,
	getItem: getItem,
	write: write,
	writeLine: writeLine,
	writeIndentLine: writeIndentLine,
	writeItem: writeItem,
	writeStack: writeStack,
	writePassedExpectations: writePassedExpectations,
	writeFailedExpectations: writeFailedExpectations,
	writeOutcome: writeOutcome,
	cleanMessage: cleanMessage,
	cleanStack: cleanStack,
	cleanStackLine: cleanStackLine,
	highlightRegex: highlightRegex,
	getDescription: getDescription,
	isDots: function () {return this.style === 'dots'},
	isCompact: function () {return this.style === 'compact'},
	getTimeElapsed: getTimeElapsed
};

function getTimeElapsed(item) {
	if (!this.showTiming) return '';
	return ' (' + (item.endTime.getTime() - item.startTime.getTime()) + 'ms)';
}
function getItem(id) {
	return this.specs[id] || this.suites[id];
}
function jasmineStarted(info) {
	this.startTime = new Date();
	this.writeLine('Starting ' + info.totalSpecsDefined + " specs", 'other');
}
function jasmineDone() {
	this.endTime = new Date();
	if (this.addSpacing) process.stdout.write('\n');
	var specCount = Object.keys(this.specs).length;
	var failedCount = 0;
	var pendingCount = 0;
	for (var k in this.specs) {
		if (this.specs[k].status === 'pending') pendingCount++;
		if (this.specs[k].status === 'failed') failedCount++;
	}

	var passedCount = specCount - failedCount - pendingCount;
	var color = 'other';
	var summary = ('Finished ' + specCount + ' specs');
	if (passedCount) {
		summary += ', ' + passedCount + ' passed';
		color = 'passed';
	}
	if (pendingCount) {
		summary += ', ' + pendingCount + ' pending';
		color = 'pending';
	}
	if (failedCount) {
		summary += ', ' + failedCount + ' failed';
		color = 'failed';
	}

	this.writeLine(summary + this.getTimeElapsed(this), color);
}
function cleanMessage(message){
	return message;
}
function suiteStarted(suite) {
	suite.startTime = suite.startTime || new Date();
	this.suites[suite.id] = suite;
	this.itemStack.push(suite.id);
	this.writeItem(suite);
}
function suiteDone(suite) {
	suite.startTime = this.suites[suite.id].startTime;
	suite.endTime = suite.endTime || new Date();
	this.suites[suite.id] = suite;
	this.writeItem(suite);
	this.itemStack.pop();
}
function specStarted(spec) {
	spec.startTime = spec.startTime || new Date();
	this.specs[spec.id] = spec;
	this.itemStack.push(spec.id);
	this.writeItem(spec);
}
function specDone(spec) {
	spec.startTime = this.specs[spec.id].startTime;
	spec.endTime = spec.endTime || new Date();
	this.specs[spec.id] = spec;
	this.writeItem(spec);
	this.itemStack.pop();
}
function writeFailedExpectations(failedExpectations, color, item) {
	if (!failedExpectations.length) return;
	for (var i = 0; i < failedExpectations.length; i++) {
		this.writeLine('FAILED: ' + this.cleanMessage(failedExpectations[i].message) + this.getTimeElapsed(item), color);
		this.writeStack(failedExpectations[i].stack, color);
	}
}
function writePassedExpectations() {}
function writeStack(stack) {
	if (!stack || this.stackStyle === 'none') return;
	var cleanStack = this.cleanStack(stack);
	if (cleanStack) this.writeLine(cleanStack);
}
function cleanStack(stack) {
	var lines = stack.split(/\r\n|\n/g);
	var cleanLines = [];
	for (var i = 0; i < lines.length; i++) {
		cleanLines.push(this.cleanStackLine(lines[i]));
	}
	return cleanLines
		.join('\n')
		.replace(/\n\n+/g, '\n')
		.replace(/^\n+|\n+$/g, '');
}
function highlightRegex(text, regexs) {
	if (!regexs.length) {
		return text.stackHighlight;
	}
	var cloneRegexs = regexs.slice(0);
	var regex = cloneRegexs.shift();
	var removePart = text.match(regex);
	if (removePart ) {
		var others = text.split(regex);
		var p1 = highlightRegex(others[0], cloneRegexs);
		var p2 = highlightRegex(others[1], cloneRegexs);
		return p1 + removePart[0].stack + p2;
	}
	return text.stackHighlight;
}
function cleanStackLine(line) {
	if (this.stackStyle === 'default') {
		return line.stack;
	}

	var highlight = true;
	if (/node_modules/.test(line)) highlight = false;
	if (/^\s*at /.test(line) && !this.regexBaseDir.test(line)) highlight = false;
	line = line.replace(/^ {4}at /g, this.indent + 'at ');

	if (this.stackStyle === 'highlight') {
		if (highlight) {
			return this.highlightRegex(line, [this.regexBaseDir]);
		}
		return line.stack;
	} else { // 'summary'
		if (highlight) {
			var cleanLine = line.replace(this.regexBaseDir, '');
			return cleanLine.stackHighlight;
		}
		return null;
	}
}
function writeItem(item) {
	var status = item.status || 'running';
	if (this.isDots()) {
		if (status === 'passed') {
			this.write(this.passDot, status);

		}
		if (status === 'failed') {
			this.write(this.failDot, status);
			if (!this.showFailed) return;
		}
		if (status === 'pending') {
			this.write(this.pendingDot, status);
			if (!this.showPending) return;
		}
	}
	if (this.isCompact()) {
		if (!this.writtenDescription[item.id] && this.description !== "encountered a declaration exception") {
			this.writtenDescription[item.id] = item;
			if (this.addSpacing && this.itemStack.length === 1) process.stdout.write('\n');
			this.writeLine(this.getDescription(item));
		}
		this.writeOutcome(item);
	} else {
		if (status === 'passed' && !this.showPassed) return;
		if (status === 'failed' && !this.showFailed) return;
		if (status === 'pending' && !this.showPending) return;
		if (item.status === 'pending' || item.status === 'passed' || item.status === 'failed') {
			if (this.addSpacing || this.isDots()) process.stdout.write('\n');
			for (var i = 0; i < this.itemStack.length - 1; i++) {
				this.writeIndentLine(this.getDescription(this.getItem(this.itemStack[i])), i);
			}
			if (status === 'pending' && item.description === "encountered a declaration exception") {
				this.writeOutcome(item, true);
				if (this.addSpacing && this.isDots()) process.stdout.write('\n');
			} else {
				this.writeLine(this.getDescription(item));
				this.writeOutcome(item);
				if (this.addSpacing && this.isDots()) process.stdout.write('\n');
			}
		}
	}
}
function getDescription(item) {
	var suffix = this.showId ? ' (' + item.id + ')' : '';
	return item.description + suffix;
}
function writeOutcome(item, noIndent) {
	var status = item.status || 'running';
	if (status === 'finished') return;
	if (status === 'running') return;

	if (!noIndent) this.itemStack.push(null);
	if (status === 'pending') {
		this.writeLine('PENDING' +
			(item.pendingReason ? ': ' + item.pendingReason : '') +
			this.getTimeElapsed(item), status);
	} else if (status === 'passed') {
		this.writeLine('PASSED' + this.getTimeElapsed(item), status);
	} else if (status === 'failed') {
		this.writeFailedExpectations(item.failedExpectations, status, item);
		this.writePassedExpectations(item.passedExpectations, status);
	} else {
		this.writeLine(status.toUpperCase(), status);
		this.writeFailedExpectations(item.failedExpectations, status, item);
		this.writePassedExpectations(item.passedExpectations, status);
	}
	if (!noIndent) this.itemStack.pop();
}
function writeLine(text, color) {
	this.writeIndentLine(text, this.itemStack.length - 1, color);
}
function write(text, color) {
	if (color) text = text[color] || text['other'];
	process.stdout.write(text);
}
function writeIndentLine(text, indent, color) {
	var indentedText = this.indentation(indent) + text.replace(/\r\n|\n/g, '\n' + this.indentation(indent));
	if (color) {
		indentedText = indentedText[color] || indentedText['other'];
	} else {
		indentedText = indentedText.base;
	}
	process.stdout.write(indentedText + '\n');
}
function indentation(indent) {
	if (indent < 0) return '';
	return this.indent.repeat(indent);
}