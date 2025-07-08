"use client";
import React, { useState, useEffect } from "react";
import { performKMeans } from "../../lib/clustering";
import { WebAttackData } from "../../lib/types";
import ClusterTable from "./ClusterTable";
import CentroidTable from "./CentroidTable";
import ClusterStats from "./ClusterStats";
import ClusterVisualization from "./ClusterVisualization";
import PerformanceMetrics from "./PerformanceMetrics";

interface ClusterModelProps {
  data: WebAttackData[];
}

const ClusterModel: React.FC<ClusterModelProps> = ({ data }) => {
  const [k, setK] = useState<number>(3);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clusterResult, setClusterResult] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<string>("visualization");

  const handleCluster = () => {
    if (data.length === 0) return;

    setIsLoading(true);
    setTimeout(() => {
      try {
        const result = performKMeans(data, k);
        setClusterResult(result);
      } catch (error) {
        console.error("Clustering protocol violation:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  useEffect(() => {
    if (data.length > 0) {
      handleCluster();
    }
  }, [data, k]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-900/50 rounded-lg border border-cyan-400/20">
        <div className="text-center">
          <div className="animate-pulse flex space-x-2 justify-center mb-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-cyan-400 rounded-full"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <p className="font-mono text-sm text-cyan-400">
            ANALYZING_THREAT_PATTERNS...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cluster Configuration Panel */}
      <div className="bg-gray-800/50 border border-cyan-400/20 rounded-lg p-4 backdrop-blur-sm">
        <h2 className="font-mono text-lg text-cyan-400 mb-4 flex items-center">
          <span className="mr-2">$</span> THREAT_CLUSTER_CONFIG
        </h2>
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-1">
            <label
              htmlFor="k-value"
              className="block font-mono text-sm text-gray-300 mb-2"
            >
              CLUSTER_QUANTITY [K]
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                id="k-value"
                min="2"
                max="10"
                value={k}
                onChange={(e) => setK(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="font-mono text-cyan-400 w-8 text-center">
                {k}
              </span>
            </div>
          </div>
          <button
            onClick={handleCluster}
            className="font-mono text-sm border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] px-4 py-2 rounded-md transition-all duration-200 flex items-center justify-center"
          >
            <span className="mr-2">⟳</span> EXECUTE_CLUSTERING
          </button>
        </div>
      </div>

      {clusterResult && (
        <>
          {/* Results Container */}
          <div className="bg-gray-800/50 border border-cyan-400/20 rounded-lg overflow-hidden backdrop-blur-sm">
            {/* Cyber Security Tabs */}
            <div className="border-b border-cyan-400/20">
              <nav className="flex overflow-x-auto">
                {[
                  { id: "visualization", label: "THREAT_VISUALIZATION" },
                  { id: "clusters", label: "CLUSTER_ANALYSIS" },
                  { id: "centroids", label: "CENTROID_DATA" },
                  { id: "stats", label: "STATISTICS" },
                  { id: "performance", label: "PERF_METRICS" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`font-mono text-xs px-4 py-3 border-b-2 whitespace-nowrap ${
                      selectedTab === tab.id
                        ? "border-cyan-400 text-cyan-400"
                        : "border-transparent text-gray-400 hover:text-cyan-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {selectedTab === "visualization" && (
                <ClusterVisualization data={clusterResult.clusteredData} />
              )}
              {selectedTab === "clusters" && (
                <ClusterTable data={clusterResult.clusteredData} />
              )}
              {selectedTab === "centroids" && (
                <CentroidTable centroids={clusterResult.centroids} />
              )}
              {selectedTab === "stats" && (
                <ClusterStats data={clusterResult.clusteredData} />
              )}
              {selectedTab === "performance" && (
                <PerformanceMetrics
                  silhouetteScore={clusterResult.silhouetteScore}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClusterModel;
