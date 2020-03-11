// https://github.com/jhartikainen/dompath
// The MIT License (MIT)

// Copyright (c) 2015 Jani Hartikainen

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function(window, document) {
	window.dompath = function(el, parent) {
		parent = parent || document.body;
		if(el.nodeName) {
			return new DomPath(pathNode(el, parent));
		}

		return new DomPath(el.node);
	};

	var getSelector = function(node) {
		if(node.id !== '') {
			return '#' + node.id;
		}

		var root = '';
		if(node.parent) {
			root = getSelector(node.parent) + ' > ';
		}

		return root + node.name + ':nth-child(' + (node.index + 1) + ')';
	};

	var DomPath = function(node) { this.node = node; };
	DomPath.prototype = {
		toCSS: function() {
			return getSelector(this.node);
		},
	
		select: function() {
			if(this.node.id !== '') {
				return document.getElementById(this.node.id);
			}

			return document.querySelector(this.toCSS());
		}
	};

	var pathNode = function(el, root) {
		var node = {
			id: el.id,
			name: el.nodeName.toLowerCase(),
			index: childIndex(el),
			parent: null
		};

		if(el.parentElement && el.parentElement !== root) {
			node.parent = pathNode(el.parentElement, root);
		}

		return node;
	};

	var childIndex = function(el) {
		var idx = 0;
		while(el = el.previousSibling) {
			if(el.nodeType == 1) {
				idx++;
			}
		}

		return idx;
	};
})(window, document);