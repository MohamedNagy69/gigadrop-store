'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@/stores/themeStore';
import { Zap, HardDrive, Gamepad2 } from 'lucide-react';

export default function ThreeGamingCore() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const { theme, locale } = useThemeStore();
  const isAr = locale === 'ar';
  const isDark = theme !== 'light';
  const [fps, setFps] = useState(120);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect mobile or low power
    const isMobile =
      typeof window !== 'undefined' &&
      window.innerWidth < 768 &&
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 460;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    // Color Palette
    const neonLime = isDark ? 0xccff00 : 0x059669;
    const electricCyan = isDark ? 0x38bdf8 : 0x0284c7;
    const darkObsidian = isDark ? 0x121418 : 0xf1f5f9;
    const metallicChassis = isDark ? 0x1f232b : 0xe2e8f0;

    // -------------------------------------------------------------
    // LIGHTING SETUP (Dynamic & Cinematic)
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.75 : 1.2);
    scene.add(ambientLight);

    // Dynamic mouse-following PointLight (Lime specular glint)
    const mouseLight = new THREE.PointLight(neonLime, isDark ? 3.5 : 2.5, 12, 1.8);
    mouseLight.position.set(2, 2, 4);
    scene.add(mouseLight);

    // Key Rim Light (Electric Cyan)
    const rimLight = new THREE.DirectionalLight(electricCyan, isDark ? 2.2 : 1.5);
    rimLight.position.set(-5, 4, 3);
    scene.add(rimLight);

    // Bottom Fill Light
    const bottomLight = new THREE.PointLight(neonLime, isDark ? 1.5 : 1.0, 8);
    bottomLight.position.set(0, -3.5, 2);
    scene.add(bottomLight);

    // -------------------------------------------------------------
    // MAIN 3D CONTROLLER & CORE ROOT GROUP
    // -------------------------------------------------------------
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Slight initial tilt for dynamic perspective
    rootGroup.rotation.x = 0.22;
    rootGroup.rotation.y = -0.15;

    // Materials
    const chassisMat = new THREE.MeshStandardMaterial({
      color: metallicChassis,
      roughness: 0.35,
      metalness: 0.8,
    });

    const gripMat = new THREE.MeshStandardMaterial({
      color: darkObsidian,
      roughness: 0.5,
      metalness: 0.65,
    });

    const neonLimeMat = new THREE.MeshBasicMaterial({
      color: neonLime,
      wireframe: false,
    });

    const cyanMat = new THREE.MeshBasicMaterial({
      color: electricCyan,
    });

    // 1. Controller Center Core (Smooth Beveled Shape)
    const centerShape = new THREE.Shape();
    centerShape.moveTo(-1.6, 0.5);
    centerShape.quadraticCurveTo(0, 0.75, 1.6, 0.5);
    centerShape.quadraticCurveTo(2.4, 0.3, 2.6, -0.6);
    centerShape.quadraticCurveTo(2.1, -1.8, 1.5, -2.1);
    centerShape.quadraticCurveTo(0.9, -1.3, 0.5, -0.6);
    centerShape.quadraticCurveTo(0, -0.7, -0.5, -0.6);
    centerShape.quadraticCurveTo(-0.9, -1.3, -1.5, -2.1);
    centerShape.quadraticCurveTo(-2.1, -1.8, -2.6, -0.6);
    centerShape.quadraticCurveTo(-2.4, 0.3, -1.6, 0.5);

    const extrudeSettings = {
      depth: 0.65,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 2,
      bevelSize: 0.18,
      bevelThickness: 0.18,
    };

    const controllerGeo = new THREE.ExtrudeGeometry(centerShape, extrudeSettings);
    controllerGeo.center();
    const controllerMesh = new THREE.Mesh(controllerGeo, chassisMat);
    rootGroup.add(controllerMesh);

    // 2. Neon Contour Edges (Cyber Wireframe Outline)
    const edgesGeo = new THREE.EdgesGeometry(controllerGeo, 24);
    const edgesMat = new THREE.LineBasicMaterial({
      color: neonLime,
      transparent: true,
      opacity: isDark ? 0.7 : 0.45,
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    rootGroup.add(edgesMesh);

    // 3. Central Glowing Touchpad / Display
    const touchpadGeo = new THREE.BoxGeometry(1.4, 0.9, 0.1);
    const touchpadMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x090a0d : 0xffffff,
      roughness: 0.2,
      metalness: 0.9,
    });
    const touchpadMesh = new THREE.Mesh(touchpadGeo, touchpadMat);
    touchpadMesh.position.set(0, 0.35, 0.46);
    rootGroup.add(touchpadMesh);

    // Touchpad Neon Border
    const padBorderGeo = new THREE.BoxGeometry(1.44, 0.94, 0.08);
    const padBorderMat = new THREE.MeshBasicMaterial({
      color: neonLime,
      wireframe: true,
    });
    const padBorder = new THREE.Mesh(padBorderGeo, padBorderMat);
    padBorder.position.set(0, 0.35, 0.45);
    rootGroup.add(padBorder);

    // 4. Dual 3D Analog Thumbsticks
    const createThumbstick = (xPos: number) => {
      const stickGroup = new THREE.Group();

      // Outer well
      const baseGeo = new THREE.CylinderGeometry(0.52, 0.58, 0.25, 24);
      const baseMesh = new THREE.Mesh(baseGeo, gripMat);
      baseMesh.rotation.x = Math.PI / 2;
      stickGroup.add(baseMesh);

      // Glowing Neon Accent Ring
      const ringGeo = new THREE.TorusGeometry(0.48, 0.025, 8, 28);
      const ringMesh = new THREE.Mesh(ringGeo, neonLimeMat);
      ringMesh.position.z = 0.12;
      stickGroup.add(ringMesh);

      // Thumbstick Cap
      const capGeo = new THREE.CylinderGeometry(0.42, 0.36, 0.22, 24);
      const capMesh = new THREE.Mesh(capGeo, chassisMat);
      capMesh.rotation.x = Math.PI / 2;
      capMesh.position.z = 0.22;
      stickGroup.add(capMesh);

      // Grip Center Dot
      const dotGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const dotMesh = new THREE.Mesh(dotGeo, neonLimeMat);
      dotMesh.position.z = 0.34;
      stickGroup.add(dotMesh);

      stickGroup.position.set(xPos, -0.45, 0.42);
      return stickGroup;
    };

    const leftStick = createThumbstick(-0.85);
    const rightStick = createThumbstick(0.85);
    rootGroup.add(leftStick);
    rootGroup.add(rightStick);

    // 5. Directional D-Pad (Left Wing)
    const dpadGroup = new THREE.Group();
    const dpadCrossH = new THREE.BoxGeometry(0.68, 0.24, 0.15);
    const dpadCrossV = new THREE.BoxGeometry(0.24, 0.68, 0.15);
    const dpadMeshH = new THREE.Mesh(dpadCrossH, gripMat);
    const dpadMeshV = new THREE.Mesh(dpadCrossV, gripMat);
    dpadGroup.add(dpadMeshH);
    dpadGroup.add(dpadMeshV);
    dpadGroup.position.set(-1.6, 0.25, 0.46);
    rootGroup.add(dpadGroup);

    // 6. Action Face Buttons (Right Wing: ✕, ○, □, △)
    const buttonsGroup = new THREE.Group();
    const btnOffsets = [
      { x: 0, y: 0.3, col: electricCyan },
      { x: 0.3, y: 0, col: 0xf43f5e },
      { x: 0, y: -0.3, col: neonLime },
      { x: -0.3, y: 0, col: 0xe879f9 },
    ];
    btnOffsets.forEach((b) => {
      const btnGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.12, 16);
      const btnMat = new THREE.MeshStandardMaterial({
        color: b.col,
        emissive: b.col,
        emissiveIntensity: isDark ? 0.6 : 0.25,
        roughness: 0.2,
      });
      const btnMesh = new THREE.Mesh(btnGeo, btnMat);
      btnMesh.rotation.x = Math.PI / 2;
      btnMesh.position.set(b.x, b.y, 0);
      buttonsGroup.add(btnMesh);
    });
    buttonsGroup.position.set(1.6, 0.25, 0.46);
    rootGroup.add(buttonsGroup);

    // -------------------------------------------------------------
    // HOLOGRAPHIC GYROSCOPIC ORBIT RINGS
    // -------------------------------------------------------------
    const holoGroup = new THREE.Group();
    scene.add(holoGroup);

    // Ring 1 - Outer Cyber Orbit
    const ring1Geo = new THREE.TorusGeometry(3.6, 0.016, 8, 80);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: neonLime,
      transparent: true,
      opacity: isDark ? 0.35 : 0.2,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    holoGroup.add(ring1);

    // Ring 2 - Inner Cross Orbit
    const ring2Geo = new THREE.TorusGeometry(3.0, 0.014, 8, 72);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: electricCyan,
      transparent: true,
      opacity: isDark ? 0.3 : 0.18,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3.5;
    holoGroup.add(ring2);

    // Orbital Holographic Nodes
    const nodesGroup = new THREE.Group();
    const nodeGeo = new THREE.SphereGeometry(0.065, 12, 12);
    for (let i = 0; i < 6; i++) {
      const nodeMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? neonLime : electricCyan,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i / 6) * Math.PI * 2;
      nodeMesh.position.set(Math.cos(angle) * 3.6, Math.sin(angle) * 3.6, 0);
      nodesGroup.add(nodeMesh);
    }
    nodesGroup.rotation.x = Math.PI / 3;
    holoGroup.add(nodesGroup);

    // -------------------------------------------------------------
    // FLOATING CYBER DATA DUST / PARTICLES
    // -------------------------------------------------------------
    const particleCount = isMobile ? 50 : 120;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 11;
      pPos[i + 1] = (Math.random() - 0.5) * 9;
      pPos[i + 2] = (Math.random() - 0.5) * 6;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: neonLime,
      size: 0.045,
      transparent: true,
      opacity: isDark ? 0.55 : 0.35,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // -------------------------------------------------------------
    // MOUSE INTERACTION & REAL-TIME ANIMATION LOOP
    // -------------------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0.22;
    let targetRotationY = -0.15;
    let currentVelocity = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      mouseX = x * 2;
      mouseY = y * 2;

      // Calculate target 3D tilts
      targetRotationY = mouseX * 0.75;
      targetRotationX = -mouseY * 0.55 + 0.2;

      // Position mouse light in 3D scene space
      mouseLight.position.x = mouseX * 3.5;
      mouseLight.position.y = -mouseY * 3.0 + 1.2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // FPS Counter calculation
    let lastTime = performance.now();
    let frameCount = 0;

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Measure FPS
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.min(144, Math.max(60, Math.round((frameCount * 1000) / (now - lastTime)))));
        frameCount = 0;
        lastTime = now;
      }

      // Smooth inertia damping for 3D controller rotation
      rootGroup.rotation.y += (targetRotationY - rootGroup.rotation.y) * 0.045;
      rootGroup.rotation.x += (targetRotationX - rootGroup.rotation.x) * 0.045;

      // Gentle continuous levitation breathing
      rootGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.12;

      // Gyroscopic Hologram Ring Rotations
      ring1.rotation.z += 0.0035;
      ring2.rotation.z -= 0.0042;
      nodesGroup.rotation.z += 0.0035;

      // Particle subtle drifting
      particles.rotation.y += 0.0006;
      particles.rotation.x = Math.sin(elapsedTime * 0.4) * 0.06;

      // Analog stick reactive micro-movement
      leftStick.rotation.z = Math.sin(elapsedTime * 2.2) * 0.08 + mouseX * 0.15;
      rightStick.rotation.z = -Math.cos(elapsedTime * 2.2) * 0.08 - mouseY * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    // -------------------------------------------------------------
    // RESIZE LISTENER
    // -------------------------------------------------------------
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 540;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // -------------------------------------------------------------
    // CLEANUP
    // -------------------------------------------------------------
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Dispose Three.js objects
      controllerGeo.dispose();
      chassisMat.dispose();
      gripMat.dispose();
      neonLimeMat.dispose();
      cyanMat.dispose();
      touchpadGeo.dispose();
      touchpadMat.dispose();
      padBorderGeo.dispose();
      padBorderMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      nodeGeo.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div className="relative flex w-full items-center justify-center select-none py-2">
      {/* Three.js WebGL Container */}
      <div
        ref={mountRef}
        className="relative z-10 h-[420px] sm:h-[480px] w-full max-w-[540px] cursor-grab active:cursor-grabbing transform-gpu"
        title={isAr ? 'حرك الماوس للتفاعل ثلاثي الأبعاد 3D' : 'Move cursor for interactive 3D perspective'}
      />

      {/* Floating HUD Telemetry Badge 1: 3D Holographic Status (Top) */}
      <div
        className={`absolute -top-1 sm:-top-2 ${
          isAr ? '-right-1 sm:-right-3' : '-left-1 sm:-left-3'
        } z-20 flex items-center gap-2 rounded-full border border-white/10 dark:border-white/10 light:border-slate-200/90 bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-white/90 px-3.5 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all hover:scale-105`}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#CCFF00] dark:bg-[#CCFF00] light:bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#CCFF00] dark:bg-[#CCFF00] light:bg-emerald-600 shadow-[0_0_8px_#CCFF00]" />
        </span>
        <span className="text-[11px] font-black uppercase tracking-wider text-white dark:text-white light:text-slate-900">
          WebGL 3D Core • {fps} FPS
        </span>
      </div>

      {/* Floating HUD Badge 2: Plug & Play Performance (Side) */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${
          isAr ? '-left-2 sm:-left-6' : '-right-2 sm:-right-6'
        } z-20 hidden sm:flex items-center gap-3 rounded-2xl border border-[#CCFF00]/30 dark:border-[#CCFF00]/30 light:border-emerald-600/30 bg-zinc-950/85 dark:bg-zinc-950/85 light:bg-white/95 px-4 py-2.5 shadow-[0_12px_36px_rgba(204,255,0,0.14)] backdrop-blur-md transition-all hover:scale-105`}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#CCFF00]/15 dark:bg-[#CCFF00]/15 light:bg-emerald-600/10 text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-700">
          <Zap className="h-4 w-4" />
        </div>
        <div className="text-right flex flex-col">
          <span className="text-xs font-black leading-tight text-white dark:text-white light:text-slate-900">
            {isAr ? 'توصيل ولعب فوري' : 'Plug & Play'}
          </span>
          <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-400 light:text-slate-500">
            {isAr ? 'بدون إنترنت • 100% أوفلاين' : '100% Offline Single-Player'}
          </span>
        </div>
      </div>

      {/* Floating HUD Badge 3: Ultra NVMe Speed (Bottom) */}
      <div
        className={`absolute -bottom-2 sm:-bottom-3 ${
          isAr ? '-right-1 sm:right-2' : '-left-1 sm:left-2'
        } z-20 flex items-center gap-2 rounded-full border border-white/10 dark:border-white/10 light:border-slate-200/90 bg-zinc-950/80 dark:bg-zinc-950/80 light:bg-white/90 px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all hover:scale-105`}
      >
        <HardDrive className="h-3.5 w-3.5 text-[#CCFF00] dark:text-[#CCFF00] light:text-emerald-600" />
        <span className="text-[11px] font-extrabold text-white dark:text-white light:text-slate-900">
          {isAr ? 'هارد خارجي فائق السرعة USB 3.2' : 'Ultra-Fast USB 3.2 Drive'}
        </span>
      </div>
    </div>
  );
}
