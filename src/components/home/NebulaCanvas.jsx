import React, { useEffect, useRef } from 'react';

/**
 * 密集星云（确保最终发散落点在框内右下角）：
 * - 出生点：leftRef（左侧文字块）右下角附近
 * - 运动：向右下 + 漩涡旋转
 * - 发散：末段（p>0.72）发散中心锁定在右下角 endX/endY，并强吸附
 * - 不挡交互：canvas pointer-events: none
 */
export default function NebulaCanvas({ active, frameRef, leftRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const reduce =
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    if (reduce) return;

    const canvas = canvasRef.current;
    const frameEl = frameRef?.current;
    const leftEl = leftRef?.current;
    if (!canvas || !frameEl || !leftEl) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const getAnchors = () => {
      const fr = frameEl.getBoundingClientRect();
      const lr = leftEl.getBoundingClientRect();

      // ✅ 出生点：邮箱区域右下角附近（left block 的 right/bottom）
      const startX = lr.right - fr.left + Math.min(80, fr.width * 0.06);
      const startY = lr.bottom - fr.top + Math.min(40, fr.height * 0.04);

      // ✅ 终点：框内右下角（固定 inset，保证贴角且不被裁）
      const inset = 28; // 越小越贴角（18~40）
      const endX = fr.width - inset;
      const endY = fr.height - inset;

      return { startX, startY, endX, endY };
    };

    const resize = () => {
      const rect = frameEl.getBoundingClientRect();
      w = rect.width;
      h = rect.height;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // ====== 粒子参数 ======
    const area = w * h;
    const COUNT = Math.min(9000, Math.max(5200, Math.floor(area / 140)));
    const particles = [];

    const rand = (a, b) => a + Math.random() * (b - a);
    const easeInOut = (t) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    // 高斯：让中心更“团”
    const gauss = () =>
      (Math.random() + Math.random() + Math.random() + Math.random() - 2) * 0.6;

    const spawn = () => {
      const { startX, startY } = getAnchors();

      const baseR = Math.min(w, h) * 0.42;
      const r = Math.abs(gauss()) * baseR;
      const ang = Math.random() * Math.PI * 2;

      const x = startX + Math.cos(ang) * r + gauss() * 18;
      const y = startY + Math.sin(ang) * r + gauss() * 18;

      return {
        x,
        y,
        vx: rand(-0.15, 0.15),
        vy: rand(-0.15, 0.15),
        drift: rand(0.55, 1.05),
        pr: Math.random() < 0.82 ? rand(0.6, 1.05) : rand(1.05, 1.85),
        a: rand(0.028, 0.105),
        seed: Math.random() * 1000,
      };
    };

    for (let i = 0; i < COUNT; i++) particles.push(spawn());

    let t = 0;
    const loopSecs = 14.0;

    const BASE_VORTEX = 0.2;
    const BASE_SPREAD = 0.35;
    const FLOW = 0.3;

    const step = () => {
      t += 1 / 135;

      const phase = (t % loopSecs) / loopSecs; // 0~1
      const p = easeInOut(phase);

      const { startX, startY, endX, endY } = getAnchors();

      // 运动中心：从 start -> end
      const cx = startX + (endX - startX) * p;
      const cy = startY + (endY - startY) * p;

      ctx.clearRect(0, 0, w, h);

      const vortexStrength = BASE_VORTEX * (1 - p * 0.75) + 0.12;
      const spreadStrength = BASE_SPREAD * (p * p * p);

      const flowX = FLOW * (0.24 + 0.55 * p);
      const flowY = FLOW * (0.18 + 0.78 * p);

      // ✅ 末段锁定：发散中心强制迁移到右下角 endX/endY
      // p < 0.72：围绕 cx/cy；p >= 0.72：围绕 endX/endY
      const lock = Math.max(0, (p - 0.72) / 0.28); // 0~1
      const centerX = cx + (endX - cx) * (lock * lock);
      const centerY = cy + (endY - cy) * (lock * lock);

      // ✅ 末段强吸附：确保“密度峰值/发散落点”贴右下角
      const snapK = 0.008 * lock * lock; // 可调 0.02~0.06（越大越“吸住”右下）

      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];

        // 这里用 centerX/centerY（末段会变成右下角）
        const dx = pt.x - centerX;
        const dy = pt.y - centerY;
        const dist = Math.max(22, Math.hypot(dx, dy));

        const tx = -dy / dist;
        const ty = dx / dist;

        const rx = dx / dist;
        const ry = dy / dist;

        const n1 = Math.sin((t * 1.4 + pt.seed) * 0.9) * 0.05;
        const n2 = Math.cos((t * 1.1 + pt.seed) * 0.7) * 0.05;

        const push = 0.008 + 0.01 * p;

        // 基础力场：旋转 + 扩散 + 向右下推进
        pt.vx +=
          tx * (vortexStrength * 0.24) +
          rx * (spreadStrength * 0.1) +
          flowX * push +
          n1;

        pt.vy +=
          ty * (vortexStrength * 0.24) +
          ry * (spreadStrength * 0.1) +
          flowY * push +
          n2;

        // ✅ 强吸附：把末段整体拖到 endX/endY（保证发散点不会在中间）
        pt.vx += (endX - pt.x) * snapK;
        pt.vy += (endY - pt.y) * snapK;

        pt.vx *= 0.992;
        pt.vy *= 0.992;

        pt.x += pt.vx * pt.drift;
        pt.y += pt.vy * pt.drift;

        const alpha = pt.a * (0.95 - 0.35 * p);
        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.pr, 0, Math.PI * 2);
        ctx.fill();

        if (pt.x < -180 || pt.y < -180 || pt.x > w + 180 || pt.y > h + 180) {
          particles[i] = spawn();
        }
      }

      // 周期重置：保持密集
      if (phase < 0.02) {
        for (let k = 0; k < particles.length * 0.12; k++) {
          const idx = Math.floor(Math.random() * particles.length);
          particles[idx] = spawn();
        }
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [active, frameRef, leftRef]);

  return (
    <canvas ref={canvasRef} className="stage4-nebula" aria-hidden="true" />
  );
}
