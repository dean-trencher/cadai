import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, BoxGeometry, CylinderGeometry, BufferGeometry } from 'three';
import * as THREE from 'three';
import { ModelParameters } from '@/hooks/useModelParameters';

interface Parametric3DModelProps {
  parameters: ModelParameters;
  autoRotate?: boolean;
  color?: string;
}

const Parametric3DModel: React.FC<Parametric3DModelProps> = ({ 
  parameters, 
  autoRotate = true,
  color = "#4A90E2"
}) => {
  const meshRef = useRef<Mesh>(null);
  const holesGroupRef = useRef<THREE.Group>(null);

  // Scale down parameters for better visualization
  const scaledParams = useMemo(() => ({
    length: parameters.length / 50,
    width: parameters.width / 50,
    height: parameters.height / 50,
    holeDiameter: parameters.holeDiameter / 50,
    holeSpacing: parameters.holeSpacing / 50,
    filletRadius: parameters.filletRadius / 50
  }), [parameters]);

  // Create the main geometry based on parameters
  const mainGeometry = useMemo(() => {
    return new BoxGeometry(
      scaledParams.length,
      scaledParams.height,
      scaledParams.width
    );
  }, [scaledParams.length, scaledParams.height, scaledParams.width]);

  // Create holes geometry
  const holesGeometry = useMemo(() => {
    const holes: JSX.Element[] = [];
    const numHoles = Math.floor(scaledParams.length / scaledParams.holeSpacing);
    
    for (let i = 0; i < numHoles; i++) {
      const x = -scaledParams.length/2 + (i + 1) * (scaledParams.length / (numHoles + 1));
      holes.push(
        <mesh key={i} position={[x, 0, 0]}>
          <cylinderGeometry args={[scaledParams.holeDiameter/2, scaledParams.holeDiameter/2, scaledParams.width + 0.1, 8]} />
          <meshStandardMaterial color="#333333" transparent opacity={0.3} />
        </mesh>
      );
    }
    return holes;
  }, [scaledParams]);

  useFrame((state, delta) => {
    if (autoRotate) {
      if (meshRef.current) {
        meshRef.current.rotation.x += delta * 0.2;
        meshRef.current.rotation.y += delta * 0.3;
      }
      if (holesGroupRef.current) {
        holesGroupRef.current.rotation.x += delta * 0.2;
        holesGroupRef.current.rotation.y += delta * 0.3;
      }
    }
  });

  return (
    <group>
      {/* Main object */}
      <mesh ref={meshRef} geometry={mainGeometry}>
        <meshStandardMaterial 
          color={color} 
          metalness={0.7} 
          roughness={0.3}
        />
      </mesh>
      
      {/* Holes */}
      <group ref={holesGroupRef}>
        {holesGeometry}
      </group>
    </group>
  );
};

export default Parametric3DModel;