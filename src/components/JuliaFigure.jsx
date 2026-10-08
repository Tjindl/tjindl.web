import { useEffect, useRef } from 'react';
import './JuliaFigure.css';

// Region of the c-plane the pointer steers through; the inset shows the same region.
const C_RE = [-1.6, 0.5];
const C_IM = [-1.1, 1.1];
const ORBIT_RADIUS = 0.7885;  // c = 0.7885·e^(ia) loops through especially intricate Julia sets
const ORBIT_SPEED = 0.0035;   // radians per frame
const START_ANGLE = 2.2;
const EASING = 0.08;          // how quickly c follows its target each frame
const KEY_STEP = 0.02;
const BADGE_EVERY = 12;       // frames between membership checks, so the badge doesn't strobe near ∂M

const VERTEX_SHADER = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Escape-time rendering of the filled Julia set of f(z) = z² + c, with smooth iteration counts.
const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform vec2 u_c;
uniform vec3 u_bg;
uniform vec3 u_accent;
uniform vec3 u_glow;
uniform vec3 u_edge;
uniform vec3 u_ink;
uniform float u_haze;
const int MAX_ITER = 200;

void main() {
    // The shorter side of the canvas spans [-1.35, 1.35] in the complex plane.
    vec2 z = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y) * 2.7;
    float n = 0.0;
    bool escaped = false;
    for (int i = 0; i < MAX_ITER; i++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + u_c;
        if (dot(z, z) > 256.0) { escaped = true; break; }
        n += 1.0;
    }
    // The interior continues the escape gradient's last step: edge colour into ink.
    vec3 col = mix(u_edge, u_ink, 0.6);
    if (escaped) {
        float smoothN = n + 1.0 - log2(0.5 * log2(dot(z, z)));
        float t = log(max(smoothN, 1.0)) / log(float(MAX_ITER));
        // Slow-escaping points sit near the set: a glow far out, a body in the primary accent, then the edge
        // colour (gold embers in dark mode, oxblood ink in light).
        col = mix(u_bg, u_glow, smoothstep(0.14, 0.44, t) * u_haze);
        col = mix(col, u_accent, smoothstep(0.38, 0.66, t));
        col = mix(col, u_edge, smoothstep(0.68, 0.93, t));
        col = mix(col, u_ink, smoothstep(0.93, 1.0, t) * 0.4);
    }
    gl_FragColor = vec4(col, 1.0);
}
`;

function parseColor(value) {
    const v = value.trim();
    if (v.startsWith('#')) {
        let hex = v.slice(1);
        if (hex.length === 3) hex = [...hex].map((ch) => ch + ch).join('');
        const n = parseInt(hex, 16);
        return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    }
    const parts = v.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
    return parts.slice(0, 3).map((x) => x / 255);
}

function readTheme() {
    const style = getComputedStyle(document.documentElement);
    return {
        bg: parseColor(style.getPropertyValue('--bg-darker')),
        accent: parseColor(style.getPropertyValue('--primary-rgb')),
        glow: parseColor(style.getPropertyValue('--julia-glow-rgb')),
        edge: parseColor(style.getPropertyValue('--julia-edge-rgb')),
        ink: parseColor(style.getPropertyValue('--text-primary')),
        haze: parseFloat(style.getPropertyValue('--julia-haze')) || 0.8,
    };
}

function inMandelbrot(re, im, maxIter = 500) {
    let x = 0;
    let y = 0;
    for (let i = 0; i < maxIter; i++) {
        [x, y] = [x * x - y * y + re, 2 * x * y + im];
        if (x * x + y * y > 4) return false;
    }
    return true;
}

const formatComplex = ({ re, im }) => {
    const f = (v) => Math.abs(v).toFixed(3);
    return `${re < 0 ? '−' : ''}${f(re)} ${im < 0 ? '−' : '+'} ${f(im)}i`;
};

// Maps a position in [0,1]² (from the top-left) to the c-plane region.
const toC = (u, v) => ({
    re: C_RE[0] + u * (C_RE[1] - C_RE[0]),
    im: C_IM[1] - v * (C_IM[1] - C_IM[0]),
});

function compileProgram(gl) {
    const compile = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
        return shader;
    };
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX_SHADER));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    return program;
}

function JuliaFigure() {
    const stageRef = useRef(null);
    const canvasRef = useRef(null);
    const insetRef = useRef(null);
    const valueRef = useRef(null);
    const badgeRef = useRef(null);
    const hintRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl', { antialias: false });
        let program;
        try {
            program = gl && compileProgram(gl);
        } catch {
            program = null;
        }
        if (!program) {
            stageRef.current.classList.add('is-unsupported');
            return;
        }

        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        // One oversized triangle covers the whole viewport.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const aPos = gl.getAttribLocation(program, 'a_pos');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
        const uniform = (name) => gl.getUniformLocation(program, name);
        const u = {
            res: uniform('u_res'), c: uniform('u_c'), bg: uniform('u_bg'), accent: uniform('u_accent'),
            glow: uniform('u_glow'), edge: uniform('u_edge'), ink: uniform('u_ink'), haze: uniform('u_haze'),
        };

        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const inset = insetRef.current;
        const insetCtx = inset.getContext('2d');
        let theme = readTheme();
        let insetImage = null;
        let angle = START_ANGLE;
        let c = { re: ORBIT_RADIUS * Math.cos(angle), im: ORBIT_RADIUS * Math.sin(angle) };
        let pointerC = null;
        let dirty = true;
        let raf = null;
        let visible = false;
        let lastMember = null;
        let framesSinceBadge = BADGE_EVERY;

        // The Mandelbrot set M over the steering region, rendered once per theme/size.
        const renderInset = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = Math.round(inset.clientWidth * dpr);
            const h = Math.round(inset.clientHeight * dpr);
            if (!w || !h) return;
            inset.width = w;
            inset.height = h;
            const image = insetCtx.createImageData(w, h);
            const accent = theme.accent.map((x) => x * 255);
            const glow = theme.glow.map((x) => x * 255);
            // M itself takes the same fill as a connected Julia set's interior (see the shader).
            const [ir, ig, ib] = theme.edge.map((v, c) => (v + (theme.ink[c] - v) * 0.6) * 255);
            for (let py = 0; py < h; py++) {
                for (let px = 0; px < w; px++) {
                    const { re, im } = toC(px / w, py / h);
                    let x = 0;
                    let y = 0;
                    let n = 0;
                    while (n < 80 && x * x + y * y <= 4) {
                        [x, y] = [x * x - y * y + re, 2 * x * y + im];
                        n++;
                    }
                    const i = (py * w + px) * 4;
                    if (n === 80) {
                        image.data.set([ir, ig, ib, 200], i);
                    } else {
                        // Escape bands shade from the glow (fast) to the primary accent (near M's boundary).
                        const k = Math.min(1, n / 18);
                        const rgb = glow.map((v, c) => v + (accent[c] - v) * k);
                        image.data.set([...rgb, Math.min(255, n * 9)], i);
                    }
                }
            }
            insetImage = image;
        };

        const drawInset = () => {
            if (!insetImage) return;
            insetCtx.putImageData(insetImage, 0, 0);
            const x = ((c.re - C_RE[0]) / (C_RE[1] - C_RE[0])) * inset.width;
            const y = ((C_IM[1] - c.im) / (C_IM[1] - C_IM[0])) * inset.height;
            const dpr = inset.width / inset.clientWidth;
            insetCtx.fillStyle = `rgb(${theme.accent.map((v) => v * 255).join(',')})`;
            insetCtx.strokeStyle = `rgb(${theme.bg.map((v) => v * 255).join(',')})`;
            insetCtx.lineWidth = 2 * dpr;
            insetCtx.beginPath();
            insetCtx.arc(x, y, 4 * dpr, 0, Math.PI * 2);
            insetCtx.fill();
            insetCtx.stroke();
        };

        const draw = () => {
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(u.res, canvas.width, canvas.height);
            gl.uniform2f(u.c, c.re, c.im);
            gl.uniform3fv(u.bg, theme.bg);
            gl.uniform3fv(u.accent, theme.accent);
            gl.uniform3fv(u.glow, theme.glow);
            gl.uniform3fv(u.edge, theme.edge);
            gl.uniform3fv(u.ink, theme.ink);
            gl.uniform1f(u.haze, theme.haze);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            drawInset();

            valueRef.current.textContent = formatComplex(c);
            if (++framesSinceBadge < BADGE_EVERY) return;
            framesSinceBadge = 0;
            const member = inMandelbrot(c.re, c.im);
            if (member !== lastMember) {
                lastMember = member;
                badgeRef.current.textContent = member ? 'c ∈ M · connected' : 'c ∉ M · Cantor dust';
                badgeRef.current.classList.toggle('is-dust', !member);
            }
        };

        const frame = () => {
            if (!pointerC && !still) angle += ORBIT_SPEED;
            const target = pointerC ?? { re: ORBIT_RADIUS * Math.cos(angle), im: ORBIT_RADIUS * Math.sin(angle) };
            const dRe = target.re - c.re;
            const dIm = target.im - c.im;
            if (Math.abs(dRe) + Math.abs(dIm) > 1e-5) {
                c = { re: c.re + dRe * EASING, im: c.im + dIm * EASING };
                dirty = true;
            }
            if (dirty) {
                draw();
                dirty = false;
            }
            raf = requestAnimationFrame(frame);
        };

        const start = () => {
            if (raf === null && visible) raf = requestAnimationFrame(frame);
        };
        const stop = () => {
            if (raf !== null) cancelAnimationFrame(raf);
            raf = null;
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(canvas.clientWidth * dpr);
            canvas.height = Math.round(canvas.clientHeight * dpr);
            renderInset();
            dirty = true;
            if (raf === null) draw();
        };

        const hideHint = () => hintRef.current?.classList.add('is-hidden');
        const onPointer = (e) => {
            const rect = canvas.getBoundingClientRect();
            pointerC = toC((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height);
            hideHint();
        };
        const onLeave = () => {
            pointerC = null;
        };
        const onKeyDown = (e) => {
            const moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] };
            const move = moves[e.key];
            if (!move) return;
            e.preventDefault();
            const from = pointerC ?? c;
            pointerC = {
                re: Math.min(C_RE[1], Math.max(C_RE[0], from.re + move[0] * KEY_STEP)),
                im: Math.min(C_IM[1], Math.max(C_IM[0], from.im + move[1] * KEY_STEP)),
            };
            hideHint();
        };
        canvas.addEventListener('pointermove', onPointer);
        canvas.addEventListener('pointerdown', onPointer);
        canvas.addEventListener('pointerleave', onLeave);
        canvas.addEventListener('pointercancel', onLeave);
        canvas.addEventListener('keydown', onKeyDown);
        canvas.addEventListener('blur', onLeave);

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);

        const intersection = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
            else stop();
        });
        intersection.observe(canvas);

        const themeObserver = new MutationObserver(() => {
            theme = readTheme();
            renderInset();
            dirty = true;
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        return () => {
            stop();
            resizeObserver.disconnect();
            intersection.disconnect();
            themeObserver.disconnect();
            canvas.removeEventListener('pointermove', onPointer);
            canvas.removeEventListener('pointerdown', onPointer);
            canvas.removeEventListener('pointerleave', onLeave);
            canvas.removeEventListener('pointercancel', onLeave);
            canvas.removeEventListener('keydown', onKeyDown);
            canvas.removeEventListener('blur', onLeave);
        };
    }, []);

    return (
        <figure className="julia" id="fig-julia">
            <div className="julia-stage" ref={stageRef}>
                <canvas
                    ref={canvasRef}
                    className="julia-canvas"
                    tabIndex={0}
                    role="img"
                    aria-label="Interactive Julia set fractal. Move the pointer over it, or use the arrow keys, to change the constant c."
                />
                <div className="julia-inset-wrap" aria-hidden="true">
                    <canvas ref={insetRef} className="julia-inset" />
                    <span className="julia-inset-label">c-plane · M</span>
                </div>
                <span className="julia-hint" ref={hintRef} aria-hidden="true">
                    <span className="hint-pointer">move to explore</span>
                    <span className="hint-touch">drag to explore</span>
                </span>
                <p className="julia-fallback">This figure needs WebGL.</p>
            </div>

            <figcaption className="julia-caption">
                <p className="julia-title">
                    <span className="fig-label">Fig. 1</span>
                    The filled Julia set of{' '}
                    <span className="math-inline">
                        <i>f</i><sub><i>c</i></sub>(<i>z</i>) = <i>z</i><sup>2</sup> + <i>c</i>
                    </span>
                </p>
                <p className="julia-readout">
                    <span className="math-inline"><i>c</i> = <span ref={valueRef} className="julia-value" /></span>
                    <span ref={badgeRef} className="julia-badge" />
                </p>
                <p className="julia-text">
                    Each point <i className="math-inline">z</i> is shaded by how quickly its orbit under repeated
                    squaring-plus-<i className="math-inline">c</i> escapes to infinity. Move across the figure to
                    steer <i className="math-inline">c</i> through the plane (inset: the Mandelbrot set M). While{' '}
                    <i className="math-inline">c</i> lies in M the Julia set is connected; step outside and it
                    shatters into Cantor dust.
                </p>
            </figcaption>
        </figure>
    );
}

export default JuliaFigure;
