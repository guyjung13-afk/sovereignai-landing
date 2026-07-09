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

    // Hero-only data rain (matrix trail) — less prominent; skips if reduced motion
    (function initDataRain() {
        var rain = document.getElementById('data-rain');
        if (!rain || !hero) return;

        if (reducedMotion) {
            rain.style.display = 'none';
            return;
        }

        var ctx = rain.getContext('2d');
        if (!ctx) return;

        var chars = '01SOVEREIGNAIWALLACEAIRGAPPRIVACYLOCALENCLAVEVAULTSPIRECITADEL'.split('');
        var fontSize = 13;
        var drops = [];
        var intervalId = 0;
        var heroVisible = true;

        function bleedPx() {
            // Match CSS: min(48vh, 460px) so glyphs keep falling past the hero line
            return Math.min(Math.floor(window.innerHeight * 0.48), 460);
        }

        function sizeCanvas() {
            var rect = hero.getBoundingClientRect();
            var w = Math.max(1, Math.floor(rect.width));
            var h = Math.max(1, Math.floor(rect.height) + bleedPx());
            var dpr = Math.min(window.devicePixelRatio || 1, 2);
            rain.width = Math.floor(w * dpr);
            rain.height = Math.floor(h * dpr);
            rain.style.width = w + 'px';
            rain.style.height = h + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            var columns = Math.floor(w / fontSize);
            drops = Array(Math.max(1, columns)).fill(1);
            // Seed trail so first frames are not empty
            ctx.fillStyle = 'rgba(9, 9, 11, 1)';
            ctx.fillRect(0, 0, w, h);
        }

        function draw() {
            if (!heroVisible || document.hidden) return;

            var w = rain.clientWidth;
            var h = rain.clientHeight;
            // Soft trail fade (site bg zinc)
            ctx.fillStyle = 'rgba(9, 9, 11, 0.15)';
            ctx.fillRect(0, 0, w, h);
            // Brand gold, lower opacity — less prominent
            ctx.fillStyle = 'rgba(212, 175, 55, 0.4)';
            ctx.font = fontSize + 'px "JetBrains Mono", ui-monospace, monospace';

            // Soft vertical falloff so density eases as it enters the next section
            var heroH = Math.max(1, hero.offsetHeight);
            for (var i = 0; i < drops.length; i++) {
                var y = drops[i] * fontSize;
                // Past hero edge: skip most glyphs so the mask isn't fighting dense rain
                if (y > heroH && Math.random() > 0.35) {
                    drops[i]++;
                    if (y > h && Math.random() > 0.96) drops[i] = 0;
                    continue;
                }
                var text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, y);
                if (y > h && Math.random() > 0.985) drops[i] = 0;
                drops[i]++;
            }
        }

        sizeCanvas();
        intervalId = window.setInterval(draw, 45);

        var resizeTimer = 0;
        window.addEventListener('resize', function () {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(sizeCanvas, 120);
        });

        // Pause when hero leaves viewport
        if ('IntersectionObserver' in window) {
            var rainObserver = new IntersectionObserver(function (entries) {
                heroVisible = !!(entries[0] && entries[0].isIntersecting);
            }, { threshold: 0.05 });
            rainObserver.observe(hero);
        }
    })();

    // Sigil scroll parallax (on inner stage so CSS layer animations keep running)
    var sigilParallax = document.getElementById('hero-sigil-parallax') || document.getElementById('hero-sigil');
    if (sigilParallax && !reducedMotion) {
        var sigilRaf = 0;
        window.addEventListener('scroll', function () {
            if (sigilRaf) return;
            sigilRaf = requestAnimationFrame(function () {
                var y = window.scrollY || 0;
                var rot = y * 0.045;
                var lift = Math.min(y * 0.04, 28);
                sigilParallax.style.transform =
                    'translate3d(0,' + (-lift) + 'px,0) rotate(' + rot + 'deg)';
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
