'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

function noop() {}

function assign(tar, src) {
	for (var k in src) {
		tar[k] = src[k];
	}return tar;
}

function assignTrue(tar, src) {
	for (var k in src) {
		tar[k] = 1;
	}return tar;
}

function addLoc(element, file, line, column, char) {
	element.__svelte_meta = {
		loc: { file: file, line: line, column: column, char: char }
	};
}

function run(fn) {
	fn();
}

function append(target, node) {
	target.appendChild(node);
}

function insert(target, node, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function reinsertChildren(parent, target) {
	while (parent.firstChild) {
		target.appendChild(parent.firstChild);
	}
}

function reinsertBefore(after, target) {
	var parent = after.parentNode;
	while (parent.firstChild !== after) {
		target.appendChild(parent.firstChild);
	}
}

function createFragment() {
	return document.createDocumentFragment();
}

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function createComment() {
	return document.createComment('');
}

function addListener(node, event, handler, options) {
	node.addEventListener(event, handler, options);
}

function removeListener(node, event, handler, options) {
	node.removeEventListener(event, handler, options);
}

function setData(text, data) {
	text.data = '' + data;
}

function toggleClass(element, name, toggle) {
	element.classList.toggle(name, !!toggle);
}

function blankObject() {
	return Object.create(null);
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = noop;

	this._fragment.d(detach !== false);
	this._fragment = null;
	this._state = {};
}

function destroyDev(detach) {
	destroy.call(this, detach);
	this.destroy = function () {
		console.warn('Component was already destroyed');
	};
}

function _differs(a, b) {
	return a != a ? b == b : a !== b || a && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' || typeof a === 'function';
}

function fire(eventName, data) {
	var handlers = eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		var handler = handlers[i];

		if (!handler.__calling) {
			try {
				handler.__calling = true;
				handler.call(this, data);
			} finally {
				handler.__calling = false;
			}
		}
	}
}

function flush(component) {
	component._lock = true;
	callAll(component._beforecreate);
	callAll(component._oncreate);
	callAll(component._aftercreate);
	component._lock = false;
}

function get$1() {
	return this._state;
}

function init(component, options) {
	component._handlers = blankObject();
	component._slots = blankObject();
	component._bind = options._bind;
	component._staged = {};

	component.options = options;
	component.root = options.root || component;
	component.store = options.store || component.root.store;

	if (!options.root) {
		component._beforecreate = [];
		component._oncreate = [];
		component._aftercreate = [];
	}
}

function on(eventName, handler) {
	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function cancel() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set$1(newState) {
	this._set(assign({}, newState));
	if (this.root._lock) return;
	flush(this.root);
}

function _set(newState) {
	var oldState = this._state,
	    changed = {},
	    dirty = false;

	newState = assign(this._staged, newState);
	this._staged = {};

	for (var key in newState) {
		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign(assign({}, oldState), newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		this.fire("state", { changed: changed, current: this._state, previous: oldState });
		this._fragment.p(changed, this._state);
		this.fire("update", { changed: changed, current: this._state, previous: oldState });
	}
}

function _stage(newState) {
	assign(this._staged, newState);
}

function setDev(newState) {
	if ((typeof newState === 'undefined' ? 'undefined' : _typeof(newState)) !== 'object') {
		throw new Error(this._debugName + '.set was called without an object of data key-values to update.');
	}

	this._checkReadOnly(newState);
	set$1.call(this, newState);
}

function callAll(fns) {
	while (fns && fns.length) {
		fns.shift()();
	}
}

function _mount(target, anchor) {
	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

var protoDev = {
	destroy: destroyDev,
	get: get$1,
	fire: fire,
	on: on,
	set: setDev,
	_recompute: noop,
	_set: _set,
	_stage: _stage,
	_mount: _mount,
	_differs: _differs
};

/* src\HSlider.html generated by Svelte v2.15.0 */

var TIMEOUT = 70;
function isRange(_ref) {
	var low = _ref.low;

	return !isNaN(parseFloat(low));
}

function hasTooltip(_ref2) {
	var tooltip = _ref2.tooltip;

	switch (typeof tooltip === 'undefined' ? 'undefined' : _typeof(tooltip)) {
		case 'boolean':
			return tooltip;
		case 'string':
			return tooltip.toLowerCase() === 'true';
		default:
			return false;
	}
}

function data() {
	return {
		min: 0,
		max: 0,
		low: NaN,
		high: 0,
		step: 0,
		tooltip: false
	};
}
var methods = {
	start: function start(e, target) {
		e.stopPropagation();
		this._moving = true;

		var _get = this.get(),
		    low = _get.low,
		    high = _get.high,
		    hasTooltip = _get.hasTooltip;

		this._startX = e.x;
		this._target = target;
		switch (target) {
			case 'left':
				this._start = parseFloat(low);
				if (hasTooltip) {
					this.refs.leftTick.style.display = 'block';
				}
				break;
			case 'right':
				this._start = parseFloat(high);
				if (hasTooltip) {
					this.refs.rightTick.style.display = 'block';
				}
				break;
			default:
				break;
		}
	},
	move: function move(e) {
		var _this = this;

		if (this._moving) {
			setTimeout(function () {
				e.stopPropagation();

				var _get2 = _this.get(),
				    min = _get2.min,
				    max = _get2.max,
				    low = _get2.low,
				    high = _get2.high,
				    step = _get2.step,
				    orientation = _get2.orientation;

				var a = parseFloat(min);
				var z = parseFloat(max);
				var s = parseFloat(step);
				var d = (e.x - _this._startX) * _this._ratio;
				if (s > 0) {
					d = Math.floor(d / s) * s;
				}
				var x = _this._start + d;
				switch (_this._target) {
					case 'left':
						var hi = parseFloat(high);
						if (!isNaN(a) && !isNaN(hi) && a <= x && x <= hi) {
							_this.set({ low: x });
						}
						break;
					case 'right':
						var lo = parseFloat(low);
						if (!isNaN(z) && (!isNaN(lo) && lo <= x && x <= z || isNaN(lo) && !isNaN(a) && a <= x && x <= z)) {
							_this.set({ high: x });
						}
						break;
					default:
						break;
				}
			}, TIMEOUT);
		}
	},
	stop: function stop(e) {
		this._moving = false;

		var _get3 = this.get(),
		    isRange = _get3.isRange,
		    hasTooltip = _get3.hasTooltip;

		if (hasTooltip) {
			if (isRange) {
				this.refs.leftTick.style.display = 'none';
			}
			this.refs.rightTick.style.display = 'none';
		}
		this._target = null;
	},
	_getRatio: function _getRatio(min, max, size) {
		var a = parseFloat(min);
		var z = parseFloat(max);
		if (!isNaN(a) && !isNaN(z)) {
			var _refs$bar$getBounding = this.refs.bar.getBoundingClientRect(),
			    width = _refs$bar$getBounding.width,
			    height = _refs$bar$getBounding.height;

			return (z - a) / (width - size);
		} else {
			return NaN;
		}
	},
	_updateDom: function _updateDom(min, max, low, high, size, ratio) {
		var a = parseFloat(min);
		var z = parseFloat(max);
		var lo = parseFloat(low);
		var hi = parseFloat(high);
		if (!isNaN(a) && !isNaN(z) && !isNaN(hi) && a <= hi && hi <= z) {
			this.refs.range.style.width = Math.round((!isNaN(lo) && a <= lo && lo <= hi ? hi - lo : hi) / ratio + size) + 'px';
			if (!isNaN(lo) && a <= lo && lo <= hi) {
				this.refs.range.style.left = Math.round(lo / ratio) + 'px';
			}
		}
	}
};

function oncreate() {
	var _get4 = this.get(),
	    min = _get4.min,
	    max = _get4.max,
	    low = _get4.low,
	    high = _get4.high,
	    orientation = _get4.orientation,
	    isRange = _get4.isRange;

	var _refs$right$getBoundi = this.refs.right.getBoundingClientRect(),
	    width = _refs$right$getBoundi.width,
	    height = _refs$right$getBoundi.height;

	this._size = isRange ? 2 * width : width;
	this._ratio = this._getRatio(min, max, this._size);
	this._updateDom(min, max, low, high, this._size, this._ratio);
}
function onupdate(_ref3) {
	var changed = _ref3.changed,
	    current = _ref3.current,
	    previous = _ref3.previous;

	if (changed.low) {
		var lo = parseFloat(current.low);
		if (!isNaN(lo)) {
			var _get5 = this.get(),
			    min = _get5.min,
			    max = _get5.max,
			    high = _get5.high;

			this._updateDom(min, max, lo, high, this._size, this._ratio);
		}
	}
	if (changed.high) {
		var hi = parseFloat(current.high);
		if (!isNaN(hi)) {
			var _get6 = this.get(),
			    _min = _get6.min,
			    _max = _get6.max,
			    low = _get6.low;

			this._updateDom(_min, _max, low, hi, this._size, this._ratio);
		}
	}
}
var file = "src\\HSlider.html";

function create_main_fragment(component, ctx) {
	var div3,
	    slot_content_default = component._slotted.default,
	    slot_content_default_after,
	    text0,
	    div2,
	    div1,
	    text1,
	    div0,
	    current;

	function onwindowmouseup(event) {
		component.stop(event);	}
	window.addEventListener("mouseup", onwindowmouseup);

	function onwindowmousemove(event) {
		component.move(event);	}
	window.addEventListener("mousemove", onwindowmousemove);

	var if_block0 = ctx.isRange && create_if_block_1(component, ctx);

	var if_block1 = ctx.hasTooltip && create_if_block(component, ctx);

	function mousedown_handler(event) {
		component.start(event, 'right');
	}

	return {
		c: function create() {
			div3 = createElement("div");
			text0 = createText("\r\n    ");
			div2 = createElement("div");
			div1 = createElement("div");
			if (if_block0) if_block0.c();
			text1 = createText("\r\n            ");
			div0 = createElement("div");
			if (if_block1) if_block1.c();
			addListener(div0, "mousedown", mousedown_handler);
			div0.className = "right svelte-5lxzq8";
			addLoc(div0, file, 12, 12, 490);
			div1.className = "range svelte-5lxzq8";
			addLoc(div1, file, 4, 8, 156);
			div2.className = "bar svelte-5lxzq8";
			addLoc(div2, file, 3, 4, 121);
			div3.className = "svelte-5lxzq8";
			toggleClass(div3, "hslider", true);
			addLoc(div3, file, 1, 0, 70);
		},

		m: function mount(target, anchor) {
			insert(target, div3, anchor);

			if (slot_content_default) {
				append(div3, slot_content_default);
				append(div3, slot_content_default_after || (slot_content_default_after = createComment()));
			}

			append(div3, text0);
			append(div3, div2);
			append(div2, div1);
			if (if_block0) if_block0.m(div1, null);
			append(div1, text1);
			append(div1, div0);
			if (if_block1) if_block1.m(div0, null);
			component.refs.right = div0;
			component.refs.range = div1;
			component.refs.bar = div2;
			current = true;
		},

		p: function update(changed, ctx) {
			if (ctx.isRange) {
				if (if_block0) {
					if_block0.p(changed, ctx);
				} else {
					if_block0 = create_if_block_1(component, ctx);
					if_block0.c();
					if_block0.m(div1, text1);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (ctx.hasTooltip) {
				if (if_block1) {
					if_block1.p(changed, ctx);
				} else {
					if_block1 = create_if_block(component, ctx);
					if_block1.c();
					if_block1.m(div0, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},

		i: function intro(target, anchor) {
			if (current) return;

			this.m(target, anchor);
		},

		o: run,

		d: function destroy$$1(detach) {
			window.removeEventListener("mouseup", onwindowmouseup);

			window.removeEventListener("mousemove", onwindowmousemove);

			if (detach) {
				detachNode(div3);
			}

			if (slot_content_default) {
				reinsertBefore(slot_content_default_after, slot_content_default);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			removeListener(div0, "mousedown", mousedown_handler);
			if (component.refs.right === div0) component.refs.right = null;
			if (component.refs.range === div1) component.refs.range = null;
			if (component.refs.bar === div2) component.refs.bar = null;
		}
	};
}

// (6:12) {#if isRange}
function create_if_block_1(component, ctx) {
	var div;

	var if_block = ctx.hasTooltip && create_if_block_2(component, ctx);

	function mousedown_handler(event) {
		component.start(event, 'left');
	}

	return {
		c: function create() {
			div = createElement("div");
			if (if_block) if_block.c();
			addListener(div, "mousedown", mousedown_handler);
			div.className = "left svelte-5lxzq8";
			addLoc(div, file, 6, 12, 226);
		},

		m: function mount(target, anchor) {
			insert(target, div, anchor);
			if (if_block) if_block.m(div, null);
			component.refs.left = div;
		},

		p: function update(changed, ctx) {
			if (ctx.hasTooltip) {
				if (if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block = create_if_block_2(component, ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},

		d: function destroy$$1(detach) {
			if (detach) {
				detachNode(div);
			}

			if (if_block) if_block.d();
			removeListener(div, "mousedown", mousedown_handler);
			if (component.refs.left === div) component.refs.left = null;
		}
	};
}

// (8:16) {#if hasTooltip}
function create_if_block_2(component, ctx) {
	var div,
	    text_value = ctx.parseFloat(ctx.low).toFixed(),
	    text;

	return {
		c: function create() {
			div = createElement("div");
			text = createText(text_value);
			div.className = "left-tick svelte-5lxzq8";
			addLoc(div, file, 8, 20, 345);
		},

		m: function mount(target, anchor) {
			insert(target, div, anchor);
			append(div, text);
			component.refs.leftTick = div;
		},

		p: function update(changed, ctx) {
			if ((changed.parseFloat || changed.low) && text_value !== (text_value = ctx.parseFloat(ctx.low).toFixed())) {
				setData(text, text_value);
			}
		},

		d: function destroy$$1(detach) {
			if (detach) {
				detachNode(div);
			}

			if (component.refs.leftTick === div) component.refs.leftTick = null;
		}
	};
}

// (14:16) {#if hasTooltip}
function create_if_block(component, ctx) {
	var div,
	    text_value = ctx.parseFloat(ctx.high).toFixed(),
	    text;

	return {
		c: function create() {
			div = createElement("div");
			text = createText(text_value);
			div.className = "right-tick svelte-5lxzq8";
			addLoc(div, file, 14, 20, 612);
		},

		m: function mount(target, anchor) {
			insert(target, div, anchor);
			append(div, text);
			component.refs.rightTick = div;
		},

		p: function update(changed, ctx) {
			if ((changed.parseFloat || changed.high) && text_value !== (text_value = ctx.parseFloat(ctx.high).toFixed())) {
				setData(text, text_value);
			}
		},

		d: function destroy$$1(detach) {
			if (detach) {
				detachNode(div);
			}

			if (component.refs.rightTick === div) component.refs.rightTick = null;
		}
	};
}

function HSlider(options) {
	var _this2 = this;

	this._debugName = '<HSlider>';
	if (!options || !options.target && !options.root) {
		throw new Error("'target' is a required option");
	}

	init(this, options);
	this.refs = {};
	this._state = assign(assign({ parseFloat: parseFloat }, data()), options.data);

	this._recompute({ low: 1, tooltip: 1 }, this._state);
	if (!('low' in this._state)) console.warn("<HSlider> was created without expected data property 'low'");
	if (!('tooltip' in this._state)) console.warn("<HSlider> was created without expected data property 'tooltip'");

	if (!('high' in this._state)) console.warn("<HSlider> was created without expected data property 'high'");
	this._intro = !!options.intro;
	this._handlers.update = [onupdate];

	this._slotted = options.slots || {};

	this._fragment = create_main_fragment(this, this._state);

	this.root._oncreate.push(function () {
		oncreate.call(_this2);
		_this2.fire("update", { changed: assignTrue({}, _this2._state), current: _this2._state });
	});

	if (options.target) {
		if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		this._fragment.c();
		this._mount(options.target, options.anchor);

		flush(this);
	}

	this._intro = true;
}

assign(HSlider.prototype, protoDev);
assign(HSlider.prototype, methods);

HSlider.prototype._checkReadOnly = function _checkReadOnly(newState) {
	if ('isRange' in newState && !this._updatingReadonlyProperty) throw new Error("<HSlider>: Cannot set read-only property 'isRange'");
	if ('hasTooltip' in newState && !this._updatingReadonlyProperty) throw new Error("<HSlider>: Cannot set read-only property 'hasTooltip'");
};

HSlider.prototype._recompute = function _recompute(changed, state) {
	if (changed.low) {
		if (this._differs(state.isRange, state.isRange = isRange(state))) changed.isRange = true;
	}

	if (changed.tooltip) {
		if (this._differs(state.hasTooltip, state.hasTooltip = hasTooltip(state))) changed.hasTooltip = true;
	}
};

/* src\VSlider.html generated by Svelte v2.15.0 */

var TIMEOUT$1 = 70;
function isRange$1(_ref) {
	var low = _ref.low;

	return !isNaN(parseFloat(low));
}

function hasTooltip$1(_ref2) {
	var tooltip = _ref2.tooltip;

	switch (typeof tooltip === 'undefined' ? 'undefined' : _typeof(tooltip)) {
		case 'boolean':
			return tooltip;
		case 'string':
			return tooltip.toLowerCase() === 'true';
		default:
			return false;
	}
}

function data$1() {
	return {
		min: 0,
		max: 0,
		low: NaN,
		high: 0,
		step: 0,
		tooltip: false
	};
}
var methods$1 = {
	start: function start(e, target) {
		e.stopPropagation();
		this._moving = true;

		var _get = this.get(),
		    low = _get.low,
		    high = _get.high,
		    hasTooltip = _get.hasTooltip;

		this._startX = e.y;
		this._target = target;
		switch (target) {
			case 'left':
				this._start = parseFloat(low);
				if (hasTooltip) {
					this.refs.leftTick.style.display = 'block';
				}
				break;
			case 'right':
				this._start = parseFloat(high);
				if (hasTooltip) {
					this.refs.rightTick.style.display = 'block';
				}
				break;
			default:
				break;
		}
	},
	move: function move(e) {
		var _this = this;

		if (this._moving) {
			setTimeout(function () {
				e.stopPropagation();

				var _get2 = _this.get(),
				    min = _get2.min,
				    max = _get2.max,
				    low = _get2.low,
				    high = _get2.high,
				    step = _get2.step;

				var a = parseFloat(min);
				var z = parseFloat(max);
				var s = parseFloat(step);
				var d = (e.y - _this._startX) * _this._ratio;
				if (s > 0) {
					d = Math.floor(d / s) * s;
				}
				var x = _this._start + d;
				switch (_this._target) {
					case 'left':
						var hi = parseFloat(high);
						if (!isNaN(a) && !isNaN(hi) && a <= x && x <= hi) {
							_this.set({ low: x });
						}
						break;
					case 'right':
						var lo = parseFloat(low);
						if (!isNaN(z) && (!isNaN(lo) && lo <= x && x <= z || isNaN(lo) && !isNaN(a) && a <= x && x <= z)) {
							_this.set({ high: x });
						}
						break;
					default:
						break;
				}
			}, TIMEOUT$1);
		}
	},
	stop: function stop(e) {
		this._moving = false;

		var _get3 = this.get(),
		    isRange = _get3.isRange,
		    hasTooltip = _get3.hasTooltip;

		if (hasTooltip) {
			if (isRange) {
				this.refs.leftTick.style.display = 'none';
			}
			this.refs.rightTick.style.display = 'none';
		}
		this._target = null;
	},
	_getRatio: function _getRatio(min, max, size) {
		var a = parseFloat(min);
		var z = parseFloat(max);
		if (!isNaN(a) && !isNaN(z)) {
			var _refs$bar$getBounding = this.refs.bar.getBoundingClientRect(),
			    width = _refs$bar$getBounding.width,
			    height = _refs$bar$getBounding.height;

			return (z - a) / (height - size);
		} else {
			return NaN;
		}
	},
	_updateDom: function _updateDom(min, max, low, high, size, ratio) {
		var a = parseFloat(min);
		var z = parseFloat(max);
		var lo = parseFloat(low);
		var hi = parseFloat(high);
		if (!isNaN(a) && !isNaN(z) && !isNaN(hi) && a <= hi && hi <= z) {
			var h = (!isNaN(lo) && a <= lo && lo <= hi ? hi - lo : hi) / ratio + size;
			this.refs.range.style.height = Math.round(h) + 'px';
			this.refs.right.style.top = h - size + 'px';
			if (!isNaN(lo) && a <= lo && lo <= hi) {
				this.refs.range.style.top = Math.round(lo / ratio) + 'px';
			}
		}
	}
};

function oncreate$1() {
	var _get4 = this.get(),
	    min = _get4.min,
	    max = _get4.max,
	    low = _get4.low,
	    high = _get4.high,
	    orientation = _get4.orientation,
	    isRange = _get4.isRange;

	var height = this.refs.right.getBoundingClientRect().height;
	this._size = isRange ? 2 * height : height;
	this._ratio = this._getRatio(min, max, this._size);
	this._updateDom(min, max, low, high, this._size, this._ratio);
}
function onupdate$1(_ref3) {
	var changed = _ref3.changed,
	    current = _ref3.current,
	    previous = _ref3.previous;

	if (changed.low) {
		var lo = parseFloat(current.low);
		if (!isNaN(lo)) {
			var _get5 = this.get(),
			    min = _get5.min,
			    max = _get5.max,
			    high = _get5.high;

			this._updateDom(min, max, lo, high, this._size, this._ratio);
		}
	}
	if (changed.high) {
		var hi = parseFloat(current.high);
		if (!isNaN(hi)) {
			var _get6 = this.get(),
			    _min = _get6.min,
			    _max = _get6.max,
			    low = _get6.low;

			this._updateDom(_min, _max, low, hi, this._size, this._ratio);
		}
	}
}
var file$1 = "src\\VSlider.html";

function create_main_fragment$1(component, ctx) {
	var div3,
	    slot_content_default = component._slotted.default,
	    slot_content_default_after,
	    text0,
	    div2,
	    div1,
	    text1,
	    div0,
	    current;

	function onwindowmouseup(event) {
		component.stop(event);	}
	window.addEventListener("mouseup", onwindowmouseup);

	function onwindowmousemove(event) {
		component.move(event);	}
	window.addEventListener("mousemove", onwindowmousemove);

	var if_block0 = ctx.isRange && create_if_block_1$1(component, ctx);

	var if_block1 = ctx.hasTooltip && create_if_block$1(component, ctx);

	function mousedown_handler(event) {
		component.start(event, 'right');
	}

	return {
		c: function create() {
			div3 = createElement("div");
			text0 = createText("\r\n    ");
			div2 = createElement("div");
			div1 = createElement("div");
			if (if_block0) if_block0.c();
			text1 = createText("\r\n            ");
			div0 = createElement("div");
			if (if_block1) if_block1.c();
			addListener(div0, "mousedown", mousedown_handler);
			div0.className = "right svelte-1lc4qx0";
			addLoc(div0, file$1, 12, 12, 490);
			div1.className = "range svelte-1lc4qx0";
			addLoc(div1, file$1, 4, 8, 156);
			div2.className = "bar svelte-1lc4qx0";
			addLoc(div2, file$1, 3, 4, 121);
			div3.className = "svelte-1lc4qx0";
			toggleClass(div3, "vslider", true);
			addLoc(div3, file$1, 1, 0, 70);
		},

		m: function mount(target, anchor) {
			insert(target, div3, anchor);

			if (slot_content_default) {
				append(div3, slot_content_default);
				append(div3, slot_content_default_after || (slot_content_default_after = createComment()));
			}

			append(div3, text0);
			append(div3, div2);
			append(div2, div1);
			if (if_block0) if_block0.m(div1, null);
			append(div1, text1);
			append(div1, div0);
			if (if_block1) if_block1.m(div0, null);
			component.refs.right = div0;
			component.refs.range = div1;
			component.refs.bar = div2;
			current = true;
		},

		p: function update(changed, ctx) {
			if (ctx.isRange) {
				if (if_block0) {
					if_block0.p(changed, ctx);
				} else {
					if_block0 = create_if_block_1$1(component, ctx);
					if_block0.c();
					if_block0.m(div1, text1);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (ctx.hasTooltip) {
				if (if_block1) {
					if_block1.p(changed, ctx);
				} else {
					if_block1 = create_if_block$1(component, ctx);
					if_block1.c();
					if_block1.m(div0, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},

		i: function intro(target, anchor) {
			if (current) return;

			this.m(target, anchor);
		},

		o: run,

		d: function destroy$$1(detach) {
			window.removeEventListener("mouseup", onwindowmouseup);

			window.removeEventListener("mousemove", onwindowmousemove);

			if (detach) {
				detachNode(div3);
			}

			if (slot_content_default) {
				reinsertBefore(slot_content_default_after, slot_content_default);
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			removeListener(div0, "mousedown", mousedown_handler);
			if (component.refs.right === div0) component.refs.right = null;
			if (component.refs.range === div1) component.refs.range = null;
			if (component.refs.bar === div2) component.refs.bar = null;
		}
	};
}

// (6:12) {#if isRange}
function create_if_block_1$1(component, ctx) {
	var div;

	var if_block = ctx.hasTooltip && create_if_block_2$1(component, ctx);

	function mousedown_handler(event) {
		component.start(event, 'left');
	}

	return {
		c: function create() {
			div = createElement("div");
			if (if_block) if_block.c();
			addListener(div, "mousedown", mousedown_handler);
			div.className = "left svelte-1lc4qx0";
			addLoc(div, file$1, 6, 12, 226);
		},

		m: function mount(target, anchor) {
			insert(target, div, anchor);
			if (if_block) if_block.m(div, null);
			component.refs.left = div;
		},

		p: function update(changed, ctx) {
			if (ctx.hasTooltip) {
				if (if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block = create_if_block_2$1(component, ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},

		d: function destroy$$1(detach) {
			if (detach) {
				detachNode(div);
			}

			if (if_block) if_block.d();
			removeListener(div, "mousedown", mousedown_handler);
			if (component.refs.left === div) component.refs.left = null;
		}
	};
}

// (8:16) {#if hasTooltip}
function create_if_block_2$1(component, ctx) {
	var div,
	    text_value = ctx.parseFloat(ctx.low).toFixed(),
	    text;

	return {
		c: function create() {
			div = createElement("div");
			text = createText(text_value);
			div.className = "left-tick svelte-1lc4qx0";
			addLoc(div, file$1, 8, 20, 345);
		},

		m: function mount(target, anchor) {
			insert(target, div, anchor);
			append(div, text);
			component.refs.leftTick = div;
		},

		p: function update(changed, ctx) {
			if ((changed.parseFloat || changed.low) && text_value !== (text_value = ctx.parseFloat(ctx.low).toFixed())) {
				setData(text, text_value);
			}
		},

		d: function destroy$$1(detach) {
			if (detach) {
				detachNode(div);
			}

			if (component.refs.leftTick === div) component.refs.leftTick = null;
		}
	};
}

// (14:16) {#if hasTooltip}
function create_if_block$1(component, ctx) {
	var div,
	    text_value = ctx.parseFloat(ctx.high).toFixed(),
	    text;

	return {
		c: function create() {
			div = createElement("div");
			text = createText(text_value);
			div.className = "right-tick svelte-1lc4qx0";
			addLoc(div, file$1, 14, 20, 612);
		},

		m: function mount(target, anchor) {
			insert(target, div, anchor);
			append(div, text);
			component.refs.rightTick = div;
		},

		p: function update(changed, ctx) {
			if ((changed.parseFloat || changed.high) && text_value !== (text_value = ctx.parseFloat(ctx.high).toFixed())) {
				setData(text, text_value);
			}
		},

		d: function destroy$$1(detach) {
			if (detach) {
				detachNode(div);
			}

			if (component.refs.rightTick === div) component.refs.rightTick = null;
		}
	};
}

function VSlider(options) {
	var _this2 = this;

	this._debugName = '<VSlider>';
	if (!options || !options.target && !options.root) {
		throw new Error("'target' is a required option");
	}

	init(this, options);
	this.refs = {};
	this._state = assign(assign({ parseFloat: parseFloat }, data$1()), options.data);

	this._recompute({ low: 1, tooltip: 1 }, this._state);
	if (!('low' in this._state)) console.warn("<VSlider> was created without expected data property 'low'");
	if (!('tooltip' in this._state)) console.warn("<VSlider> was created without expected data property 'tooltip'");

	if (!('high' in this._state)) console.warn("<VSlider> was created without expected data property 'high'");
	this._intro = !!options.intro;
	this._handlers.update = [onupdate$1];

	this._slotted = options.slots || {};

	this._fragment = create_main_fragment$1(this, this._state);

	this.root._oncreate.push(function () {
		oncreate$1.call(_this2);
		_this2.fire("update", { changed: assignTrue({}, _this2._state), current: _this2._state });
	});

	if (options.target) {
		if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		this._fragment.c();
		this._mount(options.target, options.anchor);

		flush(this);
	}

	this._intro = true;
}

assign(VSlider.prototype, protoDev);
assign(VSlider.prototype, methods$1);

VSlider.prototype._checkReadOnly = function _checkReadOnly(newState) {
	if ('isRange' in newState && !this._updatingReadonlyProperty) throw new Error("<VSlider>: Cannot set read-only property 'isRange'");
	if ('hasTooltip' in newState && !this._updatingReadonlyProperty) throw new Error("<VSlider>: Cannot set read-only property 'hasTooltip'");
};

VSlider.prototype._recompute = function _recompute(changed, state) {
	if (changed.low) {
		if (this._differs(state.isRange, state.isRange = isRange$1(state))) changed.isRange = true;
	}

	if (changed.tooltip) {
		if (this._differs(state.hasTooltip, state.hasTooltip = hasTooltip$1(state))) changed.hasTooltip = true;
	}
};

/* src\Slider.html generated by Svelte v2.15.0 */

function data$2() {
	return { HSlider: HSlider, VSlider: VSlider };
}
function create_main_fragment$2(component, ctx) {
	var slot_content_default = component._slotted.default,
	    switch_instance_updating = {},
	    switch_instance_anchor,
	    current;

	var switch_value = ctx.orientation === 'horizontal' ? ctx.HSlider : ctx.VSlider;

	function switch_props(ctx) {
		var switch_instance_initial_data = {};
		if (ctx.min !== void 0) {
			switch_instance_initial_data.min = ctx.min;
			switch_instance_updating.min = true;
		}
		if (ctx.max !== void 0) {
			switch_instance_initial_data.max = ctx.max;
			switch_instance_updating.max = true;
		}
		if (ctx.low !== void 0) {
			switch_instance_initial_data.low = ctx.low;
			switch_instance_updating.low = true;
		}
		if (ctx.high !== void 0) {
			switch_instance_initial_data.high = ctx.high;
			switch_instance_updating.high = true;
		}
		if (ctx.step !== void 0) {
			switch_instance_initial_data.step = ctx.step;
			switch_instance_updating.step = true;
		}
		if (ctx.tooltip !== void 0) {
			switch_instance_initial_data.tooltip = ctx.tooltip;
			switch_instance_updating.tooltip = true;
		}
		return {
			root: component.root,
			store: component.store,
			slots: { default: createFragment() },
			data: switch_instance_initial_data,
			_bind: function _bind(changed, childState) {
				var newState = {};
				if (!switch_instance_updating.min && changed.min) {
					newState.min = childState.min;
				}

				if (!switch_instance_updating.max && changed.max) {
					newState.max = childState.max;
				}

				if (!switch_instance_updating.low && changed.low) {
					newState.low = childState.low;
				}

				if (!switch_instance_updating.high && changed.high) {
					newState.high = childState.high;
				}

				if (!switch_instance_updating.step && changed.step) {
					newState.step = childState.step;
				}

				if (!switch_instance_updating.tooltip && changed.tooltip) {
					newState.tooltip = childState.tooltip;
				}
				component._set(newState);
				switch_instance_updating = {};
			}
		};
	}

	if (switch_value) {
		var switch_instance = new switch_value(switch_props(ctx));

		component.root._beforecreate.push(function () {
			switch_instance._bind({ min: 1, max: 1, low: 1, high: 1, step: 1, tooltip: 1 }, switch_instance.get());
		});
	}

	return {
		c: function create() {
			if (switch_instance) switch_instance._fragment.c();
			switch_instance_anchor = createComment();
		},

		m: function mount(target, anchor) {
			if (slot_content_default) {
				append(switch_instance._slotted.default, slot_content_default);
			}

			if (switch_instance) {
				switch_instance._mount(target, anchor);
			}

			insert(target, switch_instance_anchor, anchor);
			current = true;
		},

		p: function update(changed, _ctx) {
			ctx = _ctx;
			var switch_instance_changes = {};
			if (!switch_instance_updating.min && changed.min) {
				switch_instance_changes.min = ctx.min;
				switch_instance_updating.min = ctx.min !== void 0;
			}
			if (!switch_instance_updating.max && changed.max) {
				switch_instance_changes.max = ctx.max;
				switch_instance_updating.max = ctx.max !== void 0;
			}
			if (!switch_instance_updating.low && changed.low) {
				switch_instance_changes.low = ctx.low;
				switch_instance_updating.low = ctx.low !== void 0;
			}
			if (!switch_instance_updating.high && changed.high) {
				switch_instance_changes.high = ctx.high;
				switch_instance_updating.high = ctx.high !== void 0;
			}
			if (!switch_instance_updating.step && changed.step) {
				switch_instance_changes.step = ctx.step;
				switch_instance_updating.step = ctx.step !== void 0;
			}
			if (!switch_instance_updating.tooltip && changed.tooltip) {
				switch_instance_changes.tooltip = ctx.tooltip;
				switch_instance_updating.tooltip = ctx.tooltip !== void 0;
			}

			if (switch_value !== (switch_value = ctx.orientation === 'horizontal' ? ctx.HSlider : ctx.VSlider)) {
				if (switch_instance) {
					var old_component = switch_instance;
					old_component._fragment.o(function () {
						old_component.destroy();
					});
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props(ctx));

					component.root._beforecreate.push(function () {
						var changed = {};
						if (ctx.min === void 0) changed.min = 1;
						if (ctx.max === void 0) changed.max = 1;
						if (ctx.low === void 0) changed.low = 1;
						if (ctx.high === void 0) changed.high = 1;
						if (ctx.step === void 0) changed.step = 1;
						if (ctx.tooltip === void 0) changed.tooltip = 1;
						switch_instance._bind(changed, switch_instance.get());
					});
					switch_instance._fragment.c();

					slot.m(switch_instance._slotted.default, null);
					switch_instance._mount(switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance._set(switch_instance_changes);
				switch_instance_updating = {};
			}
		},

		i: function intro(target, anchor) {
			if (current) return;

			this.m(target, anchor);
		},

		o: function outro(outrocallback) {
			if (!current) return;

			if (switch_instance) switch_instance._fragment.o(outrocallback);
			current = false;
		},

		d: function destroy$$1(detach) {
			if (slot_content_default) {
				reinsertChildren(switch_instance._slotted.default, slot_content_default);
			}

			if (detach) {
				detachNode(switch_instance_anchor);
			}

			if (switch_instance) switch_instance.destroy(detach);
		}
	};
}

function Slider(options) {
	this._debugName = '<Slider>';
	if (!options || !options.target && !options.root) {
		throw new Error("'target' is a required option");
	}

	init(this, options);
	this._state = assign(data$2(), options.data);
	if (!('orientation' in this._state)) console.warn("<Slider> was created without expected data property 'orientation'");
	if (!('HSlider' in this._state)) console.warn("<Slider> was created without expected data property 'HSlider'");
	if (!('VSlider' in this._state)) console.warn("<Slider> was created without expected data property 'VSlider'");
	if (!('min' in this._state)) console.warn("<Slider> was created without expected data property 'min'");
	if (!('max' in this._state)) console.warn("<Slider> was created without expected data property 'max'");
	if (!('low' in this._state)) console.warn("<Slider> was created without expected data property 'low'");
	if (!('high' in this._state)) console.warn("<Slider> was created without expected data property 'high'");
	if (!('step' in this._state)) console.warn("<Slider> was created without expected data property 'step'");
	if (!('tooltip' in this._state)) console.warn("<Slider> was created without expected data property 'tooltip'");
	this._intro = !!options.intro;

	this._slotted = options.slots || {};

	this._fragment = create_main_fragment$2(this, this._state);

	if (options.target) {
		if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		this._fragment.c();
		this._mount(options.target, options.anchor);

		flush(this);
	}

	this._intro = true;
}

assign(Slider.prototype, protoDev);

Slider.prototype._checkReadOnly = function _checkReadOnly(newState) {};

module.exports = Slider;
