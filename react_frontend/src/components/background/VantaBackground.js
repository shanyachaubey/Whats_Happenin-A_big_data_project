import React, { useEffect, useRef } from 'react';
import GLOBE from 'vanta/dist/vanta.globe.min.js';
import * as THREE from 'three';

const VantaBackground = () => {
  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect = GLOBE({
      el: vantaRef.current,
      THREE: THREE, // Pass the THREE.js instance
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0xffffff,
      backgroundColor: 0x0
    });

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return <div ref={vantaRef} style={{ width: '100%', height: '100vh' }} />;
};

export default VantaBackground;