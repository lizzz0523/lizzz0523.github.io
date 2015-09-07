(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["vx"] = factory();
	else
		root["vx"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var extend = __webpack_require__(1).extend;

	var vx = module.exports = function (parent, name, props) {
	    var node = setup(parent, name, props, null),
	        tmpl = {
	            set: function (props) {
	                node = setup(parent, name, props, node);
	                return tmpl;
	            }
	        };

	    return tmpl
	};

	extend(vx, __webpack_require__(2));
	extend(vx, __webpack_require__(4));
	extend(vx, __webpack_require__(9));
	extend(vx, __webpack_require__(8));

	vx.version = '0.0.1';
	vx.gvxId = 1;

	function setup(parent, name, props, orig) {
	    var vnode = vx.create(name, props, []),
	        node = vx.render(parent.gvxId || (parent.gvxId = vx.gvxId++), vnode);

	    if (!orig) {
	        parent.appendChild(node);
	    } else if (orig !== node) {
	        parent.replaceChild(node, orig);
	    }

	    return node;
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	var toString = function (obj) {
	        return Object.prototype.toString.call(obj);
	    },

	    has = function (obj, prop) {
	        return Object.prototype.hasOwnProperty.call(obj, prop);
	    },

	    slice = function (arr, start, stop) {
	        if (stop === void 0) {
	            return Array.prototype.slice.call(arr, start || 0);
	        } else {
	            return Array.prototype.slice.call(arr, start, stop);
	        }
	    };

	function isType(type) {
	    return function (obj) {
	        return toString(obj) === '[object ' + type + ']';
	    }
	}

	var isArray = Array.isArray || isType('Array'),
	    isObject = isType('Object'),
	    isFunction = isType('Function'),
	    isString = isType('String'),
	    isWindow = isType('Window');

	function isPlainObject(obj) {
	    if (!isObject(obj) || isWindow(obj) || obj.nodeType) {
	        return false;
	    }

	    if (obj.constructor && !has(obj.constructor.prototype, 'isPrototypeOf')) {
	        return false;
	    }

	    return true;
	}

	function isUndefined(obj) {
	    return obj === void 0 || obj === null;
	}

	function keys(obj) {
	    var ret = [],
	        key;

	    for (key in obj) {
	        if (has(obj, key)) {
	            ret.push(key);
	        }
	    }

	    return ret;
	}

	function each(obj, fn) {
	    var props,
	        i,
	        len;

	    if (isArray(obj)) {
	        i = -1;
	        len = obj.length;

	        while (++i < len) {
	            if (fn.call(obj[i], obj[i], i, obj) === false) break;
	        }
	    } else {
	        props = keys(obj);
	        i = -1;
	        len = props.length;

	        while (++i < len) {
	            if (fn.call(obj[props[i]], obj[props[i]], props[i], obj) === false) break;
	        }
	    }
	}

	function map(obj, fn) {
	    var ret = [];

	    each(obj, function (value, key, obj) {
	        ret.push(fn.call(value, value, key, obj));
	    });

	    return ret;
	}

	function reduce(obj, fn, memo) {
	    var ret = memo,
	        init = true;

	    each(obj, function (value, key, obj) {
	        if (init && isUndefined(ret)) {
	            ret = value;
	            init = false;
	        } else {
	            ret = fn.call(value, ret, value, key, obj);
	        }
	    });

	    return ret;
	}

	function extend(dest) {
	    var args = slice(arguments, 1);

	    each(args, function (src, index) {
	        each(src, function (value, key) {
	            dest[key] = value;
	        });
	    });

	    return dest;
	}

	function bind(fn, context) {
	    return function () {
	        return fn.apply(context, arguments);
	    };
	}

	exports.isArray = isArray;
	exports.isObject = isObject;
	exports.isPlainObject = isPlainObject;
	exports.isFunction = isFunction;
	exports.isString = isString;
	exports.isWindow = isWindow;
	exports.isUndefined = isUndefined;

	exports.has = has;
	exports.keys = keys;
	exports.each = each;
	exports.map = map;
	exports.reduce = reduce;
	exports.extend = extend;
	exports.bind = bind;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var extend = __webpack_require__(1).extend;

	extend(exports, __webpack_require__(1));
	extend(exports, __webpack_require__(3));

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

	exports.createElem = function (name, props) {
	    var node = document.createElement(name.toLowerCase());

	    _.each(props, function (value, name) {
	        node.setAttribute(name, value);
	    });

	    return node;
	};

	exports.createText = function (text) {
	    var div = document.createElement('div'),
	        node;

	    div.innerHTML = text;
	    node = div.firstChild;
	    div = null;

	    return node;
	};

	exports.selectNode = function (selector, context) {
	    if (context) {
	        return context.querySelector(selector);
	    } else {
	        return document.querySelector(selector);
	    }
	};

	exports.selectNodes = function (selector, context) {
	    if (context) {
	        return context.querySelectorAll(selector);
	    } else {
	        return document.querySelectorAll(selector);
	    }
	};

	exports.removeNode = function (node) {
	    var parent = node.parentNode;

	    if (parent) {
	        parent.removeChild(node);
	    }
	};

	exports.replaceNode = function (node, other) {
	    var parent = node.parentNode;

	    if (parent) {
	        parent.replaceChild(other, node);
	    }
	};

	exports.appendChild = function (parent, node) {
	    parent.appendChild(node);
	};

	exports.prependChild = function (parent, node) {
	    var first = parent.firstChild;

	    if (!first) {
	        parent.appendChild(node);
	    } else {
	        parent.insertBefore(node, first);
	    }
	};

	exports.insertBefore = function (before, node) {
	    var parent = before.parentNode;

	    if (parent) {
	        parent.insertBefore(node, before);
	    }
	};

	exports.insertAfter = function (after, node) {
	    var parent = after.parentNode,
	        next = after.nextSibling;

	    if (parent) {
	        if (next) {
	            parent.insertBefore(node, next);
	        } else {
	            parent.appendChild(node);
	        }
	    }
	};

	exports.domReady = (function () {
	    var scrollIntervalId,
	        testDiv,
	        isTop,
	        isBrowser = typeof window !== 'undefined' && window.document,
	        isPageLoaded = !isBrowser,
	        doc = isBrowser ? document : null,
	        readyCalls = [];

	    function runCallbacks(callbacks) {
	        var i = -1,
	            len = callbacks.length;

	        while (++i < len) {
	            callbacks[i](doc);
	        }
	    }

	    function callReady() {
	        var callbacks = readyCalls;

	        if (isPageLoaded && callbacks.length) {
	            readyCalls = [];
	            runCallbacks(callbacks);
	        }
	    }

	    function pageLoaded() {
	        if (!isPageLoaded) {
	            isPageLoaded = true;

	            if (scrollIntervalId) {
	                clearInterval(scrollIntervalId);
	            }

	            callReady();
	        }
	    }

	    if (isBrowser) {
	        if (document.addEventListener) {
	            document.addEventListener('DOMContentLoaded', pageLoaded, false);
	            window.addEventListener('load', pageLoaded, false);
	        } else if (window.attachEvent) {
	            window.attachEvent('onload', pageLoaded);

	            testDiv = document.createElement('div');

	            try {
	                isTop = window.frameElement === null;
	            } catch (e) {

	            }

	            if (testDiv.doScroll && isTop && window.external) {
	                scrollIntervalId = setInterval(function () {
	                    try {
	                        testDiv.doScroll();
	                        pageLoaded();
	                    } catch (e) {}
	                }, 30);
	            }
	        }

	        if (document.readyState === 'complete') {
	            pageLoaded();
	        }
	    }

	    return function (callback) {
	        if (isPageLoaded) {
	            callback(doc);
	        } else {
	            readyCalls.push(callback);
	        }
	    };
	})();

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1),

	    diff = __webpack_require__(5),
	    apply = __webpack_require__(7);

	var View = function(id, props, children, name) {
	    this.id = id;
	    this.name = name;
	    this.state = {};
	    this.vnode = null;
	    this.node = null;

	    _.extend(this.state, props);
	    _.extend(this.state, {
	        children: children
	    });

	    this.update();
	};

	_.extend(View.prototype, {
	    set: function (props, children) {
	        if (_.isString(props)) {
	            this.state[props] = children;
	        } else {
	            _.extend(this.state, props);
	            _.extend(this.state, {
	                children: children
	            });
	        }

	        this.update();
	    },

	    render: function () {
	        if (this.template) {
	            return this.template.call(this.state);
	        } else {
	            return this.state.children[0] || null;
	        }
	    },

	    diff: function (vnode) {
	        return diff(this.id, this.vnode, vnode);
	    },

	    apply: function (patches) {
	        return apply(this.id, this.node, patches);
	    },

	    update: function () {
	        var vnode = this.render(),
	            patches = this.diff(vnode),
	            node = this.apply(patches);

	        this.vnode = vnode;
	        this.node = node;
	    },

	    destory: function () {
	        
	    }
	});

	module.exports = View;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1),

	    Type = __webpack_require__(6);

	module.exports = function (id, a, b) {
	    var patches = {a: a};
	    
	    walkTree(a, b, patches, 0);
	    
	    return patches;
	};

	function diffProps(a, b, patches, patch, index) {
	    var propsPatch;

	    _.each(a.props, function (value, name) {
	        var patch;
	        
	        if (!(name in b.props)) {
	            propsPatch = propsPatch || {};
	            propsPatch[name] = void 0;
	        } else {
	            patch = b.props[name];

	            if (value !== patch) {
	                propsPatch = propsPatch || {}
	                propsPatch[name] = patch;
	            }
	        }
	    });
	    
	    _.each(b.props, function (value, name) {
	        if (!(name in a.props)) {
	            propsPatch = propsPatch || {};
	            propsPatch[name] = value;
	        }
	    });
	    
	    if (propsPatch) {
	        patch = appendPatch(patch, {
	            type: Type.PATCH_PROP,
	            vnode: a,
	            patch: propsPatch
	        });
	    }
	    
	    return patch;
	}

	function diffChildren(a, b, patches, patch, index) {
	    var orderedSet = reorder(a.children, b.children),
	        aChildren = orderedSet.aChildren,
	        bChildren = orderedSet.bChildren,
	        aChild,
	        bChild,
	    
	        i = -1,
	        len = Math.max(aChildren.length, bChildren.length);
	        
	    while (++i < len) {
	        aChild = aChildren[i] || null;
	        bChild = bChildren[i] || null;
	        index++;
	        
	        if (!aChild && bChild) {
	            patch = appendPatch(patch, {
	                type: Type.PATCH_INSERT,
	                vnode: aChild,
	                patch: bChild
	            });
	        } else {
	            walkTree(aChild, bChild, patches, index);
	        }
	        
	        if (aChild && aChild.count) {
	            index += aChild.count;
	        }
	    }
	    
	    if (orderedSet.movePatch) {
	        patch = appendPatch(patch, {
	            type: Type.PATCH_ORDER,
	            vnode: a,
	            patch: orderedSet.movePatch
	        });
	    }
	    
	    return patch;
	}

	function diffView(a, b, patches, patch, index) {
	    if (a.props !== b.props || a.children !== b.children) {
	        patch = appendPatch(patch, {
	            type: Type.PATCH_VIEW,
	            vnode: a,
	            patch: b
	        });
	    }
	    
	    return patch;
	}

	function walkTree(a, b, patches, index) {
	    var patch = patches[index];
	    
	    if (a === b) {
	        // 如果a等于b，则结束
	        return;
	    }
	    
	    if (_.isUndefined(b)) {
	        patch = appendPatch(patch, {
	            type: Type.PATCH_REMOVE,
	            vnode: a,
	            patch: b
	        });
	    } else if (_.isUndefined(a)) {
	        patch = appendPatch(patch, {
	            type: Type.PATCH_CREATE,
	            vnode: a,
	            patch: b
	        });
	    } else if (_.isString(b)) {
	        if (_.isString(a) && a === b) {
	            // do nothing
	        } else {
	            patch = appendPatch(patch, {
	                type: Type.PATCH_REPLACE,
	                vnode: a,
	                patch: b
	            });
	        }
	    } else if (b.type === Type.NODE_ELEM) {
	        if (a.type === Type.NODE_ELEM && a.name === b.name) {
	            patch = diffProps(a, b, patches, patch, index);
	            patch = diffChildren(a, b, patches, patch, index);
	        } else {
	            patch = appendPatch(patch, {
	                type: Type.PATCH_REPLACE,
	                vnode: a,
	                patch: b
	            });
	        }
	    } else if (b.type === Type.NODE_VIEW) {
	        if (a.type === Type.NODE_VIEW && a.name === b.name) {
	            patch = diffView(a, b, patches, patch, index);
	        } else {
	            patch = appendPatch(patch, {
	               type: Type.PATCH_REPLACE,
	               vnode: a,
	               patch: b
	            });
	        }
	    }
	    
	    if (patch) {
	        patches[index] = patch;
	    }
	}

	function appendPatch(arr, patch) {
	    if (arr) {
	        if (!_.isArray(arr)) {
	            arr = [arr];
	        }
	        
	        arr.push(patch);
	    } else {
	        arr = patch;
	    }
	    
	    return arr;
	}

	function reorder(aChildren, bChildren) {
	    var aIndex = index(aChildren),
	        aKeys = aIndex.keys,
	        aFree = aIndex.free,

	        bIndex = index(bChildren),
	        bKeys = bIndex.keys,
	        bFree = bIndex.free,

	        cChildren = [],
	        dChildren = [],
	        aChild,
	        bChild,
	        cChild,
	        i,
	        j,
	        k,
	        len,

	        freePoint,
	        freeCount,
	        lastFreeIndex,
	        deletedIndex,
	        inserts = [],
	        removes = [];

	    if (bFree.length === bChildren.length) {
	        return {
	            aChildren: aChildren,
	            bChildren: bChildren,
	            movePatch: null
	        };
	    }

	    if (aFree.length === aChildren.length) {
	        return {
	            aChildren: aChildren,
	            bChildren: bChildren,
	            movePatch: null
	        };
	    }

	    i = -1;
	    len = aChildren.length;
	    freePoint = 0;
	    freeCount = bFree.length;
	    deletedIndex = 0;

	    while (++i < len) {
	        aChild = aChildren[i];

	        if (aChild.key) {
	            if (_.has(bKeys, aChild.key)) {
	                cChildren.push(bChildren[bKeys[aChild.key]]);
	            } else {
	                deletedIndex++;
	                cChildren.push(null);
	            }
	        } else {
	            if (freePoint < freeCount) {
	                cChildren.push(bChildren[bFree[freePoint++]]);
	            } else {
	                deletedIndex++;
	                cChildren.push(null);
	            }
	        }
	    }

	    i = -1;
	    len = bChildren.length;
	    lastFreeIndex = freePoint < freeCount ? bFree[freePoint] : bChildren.length;

	    while (++i < len) {
	        bChild = bChildren[i];

	        if (bChild.key) {
	            if (!_.has(aKeys, bChild.key)) {
	                cChildren.push(bChild);
	            }
	        } else {
	            if (i >= lastFreeIndex) {
	                cChildren.push(bChild);
	            }
	        }
	    }

	    dChildren = cChildren.slice();

	    j = 0;
	    k = 0;
	    len = bChildren.length;

	    while (j < len) {
	        bChild = bChildren[j];
	        cChild = cChildren[k];

	        while (cChild === null) {
	            removes.push({
	                key: null,
	                from: k
	            });

	            cChildren.splice(k, 1);
	            cChild = cChildren[k];
	        }

	        // 如果没有cChild或者有cChild但cChild和bChild不一样
	        if (!cChild || cChild.key !== bChild.key) {

	            // bChild是特殊值
	            if (bChild.key) {

	                // cChild也是特殊值
	                if (cChild && cChild.key) {
	                    removes.push({
	                        key: cChild.key,
	                        from: k
	                    });

	                    cChildren.splice(k, 1);

	                    // 这里做了一次优化，如果bChild和cChild是相邻，则只需要把前一个cChild删除并插入到bChild后即可
	                    if (bKeys[cChild.key] === j + 1) {
	                        bChild = bChildren[++j];
	                        cChild = cChildren[++k];
	                    }

	                    inserts.push({
	                        key: bChild.key,
	                        to: j
	                    });

	                // cChild是普通值
	                } else {
	                    inserts.push({
	                        key: bChild.key,
	                        to: j
	                    });
	                }

	                j++;

	            // bChild是普通值，但cChild是特殊值
	            } else if (cChild && cChild.key) {
	                removes.push({
	                    key: cChild.key,
	                    from: k
	                });

	                cChildren.splice(k, 1);

	            // bChild是普通值，cChild也是普通值，这种情况不会出现，因为最开始已判断bChild不等于cChild
	            } else {

	            }

	        // cChild和bChild一样
	        } else {
	            j++;
	            k++;
	        }
	    }

	    while (k < cChildren.length) {
	        cChild = cChildren[k];

	        removes.push({
	            key: (cChild && cChild.key) || null,
	            from: k
	        });

	        cChildren.splice(k, 1);
	    }

	    if (removes.length === deletedIndex && !inserts.length) {
	        return {
	            aChildren: aChildren,
	            bChildren: dChildren,
	            movePatch: null
	        };
	    }

	    return {
	        aChildren: aChildren,
	        bChildren: dChildren,
	        movePatch: {
	            removes: removes,
	            inserts: inserts
	        }
	    };
	}

	function index(children) {
	    var keys = {},
	        free = [],
	        
	        child,
	        i = -1,
	        len = children.length;

	    while (++i < len) {
	        child = children[i];

	        if (child.key) {
	            keys[child.key] = i;
	        } else {
	            free.push(i);
	        }
	    }

	    return {
	        keys: keys,
	        free: free
	    };
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	exports.NODE_VIEW = 1;
	exports.NODE_ELEM = 2;
	exports.PATCH_CREATE = 3;
	exports.PATCH_REMOVE = 4;
	exports.PATCH_REPLACE = 5;
	exports.PATCH_INSERT = 6;
	exports.PATCH_ORDER = 7;
	exports.PATCH_PROP = 8;
	exports.PATCH_VIEW = 9;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(3),
	    _ = __webpack_require__(1),

	    VX = __webpack_require__(8),
	    Type = __webpack_require__(6);

	module.exports = function (id, node, patches) {
	    var indices = patchIndices(patches),
	        nodes = domSearch(node, patches.a, indices);
	        
	    _.each(indices, function (index) {
	        node = applyPatch(id, node, nodes[index], patches[index]);
	    });

	    return node;
	};

	function applyPatch(id, root, node, patch) {
	    if (!_.isArray(patch)) {
	        patch = [patch];
	    }
	    
	    _.each(patch, function (operate) {
	        var result = applyOperate(id, node, operate);
	        
	        if (node === root) {
	            root = result;
	        }
	    });

	    return root;
	}

	function applyOperate(id, node, operate) {
	    var type = operate.type,
	        vnode = operate.vnode,
	        patch = operate.patch;

	    switch (type) {
	        case Type.PATCH_CREATE:
	            return createNode(id, node, patch);
	        case Type.PATCH_REMOVE:
	            return removeNode(id, node, vnode);
	        case Type.PATCH_REPLACE:
	            return replaceNode(id, node, vnode, patch);
	        case Type.PATCH_INSERT:
	            return insertNode(id, node, patch);
	        case Type.PATCH_ORDER:
	            return orderNode(id, node, patch);
	        case Type.PATCH_PROP:
	            return updateProp(id, node, patch);
	        case Type.PATCH_VIEW:
	            return updateView(id, node, patch);
	        default:
	            return node;
	    }
	}

	function createNode(id, node, vnode) {
	    var result;
	    
	    if (_.isString(vnode)) {
	        result = $.createText(vnode);
	    } else if (vnode.type === Type.NODE_ELEM) {
	        result = $.createElem(vnode.name, vnode.props);

	        _.each(vnode.children, function (vnode, index) {
	            $.appendChild(result, createNode(id + '.' + index, node, vnode));
	        });
	    } else if (vnode.type === Type.NODE_VIEW) {
	        result = VX.render(id, vnode);
	    }

	    result.vxId = id;
	    
	    return result;
	}

	function removeNode(id, node, vnode) {
	    if (vnode.type && vnode.type === Type.NODE_VIEW) {
	        VX.destory(node.vxId, vnode);
	    }
	    
	    $.removeNode(node);
	    
	    return null;
	}

	function replaceNode(id, node, vnode, patch) {
	    var result;
	    
	    if (vnode.type && vnode.type === Type.NODE_VIEW) {
	        VX.destory(node.vxId, vnode);
	    }

	    $.replaceNode(node, result = createNode(node.vxId, node, patch));
	    
	    return result;
	}

	function insertNode(id, node, patch) {
	    var children = node.childNodes;
	    
	    $.appendChild(node, createNode(node.vxId + '.' + children.length, node, patch));
	    
	    return node;
	}

	function orderNode(id, node, patch) {
	    var children = node.childNodes,
	        map = {};

	    _.each(patch.removes, function (remove) {
	        var child = children[remove.from];
	        
	        if (remove.key) {
	            map[remove.key] = child;
	        }
	        
	        $.removeNode(child);
	    });
	    
	    _.each(patch.inserts, function (insert) {
	        var child = map[insert.key];
	        
	        if (insert.to >= children.length) {
	            $.appendChild(node, child);
	        } else {
	            $.insertBefore(children[insert.to], child);
	        }
	    });
	    
	    return node;
	}

	function updateProp(id, node, patch) {
	    _.each(patch, function (value, name) {
	        if (_.isUndefined(value)) {
	            node.removeAttribute(name);
	        } else {
	            node.setAttribute(name, value);
	        }
	    });
	}

	function updateView(id, node, patch) {
	    var result;

	    result = VX.render(node.vxId, patch);

	    return result;
	}

	function patchIndices(patches) {
	    var indices = [],
	        key;

	    for (key in patches) {
	        if (key !== 'a') {
	            indices.push(Number(key));
	        }
	    }

	    return indices;
	}

	function domSearch(node, vnode, indices) {
	    if (indices.length === 0) {
	        return {};
	    } else {
	        return recurse(node, vnode, 0, indices.sort(asc), {});
	    }
	}

	function recurse(node, vnode, index, indices, nodes) {
	    var prev,
	        next;
	    
	    if (search(indices, index, index)) {
	        nodes[index] = node || null;
	    }
	    
	    if (node && vnode && vnode.count) {
	        node = node.firstChild;
	        prev = index;
	        
	        _.each(vnode.children, function (vnode, i) {
	            prev = prev + 1;
	            next = prev + (vnode.count || 0);
	            
	            if (search(indices, prev, next)) {
	                recurse(node, vnode, prev, indices, nodes);
	            }
	            
	            node = node.nextSibling;
	            prev = next;
	        });
	    }
	    
	    return nodes;
	}

	function search(indices, left, right) {
	    var min = 0,
	        max = indices.length - 1,
	        index,
	        item;
	    
	    if (indices.length === 0) {
	        return false;
	    }

	    while (min <= max) {
	        index = ((max + min) / 2) >> 0;
	        item = indices[index];

	        if (min === max) {
	            return item >= left && item <= right;
	        } else if (item < left) {
	            min = index + 1;
	        } else  if (item > right) {
	            max = index - 1;
	        } else {
	            return true;
	        }
	    }

	    return false;
	}
	    
	function asc(a, b) {
	    return a > b ? 1 : -1;
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Type = __webpack_require__(6),

	    _ = __webpack_require__(1);

	exports.cache = {};

	exports.render = function (vxid, vnode) {
	    var view;

	    if (vnode.type !== Type.NODE_VIEW) {
	        return null;
	    }
	    
	    if (exports.cache[vxid]) {
	        view = exports.cache[vxid];
	        view.set(vnode.props, vnode.children);
	    } else {
	        view = new vnode.name(vxid, vnode.props, vnode.children);
	        exports.cache[vxid] = view;
	    }
	        
	    return view.node;
	};

	exports.destory = function (vxid, vnode) {
	    var rvxId = new RegExp('^' + vxid.replace('.', '\\\.') + '(?:\\\.|$)');
	    
	    _.each(exports.cache, function (view, vxid) {
	        if (rvxId.test(vxid)) {
	            view.destory();
	            exports.cache[vxid] = null;
	        }
	    });

	    return null;
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(4),
	    Type = __webpack_require__(6),
	    
	    _ = __webpack_require__(1);

	exports.views = {};

	exports.view = function (name, proto, global) {
	    function Child(id, props, children) {
	        View.call(this, id, props, children, name);
	    }

	    function Proxy() {

	    }

	    Proxy.prototype = View.prototype;
	    Child.prototype = new Proxy();

	    if (proto && _.isFunction(proto)) {
	        proto = {
	            template: proto
	        };
	    }

	    _.extend(Child.prototype, proto || {});
	    _.extend(Child, global || {});

	    exports.views[name] = Child;
	};

	exports.create = function (name, props, children) {
	    var type,
	        key,
	        count;

	    if (!_.isPlainObject(props)) {
	        children = props;
	        props = {};
	    }

	    if (!_.isArray(children)) {
	        children = [children];
	    }

	    props = _.reduce(props, function (props, value, name) {
	        value = _.isFunction(value) ? value() : value;
	        props[name] = value;

	        return props;
	    }, {});

	    children = _.reduce(children, function (children, child) {
	        var i,
	            len;

	        child = _.isFunction(child) ? child() : child;

	        if (!_.isUndefined(child) && child !== '') {
	            if (_.isArray(child)) {
	                i = -1;
	                len = child.length;

	                while (++i < len) {
	                    children.push(child[i]);
	                }
	            } else {
	                children.push(child);
	            }
	        }

	        return children;
	    }, []);

	    if (name in exports.views) {
	        name = exports.views[name];

	        type = Type.NODE_VIEW;
	        key = props.key;
	        count = 0;
	    } else {
	        type = Type.NODE_ELEM;
	        key = props.key;
	        count = children.length;

	        _.each(children, function (child) {
	            count += child.count || 0;
	        });
	    }

	    return {
	        type: type,
	        name: name,
	        props: props,
	        children: children,
	        key: key,
	        count: count
	    };
	};

/***/ }
/******/ ])
});
;