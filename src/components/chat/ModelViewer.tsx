
import React from 'react';
import Interactive3DViewer from '../Interactive3DViewer';
import { ModelParameters } from '@/hooks/useModelParameters';

interface ModelViewerProps {
  parameters?: ModelParameters;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ parameters }) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-adam-darker">
      <div className="w-full max-w-2xl p-4">
        <Interactive3DViewer 
          showColorPicker={true} 
          parameters={parameters}
          autoRotate={true}
        />
      </div>
    </div>
  );
};

export default ModelViewer;
