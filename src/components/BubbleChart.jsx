import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BubbleChart = ({ data, width = 800, height = 600 }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || !svgRef.current) return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll("*").remove();

        // Create SVG container
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .style("display", "block")
            .style("margin", "auto");

        // Improved force simulation with better parameters
        const simulation = d3.forceSimulation(data)
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("charge", d3.forceManyBody().strength(d => -Math.pow(d.radius, 1.5))) // More natural repulsion
            .force("collide", d3.forceCollide().radius(d => d.radius + 4).strength(0.65)) // Softer collisions
            .force("x", d3.forceX(width / 2).strength(0.03)) // Gentler x-axis force
            .force("y", d3.forceY(height / 2).strength(0.03)) // Gentler y-axis force
            .velocityDecay(0.4); // Add some inertia

        // Create groups for each bubble
        const bubbles = svg.selectAll("g")
            .data(data)
            .join("g")
            .attr("class", "bubble-group")
            .style("cursor", "pointer");

        // Add circles with improved styling
        bubbles.append("circle")
            .attr("r", d => d.radius)
            .style("fill", d => d.color)
            .style("fill-opacity", 0.8)
            .style("stroke", d => d3.color(d.color).darker(0.5))
            .style("stroke-width", 2)
            .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))");

        // Add text with better readability
        bubbles.append("text")
            .text(d => d.name)
            .attr("text-anchor", "middle")
            .attr("dy", "0.3em")
            .attr("class", "bubble-text")
            .style("font-size", d => `${Math.min(d.radius / 3, 14)}px`)
            .style("filter", "drop-shadow(0 1px 2px rgba(0,0,0,0.5))");

        // Create tooltip with improved styling
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "bubble-tooltip")
            .style("opacity", 0);

        // Handle interactions
        bubbles.on("mouseover", function(event, d) {
            // Smoothly scale up
            d3.select(this)
                .transition()
                .duration(400)
                .ease(d3.easeCubicOut)
                .attr("transform", `translate(${d.x},${d.y}) scale(1.1)`);
            
            // Show tooltip
            tooltip.transition()
                .duration(300)
                .style("opacity", 1);
            
            tooltip.html(`
                <strong>${d.name}</strong><br/>
                ${d.category}<br/>
                Level: ${d.level}%
            `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function(event, d) {
            // Smoothly scale down
            d3.select(this)
                .transition()
                .duration(400)
                .ease(d3.easeCubicOut)
                .attr("transform", `translate(${d.x},${d.y}) scale(1)`);
            
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        })
        .on("click", (event, d) => {
            if (d.onClick) d.onClick(d.name);
        });

        // Smooth position updates
        let tickCount = 0;
        simulation.on("tick", () => {
            // Only update every other tick for smoother animation
            tickCount++;
            if (tickCount % 2 === 0) {
                bubbles
                    .transition()
                    .duration(150) // Longer duration for smoother movement
                    .ease(d3.easeLinear) // Linear easing for constant speed
                    .attr("transform", d => {
                        // Constrain positions to keep bubbles in bounds
                        d.x = Math.max(d.radius, Math.min(width - d.radius, d.x));
                        d.y = Math.max(d.radius, Math.min(height - d.radius, d.y));
                        return `translate(${d.x},${d.y})`;
                    });
            }
        });

        // Cleanup
        return () => {
            simulation.stop();
            tooltip.remove();
        };
    }, [data, width, height]);

    return <svg ref={svgRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
};

export default BubbleChart;