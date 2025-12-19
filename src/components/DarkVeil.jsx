import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Plane, Program, Color } from 'ogl';

const DarkVeil = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer({ alpha: true, dpr: 2 });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    containerRef.current.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 35 });
    camera.position.set(0, 0, 5);

    const scene = new Transform();

    const vertex = /* glsl */ `
      attribute vec3 position;
      attribute vec2 uv;
      uniform float uTime;
      varying vec2 vUv;
      varying float vElevation;

      void main() {
        vUv = uv;
        vec3 pos = position;
        
        float elevation = sin(pos.x * 2.0 + uTime * 0.5) * 0.2 
                        + sin(pos.y * 2.0 + uTime * 0.3) * 0.2;
        
        pos.z += elevation;
        vElevation = elevation;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragment = /* glsl */ `
      precision highp float;
      uniform vec3 uColor;
      varying vec2 vUv;
      varying float vElevation;

      void main() {
        float alpha = 0.5 + vElevation * 2.0;
        vec3 color = uColor + vElevation * 0.2;
        
        // Fade edges
        float dist = distance(vUv, vec2(0.5));
        alpha *= (1.0 - smoothstep(0.3, 0.5, dist));

        gl_FragColor = vec4(color, alpha * 0.3);
      }
    `;

    const geometry = new Plane(gl, { width: 6, height: 6, widthSegments: 40, heightSegments: 40 });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color('#7000ff') },
      },
      transparent: true,
      depthTest: false,
    });

    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    // Add a second mesh for depth
    const program2 = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 100 },
        uColor: { value: new Color('#4a00e0') },
      },
      transparent: true,
      depthTest: false,
    });
    
    const mesh2 = new Mesh(gl, { geometry, program: program2 });
    mesh2.position.z = -0.5;
    mesh2.setParent(scene);

    function resize() {
      renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    }
    window.addEventListener('resize', resize);
    resize();

    let animationId;
    function update(t) {
      animationId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      program2.uniforms.uTime.value = t * 0.001 + 100;
      renderer.render({ scene, camera });
    }
    animationId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      if (containerRef.current && gl.canvas) {
        containerRef.current.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: -1, backgroundColor: '#030014' }} />;
};

// Helper class since Mesh is not exported directly from 'ogl' in some versions, 
// but usually it is. Let's import it properly.
import { Mesh } from 'ogl';

export default DarkVeil;
