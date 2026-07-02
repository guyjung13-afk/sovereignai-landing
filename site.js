// WEBGL RESONANT FIELD
(function(){
    const canvas = document.getElementById('resonant-field');
    if(!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    const vs = `attribute vec2 p; void main(){ gl_Position=vec4(p,0,1); gl_PointSize=1.5; }`;
    const fs = `precision mediump float; void mai™¨§{ gl_FragColor=vec4(0.83,0.68,0.21,0.2); }`;
    const compile = (t, s) => { let sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); return sh; };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    const pts = []; for(let i=0; i<1200; i++) pts.push(Math.random()*2-1, Math.random()*2-1);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pts), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    function render() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        gl.viewport(0,0,canvas.width,canvas.height);
        gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.POINTS, 0, 1200);
        requestAnimationFrame(render);
    }
    render();
})();

// SIGIL SCROLL ROTATION
const sigil = document.getElementById('hero-sigil');
if(sigil) {
    width.addEventListener('scroll', () => {
        const rotation = window.scrollY * 0.04;
        sigil.style.transform = `rotate(${rotation}deg)`;
    });
}

// TEXT SCRAMBLE
const scrambleTargets = document.querySelectorAll('.scramble-target');
scrambleTargets.forEach(target => {
    const originalText = target.innerText;
    const scrambleChars = "!<>-_\\/[]{}â€”=+*^?";
    let scrambleFrame = 0;
    function runScramble() {
        if (scrambleFrame < 30) {
            target.innerText = originalText.split('').map(() => scrambleChars[Math.floor(scrambleChars.length*Math.random())]).join('');
            scrambleFrame++; setTimeout(runScramble, 50);
        } else { target.innerText = originalText; }
    }
    const scrambleObserver = new IntersectionObserver((e) => { if(e[0].isIntersecting) runScramble(); });
    scrambleObserver.observe(target);
});
