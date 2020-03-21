// Modified version of https://github.com/jhartikainen/dompath
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

type DomPathNode = {
    parent: DomPathNode | null;
    name: string;
    id: string;
    index: number;
};

type TDomPath = {
    node: DomPathNode;
    toCSS(): string;
};

class DomPath implements TDomPath {
    constructor (node: DomPathNode) {
        this.node = node;
    }
    node: DomPathNode;

    toCSS = (): string => getSelector(this.node);
}

const getSelector = (node: DomPathNode): string => node.id !== '' ?
    `#${node.id}`
    : `${node.parent ? `${getSelector(node.parent)} > ` : ''}${node.name}:nth-child(${(node.index + 1)})`;

const domPath = (element: HTMLElement): TDomPath => new DomPath(pathNode(element));

const pathNode = (element: HTMLElement): DomPathNode => ({
    id: element.id,
    name: element.nodeName.toLowerCase(),
    index: childIndex(element),
    parent: element.parentElement && element.parentElement !== document.body ? pathNode(element.parentElement) : null
});

const childIndex = function (element: HTMLElement) {
	let index: number = 0;
	while (element = element.previousSibling as HTMLElement) {
		if (element.nodeType == 1) {
			index++;
		}
	}

	return index;
};

export default domPath;