import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import './ParallaxBackground.css';

function ParallaxBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 90, damping: 18, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 18, mass: 0.4 });
  const spotX = useSpring(rawX, { stiffness: 400, damping: 32, mass: 0.15 });
  const spotY = useSpring(rawY, { stiffness: 400, damping: 32, mass: 0.15 });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY, rawX, rawY]);

  const blob1X = useTransform(springX, (v) => v * 25);
  const blob1Y = useTransform(springY, (v) => v * 25);
  const blob2X = useTransform(springX, (v) => v * -40);
  const blob2Y = useTransform(springY, (v) => v * -40);
  const blob3X = useTransform(springX, (v) => v * 55);
  const blob3Y = useTransform(springY, (v) => v * 55);

  const spotlightBg = useMotionTemplate`radial-gradient(circle 280px at ${spotX}px ${spotY}px, rgba(var(--primary-rgb), 0.4), transparent 70%)`;

  return (
    <div className="parallax-bg" aria-hidden="true">
      <motion.div className="parallax-blob blob-1" style={{ x: blob1X, y: blob1Y }} />
      <motion.div className="parallax-blob blob-2" style={{ x: blob2X, y: blob2Y }} />
      <motion.div className="parallax-blob blob-3" style={{ x: blob3X, y: blob3Y }} />
      <div className="parallax-texture" />
      <motion.div className="parallax-spotlight" style={{ background: spotlightBg }} />
    </div>
  );
}

export default ParallaxBackground;
