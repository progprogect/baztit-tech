/**
 * Baztit Tech — Three.js Hero Particle Field
 * Phase 3.1: 3000 particles, mouse interaction, mobile-optimized
 */

(function () {
  'use strict';

  if (document.documentElement.getAttribute('data-reduced-motion') === 'true') {
    return;
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  if (typeof THREE === 'undefined') return;

  const hero = document.getElementById('hero');
  if (!hero) return;

  const particleCount = window.innerWidth < 768 ? 1000 : 3000;
  const positions = new Float32Array(particleCount * 3);
  const originalPositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.5 + Math.random() * 1.5;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    positions[i] = x;
    positions[i + 1] = y;
    positions[i + 2] = z;
    originalPositions[i] = x;
    originalPositions[i + 1] = y;
    originalPositions[i + 2] = z;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const canvas = renderer.domElement;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';

  hero.style.position = 'relative';
  hero.insertBefore(canvas, hero.firstChild);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('originalPosition', new THREE.BufferAttribute(originalPositions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x00e5ff,
    size: 0.015,
    transparent: true,
    opacity: 0.6
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  document.addEventListener('mousemove', function (e) {
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.002;

    mouseX += (targetMouseX - mouseX) * 0.02;
    mouseY += (targetMouseY - mouseY) * 0.02;

    const posAttr = geometry.attributes.position;
    const origAttr = geometry.attributes.originalPosition;
    const influence = 0.15;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const ox = origAttr.array[i3];
      const oy = origAttr.array[i3 + 1];
      const oz = origAttr.array[i3 + 2];

      const driftY = Math.sin(time + i * 0.001) * 0.02;
      const rotY = Math.cos(time * 0.3) * ox - Math.sin(time * 0.3) * oz;
      const rotZ = Math.sin(time * 0.3) * ox + Math.cos(time * 0.3) * oz;

      let dx = mouseX * influence * (1 - Math.abs(oy));
      let dy = mouseY * influence * (1 - Math.abs(ox));
      dx *= 0.3;
      dy *= 0.3;

      posAttr.array[i3] = rotY + dx;
      posAttr.array[i3 + 1] = oy + driftY + dy;
      posAttr.array[i3 + 2] = rotZ;
    }
    posAttr.needsUpdate = true;

    renderer.render(scene, camera);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onResize);
  animate();
})();
