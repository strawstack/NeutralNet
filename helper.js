export function helper({ svg }) {
    function createNode(type, { attr, style }) {
        const node = document.createElementNS("http://www.w3.org/2000/svg", type);
        for (const k in attr) {
            node.setAttribute(k, attr[k]);
        }
        for (const k in style) {
            node.style[k] = style[k];
        }
        return node;
    }
    
    function createVertex({ x, y }) {
        const node = createNode("circle", {
            attr: {
                r: 100,
                cx: x,
                cy: y
            },
            style: {
    
            }
        });
        svg.appendChild(node);
    }

    return {
        createVertex
    };
}