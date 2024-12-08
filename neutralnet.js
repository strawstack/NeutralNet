import { helper } from './helper.js';
import { hyperspace } from './hyperspace.js';

export function neutralnet() {
    const svg = document.querySelector("svg");

    const {
        createVertex,
        addVertex,
        addv,
        subv,
        magv,
        uid,
        qsa
    } = helper({ svg });

    const state = {
        verticies: {
            // [vid]: {
            //     pos: {x: null, y: null},
            //     data: {
            //         style: {}
            //     },
            //     edges: [eid]
            // }, ...
        },
        edges: {
            // [eid]: {
            //     from: vid,
            //     to: vid,
            //     bidirection: true,
            //     data: {
            //         style: {}
            //     }
            // }, ...
        },
        data: {
            mouse: {
                pos: { x: 0, y: 0 },
                isDown: false,
                isClick: false,
                downLocation: { x: 0, y: 0 },
                clickLimit: 5
            },
            select: {
                target: null,
                offset: null
            }
        }
    };

    const { toHyperspace: hs } = hyperspace({
        svg,
        mousedown,
        mousemove,
        mouseup
    });

    function render(s) {
        const verticies = (() => {
            const lookup = {};
            qsa(".vertex").forEach(v => {
                const vid = v.dataset.id;
                lookup[vid] = v;
            });
            return lookup;
        })();

        const newVerticies = Object.values(s.verticies).filter(({ id }) => {
            return !(id in verticies);
        });

        // If new state nodes are present, create svg nodes for them
        newVerticies.forEach(({id, pos}) => {
            const vertex = createVertex({id, pos});
            verticies[id] = vertex;
            vertex.addEventListener("mousedown", e => {
                s.data.select.target = vertex;
                const { pos } = s.verticies[id];
                const offset = subv(pos, hs(s.data.mouse.pos));
                s.data.select.offset = offset;
                e.stopPropagation();
            });
            vertex.addEventListener("mouseup", e => {
                s.data.select.target = null;
                e.stopPropagation();
            });

        });

        const oldVerticies = Object.keys(verticies).map((vid) => {
            return (!(vid in state.verticies)) ? verticies[vid] : null;
        }).filter(v => v !== null);

        // If svg nodes are present without state nodes, delete them
        oldVerticies.forEach(v => v.remove());

        // Position verticies
        for (let vid in verticies) {
            const { pos } = s.verticies[vid];
            const ref = verticies[vid];
            ref.setAttribute("cx", pos.x);
            ref.setAttribute("cy", pos.y);
        }
        
        // Style svg nodes according to state
        
        requestAnimationFrame(() => render(state));
    }
    requestAnimationFrame(() => render(state));

    //
    // Events
    //

    function mousemove(e) {
        state.data.mouse.pos = {
            x: e.clientX,
            y: e.clientY
        };

        // If mouse moves while down, it doesn't count as a click
        const { pos, downLocation, clickLimit } = state.data.mouse;
        if (magv(subv(pos, hs(downLocation))) > clickLimit) {
            state.data.mouse.isClick = false;
        }

        if (state.data.select.target) {
            const vertex = state.data.select.target;
            const vid = vertex.dataset.id;
            state.verticies[vid].pos = addv(hs(state.data.mouse.pos), state.data.select.offset);
        }
    }

    function mousedown(e) {
        state.data.mouse.isClick = true;
        state.data.mouse.downLocation = state.data.mouse.pos;
    }

    function mouseup(e) {
        if (state.data.mouse.isClick) {
            addVertex(state, {
                id: uid(),
                pos: hs(state.data.mouse.pos)
            });
        }
    }
}