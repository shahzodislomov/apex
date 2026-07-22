import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { KTX2Loader } from 'three-stdlib';
import * as THREE from 'three';
import gsap from 'gsap';

// Configure global Draco decoder path
useGLTF.setDecoderPath('/draco/');

let sharedKtx2Loader = null;

// Helper hook to load KTX2-compressed GLB models inside Canvas context
const useCompressedGLTF = (url) => {
  const gl = useThree((state) => state.gl);
  return useGLTF(url, true, false, (loader) => {
    if (!sharedKtx2Loader) {
      sharedKtx2Loader = new KTX2Loader();
      sharedKtx2Loader.setTranscoderPath('/basis/');
      sharedKtx2Loader.detectSupport(gl);
    }
    loader.setKTX2Loader(sharedKtx2Loader);
  });
};

// Reusable Interactive Spire/Rock Model Component that handles block cracking and glowing on hover
const InteractiveModel = ({ modelPath, active, activeSection, sectionProgress = 0, scale = 1.0, position = [0, 0, 0] }) => {
  const { scene } = useCompressedGLTF(modelPath);
  const ref = useRef();
  const mouseWorld = React.useMemo(() => new THREE.Vector3(), []);
  
  // Clone the scene graph once on load to ensure independent rendering instance
  const modelScene = React.useMemo(() => scene.clone(), [scene]);

  // Extract in-place mesh references from the cloned scene to preserve transformations
  const [blocks] = useState(() => {
    const arr = [];
    modelScene.traverse((child) => {
      if (child.isMesh) {
        if (child.material) {
          child.material = child.material.clone();
          child.material.transparent = true;
          child.material.opacity = 1.0;
          child.material.color = new THREE.Color('#ffffff'); // White ice
          child.material.emissive = new THREE.Color('#0a1b2a'); // Slight blueish glow
          child.material.emissiveIntensity = 0.2;
          // Remove any ripple or net-like textures
          child.material.normalMap = null;
          child.material.bumpMap = null;
          child.material.displacementMap = null;
          child.material.roughnessMap = null;
          child.material.wireframe = false;
          child.material.needsUpdate = true;
        }
        arr.push({
          mesh: child,
          originalPosition: child.position.clone(),
          timeOffset: Math.random() * Math.PI * 2,
          currentMouseDisplacement: new THREE.Vector3(0, 0, 0),
          smoothedPosition: child.position.clone(),
        });
      }
    });
    return arr;
  });

  useFrame((state) => {
    if (blocks.length === 0 || !ref.current) return;

    const time = state.clock.getElapsedTime();

      // Dynamic global rotation and floating of the iceberg
      // Add subtle constant rotation plus responsive tilting based on mouse position
      ref.current.rotation.y = time * 0.15 + (state.pointer.x * 0.2);
      ref.current.rotation.x = state.pointer.y * -0.2;
      ref.current.rotation.z = state.pointer.x * -0.1;
      
      // Prominent floating up and down
      ref.current.position.y = position[1] + Math.sin(time * 1.2) * 0.15;

    // 1. Calculate mouse 3D position accurately by projecting along the ray to the model's depth
    state.raycaster.setFromCamera(state.pointer, state.camera);
    // Find depth distance from camera to the model's origin
    const distToModel = state.camera.position.distanceTo(ref.current.position);
    // Project ray to that distance
    state.raycaster.ray.at(distToModel, mouseWorld);

    // Convert mouseWorld from global coordinates to local coordinates of the model
    ref.current.worldToLocal(mouseWorld);

    blocks.forEach((block) => {
      const { mesh, originalPosition, timeOffset, currentMouseDisplacement, smoothedPosition } = block;

      // 2. Base direction vector from origin (normalized)
      const direction = originalPosition.clone().normalize();
      if (direction.lengthSq() === 0) {
        direction.set(0, 1, 0);
      }

      // 3. Mouse push (cracking displacement)
      let targetDisplacement = new THREE.Vector3(0, 0, 0);
      if (active) {
        const distToMouse = originalPosition.distanceTo(mouseWorld);
        const influenceRadius = 2.8; // Radius of cracking effect
        const pushStrength = 2.5;   // Force of block dispersion
        const falloffPower = 1.5;

        if (distToMouse < influenceRadius) {
          const normalizedDist = distToMouse / influenceRadius;
          const influence = Math.pow(1.0 - normalizedDist, falloffPower);
          const pushAmount = influence * pushStrength;
          targetDisplacement = direction.clone().multiplyScalar(pushAmount);
        }
      }

      // Smoothly interpolate the displacement using lerp (slower for a more graceful shatter)
      currentMouseDisplacement.lerp(targetDisplacement, 0.06);

      const dispLength = currentMouseDisplacement.length();

      // Slower wiggle speeds
      const floatSpeed = 0.25;
      const noiseSpeed = 0.6;
      const noiseAmplitude = 0.02;
      const noiseFrequency = 3.0;

      const basePhase = time * floatSpeed + timeOffset;
      const baseAnim = (Math.sin(basePhase) + 1) / 2;

      const noisePhase = time * noiseSpeed + timeOffset;
      const noise = Math.abs(Math.sin(noisePhase * noiseFrequency) * noiseAmplitude);
      const finalAnim = baseAnim + noise;

      // Make the ice perfectly whole (0 float) when not hovered. 
      // Only introduce organic breathing/shattering displacement when hovered (dispLength > 0).
      const offsetDistance = finalAnim * (dispLength * 0.08); 
      const floatDisplacement = direction.clone().multiplyScalar(offsetDistance);

      // Combine positions: if not hovered, finalPosition is originalPosition + default breathing float
      const finalPosition = originalPosition.clone()
        .add(currentMouseDisplacement)
        .add(floatDisplacement);

      // Smooth transition (slower return/movement)
      smoothedPosition.lerp(finalPosition, 0.08);
      mesh.position.copy(smoothedPosition);

      // 5. Dynamic Material Glow (only active when hovered)
      if (mesh.material) {
        if (dispLength > 0.01) {
          mesh.material.emissiveIntensity = 0.15 + dispLength * 4.0;
          mesh.material.emissive.setHSL(0.58 + dispLength * 0.08, 0.95, 0.1 + dispLength * 0.5);
        } else {
          mesh.material.emissiveIntensity = 0.05;
          mesh.material.emissive.setHex(0x00061a);
        }
      }
    });
  });

  return (
    <primitive
      ref={ref}
      object={modelScene}
      scale={active ? scale : 0.001}
      position={position}
    />
  );
};

// 3. Floating Rocks Component (Section 1 Background/Surrounding)
const FloatingRocks = ({ active }) => {
  const { scene } = useCompressedGLTF('/gl/global/rocks.glb');
  const groupRef = useRef();

  // Extract separate rock meshes
  const rockMeshes = React.useMemo(() => {
    const meshes = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        meshes.push(child.clone());
      }
    });
    return meshes.slice(0, 12);
  }, [scene]);

  // Seed random parameters for each rock
  const rockParams = React.useMemo(() => {
    return rockMeshes.map((_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 3.5 + Math.random() * 2.0;
      return {
        initialX: Math.cos(angle) * radius,
        initialY: (Math.random() - 0.5) * 4.0,
        initialZ: Math.sin(angle) * radius,
        speed: 0.1 + Math.random() * 0.15,
        rotationSpeedX: (Math.random() - 0.5) * 0.5,
        rotationSpeedY: (Math.random() - 0.5) * 0.5,
        scale: 0.2 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, [rockMeshes]);

  useFrame((state) => {
    if (!groupRef.current || !active) return;
    const children = groupRef.current.children;
    const time = state.clock.getElapsedTime();

    rockParams.forEach((params, i) => {
      const child = children[i];
      if (child) {
        const currentAngle = (i / 12) * Math.PI * 2 + time * params.speed * 0.1;
        const radius = 3.5 + Math.sin(time * 0.2 + params.phase) * 0.5;
        child.position.x = Math.cos(currentAngle) * radius;
        child.position.y = params.initialY + Math.sin(time * 0.3 + params.phase) * 0.2;
        child.position.z = Math.sin(currentAngle) * radius;
        child.rotation.x = time * params.rotationSpeedX;
        child.rotation.y = time * params.rotationSpeedY;
      }
    });
  });

  return (
    <group ref={groupRef} visible={active}>
      {rockMeshes.map((mesh, i) => (
        <primitive
          key={i}
          object={mesh}
          scale={rockParams[i].scale}
          position={[rockParams[i].initialX, rockParams[i].initialY, rockParams[i].initialZ]}
        />
      ))}
    </group>
  );
};

// 6. Global Background Grid Component (bg.glb with Vertex Displacement)
const BackgroundGrid = () => {
  const { scene } = useCompressedGLTF('/gl/global/bg.glb');
  const meshRef = useRef();

  const bgMesh = React.useMemo(() => {
    let mesh = null;
    scene.traverse((child) => {
      if (child.isMesh && child.name === 'BG') {
        mesh = child.clone();
        mesh.material = child.material.clone();
        mesh.material.transparent = true;
        mesh.material.opacity = 0.6;
        mesh.material.blending = THREE.AdditiveBlending;
        mesh.material.depthWrite = false;
        mesh.material.wireframe = true; // Enabled wavy wires
        mesh.material.color = new THREE.Color('#7a828e'); // Changed to a sophisticated grayish color
      }
    });
    return mesh;
  }, [scene]);

  const originalPositions = React.useMemo(() => {
    if (!bgMesh) return null;
    return bgMesh.geometry.attributes.position.array.slice();
  }, [bgMesh]);

  useFrame((state) => {
    if (!bgMesh || !meshRef.current || !originalPositions) return;

    const geometry = meshRef.current.geometry;
    const positions = geometry.attributes.position.array;
    const time = state.clock.getElapsedTime();

    const amp = 0.15; // Gentler wave amplitude for elegance
    const freq = 1.2; // More ripples
    const speed = 0.4; // Slower, calmer movement

    for (let i = 0; i < positions.length / 3; i++) {
      const x = originalPositions[i * 3];
      const y = originalPositions[i * 3 + 1];
      const z = originalPositions[i * 3 + 2];
      positions[i * 3 + 2] = z + Math.sin(x * freq + time * speed) * Math.cos(y * freq + time * speed) * amp;
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return bgMesh ? (
    <primitive
      ref={meshRef}
      object={bgMesh}
      scale={[4.0, 4.0, 4.0]} // Scaled down slightly to prevent huge blocky lines
      position={[0, -2.5, -4]} // Positioned as a floor/background net
    />
  ) : null;
};

// 7. Interactive Simulated Point Cloud Component (SDF/Human simulation placeholder)
const PointCloudModel = ({ modelPath, active, color, position = [0, 0, 0], scale = 1.0 }) => {
  const { scene } = useCompressedGLTF(modelPath);
  const pointsRef = useRef();

  const [positions, originalPositions] = React.useMemo(() => {
    const coords = [];
    scene.traverse((child) => {
      if (child.isMesh && child.geometry) {
        const posAttr = child.geometry.attributes.position;
        const matrix = child.matrixWorld;
        const tempV = new THREE.Vector3();
        
        for (let i = 0; i < posAttr.count; i += 2) {
          tempV.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
          tempV.applyMatrix4(matrix);
          coords.push(tempV.x, tempV.y, tempV.z);
        }
      }
    });

    const arr = new Float32Array(coords);
    return [arr, arr.slice()];
  }, [scene]);

  useFrame((state) => {
    if (!pointsRef.current || !active) return;
    const geometry = pointsRef.current.geometry;
    const posArr = geometry.attributes.position.array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < posArr.length / 3; i++) {
      const ox = originalPositions[i * 3];
      const oy = originalPositions[i * 3 + 1];
      const oz = originalPositions[i * 3 + 2];
      posArr[i * 3] = ox + Math.sin(time * 1.5 + oy * 2.0) * 0.05;
      posArr[i * 3 + 1] = oy + Math.cos(time * 1.2 + ox * 2.0) * 0.05;
      posArr[i * 3 + 2] = oz + Math.sin(time * 1.8 + oz * 2.0) * 0.05;
    }
    geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.1;
  });

  return active ? (
    <points ref={pointsRef} position={position} scale={scale}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.025}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  ) : null;
};

// Background Bubble System
const ParticleSystem = () => {
  const count = 300;
  const meshRef = useRef();

  const [positions, speeds] = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      sp[i] = 0.015 + Math.random() * 0.025;
    }
    return [pos, sp];
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const posArr = meshRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += speeds[i];
      if (posArr[i * 3 + 1] > 6) {
        posArr[i * 3 + 1] = -6;
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#9bb8e1"
        size={0.02}
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </points>
  );
};

// Scene Controller to handle animations
const SceneController = ({ activeSection, sectionProgress, mouse }) => {
  const { camera } = useThree();

  // Normalized relative camera paths based on Theatre.js data
  const cameraPaths = [
    // Simple camera paths that keep the iceberg centered
      // Section 0: Hero/Intro
      {
        pos: [
          [0, 0, 5.0],
          [0, 0, 4.8],
          [0, 0, 4.6],
          [0, 0, 4.4]
        ],
        target: [0, 0, 0]
      },
      // Section 1: Manifesto/Investors
      {
        pos: [
          [0, 0, 4.4],
          [0, 0, 4.2],
          [0, 0, 4.0],
          [0, 0, 3.8]
        ],
        target: [0, 0, 0]
      },
      // Section 2: Portfolio
      {
        pos: [
          [0, 0, 3.8],
          [0, 0, 3.6],
          [0, 0, 3.4],
          [0, 0, 3.2]
        ],
        target: [0, 0, 0]
      },
      // Section 3: Team
      {
        pos: [
          [0, 0, 3.2],
          [0, 0, 3.0],
          [0, 0, 2.8],
          [0, 0, 2.6]
        ],
        target: [0, 0, 0]
      },
      // Section 4: Outro
      {
        pos: [
          [0, 0, 2.6],
          [0, 0, 2.4],
          [0, 0, 2.2],
          [0, 0, 2.0]
        ],
        target: [0, 0, 0]
      }
    ];

    const cameraTargetPos = useRef(new THREE.Vector3(0, 0, 5.0));
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    currentTarget.current.set(0, 0, 0);
  }, []);

  useFrame(() => {
    const pathConfig = cameraPaths[activeSection];
    if (!pathConfig) return;

    // 1. Interpolate camera points based on sectionProgress
    const p = Math.max(0, Math.min(1, sectionProgress));
    const p0 = pathConfig.pos[0];
    const p1 = pathConfig.pos[1];
    const p2 = pathConfig.pos[2];
    const p3 = pathConfig.pos[3];

    let interpolatedX, interpolatedY, interpolatedZ;
    if (p < 0.33) {
      const t = p / 0.33;
      interpolatedX = p0[0] * (1 - t) + p1[0] * t;
      interpolatedY = p0[1] * (1 - t) + p1[1] * t;
      interpolatedZ = p0[2] * (1 - t) + p1[2] * t;
    } else if (p < 0.66) {
      const t = (p - 0.33) / 0.33;
      interpolatedX = p1[0] * (1 - t) + p2[0] * t;
      interpolatedY = p1[1] * (1 - t) + p2[1] * t;
      interpolatedZ = p1[2] * (1 - t) + p2[2] * t;
    } else {
      const t = (p - 0.66) / 0.34;
      interpolatedX = p2[0] * (1 - t) + p3[0] * t;
      interpolatedY = p2[1] * (1 - t) + p3[1] * t;
      interpolatedZ = p2[2] * (1 - t) + p3[2] * t;
    }

    // 2. Smoothly update camera target position
    cameraTargetPos.current.x += (interpolatedX - cameraTargetPos.current.x) * 0.08;
    cameraTargetPos.current.y += (interpolatedY - cameraTargetPos.current.y) * 0.08;
    cameraTargetPos.current.z += (interpolatedZ - cameraTargetPos.current.z) * 0.08;

    // 3. Add mouse parallax offsets to camera
    const factorX = mouse.current.x * 0.45;
    
    const factorY = mouse.current.y * 0.45;

    camera.position.x += (cameraTargetPos.current.x + factorX - camera.position.x) * 0.08;
    camera.position.y += (cameraTargetPos.current.y + factorY - camera.position.y) * 0.08;
    camera.position.z += (cameraTargetPos.current.z - camera.position.z) * 0.08;

    camera.lookAt(currentTarget.current);
  });

  return null;
};

// Loader Fallback Component
const LoaderFallback = () => {
  return null;
};

const Canvas3D = ({ activeSection, sectionProgress = 0 }) => {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div id="gl-canvas-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} color="#e3f4ff" />
        <pointLight position={[-6, -6, -6]} intensity={0.5} color="#2c4e73" />
        <pointLight position={[0, 4, 3]} intensity={0.9} color="#9bb8e1" />
        
        <Suspense fallback={<LoaderFallback />}>
          {/* Models and background grid removed per user request */}
        </Suspense>

        <SceneController activeSection={activeSection} sectionProgress={sectionProgress} mouse={mouse} />
      </Canvas>
    </div>
  );
};

export default Canvas3D;
