import { useState, useCallback } from 'react';

export interface ModelParameters {
  length: number;
  width: number;
  height: number;
  holeDiameter: number;
  holeSpacing: number;
  filletRadius: number;
}

export const useModelParameters = () => {
  const [parameters, setParameters] = useState<ModelParameters>({
    length: 100,
    width: 20,
    height: 20,
    holeDiameter: 8,
    holeSpacing: 15,
    filletRadius: 2
  });

  const updateParameter = useCallback((key: keyof ModelParameters, value: number) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetParameters = useCallback(() => {
    setParameters({
      length: 100,
      width: 20,
      height: 20,
      holeDiameter: 8,
      holeSpacing: 15,
      filletRadius: 2
    });
  }, []);

  return {
    parameters,
    updateParameter,
    resetParameters
  };
};