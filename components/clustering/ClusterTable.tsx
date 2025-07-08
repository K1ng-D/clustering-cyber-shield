import React from "react";
import { WebAttackDataWithCluster } from "@/lib/types";

interface ClusterTableProps {
  data: WebAttackDataWithCluster[];
}

const ClusterTable: React.FC<ClusterTableProps> = ({ data }) => {
  // Debugging: Analisis distribusi cluster
  const clusterDistribution = data.reduce((acc, { cluster }) => {
    acc[cluster] = (acc[cluster] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log("Cluster Distribution:", clusterDistribution);

  // Warna untuk setiap cluster termasuk -1
  const clusterStyles = [
    { bg: "bg-gray-800/20", text: "text-gray-400", border: "border-gray-600" }, // cluster -1
    { bg: "bg-cyan-400/10", text: "text-cyan-400", border: "border-cyan-400" },
    {
      bg: "bg-purple-400/10",
      text: "text-purple-400",
      border: "border-purple-400",
    },
    { bg: "bg-red-400/10", text: "text-red-400", border: "border-red-400" },
    {
      bg: "bg-green-400/10",
      text: "text-green-400",
      border: "border-green-400",
    },
    {
      bg: "bg-yellow-400/10",
      text: "text-yellow-400",
      border: "border-yellow-400",
    },
    { bg: "bg-pink-400/10", text: "text-pink-400", border: "border-pink-400" },
    { bg: "bg-blue-400/10", text: "text-blue-400", border: "border-blue-400" },
    { bg: "bg-gray-800/20", text: "text-gray-400", border: "border-gray-600" },
    { bg: "bg-cyan-400/10", text: "text-cyan-400", border: "border-cyan-400" },
    {
      bg: "bg-purple-400/10",
      text: "text-purple-400",
      border: "border-purple-400",
    },
    { bg: "bg-red-400/10", text: "text-red-400", border: "border-red-400" },
    {
      bg: "bg-green-400/10",
      text: "text-green-400",
      border: "border-green-400",
    },
    {
      bg: "bg-yellow-400/10",
      text: "text-yellow-400",
      border: "border-yellow-400",
    },
    { bg: "bg-pink-400/10", text: "text-pink-400", border: "border-pink-400" },
    { bg: "bg-blue-400/10", text: "text-blue-400", border: "border-blue-400" },
  ];

  const getClusterStyle = (cluster: number) => {
    return clusterStyles[cluster + 1] || clusterStyles[0];
  };

  // Urutkan data berdasarkan cluster untuk tampilan yang lebih baik
  const sortedData = [...data].sort((a, b) => a.cluster - b.cluster);

  return (
    <div className="border border-cyan-400/20 rounded-lg overflow-hidden shadow-lg shadow-cyan-500/10">
      {/* Cluster Summary */}
      <div className="bg-gray-900/50 p-4 border-b border-cyan-400/20">
        <div className="flex flex-wrap gap-2">
          {Object.entries(clusterDistribution).map(([cluster, count]) => (
            <div
              key={cluster}
              className={`px-3 py-1 rounded-full text-xs font-mono flex items-center ${
                getClusterStyle(Number(cluster)).bg
              } ${getClusterStyle(Number(cluster)).text}`}
            >
              <span
                className="w-2 h-2 rounded-full mr-2"
                style={{
                  backgroundColor: getClusterStyle(
                    Number(cluster)
                  ).text.replace("text-", "bg-"),
                }}
              ></span>
              Cluster {cluster}: {count}
            </div>
          ))}
        </div>
      </div>

      {/* Tabel Data */}
      <div className="relative overflow-x-auto">
        <table className="w-full font-mono text-xs">
          <thead className="bg-gray-800/80 text-cyan-400">
            <tr>
              <th className="px-4 py-3 text-left uppercase tracking-wider border-b border-cyan-400/20">
                Cluster
              </th>
              <th className="px-4 py-3 text-left uppercase tracking-wider border-b border-cyan-400/20">
                ID
              </th>
              <th className="px-4 py-3 text-left uppercase tracking-wider border-b border-cyan-400/20">
                Method
              </th>
              <th className="px-4 py-3 text-left uppercase tracking-wider border-b border-cyan-400/20">
                Status
              </th>
              <th className="px-4 py-3 text-left uppercase tracking-wider border-b border-cyan-400/20">
                Attack Type
              </th>
              <th className="px-4 py-3 text-left uppercase tracking-wider border-b border-cyan-400/20">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {sortedData.map((item) => {
              const style = getClusterStyle(item.cluster);
              return (
                <tr
                  key={`${item.id}-${item.cluster}`}
                  className={`hover:bg-gray-800/50 ${style.bg}`}
                >
                  <td className={`px-4 py-3 font-bold ${style.text}`}>
                    <div className="flex items-center">
                      <span
                        className="w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor: style.text.replace("text-", "bg-"),
                        }}
                      ></span>
                      {item.cluster}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{item.id}</td>
                  <td className="px-4 py-3 text-gray-300">
                    {item.http_method}
                  </td>
                  <td
                    className={`px-4 py-3 ${
                      item.status_code >= 400
                        ? "text-red-400 font-bold"
                        : "text-gray-300"
                    }`}
                  >
                    {item.status_code}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {item.attack_type || "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 max-w-xs truncate hover:max-w-none hover:whitespace-normal hover:absolute hover:bg-gray-800 hover:z-10 hover:border hover:border-cyan-400/20 hover:shadow-lg">
                    {item.description}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-gray-900/50 px-4 py-2 text-right text-xs font-mono text-cyan-400 border-t border-cyan-400/20">
        <span className="bg-cyan-400/10 px-2 py-1 rounded">
          {data.length} records | {Object.keys(clusterDistribution).length}{" "}
          clusters
        </span>
      </div>
    </div>
  );
};

export default ClusterTable;
