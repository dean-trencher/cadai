
import React from 'react';
import Interactive3DViewer from '../Interactive3DViewer';

const ModelViewer: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-adam-darker">
      <div className="w-full max-w-2xl p-4">
        <Interactive3DViewer showColorPicker={true} />
      </div>
    </div>
  );
};

export default ModelViewer;
