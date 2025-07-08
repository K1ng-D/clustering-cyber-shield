import React from "react";
import { WebAttackDataWithCluster } from "../../lib/types";

interface ClusterStatsProps {
  data: WebAttackDataWithCluster[];
}

const ClusterStats: React.FC<ClusterStatsProps> = ({ data }) => {
  const calculateStats = () => {
    const clusters = [...new Set(data.map((item) => item.cluster))];
    return clusters.map((cluster) => {
      const clusterData = data.filter((item) => item.cluster === cluster);
      const attackTypes = clusterData.reduce(
        (acc: Record<string, number>, item) => {
          acc[item.attack_type] = (acc[item.attack_type] || 0) + 1;
          return acc;
        },
        {}
      );

      const mostCommonAttack = Object.entries(attackTypes).sort(
        (a, b) => b[1] - a[1]
      )[0];

      return {
        cluster,
        count: clusterData.length,
        percentage: ((clusterData.length / data.length) * 100).toFixed(2),
        mostCommonAttack: mostCommonAttack[0],
        attackCount: mostCommonAttack[1],
        avgResponseTime: (
          clusterData.reduce((sum, item) => sum + item.response_time, 0) /
          clusterData.length
        ).toFixed(2),
        avgRequestSize: (
          clusterData.reduce((sum, item) => sum + item.request_size, 0) /
          clusterData.length
        ).toFixed(2),
      };
    });
  };

  const stats = calculateStats();

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
    <div className="space-y-6">
      <h3 className="font-mono text-lg text-cyan-400 flex items-center">
        <span className="mr-2">$</span> THREAT_GROUP_ANALYTICS
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.cluster}
            className={`bg-gray-800/50 p-5 rounded-lg border ${
              clusterColors[stat.cluster % clusterColors.length]
            } backdrop-blur-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-mono font-bold text-lg">
                THREAT_GROUP_{stat.cluster}
              </h4>
              <span className="font-mono text-xs bg-gray-900/50 px-2 py-1 rounded-full border border-cyan-400/20">
                {stat.percentage}%
              </span>
            </div>

            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                <span className="text-gray-400">THREATS:</span>
                <span className="text-cyan-400 font-medium">{stat.count}</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                <span className="text-gray-400">PRIMARY_ATTACK:</span>
                <span className="text-red-400 font-medium">
                  {stat.mostCommonAttack.toUpperCase().replace(/\s+/g, "_")}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                <span className="text-gray-400">ATTACK_COUNT:</span>
                <span className="text-purple-400 font-medium">
                  {stat.attackCount}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                <span className="text-gray-400">AVG_RESPONSE:</span>
                <span className="text-green-400 font-medium">
                  {stat.avgResponseTime}ms
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">AVG_SIZE:</span>
                <span className="text-yellow-400 font-medium">
                  {stat.avgRequestSize}bytes
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="font-mono text-xs text-cyan-400/70 text-center">
        {data.length} TOTAL_THREATS_ANALYZED • {stats.length}{" "}
        THREAT_GROUPS_IDENTIFIED
      </div>
    </div>
  );
};

export default ClusterStats;
