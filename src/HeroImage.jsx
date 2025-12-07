import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import img from "./img.jpeg";
import './App.css'; // Ensure we have access to styles

function HeroImage() {
    const ref = useRef(null);

    // Mouse position state
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring animation for tilt
    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    // Calculate rotation based on mouse position
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    // Parallax for layers (RGB Split)
    const layer1X = useTransform(mouseXSpring, [-0.5, 0.5], ["-5px", "5px"]);
    const layer1Y = useTransform(mouseYSpring, [-0.5, 0.5], ["-5px", "5px"]);

    const layer2X = useTransform(mouseXSpring, [-0.5, 0.5], ["5px", "-5px"]);
    const layer2Y = useTransform(mouseYSpring, [-0.5, 0.5], ["5px", "-5px"]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className="hero-image-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
        >
            {/* Red Channel */}
            <motion.div
                className="hero-image-layer red"
                style={{ x: layer1X, y: layer1Y, backgroundImage: `url(${img})` }}
            />

            {/* Blue Channel */}
            <motion.div
                className="hero-image-layer blue"
                style={{ x: layer2X, y: layer2Y, backgroundImage: `url(${img})` }}
            />

            {/* Main Image */}
            <div
                className="hero-image-main"
                style={{ backgroundImage: `url(${img})` }}
            >
                <div className="glitch-overlay"></div>
            </div>

            {/* Frame/Border Elements */}
            <div className="holo-border"></div>
        </motion.div>
    );
}

export default HeroImage;
