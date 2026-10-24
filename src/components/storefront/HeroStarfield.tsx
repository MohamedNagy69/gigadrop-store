'use client';

import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '@/stores/themeStore';

interface Star {
  x: number;
  y: number;
  z: number; // depth: 0.3 (far) to 1.3 (near)
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  colorType: 'lime' | 'emerald' | 'bright';
  vx: number;
  vy: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  maxLife: number;
  life: number;
}

export default function HeroStarfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useThemeStore();
  const isDark = theme !== 'light';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    // 1. Initialize Stars Field (160 stars with depth distribution)
    const starCount = Math.min(180, Math.floor((width * height) / 4800));
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const z = 0.3 + Math.random() * 1.0;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        radius: (0.75 + Math.random() * 1.6) * (z * 0.9),
        baseAlpha: 0.25 + Math.random() * 0.65,
        twinkleSpeed: 0.015 + Math.random() * 0.035,
        twinklePhase: Math.random() * Math.PI * 2,
        colorType: Math.random() > 0.3 ? 'lime' : Math.random() > 0.5 ? 'emerald' : 'bright',
        vx: (Math.random() - 0.5) * 0.12,
        vy: -(0.06 + Math.random() * 0.14) * z, // slow floating upwards
      });
    }

    // 2. Shooting Stars Array
    const shootingStars: ShootingStar[] = [];
    let nextShootingStarTime = Date.now() + 2500 + Math.random() * 3000;

    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * (width * 0.8),
        y: Math.random() * (height * 0.45),
        length: 70 + Math.random() * 70,
        speed: 8 + Math.random() * 7,
        angle: (Math.PI / 180) * (25 + Math.random() * 20),
        opacity: 0,
        maxLife: 50 + Math.random() * 30,
        life: 0,
      });
      nextShootingStarTime = Date.now() + 4500 + Math.random() * 4000;
    };

    // 3. Mouse Parallax Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let mousePixelX = -9999;
    let mousePixelY = -9999;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mousePixelX = x;
      mousePixelY = y;
      targetMouseX = (x / width - 0.5) * 2;
      targetMouseY = (y / height - 0.5) * 2;
    };

    const handleMouseLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
      mousePixelX = -9999;
      mousePixelY = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 650;
    };
    window.addEventListener('resize', handleResize);

    // 4. Main Animation Loop
    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation (spring easing)
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Spawn shooting stars periodically
      if (Date.now() > nextShootingStarTime) {
        spawnShootingStar();
      }

      // --- Draw & Animate Stars ---
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Float upwards & drift
        star.y += star.vy;
        star.x += star.vx + Math.sin(time + star.twinklePhase) * 0.08;

        // Wrap around borders
        if (star.y < -10) star.y = height + 10;
        if (star.y > height + 10) star.y = -10;
        if (star.x < -10) star.x = width + 10;
        if (star.x > width + 10) star.x = -10;

        // 3D Parallax offset based on depth (z)
        const parallaxX = currentMouseX * star.z * 36;
        const parallaxY = currentMouseY * star.z * 28;
        const drawX = star.x + parallaxX;
        const drawY = star.y + parallaxY;

        // Twinkle pulse effect
        const pulse = Math.sin(time * 2 + star.twinklePhase);
        let alpha = star.baseAlpha + pulse * 0.28;
        alpha = Math.max(0.12, Math.min(1.0, alpha));

        // Proximity glow to cursor
        const dx = drawX - mousePixelX;
        const dy = drawY - mousePixelY;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 140) {
          const proximityBoost = (1 - distToMouse / 140) * 0.45;
          alpha = Math.min(1.0, alpha + proximityBoost);
        }

        // Color definitions
        let colorCenter: string;
        let colorGlow: string;

        if (isDark) {
          if (star.colorType === 'lime') {
            colorCenter = `rgba(204, 255, 0, ${alpha})`;
            colorGlow = `rgba(204, 255, 0, ${alpha * 0.25})`;
          } else if (star.colorType === 'emerald') {
            colorCenter = `rgba(74, 222, 128, ${alpha})`;
            colorGlow = `rgba(74, 222, 128, ${alpha * 0.25})`;
          } else {
            colorCenter = `rgba(240, 255, 170, ${alpha})`;
            colorGlow = `rgba(204, 255, 0, ${alpha * 0.35})`;
          }
        } else {
          // Light Mode: Vibrant Emerald, Mint, & Azure Glistening Cyber-Stars
          if (star.colorType === 'lime') {
            colorCenter = `rgba(5, 150, 105, ${alpha * 0.95})`;
            colorGlow = `rgba(5, 150, 105, ${alpha * 0.28})`;
          } else if (star.colorType === 'emerald') {
            colorCenter = `rgba(16, 185, 129, ${alpha * 0.95})`;
            colorGlow = `rgba(16, 185, 129, ${alpha * 0.28})`;
          } else {
            colorCenter = `rgba(2, 132, 199, ${alpha * 0.95})`;
            colorGlow = `rgba(2, 132, 199, ${alpha * 0.28})`;
          }
        }

        // 1. Draw outer soft luminous aura
        const glowRadius = star.radius * (isDark ? 3.6 : 2.4);
        const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, glowRadius);
        gradient.addColorStop(0, colorGlow);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(drawX, drawY, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // 2. Draw sharp center core
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = colorCenter;
        ctx.fill();
      }

      // --- Draw & Animate Shooting Stars ---
      for (let s = shootingStars.length - 1; s >= 0; s--) {
        const ss = shootingStars[s];
        ss.life++;

        // Fade in and out
        const progress = ss.life / ss.maxLife;
        if (progress < 0.2) {
          ss.opacity = progress / 0.2;
        } else {
          ss.opacity = 1 - (progress - 0.2) / 0.8;
        }

        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        if (isDark) {
          grad.addColorStop(0, 'rgba(204, 255, 0, 0)');
          grad.addColorStop(0.7, `rgba(204, 255, 0, ${ss.opacity * 0.4})`);
          grad.addColorStop(1, `rgba(240, 255, 200, ${ss.opacity * 0.95})`);
        } else {
          grad.addColorStop(0, 'rgba(2, 132, 199, 0)');
          grad.addColorStop(0.65, `rgba(2, 132, 199, ${ss.opacity * 0.5})`);
          grad.addColorStop(1, `rgba(5, 150, 105, ${ss.opacity * 0.95})`);
        }

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Head spark
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${ss.opacity})`
          : `rgba(5, 150, 105, ${ss.opacity})`;
        ctx.fill();

        if (ss.life >= ss.maxLife) {
          shootingStars.splice(s, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
      aria-hidden="true"
    />
  );
}
