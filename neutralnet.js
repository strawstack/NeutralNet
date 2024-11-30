import { hyperspace } from './hyperspace.js';

export function neutralnet() {

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
            
        }
    };

    function render(s) {
        // If new state nodes are present, create svg nodes for them

        // If svg nodes are present without state nodes, delete them

        // Position and style svg nodes according to state
    }

    hyperspace(
        document.querySelector("svg")
    );

    //
    // Events
    //
    

}