
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
  const [zoom, setZoom] = useState(8);

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

  const colorOptions = [
    { name: 'Blue', color: '#4A90E2' },
    { name: 'Pink', color: '#FF6B9D' },
    { name: 'Purple', color: '#9D4EDD' },
    { name: 'Green', color: '#06D6A0' },
    { name: 'Orange', color: '#FF9F1C' },
    { name: 'Red', color: '#EF476F' },
  ];

  const handleZoomIn = () => setZoom(prev => Math.max(3, prev - 1));
  const handleZoomOut = () => setZoom(prev => Math.min(15, prev + 1));

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-lg">
      <Canvas
        camera={{ position: [zoom, zoom, zoom], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <Parametric3DModel 
          parameters={activeParameters}
          autoRotate={autoRotate}
          color={cubeColor}
        />
        
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          maxDistance={15}
          minDistance={3}
        />
      </Canvas>

      {showColorPicker && (
        <>
          {/* Color Picker */}
          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-lg border border-white/20">
            <div className="text-xs text-white/80 mb-2 font-medium">Choose Color</div>
            <div className="flex gap-2 flex-wrap max-w-[140px]">
              {colorOptions.map((option) => (
                <button
                  key={option.color}
                  onClick={() => setCubeColor(option.color)}
                  className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${
                    cubeColor === option.color ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''
                  }`}
                  style={{ backgroundColor: option.color }}
                  title={option.name}
                />
              ))}
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md rounded-lg p-2 shadow-lg border border-white/20 flex flex-col gap-2">
            <button
              onClick={handleZoomIn}
              className="px-3 py-2 text-white hover:bg-white/20 rounded transition-colors text-sm font-medium"
              title="Zoom In"
            >
              +
            </button>
            <div className="w-full h-px bg-white/20" />
            <button
              onClick={handleZoomOut}
              className="px-3 py-2 text-white hover:bg-white/20 rounded transition-colors text-sm font-medium"
              title="Zoom Out"
            >
              −
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Interactive3DViewer;
