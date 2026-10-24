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

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 520;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    const isLight = theme === 'light';
    const primaryHex = isLight ? 0x059669 : 0xccff00;
    const coreHex = isLight ? 0x0f766e : 0x84cc16;
    const secondaryHex = isLight ? 0x0284c7 : 0x38bdf8;

    // Main 3D Group
    const group = new THREE.Group();
    scene.add(group);

    // 1. Outer Geodesic Wireframe Sphere (Icosahedron detail 2)
    const outerGeo = new THREE.IcosahedronGeometry(2.0, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: primaryHex,
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.55 : 0.45,
    });
    const outerSphere = new THREE.Mesh(outerGeo, outerMat);
    group.add(outerSphere);

    // 2. Inner Rotating Octahedron Core
    const coreGeo = new THREE.OctahedronGeometry(1.05, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: coreHex,
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.70 : 0.68,
    });
    const innerCore = new THREE.Mesh(coreGeo, coreMat);
    group.add(innerCore);

    // 3. Middle Tilted Gyro Data Ring
    const ringGeo = new THREE.TorusGeometry(2.28, 0.016, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: primaryHex,
      transparent: true,
      opacity: isLight ? 0.50 : 0.52,
    });
    const gyroRing = new THREE.Mesh(ringGeo, ringMat);
    gyroRing.rotation.x = Math.PI / 2.8;
    gyroRing.rotation.y = Math.PI / 6;
    group.add(gyroRing);

    // 4. Secondary Counter-Tilted Ring
    const ring2Geo = new THREE.TorusGeometry(2.4, 0.012, 8, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: secondaryHex,
      transparent: true,
      opacity: isLight ? 0.42 : 0.38,
    });
    const gyroRing2 = new THREE.Mesh(ring2Geo, ring2Mat);
    gyroRing2.rotation.x = -Math.PI / 3.2;
    gyroRing2.rotation.z = Math.PI / 4;
    group.add(gyroRing2);

    // 5. Ambient Floating Cyber Particles
    const particleCount = 100;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8.5;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6.5;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: primaryHex,
      size: isLight ? 0.055 : 0.045,
      transparent: true,
      opacity: isLight ? 0.75 : 0.78,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Parallax
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

      // Camera tilt towards mouse
      targetX = mouseX * 0.4;
      targetY = -mouseY * 0.3;
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (targetY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Continuous Rotations
      outerSphere.rotation.y += 0.0028;
      outerSphere.rotation.x += 0.0014;

      innerCore.rotation.y -= 0.0045;
      innerCore.rotation.z += 0.0022;

      gyroRing.rotation.z += 0.002;
      gyroRing2.rotation.z -= 0.0016;

      particles.rotation.y += 0.0008;
      particles.rotation.x -= 0.0004;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 520;
      const h = container.clientHeight || 520;
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
      ring2Geo.dispose();
      ring2Mat.dispose();
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
      className="relative h-full w-full flex items-center justify-center select-none"
      aria-hidden="true"
    />
  );
}
