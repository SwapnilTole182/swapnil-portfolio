import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * CinematicLayer
 * ---------------
 * A transparent, additive-blended particle field meant to sit ABOVE the video
 * layers and BELOW the text content. Simulates warm bokeh / dust motes drifting
 * through a shallow depth of field.
 *
 * Perf decisions (see README for the reasoning):
 *  - Particle count scales down on narrow viewports.
 *  - devicePixelRatio is clamped to 1.5 — retina sharpness on a soft blurred
 *    particle field is wasted GPU work.
 *  - The whole layer is skipped under prefers-reduced-motion, and skipped
 *    entirely below a width threshold (mobile) to protect frame budget for
 *    the video layers, which matter more to the "talking head" content.
 *  - All geometries/materials/renderer are disposed on unmount.
 */
export default function CinematicLayer({ className }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const isNarrowViewport = window.innerWidth < 640;

    // Skip the whole layer where it would cost more than it's worth.
    if (prefersReducedMotion || isNarrowViewport) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // additive blended soft points don't need MSAA
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ---- Particle field -----------------------------------------------
    const PARTICLE_COUNT = width < 1024 ? 90 : 160;

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT); // phase offsets for sine drift
    const sizes = new Float32Array(PARTICLE_COUNT);
    const warmth = new Float32Array(PARTICLE_COUNT); // 0 = white, 1 = warm orange

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
      seeds[i] = Math.random() * Math.PI * 2;
      sizes[i] = 0.6 + Math.random() * 1.8;
      warmth[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('warmth', new THREE.BufferAttribute(warmth, 1));

    // Soft round sprite generated on a canvas — cheaper than loading a texture asset.
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const ctx = spriteCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.6)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const spriteTexture = new THREE.CanvasTexture(spriteCanvas);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: spriteTexture },
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute float seed;
        attribute float size;
        attribute float warmth;
        varying float vWarmth;
        varying float vAlpha;
        uniform float uTime;

        void main() {
          vWarmth = warmth;

          vec3 pos = position;
          // slow sine-wave drift, unique per-particle via seed
          pos.x += sin(uTime * 0.15 + seed) * 0.6;
          pos.y += cos(uTime * 0.12 + seed * 1.3) * 0.4;
          pos.z += sin(uTime * 0.1 + seed * 0.7) * 0.5;

          vAlpha = 0.35 + 0.35 * sin(uTime * 0.2 + seed * 2.0);

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (120.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying float vWarmth;
        varying float vAlpha;

        void main() {
          vec4 tex = texture2D(uTexture, gl_PointCoord);
          vec3 warm = vec3(1.0, 0.55, 0.22);   // warm orange
          vec3 cool = vec3(1.0, 1.0, 1.0);     // white
          vec3 color = mix(cool, warm, vWarmth);
          gl_FragColor = vec4(color, tex.a * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ---- Mouse parallax --------------------------------------------------
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    function handlePointerMove(e) {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // ---- Resize ------------------------------------------------------
    function handleResize() {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', handleResize);

    // ---- Animation loop ------------------------------------------------
    let rafId;
    const clock = new THREE.Clock();

    function animate() {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      material.uniforms.uTime.value = t;

      // ease camera toward pointer target — gentle parallax, never snappy
      current.x += (target.x - current.x) * 0.02;
      current.y += (target.y - current.y) * 0.02;
      camera.position.x = current.x * 0.8;
      camera.position.y = -current.y * 0.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    // ---- Cleanup ------------------------------------------------------
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      spriteTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
