
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Parametric3DModel from './chat/Parametric3DModel';
import { ModelParameters } from '@/hooks/useModelParameters';

interface Interactive3DViewerProps {
  showColorPicker?: boolean;
  parameters?: ModelParameters;
  autoRotate?: boolean;
}

const Interactive3DViewer: React.FC<Interactive3DViewerProps> = ({ 
  showColorPicker = false,
  parameters,
  autoRotate = true
}) => {
  const [cubeColor, setCubeColor] = useState('#4A90E2');

  // Default parameters if none provided
  const defaultParameters: ModelParameters = {
    length: 100,
    width: 20,
    height: 20,
    holeDiameter: 8,
    holeSpacing: 15,
    filletRadius: 2
  };

  const activeParameters = parameters || defaultParameters;

  return (
    <div className="w-full h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-lg">
      <Canvas
        camera={{ position: [4, 4, 4], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <Parametric3DModel 
          parameters={activeParameters}
          autoRotate={autoRotate}
        />
        
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          maxDistance={10}
          minDistance={2}
        />
      </Canvas>

      {showColorPicker && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg p-2 shadow-lg">
          <input
            type="color"
            value={cubeColor}
            onChange={(e) => setCubeColor(e.target.value)}
            className="w-8 h-8 rounded border-none cursor-pointer"
            title="Choose cube color"
          />
        </div>
      )}
    </div>
  );
};

export default Interactive3DViewer;
