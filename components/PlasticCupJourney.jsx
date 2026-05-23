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

        const plasticMaterial = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          metalness: 0.03,
          roughness: 0.05,
          transmission: 1.0,
          thickness: 0.5,
          ior: 1.50,
          clearcoat: 1.0,
          clearcoatRoughness: 0.02,
          transparent: true,
          opacity: 0.45,
          depthWrite: false,
          envMapIntensity: 2.5
        });

        model.traverse((obj) => {
          if (!obj.isMesh) return;
          obj.material = plasticMaterial.clone(); 
          materials.push(obj.material);
        });

        const bbox = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const center = new THREE.Vector3();
        bbox.getCenter(center);

        model.position.sub(center);
        model.position.y -= size.y * 0.1; 

        model.scale.setScalar(3.0 / Math.max(size.x, size.y, size.z));
        modelRoot.add(model);

        try {
          const gen = pmremGenerator.fromScene(scene);
          if (gen && gen.texture) {
            scene.environment = gen.texture;
            materials.forEach((m) => {
              m.envMap = gen.texture;
              m.needsUpdate = true;
            });
          }
        } catch (e) {}

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

    const update = () => {
      if (destroyed) return;

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const width = window.innerWidth;
      const mobile = width < 768;

      if (scrollY <= 4) {
        materials.forEach((m) => { m.opacity = 0; });
        modelRoot.visible = false;
        renderer.render(scene, camera);
        requestAnimationFrame(update);
        return;
      }

      let progress = clamp((scrollY - range.start) / Math.max(range.end - range.start, 1), 0, 1);
      if (typeof window !== 'undefined' && typeof window.cupTimelineProgress === 'number') {
        progress = clamp(window.cupTimelineProgress, 0, 1);
      }
      
      let posX, posY, rotX, rotY, rotZ;
      let opacityFactor = 1;

      // Positioning anchors
      const startX = mobile ? -2.2 : -4.2;
      const midX = mobile ? -0.35 : -0.65; 
      const exitX = mobile ? 2.5 : 4.5; 

      const startY = mobile ? 1.8 : 1.5;
      const midY = mobile ? 0.3 : 0.2; 
      const exitY = mobile ? -0.3 : -0.4; 
      const posZ = mobile ? -0.8 : -1.0;

      if (progress <= 0.55) {
        // --- PHASE 1: REVOLVING INTO PLACE ---
        const p = progress / 0.55;
        const easeOut = 1 - Math.pow(1 - p, 4);

        posX = THREE.MathUtils.lerp(startX, midX, easeOut);
        posY = THREE.MathUtils.lerp(startY, midY, easeOut);

        const sweepArc = Math.sin(easeOut * Math.PI) * (mobile ? 1.2 : 1.8);
        posX += sweepArc * 0.4;
        posY += sweepArc * 0.2;

        rotX = THREE.MathUtils.lerp(0.8, Math.PI * 4, easeOut);
        rotY = THREE.MathUtils.lerp(-0.5, Math.PI * 2, easeOut);
        rotZ = THREE.MathUtils.lerp(0.4, 0, easeOut);

        opacityFactor = clamp(p * 2, 0, 1);

      } else if (progress > 0.55 && progress <= 0.75) {
        // --- PHASE 2: STANDING UP & SLOWLY CONTINUOUSLY FLIPPING (ABOUT SECTION) ---
        posX = midX;
        posY = midY;
        opacityFactor = 1;

        const localP = (progress - 0.55) / 0.20;
        
        // Modifying these lines to add a bit more spin behavior on the X and Y axis during the about view
        rotX = THREE.MathUtils.lerp(0, Math.PI * 2, localP);
        rotY = THREE.MathUtils.lerp(0, Math.PI * 2.4, localP); // Increased rotation from 0.4 to 2.4 for an extra twirl
        rotZ = THREE.MathUtils.lerp(0, -0.15, localP);

      } else {
        // --- PHASE 3: EARLY SIDEWAYS SPIN OUT EXIT ---
        const p = clamp((progress - 0.75) / 0.13, 0, 1);
        const easeIn = p * p;

        posX = THREE.MathUtils.lerp(midX, exitX, easeIn);
        posY = THREE.MathUtils.lerp(midY, exitY, easeIn);

        // Adjusted matching start values here so Phase 3 transitions cleanly from Phase 2's new end position
        rotX = (Math.PI * 2) + THREE.MathUtils.lerp(0, Math.PI * 1.5, easeIn);
        rotY = (Math.PI * 2.4) + THREE.MathUtils.lerp(0, Math.PI * 1.0, easeIn); // Started at 2.4 to match phase 2
        rotZ = -0.15 + THREE.MathUtils.lerp(0, -0.3, easeIn);

        opacityFactor = 1 - p;
      }

      const now = performance.now();
      const slowBob = Math.sin(now / 450) * 0.03;
      
      const slowSway = progress > 0.75 ? 0 : Math.cos(now / 600) * 0.015;

      modelRoot.position.set(posX, posY + slowBob, posZ);
      modelRoot.rotation.set(rotX + slowSway, rotY, rotZ + (slowSway * 0.5));

      const fade = clamp(opacityFactor * 0.88, 0, 1);
      materials.forEach((m) => { m.opacity = fade; });
      modelRoot.visible = fade > 0.01;

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