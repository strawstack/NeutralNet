export function hyperspace({
    svg: userSvg,
    mousemove,
    mousedown,
    mouseup
}) {
    const qs = s => document.querySelector(s);
    
    //
    // Inject SVG elements
    //
    const {
        rect,
        pattern,
        defs
    } = svgElements();

    //
    // REFS
    //
    const svg = userSvg || qs("svg");
    svg.appendChild(rect);
    svg.appendChild(defs);
    const patternDef = pattern;
    const patternArea = rect;

    //
    // HELPER
    //

    const mulv = (a, b) => {
        return {
            x: a.x * b,
            y: a.y * b
        };
    };

    const addv = (a, b) => {
        return {
            x: a.x + b.x,
            y: a.y + b.y
        };
    };

    const subv = (a, b) => {
        return {
            x: a.x - b.x,
            y: a.y - b.y
        };
    };

    function setStyleVar(name, value) {
        document.body.style.setProperty(
            name, `${value}px`
        );
    }

    function svgElements() {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("id", "pattern-rect");
        rect.style.fill = "url(#Pattern)";
        
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("id", "pattern-circle");
        circle.setAttribute("r", "4");
        circle.setAttribute("cx", "5");
        circle.setAttribute("cy", "5");
        circle.style.fill = "#ccc";

        const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
        pattern.setAttribute("id", "Pattern");
        pattern.setAttribute("x", "0");
        pattern.setAttribute("y", "0");
        pattern.setAttribute("width", "0.5");
        pattern.setAttribute("height", "0.5");

        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        
        defs.appendChild(pattern);
        pattern.appendChild(circle);

        return { rect, pattern, defs };
    }

    //
    // VAR
    //
    const {
        width: pageWidth,
        height: pageHeight
    } = document.body.getBoundingClientRect();

    const PAGES = 3;
    const DOT_SPACING = 50;

    patternArea.setAttribute("width", pageWidth * PAGES);
    patternArea.setAttribute("height", pageHeight * PAGES);
    patternDef.setAttribute("width", DOT_SPACING/(pageWidth * PAGES));
    patternDef.setAttribute("height", DOT_SPACING/(pageHeight * PAGES));

    setStyleVar("--viewport-width", pageWidth);
    setStyleVar("--viewport-height", pageHeight);

    //
    // STATE
    //
    const state = {
        data: {
            viewBox: {
                minx: pageWidth,
                miny: pageHeight,
                width: pageWidth,
                height: pageHeight,
            },
            aspectRatio: pageWidth / pageHeight,
            zoom: {
                step: 100,
                max: 1000,
                min: 1
            },
            mouse: {
                pos: {
                    x: 0, 
                    y: 0
                },
                isDown: false,
                lastDown: {
                    x: 0,
                    y: 0
                }
            }
        }
    };

    //
    // RENDER
    //
    function setViewbox({
        minx: mx,
        miny: my,
        width: vw,
        height: vh,
    }) {
        svg.setAttribute(
            "viewBox", 
            `${mx} ${my} ${vw} ${vh}`
        );
    }

    //
    // EVENTS
    //
    svg.addEventListener("wheel", e => {
        const dir = (e.deltaY > 0) ? 1 : -1;        
        const { aspectRatio } = state.data;
        
        const amountX = dir * state.data.zoom.step;
        const amountY = amountX / aspectRatio;

        // Max zoom in
        if (state.data.viewBox.width + amountX <= 0) {
            return;
        }
        
        state.data.viewBox.width += amountX;
        state.data.viewBox.height += amountY;
        
        const { minx, miny } = state.data.viewBox;
        let xpercent = state.data.mouse.pos.x / pageWidth;
        let ypercent = state.data.mouse.pos.y / pageHeight;

        // Max zoom out
        const zoomOutMax = pageWidth * PAGES;
        if (state.data.viewBox.width >= zoomOutMax) {
            state.data.viewBox.width = zoomOutMax;
            state.data.viewBox.height = zoomOutMax / aspectRatio;
            setViewbox(state.data.viewBox);
            return; // Don't adjust minx and miny if zoomed to max
        }

        state.data.viewBox.minx = minx + (-1 * amountX) * xpercent;
        state.data.viewBox.miny = miny + (-1 * amountY) * ypercent;
        setViewbox(state.data.viewBox);
    });
    svg.addEventListener("mousemove", e => {
        const pos = {
            x: e.clientX,
            y: e.clientY
        };

        if (state.data.mouse.isDown) {
            const delta = subv(
                state.data.mouse.pos,
                pos
            );

            const { minx, miny } = state.data.viewBox;
            const pixelRatio = state.data.viewBox.width / pageWidth;
            state.data.viewBox.minx = minx + delta.x * pixelRatio;
            state.data.viewBox.miny = miny + delta.y * pixelRatio;
        }

        state.data.mouse.pos = pos;
        setViewbox(state.data.viewBox);
        mousemove(e);
    });
    svg.addEventListener("mousedown", e => {
        state.data.mouse.isDown = true;
        mousedown(e);
    });
    svg.addEventListener("mouseup", e => {
        state.data.mouse.isDown = false;
        mouseup(e);
    });

    return {
        toHyperspace: ({x, y}) => {
            const pixelRatio = state.data.viewBox.width / pageWidth;
            const { minx, miny } = state.data.viewBox;
            return addv(
                mulv({x, y}, pixelRatio),
                { x: minx, y: miny }
            );
        }
    };
}