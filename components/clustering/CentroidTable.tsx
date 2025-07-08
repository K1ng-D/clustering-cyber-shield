import React from "react";
import { Centroid } from "../../lib/types";

interface CentroidTableProps {
  centroids: Centroid[];
}

const CentroidTable: React.FC<CentroidTableProps> = ({ centroids }) => {
  if (!centroids || centroids.length === 0) return null;

  // Cyber security color scheme for clusters
  const clusterColors = [
    "border-cyan-400 text-cyan-400", // Cluster 0
    "border-purple-400 text-purple-400", // Cluster 1
    "border-red-400 text-red-400", // Cluster 2
    "border-green-400 text-green-400", // Cluster 3
    "border-yellow-400 text-yellow-400", // Cluster 4
    "border-pink-400 text-pink-400", // Cluster 5
  ];

  return (
    <div className="border border-cyan-400/20 rounded-lg overflow-hidden shadow-lg shadow-cyan-500/10">
      <div className="relative overflow-x-auto">
        <table className="w-full font-mono text-xs">
          <thead className="bg-gray-800/80 text-cyan-400">
            <tr>
              <th className="px-4 py-3 text-left uppercase tracking-wider border-b border-cyan-400/20">
                THREAT_EPICENTER
              </th>
              {centroids[0].features.map((feature, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-left uppercase tracking-wider border-b border-cyan-400/20"
                >
                  {feature.toUpperCase().replace(/\s+/g, "_")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {centroids.map((centroid) => (
              <tr key={centroid.cluster} className="hover:bg-gray-800/50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 border rounded-md ${
                      clusterColors[centroid.cluster % clusterColors.length]
                    }`}
                  >
                    EPICENTER_{centroid.cluster}
                  </span>
                </td>
                {centroid.values.map((value, idx) => (
                  <td
                    key={idx}
                    className="px-4 py-3 whitespace-nowrap text-gray-300 font-medium"
                  >
                    <span className="bg-gray-800/50 px-2 py-1 rounded">
                      {value.toFixed(2)}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-900/50 px-4 py-2 text-right text-xs font-mono text-cyan-400 border-t border-cyan-400/20">
        <span className="bg-cyan-400/10 px-2 py-1 rounded">
          {centroids.length} THREAT_EPICENTERS_ANALYZED
        </span>
      </div>
    </div>
  );
};

export default CentroidTable;
