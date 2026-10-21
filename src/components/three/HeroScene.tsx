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

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const isLight = theme === 'light';
    const primaryHex = isLight ? 0x166534 : 0xccff00;
    const secondaryHex = isLight ? 0x0284c7 : 0x38bdf8;

    const group = new THREE.Group();
    // Position the cyber portal slightly lower and tilted back so it frames the content
    group.position.set(0, -0.65, 0);
    group.rotation.x = 0.85;
    scene.add(group);

    // 1. Outer Segmented Cyber Ring
    const outerRadius = 3.6;
    const outerSegments = 64;
    const outerGeo = new THREE.BufferGeometry();
    const outerPositions = new Float32Array(outerSegments * 3);
    for (let i = 0; i < outerSegments; i++) {
      const angle = (i / outerSegments) * Math.PI * 2;
      outerPositions[i * 3] = Math.cos(angle) * outerRadius;
      outerPositions[i * 3 + 1] = Math.sin(angle) * outerRadius;
      outerPositions[i * 3 + 2] = 0;
    }
    outerGeo.setAttribute('position', new THREE.BufferAttribute(outerPositions, 3));
    const outerMat = new THREE.LineBasicMaterial({
      color: primaryHex,
      transparent: true,
      opacity: isLight ? 0.12 : 0.22,
    });
    const outerRing = new THREE.LineLoop(outerGeo, outerMat);
    group.add(outerRing);

    // 2. Middle Torus Data Ring
    const midGeo = new THREE.TorusGeometry(2.6, 0.015, 8, 48);
    const midMat = new THREE.MeshBasicMaterial({
      color: secondaryHex,
      transparent: true,
      opacity: isLight ? 0.15 : 0.28,
    });
    const midRing = new THREE.Mesh(midGeo, midMat);
    group.add(midRing);

    // 3. Inner Cyber Grid Disc
    const innerGeo = new THREE.RingGeometry(1.2, 1.8, 32, 3);
    const innerMat = new THREE.MeshBasicMaterial({
      color: primaryHex,
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.08 : 0.16,
      side: THREE.DoubleSide,
    });
    const innerRing = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerRing);

    // 4. Subtle Orbital Nodes
    const nodeCount = 6;
    const nodeGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: primaryHex,
      transparent: true,
      opacity: isLight ? 0.35 : 0.7,
    });
    const nodesGroup = new THREE.Group();
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(Math.cos(angle) * 2.6, Math.sin(angle) * 2.6, 0);
      nodesGroup.add(node);
    }
    group.add(nodesGroup);

    // 5. Ambient Floating Cyber Particles (Stars / Cyber Dust)
    const particleCount = 100;
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pPositions[i] = (Math.random() - 0.5) * 12;
      pPositions[i + 1] = (Math.random() - 0.5) * 8;
      pPositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: primaryHex,
      size: 0.035,
      transparent: true,
      opacity: isLight ? 0.25 : 0.45,
    });
    const particles = new THREE.Points(pGeo, pMat);
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

      // Smooth camera interpolation
      targetX = mouseX * 0.35;
      targetY = -mouseY * 0.25;
      camera.position.x += (targetX - camera.position.x) * 0.03;
      camera.position.y += (targetY - camera.position.y) * 0.03;
      camera.lookAt(0, -0.4, 0);

      // Rotations
      outerRing.rotation.z += 0.0012;
      midRing.rotation.z -= 0.0018;
      innerRing.rotation.z += 0.0022;
      nodesGroup.rotation.z -= 0.0018;
      particles.rotation.y += 0.0004;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 560;
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
      midGeo.dispose();
      midMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, [theme]);

  if (!webglSupported) {
    return (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-20">
        <div
          className="h-72 w-72 animate-spin rounded-full border border-dashed border-[#CCFF00]/40"
          style={{ animationDuration: '30s' }}
        />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden [mask-image:radial-gradient(ellipse_85%_75%_at_50%_45%,black_40%,transparent_90%)]"
      aria-hidden="true"
    />
  );
}
