
import React from 'react';
import { useToast } from '@/hooks/use-toast';

interface SliderProps {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ label, value, max, onChange }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-white">{label}</span>
        <span className="text-sm text-white">{value}</span>
      </div>
      <div className="relative h-1 bg-gray-700 rounded-full">
        <div 
          className="absolute h-1 bg-adam-pink rounded-full"
          style={{ width: `${(value / max) * 100}%` }}
        ></div>
        <input
          type="range"
          min="0"
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-1 opacity-0 cursor-pointer"
        />
        <div 
          className="absolute w-3 h-3 bg-adam-pink rounded-full -mt-1"
          style={{ left: `calc(${(value / max) * 100}% - 6px)` }}
        ></div>
      </div>
    </div>
  );
};

const ParametersPanel: React.FC = () => {
  const { toast } = useToast();
  const [parameters, setParameters] = React.useState({
    length: 100,
    width: 20,
    height: 20,
    holeDiameter: 8,
    holeSpacing: 15,
    filletRadius: 2
  });

  const [isDownloading, setIsDownloading] = React.useState(false);

  const updateParameter = (key: keyof typeof parameters, value: number) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Show feedback when parameters change
    toast({
      title: "Parameter Updated",
      description: `${key} set to ${value}`,
      duration: 1000,
    });
  };

  const generateSTL = () => {
    const { length, width, height, holeDiameter, holeSpacing, filletRadius } = parameters;
    
    // Generate basic STL content based on parameters
    const stlContent = `solid CAD_AI_Object
facet normal 0.0 0.0 1.0
  outer loop
    vertex 0.0 0.0 ${height}
    vertex ${length} 0.0 ${height}
    vertex ${length} ${width} ${height}
  endloop
endfacet
facet normal 0.0 0.0 1.0
  outer loop
    vertex 0.0 0.0 ${height}
    vertex ${length} ${width} ${height}
    vertex 0.0 ${width} ${height}
  endloop
endfacet
facet normal 0.0 0.0 -1.0
  outer loop
    vertex 0.0 0.0 0.0
    vertex ${length} ${width} 0.0
    vertex ${length} 0.0 0.0
  endloop
endfacet
facet normal 0.0 0.0 -1.0
  outer loop
    vertex 0.0 0.0 0.0
    vertex 0.0 ${width} 0.0
    vertex ${length} ${width} 0.0
  endloop
endfacet
facet normal 0.0 -1.0 0.0
  outer loop
    vertex 0.0 0.0 0.0
    vertex ${length} 0.0 0.0
    vertex ${length} 0.0 ${height}
  endloop
endfacet
facet normal 0.0 -1.0 0.0
  outer loop
    vertex 0.0 0.0 0.0
    vertex ${length} 0.0 ${height}
    vertex 0.0 0.0 ${height}
  endloop
endfacet
facet normal 1.0 0.0 0.0
  outer loop
    vertex ${length} 0.0 0.0
    vertex ${length} ${width} 0.0
    vertex ${length} ${width} ${height}
  endloop
endfacet
facet normal 1.0 0.0 0.0
  outer loop
    vertex ${length} 0.0 0.0
    vertex ${length} ${width} ${height}
    vertex ${length} 0.0 ${height}
  endloop
endfacet
facet normal 0.0 1.0 0.0
  outer loop
    vertex ${length} ${width} 0.0
    vertex 0.0 ${width} 0.0
    vertex 0.0 ${width} ${height}
  endloop
endfacet
facet normal 0.0 1.0 0.0
  outer loop
    vertex ${length} ${width} 0.0
    vertex 0.0 ${width} ${height}
    vertex ${length} ${width} ${height}
  endloop
endfacet
facet normal -1.0 0.0 0.0
  outer loop
    vertex 0.0 ${width} 0.0
    vertex 0.0 0.0 0.0
    vertex 0.0 0.0 ${height}
  endloop
endfacet
facet normal -1.0 0.0 0.0
  outer loop
    vertex 0.0 ${width} 0.0
    vertex 0.0 0.0 ${height}
    vertex 0.0 ${width} ${height}
  endloop
endfacet
endsolid CAD_AI_Object`;

    return stlContent;
  };

  const downloadSTL = async () => {
    setIsDownloading(true);
    
    try {
      // Generate STL content
      const stlContent = generateSTL();
      
      // Create blob and download
      const blob = new Blob([stlContent], { type: 'application/sla' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `cad-ai-object-${Date.now()}.stl`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "STL Downloaded",
        description: "Your 3D model has been downloaded successfully!",
      });
      
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate STL file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-72 bg-adam-darker border-l border-white/10 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 12h8M12 8v8"></path>
          </svg>
          <span className="text-sm font-medium text-white">Parameters</span>
        </div>
        <button className="text-white/70 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
            <path d="M15 3v18M3 15h18M3 9h18M9 3v18"></path>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Slider label="Length" value={parameters.length} max={150} onChange={(v) => updateParameter('length', v)} />
        <Slider label="Width" value={parameters.width} max={50} onChange={(v) => updateParameter('width', v)} />
        <Slider label="Height" value={parameters.height} max={50} onChange={(v) => updateParameter('height', v)} />
        <Slider label="Hole Diameter" value={parameters.holeDiameter} max={20} onChange={(v) => updateParameter('holeDiameter', v)} />
        <Slider label="Hole Spacing" value={parameters.holeSpacing} max={30} onChange={(v) => updateParameter('holeSpacing', v)} />
        <Slider label="Fillet Radius" value={parameters.filletRadius} max={10} onChange={(v) => updateParameter('filletRadius', v)} />
      </div>

      <div className="mt-6">
        <div className="mb-4 rounded-lg overflow-hidden">
          <div className="relative w-full h-24 bg-gradient-to-b from-white to-transparent">
            <div 
              className="absolute right-2 top-2 w-6 h-6 rounded-full border-2 border-white"
              style={{ background: '#FF007C' }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex-1 h-10 rounded-lg overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500 relative">
              <div className="absolute right-0 top-0 w-4 h-4 rounded-full border-2 border-white transform translate-x-1/2 translate-y-1/2"></div>
            </div>
          </div>
        </div>
        <button 
          onClick={downloadSTL}
          disabled={isDownloading}
          className="w-full mt-4 py-2 bg-adam-pink/80 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-adam-pink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download STL</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ParametersPanel;
