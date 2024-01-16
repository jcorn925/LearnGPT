import { useState, useEffect } from 'react';
import { tree } from 'd3-hierarchy';
import { zoom, zoomIdentity } from 'd3-zoom';
import { select } from 'd3-selection';

const useRandomCameraView = (treeData, dimensions, svgRef) => {
  const [cameraView, setCameraView] = useState(zoomIdentity);

  useEffect(() => {
    if (treeData && dimensions && svgRef.current) {
      const svg = select(svgRef.current);
      const treeLayout = tree().size([dimensions.width, dimensions.height]);
      const root = treeLayout(treeData);

      const randomX = Math.floor(Math.random() * dimensions.width);
      const randomY = Math.floor(Math.random() * dimensions.height);

      const zoomTransform = zoomIdentity.translate(randomX, randomY);
      svg.call(zoom().transform, zoomTransform);
      setCameraView(zoomTransform);
    }
  }, [treeData, dimensions, svgRef]);

  return cameraView;
};

export default useRandomCameraView;