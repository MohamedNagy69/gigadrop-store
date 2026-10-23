'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@/stores/themeStore';

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const { theme } = useThemeStore();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isLowPowerMobile =
      typeof window !== 'undefined' &&
      window.innerWidth < 640 &&
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isLowPowerMobile) {
      setWebglSupported(false);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 650;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.0);

    const isLight = theme === 'light';
    const primaryHex = isLight ? 0x166534 : 0xccff00;
    const coreHex = isLight ? 0x15803d : 0x84cc16;

    // Centered 3D Cyber Core Group
    const sphereGroup = new THREE.Group();
    sphereGroup.position.set(0, 0, 0);
    scene.add(sphereGroup);

    // 1. Outer Geodesic Wireframe Sphere (Icosahedron detail 2 gives the exact triangular lattice from the photo)
    const outerGeo = new THREE.IcosahedronGeometry(2.35, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: primaryHex,
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.14 : 0.28,
    });
    const outerSphere = new THREE.Mesh(outerGeo, outerMat);
    sphereGroup.add(outerSphere);

    // 2. Inner Rotating Core (Octahedron with bright wireframe)
    const coreGeo = new THREE.OctahedronGeometry(1.2, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: coreHex,
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.22 : 0.45,
    });
    const innerCore = new THREE.Mesh(coreGeo, coreMat);
    sphereGroup.add(innerCore);

    // 3. Subtle Inner Equator Ring
    const ringGeo = new THREE.RingGeometry(1.48, 1.52, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: primaryHex,
      transparent: true,
      opacity: isLight ? 0.12 : 0.24,
      side: THREE.DoubleSide,
    });
    const gyroRing = new THREE.Mesh(ringGeo, ringMat);
    gyroRing.rotation.x = Math.PI / 2.3;
    sphereGroup.add(gyroRing);

    // 4. Ambient Floating Cyber Particles
    const particleCount = 110;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 7;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: primaryHex,
      size: 0.045,
      transparent: true,
      opacity: isLight ? 0.35 : 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Parallax Effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX / innerWidth - 0.5) * 2;
      mouseY = (e.clientY / innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Smooth camera interpolation towards cursor
      targetX = mouseX * 0.45;
      targetY = -mouseY * 0.35;
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (targetY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Self-rotations
      outerSphere.rotation.y += 0.0022;
      outerSphere.rotation.x += 0.001;

      innerCore.rotation.y -= 0.0035;
      innerCore.rotation.z += 0.0018;

      gyroRing.rotation.z += 0.0015;

      particles.rotation.y += 0.0006;
      particles.rotation.x -= 0.0003;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1200;
      const h = container.clientHeight || 650;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      outerGeo.dispose();
      outerMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [theme]);

  if (!webglSupported) {
    return null;
  }

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_50%,transparent_92%)]"
      aria-hidden="true"
    />
  );
}
