import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus, Ring, Cylinder, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const RobotEye = () => {
    const group = useRef();
    const irisRef = useRef();
    const pupilRef = useRef();
    const [blink, setBlink] = useState(false);
    const mouse = useRef(new THREE.Vector2(0, 0));

    // Global Tracking
    useEffect(() => {
        const handleMouseMove = (event) => {
            const x = (event.clientX / window.innerWidth) * 2 - 1;
            const y = -(event.clientY / window.innerHeight) * 2 + 1;
            mouse.current.set(x, y);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Random Blink Logic
    useEffect(() => {
        const triggerBlink = () => {
            setBlink(true);
            setTimeout(() => setBlink(false), 150);
            setTimeout(triggerBlink, Math.random() * 4000 + 2000);
        };
        const timer = setTimeout(triggerBlink, 2000);
        return () => clearTimeout(timer);
    }, []);

    useFrame((state) => {
        if (group.current) {
            // Tracking Logic
            const rotationLimit = 0.6;
            const targetY = mouse.current.x * rotationLimit;
            const targetX = -mouse.current.y * rotationLimit;

            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.1);
            group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.1);
        }

        // Pulse the pupil
        if (pupilRef.current) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            pupilRef.current.scale.setScalar(scale);
        }

        // Rotate Iris parts
        if (irisRef.current) {
            irisRef.current.rotation.z -= 0.005;
        }
    });

    return (
        <group ref={group} scale={[1.0, 1.0, 1.0]}>
            {/* Standard Scale */}

            {/* --- Main Housing (The Sclera) --- */}
            <Sphere args={[1.5, 64, 64]}>
                <meshPhysicalMaterial
                    color="#0a0a0a"
                    metalness={0.9}
                    roughness={0.2}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                />
            </Sphere>

            {/* --- The Eyelids (Blink Animation) --- */}
            {/* Top Lid */}
            <Sphere args={[1.52, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.5]} rotation={[blink ? 0.3 : -0.8, 0, 0]}>
                <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
            </Sphere>
            {/* Bottom Lid */}
            <Sphere args={[1.52, 64, 64, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5]} rotation={[blink ? -0.3 : 0.8, 0, 0]}>
                <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
            </Sphere>

            {/* --- The Eye Complex --- */}
            <group position={[0, 0, 1.35]} rotation={[Math.PI / 2, 0, 0]}>

                {/* 1. Glass Cornea Dome */}
                <mesh position={[0, 0.2, 0]}>
                    <cylinderGeometry args={[0.7, 0.7, 0.4, 32]} />
                    <meshPhysicalMaterial
                        color="white"
                        transmission={0.95} // Glass
                        opacity={1}
                        metalness={0}
                        roughness={0}
                        ior={1.5}
                        thickness={0.5}
                    />
                </mesh>

                {/* 2. Glowing Iris Ring (Outer) */}
                <Torus args={[0.6, 0.05, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
                </Torus>

                {/* 3. Mechanical Iris Details (Inner Rotating) */}
                <group ref={irisRef} rotation={[Math.PI / 2, 0, 0]}>
                    <Ring args={[0.3, 0.55, 32]}>
                        <meshStandardMaterial color="#333" wireframe />
                    </Ring>
                    <Ring args={[0.35, 0.45, 8]}>
                        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} wireframe />
                    </Ring>
                </group>

                {/* 4. The Pupil (Black Hole + Glow) */}
                <group ref={pupilRef} rotation={[Math.PI / 2, 0, 0]}>
                    <Sphere args={[0.25, 32, 32]} scale={[1, 0.5, 1]}>
                        <meshBasicMaterial color="black" />
                    </Sphere>
                    <Sphere args={[0.1, 32, 32]} position={[0.1, 0.1, 0.15]}>
                        <meshBasicMaterial color="white" />
                    </Sphere>
                </group>
            </group>

            {/* --- Holographic HUD Rings (Floating) --- */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.2}>
                <Ring args={[1.8, 1.85, 64]} rotation={[0, 0, 0]}>
                    <meshBasicMaterial color="#00ffcc" transparent opacity={0.3} side={THREE.DoubleSide} />
                </Ring>
                <Ring args={[2.2, 2.22, 64]} rotation={[0.2, 0, 0]}>
                    <meshBasicMaterial color="#ff00aa" transparent opacity={0.2} side={THREE.DoubleSide} />
                </Ring>
            </Float>

        </group>
    );
};

const HeroImage = () => {
    return (
        <div style={{ width: '100%', height: '500px' }}>
            <Canvas
                camera={{ position: [0, 0, 6], fov: 45 }}
                gl={{ alpha: true }}
                dpr={[1, 1.5]}
            >
                {/* Clean Cinematic Lighting */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#00ffff" />
                <pointLight position={[-10, -10, -10]} intensity={2} color="#ff00aa" />

                <RobotEye />

                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
        </div>
    );
};

export default HeroImage;
