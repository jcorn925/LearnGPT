import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { hierarchy, tree } from 'd3';
import './MiniMap.scss';

// Include the d3.demo.canvas and d3.demo.minimap functions here
// ...



const MiniMap = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const root = hierarchy(data);
    const miniMapTreeLayout = tree().size([100, 100]); // Change size as needed

    miniMapTreeLayout(root);

    // Clear the SVG
    svg.selectAll('*').remove();

    // Add the links (lines)
    svg.selectAll('line')
      .data(root.links())
      .enter()
      .append('line')
      .attr('x1', d => d.source.y)
      .attr('y1', d => d.source.x)
      .attr('x2', d => d.target.y)
      .attr('y2', d => d.target.x)
      .style('stroke', 'lightgray');

    // Add the nodes (circles)
    svg.selectAll('circle')
      .data(root.descendants())
      .enter()
      .append('circle')
      .attr('cx', d => d.y)
      .attr('cy', d => d.x)
      .attr('r', 2) // Change node size as needed
      .style('fill', 'black');
  }, [data]);

  return <svg ref={svgRef} style={{ width: '100px', height: '100px' }} />; // Set dimensions as needed
};

export default MiniMap;


