import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { WebAttackDataWithCluster } from "../../lib/types";

interface ClusterVisualizationProps {
  data: WebAttackDataWithCluster[];
  silhouetteScore?: number;
}

const ClusterVisualization: React.FC<ClusterVisualizationProps> = ({
  data,
  silhouetteScore,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 900;
  const height = 600;
  const margin = { top: 50, right: 180, bottom: 80, left: 80 };

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Normalization function
    const normalize = (value: number, min: number, max: number): number => {
      return (value - min) / (max - min);
    };

    // Get max values safely
    const maxResponseTime = d3.max(data, (d) => d.response_time) || 1;
    const maxRequestSize = d3.max(data, (d) => d.request_size) || 1;

    // Feature accessors with normalization
    const xAccessor = (d: WebAttackDataWithCluster): number =>
      normalize(d.response_time, 0, maxResponseTime);
    const yAccessor = (d: WebAttackDataWithCluster): number =>
      normalize(d.request_size, 0, maxRequestSize);

    // Scales
    const xScale = d3.scaleLinear().domain([0, 1.1]).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([0, 1.1]).range([innerHeight, 0]);

    // Color scale
    const clusters = [...new Set(data.map((d) => d.cluster))].sort(
      (a, b) => a - b
    );
    const colorScale = d3
      .scaleOrdinal<string, string>()
      .domain(clusters.map((c) => c.toString()))
      .range([
        "#2d3748",
        "#00f0ff",
        "#ff2d75",
        "#7bff00",
        "#ffcc00",
        "#8a2be2",
        "#00ffcc",
        "#ff7b00",
        "#ff00aa",
        "#00ff7b",
        "#8b00ff",
      ]);

    // Main visualization group
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(-innerHeight)
          .tickFormat(() => "")
      )
      .selectAll("line")
      .attr("stroke", "#2d3748")
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "2,2");

    g.append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
      )
      .selectAll("line")
      .attr("stroke", "#2d3748")
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "2,2");

    // Axes
    const xAxis = g
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickFormat((d) => `${(Number(d) * 100).toFixed(0)}%`)
      );

    xAxis.selectAll("path").attr("stroke", "#4a5568");
    xAxis.selectAll("line").attr("stroke", "#4a5568");
    xAxis
      .selectAll("text")
      .attr("fill", "#a0aec0")
      .attr("font-family", "'Courier New', monospace")
      .attr("font-size", "11px");

    xAxis
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", 40)
      .attr("fill", "#00f0ff")
      .attr("font-family", "'Courier New', monospace")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text("NORMALIZED_RESPONSE_TIME");

    const yAxis = g
      .append("g")
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat((d) => `${(Number(d) * 100).toFixed(0)}%`)
      );
    yAxis.selectAll("path").attr("stroke", "#4a5568");
    yAxis.selectAll("line").attr("stroke", "#4a5568");
    yAxis
      .selectAll("text")
      .attr("fill", "#a0aec0")
      .attr("font-family", "'Courier New', monospace")
      .attr("font-size", "11px");

    yAxis
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -innerHeight / 2)
      .attr("fill", "#00f0ff")
      .attr("font-family", "'Courier New', monospace")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text("NORMALIZED_REQUEST_SIZE");

    // Cluster hulls
    clusters.forEach((cluster) => {
      if (cluster === -1) return;

      const clusterData = data.filter((d) => d.cluster === cluster);
      if (clusterData.length < 3) return;

      const points = clusterData.map(
        (d) =>
          [xScale(xAccessor(d)) || 0, yScale(yAccessor(d)) || 0] as [
            number,
            number
          ]
      );

      const hull = d3.polygonHull(points);
      if (hull) {
        g.append("path")
          .attr("d", `M${hull.join("L")}Z`)
          .attr("fill", colorScale(cluster.toString()))
          .attr("fill-opacity", 0.1)
          .attr("stroke", colorScale(cluster.toString()))
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "3,2");
      }
    });

    // Data points only (no centroids)
    g.selectAll<SVGCircleElement, WebAttackDataWithCluster>("circle.data")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(xAccessor(d)) || 0)
      .attr("cy", (d) => yScale(yAccessor(d)) || 0)
      .attr("r", (d) => (d.cluster === -1 ? 4 : 6))
      .attr("fill", (d) => colorScale(d.cluster.toString()))
      .attr("opacity", (d) => (d.cluster === -1 ? 0.6 : 0.9))
      .attr("stroke", (d) => (d.cluster === -1 ? "#4a5568" : "#ffffff"))
      .attr("stroke-width", (d) => (d.cluster === -1 ? 1 : 2))
      .attr("class", "data-point")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 8).attr("stroke-width", 3);
      })
      .on("mouseout", function (event, d: WebAttackDataWithCluster) {
        d3.select(this)
          .attr("r", d.cluster === -1 ? 4 : 6)
          .attr("stroke-width", d.cluster === -1 ? 1 : 2);
      });

    // Legend
    const legend = svg
      .append("g")
      .attr(
        "transform",
        `translate(${width - margin.right + 20},${margin.top})`
      );

    legend
      .append("rect")
      .attr("width", 150)
      .attr("height", clusters.length * 25 + 30)
      .attr("fill", "rgba(26, 32, 44, 0.7)")
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("stroke", "#00f0ff")
      .attr("stroke-width", 0.5);

    legend
      .append("text")
      .attr("x", 10)
      .attr("y", 20)
      .text("THREAT_CLUSTERS")
      .attr("fill", "#00f0ff")
      .attr("font-family", "'Courier New', monospace")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");

    if (silhouetteScore !== undefined) {
      legend
        .append("text")
        .attr("x", 10)
        .attr("y", clusters.length * 25 + 50)
        .text(`SILHOUETTE: ${silhouetteScore.toFixed(3)}`)
        .attr("fill", "#7bff00")
        .attr("font-family", "'Courier New', monospace")
        .attr("font-size", "11px");
    }

    clusters.forEach((cluster, i) => {
      const clusterSize = data.filter((d) => d.cluster === cluster).length;
      const legendItem = legend
        .append("g")
        .attr("transform", `translate(10,${i * 25 + 35})`);

      legendItem
        .append("circle")
        .attr("r", 6)
        .attr("fill", colorScale(cluster.toString()))
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 1);

      legendItem
        .append("text")
        .attr("x", 15)
        .attr("y", 5)
        .text(`CLUSTER_${cluster} (${clusterSize})`)
        .attr("fill", cluster === -1 ? "#a0aec0" : "#e2e8f0")
        .attr("font-family", "'Courier New', monospace")
        .attr("font-size", "11px");
    });

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr(
        "class",
        "absolute p-2 bg-gray-800 border border-cyan-400 rounded shadow-lg text-white text-sm invisible z-50 max-w-xs"
      );

    return () => {
      tooltip.remove();
    };
  }, [data, silhouetteScore, margin]);

  return (
    <div className="bg-gray-900/50 border border-cyan-400/20 rounded-lg p-4 backdrop-blur-sm shadow-lg shadow-cyan-500/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-lg text-cyan-400 flex items-center">
          <span className="mr-2">$</span> THREAT_CLUSTER_ANALYSIS
        </h3>
        {silhouetteScore !== undefined && (
          <div className="font-mono text-xs bg-gray-800/50 px-3 py-1 rounded-full border border-cyan-400/20 text-cyan-400">
            SILHOUETTE: {silhouetteScore.toFixed(3)}
          </div>
        )}
      </div>
      <div className="relative">
        <svg ref={svgRef} width={width} height={height} className="mx-auto" />
      </div>
      <div className="mt-2 text-xs text-gray-400 font-mono text-center">
        // CLUSTER_VISUALIZATION: NORMALIZED_FEATURE_SPACE //
      </div>
    </div>
  );
};

export default ClusterVisualization;
