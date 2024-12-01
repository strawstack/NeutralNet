import { helper } from './helper.js';
import { hyperspace } from './hyperspace.js';

export function neutralnet() {
    const svg = document.querySelector("svg");

    const {
        createVertex,
        addVertex,
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
            }
        }
    };

    function render(s) {
        const verticies = (() => {
            const lookup = {};
            qsa(".vertex").forEach(v => {
                const vid = v.dataset.id;
                lookup[vid] = v;
            });
            return lookup;
        })();

        const newVerticies = Object.values(state.verticies).filter(({ id }) => {
            return !(id in verticies);
        });

        // If new state nodes are present, create svg nodes for them
        newVerticies.forEach(({id, pos}) => createVertex({id, pos}));

        const oldVerticies = Object.keys(verticies).map((vid) => {
            return (!(vid in state.verticies)) ? verticies[vid] : null;
        }).filter(v => v !== null);

        // If svg nodes are present without state nodes, delete them
        oldVerticies.forEach(v => v.remove());

        // Position and style svg nodes according to state
        
        requestAnimationFrame(() => render(state));
    }
    requestAnimationFrame(() => render(state));

    const { toHyperspace: hs } = hyperspace({
        svg,
        mousedown,
        mousemove,
        mouseup
    });

    //
    // Events
    //
    svg.addEventListener("click", e => {
        if (state.data.mouse.isClick) {
            addVertex(state, {
                id: uid(),
                pos: hs(state.data.mouse.pos)
            });
        }
    });

    function mousemove(e) {
        state.data.mouse.pos = {
            x: e.clientX,
            y: e.clientY
        };

        // If mouse moves while down, it doesn't count as a click
        const { pos, downLocation, clickLimit } = state.data.mouse;
        if (magv(subv(pos, downLocation)) > clickLimit) {
            state.data.mouse.isClick = false;
        }
    }

    function mousedown(e) {
        state.data.mouse.isClick = true;
        state.data.mouse.downLocation = state.data.mouse.pos;
    }

    function mouseup(e) {

    }

    window.addEventListener("keydown", e => {
        delete state.verticies['0'];
    });
}