import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class BubbleChart extends Component {
    constructor(props) {
        super(props);
        this.svgRef = React.createRef();
        this.renderChart = this.renderChart.bind(this);
        this.renderBubbles = this.renderBubbles.bind(this);
        this.renderLegend = this.renderLegend.bind(this);
        this.numBubbles = 0;
    }

    componentDidMount() {
        this.renderChart();
    }

    componentDidUpdate() {
        const { width, height } = this.props;
        if (width !== 0 && height !== 0) {
            this.renderChart();
        }
    }
    render() {
        // Destructure props
        const { data } = this.props;
        this.numBubbles = data ? data.length : 0;
        // Calculate chart dimensions
        const containerWidth = window.innerWidth * 0.9; // Adjust as needed
        const containerHeight = window.innerHeight * 0.9; // Adjust as needed
        const chartWidth = containerWidth * 1.5; // Increase width by a factor of 1.5
        const chartHeight = containerHeight * 1.5; // Increase height by a factor of 1.5

        // Return JSX
        return (
            <div style={{ width: '100%', height: '100%' }}>
                {/* Use chartWidth and chartHeight */}
                <svg ref={this.svgRef} width={chartWidth} height={chartHeight} />
            </div>
        );
    }


    renderChart() {
        const { overflow, graph, data, width, legendPercentage, showLegend } = this.props;
        const someFactor = 5.5; // Adjust as needed
        const minimumSize = 30; // Adjust as needed
        const maxBubbleSize = 220; // Define the maximum size for the bubbles
        const numBubbles = this.numBubbles;
        const svg = this.svgRef.current;
        svg.innerHTML = '';
        if (!overflow) {
            svg.style.overflow = "hidden";
        } else {
            svg.style.overflow = "visible";
        }
        const bubblesWidth = showLegend ? width * (1 - (legendPercentage / 100)) : width;
        const color = d3.scaleOrdinal(d3.schemeCategory10)
        const pack = d3.pack()
            .size([bubblesWidth * graph.zoom, bubblesWidth * graph.zoom])
            .padding(-2.5)
            .radius(function (d) {
                // Adjust the minimum and maximum size of the bubbles here
                return Math.max(Math.min(d.value * someFactor, maxBubbleSize), minimumSize);
            });

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
        if (numBubbles === 1) {
            this.renderSoloBubbles(svg, bubblesWidth, nodes, color);
        } else {
            this.renderBubbles(svg, bubblesWidth, nodes, color);
        }
        // Calculate the maximum radius of the bubbles
        const maxRadius = d3.max(nodes, d => d.r);

        // Calculate the required width and height to accommodate the bubbles
        const requiredWidth = bubblesWidth * graph.zoom + maxRadius * 2;
        const requiredHeight = bubblesWidth * graph.zoom + maxRadius * 2;

        // Update the width and height of the SVG element
        svg.setAttribute('width', requiredWidth);
        svg.setAttribute('height', requiredHeight);

        // Update the transform of the bubble chart group
        d3.select(svg).select(".bubble-chart")
            .attr("transform", `translate(${maxRadius},${maxRadius})`);
    }
    renderSoloBubbles(svg, width, nodes, color) {
        const { graph, bubbleClickFun, valueFont, labelFont } = this.props;
        const bubbleChart = d3.select(svg).append("g")
            .attr("class", "bubble-chart")
            .attr("transform", function (d) {
                const translateY = width * graph.offsetY - 100;
                return "translate(" + (width * graph.offsetX) + "," + translateY + ")";
            });
        const node = bubbleChart.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .on("click", function (d) {
                bubbleClickFun(d.label);
            });
        node.append("circle")
            .attr("id", function (d) { return d.id; })
            .attr("r", function (d) { return d.r - (d.r * .04); })
            .style("fill", function (d) { return d.data.color ? d.data.color : color(nodes.indexOf(d)); })
            .style("z-index", 1)
            .on('mouseover', function (d) { d3.select(this).attr("r", d.r * 1.04); })
            .on('mouseout', function (d) {
                const r = d.r - (d.r * 0.04);
                d3.select(this).attr("r", r);
            });
        node.append("clipPath")
            .attr("id", function (d) { return "clip-" + d.id; })
            .append("use")
            .attr("xlink:href", function (d) { return "#" + d.id; });
        node.append("text")
            .attr("class", "value-text")
            .style("font-size", `24px`)
            .attr("clip-path", function (d) { return "url(#clip-" + d.id + ")"; })
            .style("font-weight", (d) => { return valueFont.weight ? valueFont.weight : 600; })
            .style("font-family", valueFont.family)
            .style("fill", () => { return valueFont.color ? valueFont.color : '#000'; })
            .style("stroke", () => { return valueFont.lineColor ? valueFont.lineColor : '#000'; })
            .style("stroke-width", () => { return valueFont.lineWeight ? valueFont.lineWeight : 0; });
        node.append("text")
            .attr("class", "label-text")
            .style("font-size", `30x`)
            .attr("clip-path", function (d) { return "url(#clip-" + d.id + ")"; })
            .style("font-weight", (d) => { return labelFont.weight ? labelFont.weight : 600; })
            .style("font-family", labelFont.family)
            .style("fill", () => { return labelFont.color ? labelFont.color : '#000'; })
            .style("stroke", () => { return labelFont.lineColor ? labelFont.lineColor : '#000'; })
            .style("stroke-width", () => { return labelFont.lineWeight ? labelFont.lineWeight : 0; })
            .text(function (d) { return d.label; });
        d3.selectAll(".label-text").attr("x", function (d) {
            const self = d3.select(this);
            const width = self.node().getBBox().width;
            return -(width / 2);
        })
            .style("opacity", function (d) {
                const self = d3.select(this);
                const width = self.node().getBBox().width;
                d.hideLabel = width * 1.05 > (d.r * 2);
                return d.hideLabel ? 0 : 1;
            })
            .attr("y", function (d) { return labelFont.size / 2 });
        d3.selectAll(".value-text").attr("x", function (d) {
            const self = d3.select(this);
            const width = self.node().getBBox().width;
            return -(width / 2);
        })
            .attr("y", function (d) {
                if (d.hideLabel) {
                    return valueFont.size / 3;
                } else {
                    return -valueFont.size * 0.5;
                }
            });
        node.append("title")
            .text(function (d) { return d.label; });
    }


    renderBubbles(svg, width, nodes, color) {
        const { graph, bubbleClickFun, valueFont, labelFont } = this.props;
        const bubbleChart = d3.select(svg).append("g")
            .attr("class", "bubble-chart")
            .attr("transform", function (d) {
                const translateY = width * graph.offsetY;
                return "translate(" + (width * graph.offsetX) + "," + translateY + ")";
            });


        const node = bubbleChart.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .on("click", function (d) {
                bubbleClickFun(d.label);
            });
        node.append("circle")
            .attr("id", function (d) { return d.id; })
            .attr("r", function (d) { return d.r - (d.r * .04); })
            .style("fill", function (d) { return d.data.color ? d.data.color : color(nodes.indexOf(d)); })
            .style("z-index", 1)
            .on('mouseover', function (d) { d3.select(this).attr("r", d.r * 1.04); })
            .on('mouseout', function (d) {
                const r = d.r - (d.r * 0.04);
                d3.select(this).attr("r", r);
            });
        node.append("clipPath")
            .attr("id", function (d) { return "clip-" + d.id; })
            .append("use")
            .attr("xlink:href", function (d) { return "#" + d.id; });
        node.append("text")
            .attr("class", "value-text")
            .style("font-size", `${valueFont.size}px`)
            .attr("clip-path", function (d) { return "url(#clip-" + d.id + ")"; })
            .style("font-weight", (d) => { return valueFont.weight ? valueFont.weight : 600; })
            .style("font-family", valueFont.family)
            .style("fill", () => { return valueFont.color ? valueFont.color : '#000'; })
            .style("stroke", () => { return valueFont.lineColor ? valueFont.lineColor : '#000'; })
            .style("stroke-width", () => { return valueFont.lineWeight ? valueFont.lineWeight : 0; })
            .text(function (d) { return d.value + "%"; });
        node.append("text")
            .attr("class", "label-text")
            .style("font-size", `${labelFont.size}px`)
            .attr("clip-path", function (d) { return "url(#clip-" + d.id + ")"; })
            .style("font-weight", (d) => { return labelFont.weight ? labelFont.weight : 600; })
            .style("font-family", labelFont.family)
            .style("fill", () => { return labelFont.color ? labelFont.color : '#000'; })
            .style("stroke", () => { return labelFont.lineColor ? labelFont.lineColor : '#000'; })
            .style("stroke-width", () => { return labelFont.lineWeight ? labelFont.lineWeight : 0; })
            .text(function (d) { return d.label; });
        d3.selectAll(".label-text").attr("x", function (d) {
            const self = d3.select(this);
            const width = self.node().getBBox().width;
            return -(width / 2);
        })
            .style("opacity", function (d) {
                const self = d3.select(this);
                const width = self.node().getBBox().width;
                d.hideLabel = width * 1.05 > (d.r * 2);
                return d.hideLabel ? 0 : 1;
            })
            .attr("y", function (d) { return labelFont.size / 2 });
        d3.selectAll(".value-text").attr("x", function (d) {
            const self = d3.select(this);
            const width = self.node().getBBox().width;
            return -(width / 2);
        })
            .attr("y", function (d) {
                if (d.hideLabel) {
                    return valueFont.size / 3;
                } else {
                    return -valueFont.size * 0.5;
                }
            });
        node.append("title")
            .text(function (d) { return d.label; });
    }

    renderLegend(svg, width, height, offset, nodes, color) {
        const { legendClickFun, legendFont, minLegendSize } = this.props;
        const bubble = d3.select('.bubble-chart');
        const bubbleHeight = bubble.node().getBBox().height;
        const legend = d3.select(svg).append("g")
            .attr("transform", function () {
                return `translate(${offset},${(bubbleHeight) * 0.05})`;
            })
            .attr("class", "legend");
        let textOffset = 0;
        const texts = legend.selectAll(".legend-text")
            .data(nodes)
            .enter()
            .append("g")
            .attr("transform", (d, i) => {
                const offset = textOffset;
                textOffset += legendFont.size + 10;
                return `translate(0,${offset})`;
            })
            .on('mouseover', function (d) {
                d3.select('#' + d.id).attr("r", d.r * 1.04);
            })
            .on('mouseout', function (d) {
                const r = d.r - (d.r * 0.04);
                d3.select('#' + d.id).attr("r", r);
            })
            .on("click", function (d) {
                legendClickFun(d.label);
            });
        texts.append("rect")
            .attr("width", 30)
            .attr("height", legendFont.size)
            .attr("x", 0)
            .attr("y", -legendFont.size)
            .style("fill", "transparent");
        texts.append("rect")
            .attr("width", legendFont.size)
            .attr("height", legendFont.size)
            .attr("x", 0)
            .attr("y", -legendFont.size)
            .style("fill", function (d) { return d.data.color ? d.data.color : color(nodes.indexOf(d)); });
        texts.append("text")
            .style("font-size", `${legendFont.size}px`)
            .style("font-weight", (d) => { return legendFont.weight ? legendFont.weight : 600; })
            .style("font-family", legendFont.family)
            .style("fill", () => { return legendFont.color ? legendFont.color : '#000'; })
            .style("stroke", () => { return legendFont.lineColor ? legendFont.lineColor : '#000'; })
            .style("stroke-width", () => { return legendFont.lineWeight ? legendFont.lineWeight : 0; })
            .attr("x", (d) => { return legendFont.size + 10 })
            .attr("y", 0)
            .text((d) => { return d.label });

        // Ensure minimum legend size
        texts.attr("transform", function (d, i) {
            const box = this.getBBox();
            if (box.width < minLegendSize) {
                const scale = minLegendSize / box.width;
                d3.select(this).select("text").attr("transform", `scale(${scale})`);
            }
            const yOffset = 20; // Adjust the offset value as needed
            return `translate(0,${i * (legendFont.size + 10) + yOffset})`;
        });

    }
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
        lineColor: PropTypes.string,
        lineWeight: PropTypes.number,
    }),
    valueFont: PropTypes.shape({
        family: PropTypes.string,
        size: PropTypes.number,
        color: PropTypes.string,
        weight: PropTypes.string,
        lineColor: PropTypes.string,
        lineWeight: PropTypes.number,
    }),
    labelFont: PropTypes.shape({
        family: PropTypes.string,
        size: PropTypes.number,
        color: PropTypes.string,
        weight: PropTypes.string,
        lineColor: PropTypes.string,
        lineWeight: PropTypes.number,
    }),
    bubbleClickFun: PropTypes.func,
    legendClickFun: PropTypes.func,
    data: PropTypes.arrayOf(PropTypes.object),
    minLegendSize: PropTypes.number, // Add this line
};


BubbleChart.defaultProps = {
    overflow: false,
    graph: {
        zoom: .7,
        offsetX: -0.1,
        offsetY: -2,
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
        lineColor: '',
        lineWeight: 0,
    },
    valueFont: {
        family: 'Arial',
        size: 16,
        color: '#fff',
        weight: 'bold',
        lineColor: '',
        lineWeight: 0,
    },
    labelFont: {
        family: 'Arial',
        size: 11,
        color: '#fff',
        weight: 'normal',
        lineColor: '',
        lineWeight: 0,
    },
    bubbleClickFun: (label) => {
        console.log(`Bubble ${label} is clicked ...`)
    },
    legendClickFun: (label) => {
        console.log(`Legend ${label} is clicked ...`)
    },
    data: [],
};

export default BubbleChart;