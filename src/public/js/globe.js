// globe.js — Rotating orthographic globe with Bangalore pin
(function () {
  'use strict';

  // Bangalore coordinates
  var BLAT = 12.9716 * Math.PI / 180;
  var BLNG = 77.5946 * Math.PI / 180;

  // Graticule grid lines (every 30°)
  var LAT_LINES = [-60, -30, 0, 30, 60];
  var LNG_LINES = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];

  function project(lat, lng, rot) {
    var lambda = lng - rot;
    var x = Math.cos(lat) * Math.sin(lambda);
    var y = -Math.sin(lat);
    var z = Math.cos(lat) * Math.cos(lambda);
    return { x: x, y: y, z: z };
  }

  function initGlobe() {
    var canvas = document.getElementById('footer-globe-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');

    // HiDPI
    var dpr = window.devicePixelRatio || 1;
    var SIZE = 160;
    canvas.width  = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width  = SIZE + 'px';
    canvas.style.height = SIZE + 'px';
    ctx.scale(dpr, dpr);

    var cx = SIZE / 2;
    var cy = SIZE / 2;
    var r  = SIZE / 2 - 1;

    var rot = 0;           // current longitude rotation (radians)
    var pingPhase = 0;     // for ping animation

    function drawFrame() {
      ctx.clearRect(0, 0, SIZE, SIZE);

      // ── Background sphere ──────────────────────────────
      var grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.38, 0, cx, cy, r);
      grad.addColorStop(0,   'rgba(42,42,42,1)');
      grad.addColorStop(0.5, 'rgba(14,14,14,1)');
      grad.addColorStop(1,   'rgba(4,4,4,1)');

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // ── Clip to circle ─────────────────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      // ── Latitude lines ─────────────────────────────────
      LAT_LINES.forEach(function (latDeg) {
        var lat = latDeg * Math.PI / 180;
        ctx.beginPath();
        var started = false;
        for (var lngDeg = -180; lngDeg <= 181; lngDeg += 2) {
          var lng = lngDeg * Math.PI / 180;
          var p = project(lat, lng, rot);
          var sx = cx + r * p.x;
          var sy = cy + r * p.y;
          if (!started || p.z < 0) {
            ctx.moveTo(sx, sy);
            started = p.z >= 0;
          } else {
            ctx.lineTo(sx, sy);
          }
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.07)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });

      // ── Longitude lines ─────────────────────────────────
      LNG_LINES.forEach(function (lngDeg) {
        var lng = lngDeg * Math.PI / 180;
        ctx.beginPath();
        var started = false;
        for (var latDeg = -90; latDeg <= 91; latDeg += 2) {
          var lat = latDeg * Math.PI / 180;
          var p = project(lat, lng, rot);
          var sx = cx + r * p.x;
          var sy = cy + r * p.y;
          if (!started || p.z < 0) {
            ctx.moveTo(sx, sy);
            started = p.z >= 0;
          } else {
            ctx.lineTo(sx, sy);
          }
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.07)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });

      // ── Equator (slightly brighter) ─────────────────────
      ctx.beginPath();
      var started = false;
      for (var lngDeg = -180; lngDeg <= 181; lngDeg += 2) {
        var lng = lngDeg * Math.PI / 180;
        var p = project(0, lng, rot);
        var sx = cx + r * p.x;
        var sy = cy + r * p.y;
        if (!started || p.z < 0) {
          ctx.moveTo(sx, sy);
          started = p.z >= 0;
        } else {
          ctx.lineTo(sx, sy);
        }
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.13)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();

      // ── Sphere rim ─────────────────────────────────────
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // ── Specular highlight ─────────────────────────────
      var hl = ctx.createRadialGradient(cx - r * 0.32, cy - r * 0.36, 0, cx, cy, r);
      hl.addColorStop(0,   'rgba(255,255,255,0.09)');
      hl.addColorStop(0.45,'rgba(255,255,255,0.025)');
      hl.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = hl;
      ctx.fill();

      // ── Bangalore Pin ──────────────────────────────────
      var bp = project(BLAT, BLNG, rot);
      if (bp.z > 0) {
        var alpha  = Math.min(1, bp.z * 2.2); // fade near limb
        var sx     = cx + r * bp.x;
        var sy     = cy + r * bp.y;

        // Animated ping rings
        var pulse1 = 0.5 + 0.5 * Math.sin(pingPhase);
        var pulse2 = 0.5 + 0.5 * Math.sin(pingPhase + Math.PI);

        // Outer ring 1
        ctx.beginPath();
        ctx.arc(sx, sy, 3 + 8 * pulse1, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(74,222,128,' + (0.35 * (1 - pulse1) * alpha) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Outer ring 2 (offset phase)
        ctx.beginPath();
        ctx.arc(sx, sy, 3 + 6 * pulse2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(74,222,128,' + (0.25 * (1 - pulse2) * alpha) + ')';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Glow fill
        var glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 7);
        glow.addColorStop(0,   'rgba(74,222,128,' + (0.6 * alpha) + ')');
        glow.addColorStop(0.5, 'rgba(74,222,128,' + (0.2 * alpha) + ')');
        glow.addColorStop(1,   'rgba(74,222,128,0)');
        ctx.beginPath();
        ctx.arc(sx, sy, 7, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74,222,128,' + alpha + ')';
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(sx, sy, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,255,220,' + alpha + ')';
        ctx.fill();
      }

      // Advance
      rot      += 0.004;
      pingPhase += 0.055;

      requestAnimationFrame(drawFrame);
    }

    drawFrame();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobe);
  } else {
    initGlobe();
  }
})();
