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

    // Hero entrance + subtle sigil parallax
    var hero = document.getElementById('hero-section');
    if (hero && !reducedMotion) {
        hero.classList.add('is-pending');
        var reveal = function () {
            // Force reflow so the pending state is painted before reveal
            void hero.offsetWidth;
            hero.classList.remove('is-pending');
            hero.classList.add('is-ready');
        };
        if (document.readyState === 'complete') {
            setTimeout(reveal, 80);
        } else {
            window.addEventListener('load', function () {
                setTimeout(reveal, 80);
            });
        }
    }

    var sigil = document.getElementById('hero-sigil');
    if (sigil && !reducedMotion) {
        var sigilRaf = 0;
        window.addEventListener('scroll', function () {
            if (sigilRaf) return;
            sigilRaf = requestAnimationFrame(function () {
                sigil.style.transform = 'rotate(' + (window.scrollY * 0.04) + 'deg)';
                sigilRaf = 0;
            });
        }, { passive: true });
    }

    // Scramble text (once per heading on scroll-in).
    // Fail-safe: always restore original text; never leave garbage mid-string.
    document.querySelectorAll('.scramble-target').forEach(function (target) {
        var originalText = (target.textContent || '').replace(/\s+/g, ' ').trim();
        if (!originalText) return;
        target.setAttribute('data-scramble-original', originalText);

        function restore() {
            target.textContent = originalText;
        }

        if (reducedMotion) {
            restore();
            return;
        }

        // Prefer glyphs that do not look like broken markup (avoid \ / [ ] { })
        var scrambleChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#@$%*+=';
        var totalFrames = 10;
        var frameMs = 26;
        var hasScrambled = false;
        var timer = 0;
        var failSafe = 0;

        function runScramble(frame) {
            if (frame >= totalFrames) {
                restore();
                if (failSafe) {
                    clearTimeout(failSafe);
                    failSafe = 0;
                }
                return;
            }

            var settled = Math.floor((frame / totalFrames) * originalText.length);
            var out = '';
            for (var i = 0; i < originalText.length; i++) {
                var ch = originalText.charAt(i);
                if (ch === ' ' || ch === '\u00a0' || ch === '-' || ch === '\u2014' || ch === '\u2013') {
                    out += ch;
                } else if (i < settled) {
                    out += ch;
                } else {
                    out += scrambleChars.charAt(Math.floor(Math.random() * scrambleChars.length));
                }
            }
            target.textContent = out;
            timer = window.setTimeout(function () {
                runScramble(frame + 1);
            }, frameMs);
        }

        var scrambleObserver = new IntersectionObserver(function (entries) {
            if (!entries[0] || !entries[0].isIntersecting || hasScrambled) return;
            hasScrambled = true;
            scrambleObserver.disconnect();

            // Absolute fail-safe: never leave scrambled text longer than ~1s
            failSafe = window.setTimeout(restore, totalFrames * frameMs + 400);
            runScramble(0);
        }, { threshold: 0.2, rootMargin: '0px 0px -5% 0px' });

        scrambleObserver.observe(target);

        // If tab sleeps mid-animation, restore immediately
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                if (timer) clearTimeout(timer);
                if (failSafe) clearTimeout(failSafe);
                restore();
            }
        });
    });

})();
