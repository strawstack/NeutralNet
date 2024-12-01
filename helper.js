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
    
    function createVertex({ id, pos }) {
        const node = createNode("circle", {
            attr: {
                class: 'vertex',
                r: 50,
                cx: pos.x,
                cy: pos.y,
                'data-id': id
            },
            style: {
                fill: "white",
                stroke: "#555",
                strokeWidth: 3
            }
        });
        svg.appendChild(node);
        return node;
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
    })();

    function qs(s) {
        return document.querySelector(s);
    }

    function qsa(s) {
        return document.querySelectorAll(s);
    }

    function addVertex(state, data) {
        const base = {
            pos: {x: 0, y: 0},
            data: {
                style: {}
            },
            edges: []
        };
        state.verticies[data.id] = {...base, ...data};
    }

    function vertexData(data) {

        return ;
    }

    return {
        createVertex,
        addVertex,
        subv,
        magv,
        uid,
        qsa
    };
}