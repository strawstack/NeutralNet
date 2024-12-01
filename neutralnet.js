import { helper } from './helper.js';
import { hyperspace } from './hyperspace.js';

export function neutralnet() {
    const svg = document.querySelector("svg");

    const {
        createVertex
    } = helper({ svg });

    //
    // Helper
    //
    const uid = (() => {
        let id = -1;
        return () => {
            id += 1;
            return id;
        };
    });

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
                isDown: false
            }
        }
    };

    function render(s) {
        // If new state nodes are present, create svg nodes for them

        // If svg nodes are present without state nodes, delete them

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
        createVertex(
            hs(state.data.mouse.pos)
        );
    });

    function mousemove(e) {
        state.data.mouse.pos = {
            x: e.clientX,
            y: e.clientY
        };
    }

    function mousedown(e) {

    }

    function mouseup(e) {

    }
}