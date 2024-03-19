import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

function BubbleChart(props) {
  const svgRef = useRef(null);

  const customColorScheme = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
  ];

  useEffect(() => {
    renderChart();
  }, [props]);

  const renderChart = () => {
    const { overflow, graph, data, height, width, padding, showLegend, legendPercentage } = props;
    const svg = d3.select(svgRef.current);

    svg.html('');

    if (!overflow) {
      svg.style('overflow', 'hidden');
    } else {
      svg.style('overflow', 'visible');
    }

    const bubblesWidth = showLegend ? width * (1 - (legendPercentage / 100)) : width;
    const legendWidth = width - bubblesWidth;
    const color = d3.scaleOrdinal(d3.range(customColorScheme));

    const pack = d3.pack()
      .size([bubblesWidth * graph.zoom, bubblesWidth * graph.zoom])
      .padding(padding);

    const root = d3.hierarchy({ children: data })
      .sum(function (d) { return d.value; })
      .sort(function (a, b) { return b.value - a.value; })
      .each((d) => {
        if (d.data.label) {
          d.label = d.data.label;
          d.id = d.data.label.toLowerCase().replace(/ |\//g, "-");
        }
      });

    const nodes = pack(root).leaves();

    renderBubbles(svg, bubblesWidth, nodes, color);

    if (showLegend) {
      renderLegend(svg, legendWidth, height, bubblesWidth, nodes, color);
    }
  }

  const renderBubbles = (svg, width, nodes, color) => {
    // const { graph } = props; // bubbleClickFun,valueFont, labelFont 

    // const bubbleChart = svg.append("g")
    //   .attr("class", "bubble-chart")
    //   .attr("transform", function (d) { return "translate(" + (width * graph.offsetX) + "," + (width * graph.offsetY) + ")"; });

    // const node = bubbleChart.selectAll(".node")
    //   .data(nodes)
    //   .enter().append("g")
    //   .attr("class", "node")
    //   .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
    //   .on("click", function (d) {
    //     bubbleClickFun(d.label);
    //   });

    // Rest of the function...
  }

  const renderLegend = (svg, width, height, offset, nodes, color) => {
    // const { legendClickFun, legendFont } = props;
    // const bubble = d3.select('.bubble-chart');
    // const bubbleHeight = bubble.node().getBBox().height;

    // Rest of the function...
  }

  return (
    <svg ref={svgRef} width={props.width} height={props.height} />
  );
}

BubbleChart.propTypes = {
  overflow: PropTypes.bool,
  graph: PropTypes.shape({
    zoom: PropTypes.number,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
  }),
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  showLegend: PropTypes.bool,
  legendPercentage: PropTypes.number,
  legendFont: PropTypes.shape({
    family: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    weight: PropTypes.string,
  }),
  valueFont: PropTypes.shape({
    family: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    weight: PropTypes.string,
  }),
  labelFont: PropTypes.shape({
    family: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    weight: PropTypes.string,
  }),
  data: PropTypes.array.isRequired,
  bubbleClickFun: PropTypes.func,
  legendClickFun: PropTypes.func,
}

BubbleChart.defaultProps = {
  overflow: false,
  graph: {
    zoom: .5,
    offsetX: 0.1,
    offsetY: 0.1,
  },
  width: 700,
  height: 450,
  padding: 0,
  showLegend: true,
  legendPercentage: 20,
  legendFont: {
    family: 'Arial',
    size: 12,
    color: '#000',
    weight: 'bold',
  },
  valueFont: {
    family: 'Arial',
    size: 16,
    color: '#fff',
    weight: 'bold',
  },
  labelFont: {
    family: 'Arial',
    size: 11,
    color: '#fff',
    weight: 'normal',
  },
  bubbleClickFun: (label) => { console.log(`Bubble ${label} is clicked ...`) },
  legendClickFun: (label) => { console.log(`Legend ${label} is clicked ...`) }
}

export default BubbleChart;
