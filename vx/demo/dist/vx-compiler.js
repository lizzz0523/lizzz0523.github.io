(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["vx-compiler"] = factory();
	else
		root["vx-compiler"] = factory();
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
/***/ function(module, exports) {

	module.exports = compile;

	var block = makeMap('address,article,aside,bdi,blockquote,data,div,dl,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,li,main,menu,nav,ol,p,pre,s,section,table,template,ul'),
	    inline = makeMap('a,abbr,area,audio,b,base,bdo,br,button,canvas,cite,code,command,datalist,del,details,dfn,em,embed,fieldset,i,iframe,img,input,ins,kbd,keygen,label,link,map,mark,math,meta,meter,noscript,object,output,progress,q,ruby,samp,script,select,small,span,strong,style,sub,sup,svg,textarea,time,title,var,video,wbr'),
	    empty = makeMap('area,base,br,col,colgroup,command,hr,img,input,keygen,link,meta,param,source,track,wbr'),
	    special = makeMap('script,style'),
	    
	    closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr'),
	    fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');

	var rstartTag = /^<([-A-Za-z0-9_]+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
	    rendTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/,
	    rcomment = /<!--(.*?)-->/g,
	    rcdata = /<!\[CDATA\[(.*?)]]>/g,
	    rattr = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
	    
	var rscript = /\{([^\}]+)$|\{([\s\S]+)\}|^([^\{]+)\}|$/,
	    rprop = /^(?:\{([\s\S]+)\})|[\s\S]+$/,
	    rtrim = /^\s*|\s*$/g,
	    cache = {};

	function compile(source) {
	    var envir = [],
	        stack,
	        mode;

	    envir.pushStack = function (stack) {
	        this.push(stack);

	        stack.last = function () {
	            return this[this.length - 1];
	        };

	        return stack;
	    };

	    envir.popStack = function () {
	        this.pop();

	        return this[this.length - 1];
	    };

	    stack = envir.pushStack([]);
	    mode = 'script';

	    stack.push({
	        intro: '',
	        lines: [],
	        outro: ''
	    });

	    if (!cache[source]) {
	        parse(source.replace(rtrim, ''), {
	            start: function(name, props, unary) {
	                if (mode === 'script') {
	                    stack = envir.pushStack([]);
	                    mode = 'node';
	                }

	                stack.push({
	                    name: name,
	                    props: props,
	                    children: []
	                });

	                if (unary) {
	                    this.end(name);
	                }
	            },
	            end: function(name) {
	                var node = stack.pop(),
	                    parent = stack.last(),
	                    script,

	                    name = node.name,
	                    props = node.props,
	                    children = node.children,
	                    i,
	                    len,
	                    code;

	                code = 'vx.create("' + name + '",{';

	                i = -1;
	                len = props.length;

	                while (++i < len) {
	                    props[i].escaped.replace(rprop, function (all, script) {
	                        if (script) {
	                            code += '"' + props[i].name + '":vx.bind(function(){return ' + script + ';}, this),';
	                        } else {
	                            code += '"' + props[i].name + '":"' + all + '",';
	                        }
	                    });
	                }

	                if (code.substring(code.length - 1) === ',') {
	                    code = code.substring(0, code.length - 1);
	                }
	                code += '},[';

	                i = -1;
	                len = children.length;

	                while (++i < len) {
	                    code += children[i] + ',';
	                }

	                if (code.substring(code.length - 1) === ',') {
	                    code = code.substring(0, code.length - 1);
	                }
	                code += '])';

	                if (parent) {
	                    parent.children.push(code);
	                } else {
	                    stack = envir.popStack();
	                    mode = 'script';

	                    script = stack.last();
	                    script.lines.push(code);
	                }
	            },
	            chars: function(text) {
	                var index;

	                text.replace(rscript, vx.bind(function(match, intro, all, outro, offset) {
	                    var chars = text.slice(index, offset),
	                        code = all || intro || outro || '';

	                    if (chars = chars.replace(rtrim, '')) {
	                        this.text(chars);
	                    }

	                    if (code = code.replace(rtrim, '')) {
	                        if (all) {
	                            this.script(code);
	                        } else if (outro) {
	                            this.scriptOutro(code);
	                        } else if (intro) {
	                            this.scriptIntro(code);
	                        }
	                    }

	                    index = offset + match.length;
	                }, this));
	            },
	            text: function (code) {
	                var parent = stack.last(),
	                    script;

	                code = '"' + code + '"';

	                if (parent) {
	                    parent.children.push(code);
	                } else {
	                    stack = envir.popStack();
	                    mode = 'script';

	                    script = stack.last();
	                    script.lines.push(code);
	                }
	            },
	            script: function (code) {
	                var parent = stack.last(),
	                    script;

	                code = 'vx.bind(function(){return ' + code + ';}, this)';
	                    
	                if (parent) {
	                    parent.children.push(code);
	                } else {
	                    stack = envir.popStack();
	                    mode = 'script';

	                    script = stack.last();
	                    script.lines.push(code);
	                }
	            },
	            scriptIntro: function (code) {
	                if (mode === 'node') {
	                    stack = envir.pushStack([]);
	                    mode = 'script';
	                }

	                stack.push({
	                    intro: 'vx.bind(function(){return ',
	                    lines: [code],
	                    nodes: [],
	                    outro: ';}, this)'
	                });
	            },
	            scriptOutro: function (code) {
	                var script = stack.pop(),
	                    parent = stack.last(),
	                    node,

	                    intro = script.intro,
	                    lines = script.lines,
	                    outro = script.outro,
	                    i,
	                    len;

	                lines.push(code);
	                i = -1;
	                len = lines.length;
	                code = '';

	                code += intro;

	                while (++i < len) {
	                    code += lines[i];
	                }

	                code += outro;
	                
	                if (parent) {
	                    parent.lines.push(code);
	                } else {
	                    stack = envir.popStack();
	                    mode = 'node';

	                    node = stack.last();
	                    node.children.push(code);
	                }
	            }
	        });

	        cache[source] = new Function('', 'return ' + stack.pop().lines.join(''));
	    }

	    return cache[source];
	}

	function parse(html, handler) {
	    var index,
	        chars,
	        match,
	        text,
	        stack = [],
	        last = html;

	    stack.last = function() {
	        return this[this.length - 1];
	    };

	    while (html) {
	        chars = true;

	        if (!stack.last() || !special[stack.last()]) {
	            if (html.indexOf('<!--') == 0) {
	                index = html.indexOf('-->');

	                if (index >= 0) {
	                    if (handler.comment) {
	                        handler.comment(html.substring(4, index));
	                    }

	                    html = html.substring(index + 3);
	                    chars = false;
	                }
	            } else if (html.indexOf('</') == 0) {
	                match = html.match(rendTag);

	                if (match) {
	                    match[0].replace(rendTag, parseEndTag);

	                    html = html.substring(match[0].length);
	                    chars = false;
	                }
	            } else if (html.indexOf('<') == 0) {
	                match = html.match(rstartTag);

	                if (match) {
	                    match[0].replace(rstartTag, parseStartTag);

	                    html = html.substring(match[0].length);
	                    chars = false;
	                }
	            } 

	            if (chars) {
	                index = html.indexOf('<');

	                text = index < 0 ? html : html.substring(0, index);
	                html = index < 0 ? '' : html.substring(index);

	                if (handler.chars) {
	                    handler.chars(text);
	                }
	            }
	        } else {
	            html = html.replace(new RegExp('(.*)<\/' + stack.last() + '[^>]*>'), function(all, text) {
	                text = clear(text, rcomment, rcdata);

	                if (handler.chars) {
	                    handler.chars(text);
	                }

	                return '';
	            });

	            parseEndTag('', stack.last());
	        }

	        if (html == last) {
	            throw 'Parse Error: ' + html;
	        }

	        last = html;
	    }

	    parseEndTag('', '');

	    function clear(text) {
	        var args = [].slice(arguments, 1);

	        vx.each(args, function (rpattern) {
	            text = text.replace(rpattern, '$1');
	        });

	        return text;
	    }

	    function parseStartTag(tag, tagName, rest, unary) {
	        var attrs = [];

	        function available(arr, start, stop, memo) {
	            var ret = memo;

	            vx.each(arr, function (value, index) {
	                if (index >= start && index <= stop && value) {
	                    ret = value;
	                    return false;
	                }
	            });

	            return ret;
	        }

	        unary = empty[tagName] || !!unary;

	        if (block[tagName]) {
	            while (stack.last() && inline[stack.last()]) {
	                parseEndTag('', stack.last());
	            }
	        }

	        if (closeSelf[tagName] && stack.last() == tagName) {
	            parseEndTag('', stack.last());
	        }

	        if (!unary) {
	            stack.push(tagName);
	        }

	        if (handler.start) {
	            rest.replace(rattr, function(match, name) {
	                var value = available(arguments, 2, 4, fillAttrs[name] ? name : '');

	                attrs.push({
	                    name: name,
	                    value: value,
	                    escaped: value.replace(/(^|[^\\])"/g, '$1\\\"')
	                });
	            });

	            handler.start(tagName, attrs, unary);
	        }
	    }

	    function parseEndTag(tag, tagName) {
	        var pos = stack.length,
	            len = stack.length;

	        if (!tagName) {
	            pos = 0;
	        } else {
	            while (--pos >= 0) {
	                if (stack[pos] == tagName) {
	                    break;
	                }
	            }
	        }

	        if (pos >= 0) {
	            while (--len >= pos) {
	                if (handler.end) {
	                    handler.end(stack[len]);
	                }
	            }

	            stack.length = pos;
	        }
	    }
	}

	function makeMap(str) {
	    return vx.reduce(str.split(','), function (ret, name) {
	        ret[name] = true;
	        return ret;
	    }, {});
	}

	function autoload() {
	    var elems = document.querySelectorAll('[data-vx]');

	    vx.each(elems, function (elem) {
	        var name = elem.getAttribute('data-vx'),
	            tmpl = elem.innerHTML;

	        vx.view(name, {
	            template: compile(tmpl)
	        });
	    });
	}

	vx.domReady(autoload);

/***/ }
/******/ ])
});
;