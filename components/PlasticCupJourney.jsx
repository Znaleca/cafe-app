'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function PlasticCupJourney() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x52b1e7, 8, 26);

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0.15, 8.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    renderer.physicallyCorrectLights = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const ambient = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 7, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xcff2ff, 1.0);
    fillLight.position.set(-6, 2, 4);
    scene.add(fillLight);

    const modelRoot = new THREE.Group();
    modelRoot.visible = false;
    scene.add(modelRoot);

    const materials = [];
    let destroyed = false;

    const loader = new GLTFLoader();
    loader.load(
      '/plastic_cup.glb',
      (gltf) => {
        if (destroyed) return;
        const model = gltf.scene;

        model.traverse((obj) => {
          if (!obj.isMesh) return;
          const meshMats = Array.isArray(obj.material) ? obj.material : [obj.material];
          meshMats.forEach((m) => {
            if (!m) return;
            m.color = new THREE.Color(0xffffff);
            if (m.emissive) m.emissive = new THREE.Color(0x111111);
            if (m.metalness !== undefined) m.metalness = 0.0;
            if (m.roughness !== undefined) m.roughness = 0.03;
            if (m.transmission !== undefined) m.transmission = 0.95;
            if (m.thickness !== undefined) m.thickness = 0.8;
            if (m.ior !== undefined) m.ior = 1.45;
            if (m.clearcoat !== undefined) m.clearcoat = 0.25;
            if (m.clearcoatRoughness !== undefined) m.clearcoatRoughness = 0.02;
            m.transparent = true;
            m.depthWrite = false;
            m.opacity = 0.45;
            if (m.envMapIntensity !== undefined) m.envMapIntensity = 1.0;
            m.needsUpdate = true;
            materials.push(m);
          });
        });

        const bbox = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const center = new THREE.Vector3();
        bbox.getCenter(center);

        model.position.sub(center);
        model.scale.setScalar(3.2 / Math.max(size.x, size.y, size.z));
        model.rotation.set(0.05, Math.PI * 0.35, 0.1);

        modelRoot.add(model);

        try {
          const gen = pmremGenerator.fromScene(model, 0.04);
          if (gen && gen.texture) {
            scene.environment = gen.texture;
            materials.forEach((m) => {
              if (!m.envMap) m.envMap = gen.texture;
              if (m.envMapIntensity !== undefined) m.envMapIntensity = 1.0;
              m.needsUpdate = true;
            });
          }
        } catch (e) {
          // ignore
        }

        modelRoot.visible = true;
      },
      undefined,
      () => {
        modelRoot.visible = false;
      }
    );

    const getScrollRange = () => {
      const hero = document.getElementById('home-hero');
      const about = document.getElementById('home-about');

      let start = 0;
      let end = typeof window !== 'undefined' ? window.innerHeight * 2 : 1600;

      if (hero && about) {
        // Start as soon as the home page begins.
        start = Math.max(0, hero.offsetTop);

        end = about.offsetTop + about.offsetHeight;
      }

      return { start, end };
    };

    let range = getScrollRange();

    const resize = () => {
      if (!mount.isConnected) return;
      renderer.setSize(mount.clientWidth, mount.clientHeight, false);
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      range = getScrollRange();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    window.addEventListener('resize', resize);

    let lastTime = performance.now();

    const update = () => {
      if (destroyed) return;

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const width = window.innerWidth;
      const mobile = width < 768;

      // Keep the cup hidden at the absolute top of the page.
      if (scrollY <= 4) {
        materials.forEach((m) => { m.opacity = 0; });
        modelRoot.visible = false;
        camera.position.z = mobile ? 9.2 : 8.5;
        camera.position.y = window.innerHeight < 760 ? 0.05 : 0.15;
        renderer.render(scene, camera);
        requestAnimationFrame(update);
        return;
      }

      // Keep the cup visible by default.
      const spawned = true;

      // Determine progress: prefer GSAP timeline progress if available, otherwise use scroll mapping
      let progress = clamp((scrollY - range.start) / Math.max(range.end - range.start, 1), 0, 1);
      if (typeof window !== 'undefined' && typeof window.cupTimelineProgress === 'number') {
        progress = clamp(window.cupTimelineProgress, 0, 1);
      }

      // Movement path: start from the bottom, rise into the middle, roll through About, and exit there.
      const startX = mobile ? -1.8 : -3.4;
      const midX = mobile ? -0.2 : 0.15;
      const aboutX = mobile ? 0.55 : 1.25;
      const exitX = mobile ? 1.8 : 3.2;
      const startY = mobile ? 1.45 : 1.15;
      const midY = mobile ? 0.05 : -0.15;
      const aboutY = mobile ? -0.45 : -0.75;
      const exitY = mobile ? -1.45 : -1.9;
      const posZ = mobile ? -1.45 : -1.7;

      let posX;
      let posY;
      let opacityFactor = 1;

      if (progress < 0.18) {
        const p = progress / 0.18;
        const e = p < 0.5 ? 2 * p * p : 1 - ((-2 * p + 2) ** 2) / 2;
        posX = THREE.MathUtils.lerp(startX, midX, e);
        posY = THREE.MathUtils.lerp(startY, midY, e);
        // Fade in during the first pop-up so the cup emerges from nothing.
        opacityFactor = e;
      } else if (progress < 0.56) {
        const p = (progress - 0.18) / 0.38;
        const e = p < 0.5 ? 2 * p * p : 1 - ((-2 * p + 2) ** 2) / 2;
        posX = THREE.MathUtils.lerp(midX, aboutX, e);
        posY = THREE.MathUtils.lerp(midY, aboutY, e);
      } else if (progress < 0.86) {
        const p = (progress - 0.56) / 0.3;
        const e = p < 0.5 ? 2 * p * p : 1 - ((-2 * p + 2) ** 2) / 2;
        posX = THREE.MathUtils.lerp(aboutX, exitX, e);
        posY = THREE.MathUtils.lerp(aboutY, aboutY + (mobile ? -0.12 : -0.18), e);
      } else {
        const p = (progress - 0.86) / 0.14;
        const e = p < 0.5 ? 2 * p * p : 1 - ((-2 * p + 2) ** 2) / 2;
        posX = THREE.MathUtils.lerp(exitX, exitX + (mobile ? 0.7 : 1.1), e);
        posY = THREE.MathUtils.lerp(aboutY, exitY, e);
        opacityFactor = 1 - clamp(p, 0, 1);
      }

      // bob while moving
      const now = performance.now();
      lastTime = now;
      const bob = Math.sin(now / 300) * (mobile ? 0.02 : 0.03);

      // Add a small flip arc so the motion feels like the cup is flipping through space.
      const flipArc = Math.sin(progress * Math.PI) * (mobile ? 0.16 : 0.22);
      const flipDrift = Math.sin(progress * Math.PI * 2) * (mobile ? 0.05 : 0.08);
      modelRoot.position.set(posX + flipDrift, posY + bob + flipArc, posZ);

      // rotation while moving: make it feel like an end-over-end flip
      const rotX = THREE.MathUtils.lerp(0.15, Math.PI * 6.2 + 0.15, progress);
      const rotY = Math.PI * 0.28 + (progress * Math.PI * 1.2);
      const rotZ = Math.sin(progress * Math.PI * 2) * (mobile ? 0.22 : 0.3);
      modelRoot.rotation.set(rotX, rotY, rotZ);

      const fade = opacityFactor * 0.82;
      materials.forEach((m) => { m.opacity = fade; });

      modelRoot.visible = fade > 0.02;

      // simple camera adjustments for mobile
      camera.position.z = mobile ? 9.2 : 8.5;
      camera.position.y = window.innerHeight < 760 ? 0.05 : 0.15;

      renderer.render(scene, camera);
      requestAnimationFrame(update);
    };

    const animationId = requestAnimationFrame(update);

    return () => {
      destroyed = true;
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
      try { pmremGenerator.dispose(); } catch (e) {}
      renderer.dispose();
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={mountRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 hidden md:block" />
  );
}
