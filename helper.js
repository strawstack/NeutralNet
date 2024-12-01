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
                r: 50,
                cx: x,
                cy: y
            },
            style: {
                fill: "white",
                stroke: "#222",
                strokeWidth: 3
            }
        });
        svg.appendChild(node);
    }

    function subv(a, b) {
        return {
            x: a.x - b.x,
            y: a.y - b.y
        };
    }

    function magv(a) {
        return Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2));
    }

    const uid = (() => {
        let id = -1;
        return () => {
            id += 1;
            return id;
        };
    });

    return {
        createVertex,
        subv,
        magv,
        uid
    };
}