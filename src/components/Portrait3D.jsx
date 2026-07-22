import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Portrait3D = ({ imageSrc, depthMapSrc, normalMapSrc, active }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef(null);
  const requestRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const targetMouseRef = useRef(new THREE.Vector2(0, 0));
  const hoverProgressRef = useRef(0);
  const targetHoverProgressRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = 320;
    const height = 320;

    // 1. Create Scene
    const scene = new THREE.Scene();

    // 2. Create Orthographic Camera
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // 3. Create WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Load Textures
    const loader = new THREE.TextureLoader();
    const textureImage = loader.load(imageSrc);
    const textureDepth = loader.load(depthMapSrc);
    const textureNormal = loader.load(normalMapSrc);

    // Wrap settings
    [textureImage, textureDepth, textureNormal].forEach((tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
    });

    // 5. Custom Shaders (Depth map + Parallax Normal mapping)
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uImage;
      uniform sampler2D uDepthMap;
      uniform sampler2D uNormalMap;
      uniform vec2 uMouse;
      uniform float uHover;
      varying vec2 vUv;

      void main() {
        // Read depth value
        float depth = texture2D(uDepthMap, vUv).r;

        // Displace coordinate based on depth and mouse position
        vec2 parallaxOffset = uMouse * depth * 0.05 * uHover;
        vec2 displacedUv = vUv + parallaxOffset;

        // Ensure UV coords stay in [0, 1] bounds
        displacedUv = clamp(displacedUv, 0.0, 1.0);

        // Fetch primary image color
        vec4 color = texture2D(uImage, displacedUv);

        // Calculate dynamic directional light using normal map
        vec3 normal = texture2D(uNormalMap, displacedUv).rgb * 2.0 - 1.0;
        normal = normalize(normal);

        // Dynamic light position based on mouse coordinate
        vec3 lightDirection = normalize(vec3(uMouse * 1.5, 0.8));
        
        // Dynamic diffuse lighting calculation
        float diffuse = max(dot(normal, lightDirection), 0.0);

        // Add specular highlight based on reflection vector
        vec3 viewDir = vec3(0.0, 0.0, 1.0);
        vec3 halfDir = normalize(lightDirection + viewDir);
        float specular = pow(max(dot(normal, halfDir), 0.0), 32.0);

        // Blend lighting into portrait
        color.rgb += (diffuse * 0.08 + specular * 0.04) * uHover;

        gl_FragColor = color;
      }
    `;

    // 6. Create Material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uImage: { value: textureImage },
        uDepthMap: { value: textureDepth },
        uNormalMap: { value: textureNormal },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uHover: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
    });
    materialRef.current = material;

    // 7. Create Plane Mesh
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 8. Handle Mouse Move
    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseRef.current.set(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 9. Animation render loop
    const animate = () => {
      // Lerp mouse coordinates for smooth inertia motion
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.08;
      material.uniforms.uMouse.value.copy(mouseRef.current);

      // Lerp hover transition progress
      hoverProgressRef.current += (targetHoverProgressRef.current - hoverProgressRef.current) * 0.1;
      material.uniforms.uHover.value = hoverProgressRef.current;

      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      // Cleanup
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      geometry.dispose();
      material.dispose();
      textureImage.dispose();
      textureDepth.dispose();
      textureNormal.dispose();
      renderer.dispose();
    };
  }, [imageSrc, depthMapSrc, normalMapSrc]);

  // Sync active hover state
  useEffect(() => {
    targetHoverProgressRef.current = active ? 1.0 : 0.0;
  }, [active]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '320px',
        height: '320px',
        backgroundColor: '#000',
        borderRadius: '1rem',
        overflow: 'hidden',
      }}
    />
  );
};

export default Portrait3D;
