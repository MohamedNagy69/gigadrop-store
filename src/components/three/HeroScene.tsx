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
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.2;

    const isLight = theme === 'light';
    const accentHex = isLight ? 0x166534 : 0xccff00;

    // Centered Wireframe Icosahedron Sphere
    const geometry = new THREE.IcosahedronGeometry(2.1, 2);
    const material = new THREE.MeshBasicMaterial({
      color: accentHex,
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.08 : 0.12,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Inner Octahedron Core
    const coreGeo = new THREE.OctahedronGeometry(1.05, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: accentHex,
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.12 : 0.2,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Floating Particles Ring
    const particlesCount = 80;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 8;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: accentHex,
      size: 0.04,
      transparent: true,
      opacity: isLight ? 0.25 : 0.45,
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      sphere.rotation.y += 0.002;
      sphere.rotation.x += 0.001;
      core.rotation.y -= 0.003;
      core.rotation.z += 0.0015;
      particles.rotation.y += 0.0008;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, [theme]);

  if (!webglSupported) {
    return (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-20">
        <div
          className="h-72 w-72 animate-spin rounded-full border border-dashed border-[#CCFF00]/50"
          style={{ animationDuration: '28s' }}
        />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
