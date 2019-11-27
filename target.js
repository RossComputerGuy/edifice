const assert = require('assert').ok;
const EdificeProject = require('./project.js');
const fs = require('fs');
const path = require('path');

class EdificeTarget {
	constructor(opts) {
		assert(typeof(opts) == 'object', 'arguments opts must be an object');
		assert(typeof(opts.name) == 'string', 'property name in opts must be a string');
		assert(typeof(opts.depends) == 'object' ? Array.isArray(opts.depends) : typeof(opts.depends) == 'undefined', 'property depends in opts must be undefined or an array');
		assert(typeof(opts.outputs) == 'object' ? Array.isArray(opts.outputs) : typeof(opts.outputs) == 'undefined', 'property outputs in opts must be undefined or an array');
		assert(typeof(opts.sources) == 'object' ? Array.isArray(opts.sources) : typeof(opts.sources) == 'undefined', 'property sources in opts must be undefined or an array');
		assert(typeof(opts.project) == 'object' ? opts.project.constructor.name == 'EdificeProject' : typeof(opts.depends) == 'undefined', 'property project in opts must be an EdificeProject or undefined');

		this.name = opts.name;
		this.depends = opts.depends || [];
		this.outputs = opts.outputs || [];
		this.sources = opts.sources || [];
		this.project = opts.project;
	}
	isBuilt() {
		if (this.outputs.length == 0) return false;
		let builtOutputs = this.outputs.map((output) => fs.existsSync(path.join(typeof(this.project) == 'undefined' ? 'build' : this.project.dirs['targetBuild'], this.name, output)))
			.filter((v) => v == true);
		return buildOutputs.length == this.outputs.length;
	}
	build() {
		if (!this.isBuilt()) {
			// TODO: build me!
		}
	}
}
module.exports = EdificeTarget;
