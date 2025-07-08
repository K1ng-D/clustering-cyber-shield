import React from "react";

interface PerformanceMetricsProps {
  silhouetteScore: number;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  silhouetteScore,
}) => {
  const getSilhouetteInterpretation = (score: number) => {
    if (score > 0.7) return "STRONG CLUSTER STRUCTURE DETECTED";
    if (score > 0.5) return "REASONABLE CLUSTER SEPARATION";
    if (score > 0.25) return "WEAK CLUSTER FORMATION";
    return "NO SUBSTANTIAL CLUSTERING";
  };

  const getScoreColor = (score: number) => {
    if (score > 0.7) return "text-green-400";
    if (score > 0.5) return "text-blue-400";
    if (score > 0.25) return "text-yellow-400";
    return "text-red-400";
  };

  const getProgressColor = (score: number) => {
    if (score > 0.7) return "bg-green-400";
    if (score > 0.5) return "bg-blue-400";
    if (score > 0.25) return "bg-yellow-400";
    return "bg-red-400";
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center space-x-3">
        <span className="text-cyan-400 text-lg">$</span>
        <h3 className="text-xl font-bold text-cyan-400 tracking-wider">
          CLUSTER_PERFORMANCE_METRICS
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Silhouette Score Card */}
        <div className="bg-gray-900/50 border border-cyan-400/20 rounded-lg p-5 shadow-lg shadow-cyan-500/10 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
            <h4 className="text-cyan-400 font-bold tracking-wider">
              SILHOUETTE_SCORE
            </h4>
          </div>

          <div className="flex items-end space-x-5">
            <div
              className={`text-4xl font-bold ${getScoreColor(silhouetteScore)}`}
            >
              {silhouetteScore.toFixed(3)}
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs ${getScoreColor(
                silhouetteScore
              ).replace("text", "bg")}/20 border ${getScoreColor(
                silhouetteScore
              ).replace("text", "border")}`}
            >
              {getSilhouetteInterpretation(silhouetteScore)}
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${getProgressColor(
                  silhouetteScore
                )}`}
                style={{ width: `${(silhouetteScore + 1) * 50}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>-1.0</span>
              <span>0</span>
              <span>+1.0</span>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-400 leading-relaxed">
            // Measures how similar an object is to its own cluster (cohesion)
            compared to other clusters (separation).
            <br />
            // Scores range from -1 to 1, where 1 indicates dense,
            well-separated clusters.
          </p>
        </div>

        {/* Interpretation Guide */}
        <div className="bg-gray-900/50 border border-purple-400/20 rounded-lg p-5 shadow-lg shadow-purple-500/10 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
            <h4 className="text-purple-400 font-bold tracking-wider">
              INTERPRETATION_GUIDE
            </h4>
          </div>

          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400 mt-1.5 mr-3"></span>
              <div>
                <span className="text-green-400 font-bold">0.71 - 1.0:</span>
                <span className="text-gray-300 ml-2">
                  STRONG EVIDENCE OF CLUSTERING
                </span>
                <div className="text-xs text-gray-400 mt-1">
                  Threat patterns clearly distinguishable
                </div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-400 mt-1.5 mr-3"></span>
              <div>
                <span className="text-blue-400 font-bold">0.51 - 0.70:</span>
                <span className="text-gray-300 ml-2">
                  MODERATE CLUSTER SEPARATION
                </span>
                <div className="text-xs text-gray-400 mt-1">
                  Distinct attack signatures detected
                </div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block h-2 w-2 rounded-full bg-yellow-400 mt-1.5 mr-3"></span>
              <div>
                <span className="text-yellow-400 font-bold">0.26 - 0.50:</span>
                <span className="text-gray-300 ml-2">
                  WEAK CLUSTER BOUNDARIES
                </span>
                <div className="text-xs text-gray-400 mt-1">
                  Potential false positives likely
                </div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-block h-2 w-2 rounded-full bg-red-400 mt-1.5 mr-3"></span>
              <div>
                <span className="text-red-400 font-bold">≤ 0.25:</span>
                <span className="text-gray-300 ml-2">
                  NO MEANINGFUL CLUSTERS
                </span>
                <div className="text-xs text-gray-400 mt-1">
                  Consider feature engineering or alternative model
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
