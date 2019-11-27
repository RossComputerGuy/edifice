const assert = require('assert').ok;
const { DepGraph } = require('dependency-graph');
const EdificeTarget = require('./target.js');
const path = require('path');

class EdificeProject {
	constructor(opts={}) {
		assert(typeof(opts) == 'object', 'argument opts must be an object');
		assert(typeof(opts.name) == 'string', 'property name in opts must be a string');
		assert(typeof(opts.src) == 'string' || typeof(opts.src) == 'undefined', 'property src in opts must be a string or undefined');
		assert(typeof(opts.build) == 'string' || typeof(opts.buld) == 'undefined', 'property build in opts must be a string or undefined');
		assert(typeof(opts.project) == 'object' ? opts.project.constructor.name == 'EdificeProject' : typeof(opts.depends) == 'undefined', 'property project in opts must be an EdificeProject or undefined');

		this.name = opts.name;
		this.parentProject = opts.project;
		this.targets = [];
		this.subprojects = [];
		this.deps = new DepGraph();
		this.dirs = {
			'src': typeof(opts.src) == 'string' ? opts.src : process.cwd()
		};
		this.dirs['build'] = typeof(opts.buildDir) == 'string' ? opts.buildDir : path.join(this.dirs['src'], 'build');
		this.dirs['targetBuild'] = path.join(this.dirs['build'], 'targets');
	}
	hasTarget(name) {
		for (let target of this.targets) {
			if (target.name == name) return true;
		}
		return false;
	}
	getTarget(name) {
		for (let target of this.targets) {
			if (target.name == name) return target;
		}
		return null;
	}
	addTarget(opts) {
		assert(typeof(opts) == 'object', 'arguments opts must be an object');
		assert(typeof(opts.name) == 'string', 'property name in opts must be a string');
		assert(!this.hasTarget(opts.name), `target ${opts.name} already exists`);
		opts.project = this;
		let target = new EdificeTarget(opts);
		this.targets.push(target);
		this.deps.addNode(target.name, target);
		for (let dep of target.depends) {
			this.deps.addDependency(target.name, dep);
		}
		return target;
	}
	isBuilt() {
		// TODO: add subprojects and required targets into targets
		let wasBuilt = this.targets.map(target => target.isBuilt());
		return wasBuilt.length == this.targets.length;
	}
	build() {
		if (!this.isBuilt()) {
			for (let targetName of this.deps.overallOrder()) {
				let target = this.getTarget(targetName);
				if (!target.isBuilt()) target.build();
				// TODO: caching
			}
		}
	}
}
module.exports = EdificeProject;
