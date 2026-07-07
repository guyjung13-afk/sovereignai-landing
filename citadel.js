(function () {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mobile nav
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', function () {
            var open = links.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open);
        });
        links.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                links.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // WebGL resonant field
    if (!reducedMotion) {
        var canvas = document.getElementById('resonant-field');
        if (canvas) {
            var gl = canvas.getContext('webgl');
            if (gl) {
                var vs = 'attribute vec2 p; void main(){ gl_Position=vec4(p,0,1); gl_PointSize=1.5; }';
                var fs = 'precision mediump float; void main(){ gl_FragColor=vec4(0.83,0.68,0.21,0.25); }';
                var compile = function (t, s) {
                    var sh = gl.createShader(t);
                    gl.shaderSource(sh, s);
                    gl.compileShader(sh);
                    return sh;
                };
                var prog = gl.createProgram();
                gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
                gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
                gl.linkProgram(prog);
                gl.useProgram(prog);
                var buf = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buf);
                var pts = [];
                for (var i = 0; i < 1000; i++) pts.push(Math.random() * 2 - 1, Math.random() * 2 - 1);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pts), gl.STATIC_DRAW);
                var pos = gl.getAttribLocation(prog, 'p');
                gl.enableVertexAttribArray(pos);
                gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
                function render() {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    gl.viewport(0, 0, canvas.width, canvas.height);
                    gl.clearColor(0, 0, 0, 0);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    gl.drawArrays(gl.POINTS, 0, 800);
                    requestAnimationFrame(render);
                }
                render();
            }
        }
    } else if (document.getElementById('resonant-field')) {
        document.getElementById('resonant-field').style.display = 'none';
    }

    // Sigil scroll rotation
    var sigil = document.getElementById('hero-sigil');
    if (sigil && !reducedMotion) {
        window.addEventListener('scroll', function () {
            sigil.style.transform = 'rotate(' + (window.scrollY * 0.05) + 'deg)';
        }, { passive: true });
    }

    // Scramble text
    if (!reducedMotion) {
        document.querySelectorAll('.scramble-target').forEach(function (target) {
            var originalText = target.innerText;
            var scrambleChars = '!<>-_\\/[]{}—=+*^?';
            var scrambleFrame = 0;
            function runScramble() {
                if (scrambleFrame < 25) {
                    target.innerText = originalText.split('').map(function () {
                        return scrambleChars[Math.floor(scrambleChars.length * Math.random())];
                    }).join('');
                    scrambleFrame++;
                    setTimeout(runScramble, 60);
                } else {
                    target.innerText = originalText;
                }
            }
            var scrambleObserver = new IntersectionObserver(function (e) {
                if (e[0].isIntersecting) runScramble();
            });
            scrambleObserver.observe(target);
        });
    }

    // Hero staggered entrance
    var heroReveals = document.querySelectorAll('#hero-section .hero-reveal');
    if (heroReveals.length) {
        if (reducedMotion) {
            heroReveals.forEach(function (el) { el.classList.add('is-visible'); });
        } else {
            window.addEventListener('load', function () {
                heroReveals.forEach(function (el, i) {
                    setTimeout(function () {
                        el.classList.add('is-visible');
                    }, 200 + i * 180);
                });
            });
        }
    }

})();