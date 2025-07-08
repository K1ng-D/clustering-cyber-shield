import {
  WebAttackData,
  ClusterResult,
  Centroid,
  WebAttackDataWithCluster,
} from "./types";

export function performKMeans(
  data: WebAttackData[],
  k: number,
  maxIterations: number = 100
): ClusterResult {
  // Validasi input
  if (data.length === 0 || k <= 0) {
    throw new Error("Invalid input parameters");
  }

  // 1. Persiapan Fitur dengan Normalisasi
  const features = data.map((d) => [
    normalize(d.request_size, 0, 10000),
    normalize(d.response_size, 0, 50000),
    normalize(d.response_time, 0, 10000),
    normalize(d.url_length, 0, 2000),
    normalize(d.param_count, 0, 50),
    normalize(d.user_agent_length, 0, 500),
  ]);

  // 2. Inisialisasi Centroid dengan K-means++
  let centroids: number[][] = initializeCentroids(features, k);

  let clusters: number[] = Array(data.length).fill(-1);
  let iterations = 0;
  let changed: boolean;

  // 3. Algoritma K-Means
  do {
    changed = false;

    // Assign setiap titik ke cluster terdekat
    for (let i = 0; i < features.length; i++) {
      const distances = centroids.map((centroid) =>
        euclideanDistance(features[i], centroid)
      );
      const minDist = Math.min(...distances);
      const bestCluster = distances.indexOf(minDist);

      if (clusters[i] !== bestCluster) {
        clusters[i] = bestCluster;
        changed = true;
      }
    }

    // Update centroid
    centroids = updateCentroids(features, clusters, k);

    iterations++;
  } while (changed && iterations < maxIterations);

  // 4. Post-processing
  const validClusters = [...new Set(clusters)].filter((c) => c !== -1);

  // 5. Hitung Silhouette Score
  const silhouetteScore =
    validClusters.length > 1
      ? calculateSilhouetteScore(features, clusters, centroids)
      : 0;

  // 6. Format Hasil
  return {
    cluster: validClusters.length,
    silhouetteScore,
    centroids: formatCentroids(centroids, validClusters),
    clusteredData: data.map((d, i) => ({
      ...d,
      cluster: clusters[i],
    })),
  };
}

// Fungsi Bantuan
function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

function initializeCentroids(features: number[][], k: number): number[][] {
  const centroids: number[][] = [];
  const firstIdx = Math.floor(Math.random() * features.length);
  centroids.push([...features[firstIdx]]);

  for (let i = 1; i < k; i++) {
    const distances = features.map((point) =>
      Math.min(...centroids.map((c) => euclideanDistance(point, c)))
    );
    const sum = distances.reduce((a, b) => a + b, 0);
    let threshold = Math.random() * sum;

    let j = 0;
    while (threshold > 0 && j < distances.length) {
      threshold -= distances[j];
      j++;
    }
    centroids.push([...features[j - 1]]);
  }

  return centroids;
}

function updateCentroids(
  features: number[][],
  clusters: number[],
  k: number
): number[][] {
  return Array.from({ length: k }, (_, j) => {
    const clusterPoints = features.filter((_, idx) => clusters[idx] === j);
    return clusterPoints.length > 0
      ? calculateMean(clusterPoints)
      : features[Math.floor(Math.random() * features.length)]; // Jaga jika cluster kosong
  });
}

function formatCentroids(
  centroids: number[][],
  validClusters: number[]
): Centroid[] {
  const featureNames = [
    "request_size",
    "response_size",
    "response_time",
    "url_length",
    "param_count",
    "user_agent_length",
  ];

  return validClusters.map((cluster) => ({
    cluster,
    values: centroids[cluster],
    features: featureNames,
  }));
}

function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

function calculateMean(points: number[][]): number[] {
  const dimensions = points[0].length;
  return Array.from(
    { length: dimensions },
    (_, i) => points.reduce((sum, point) => sum + point[i], 0) / points.length
  );
}

function calculateSilhouetteScore(
  features: number[][],
  clusters: number[],
  centroids: number[][]
): number {
  let totalScore = 0;
  const clusterIndices = clusters.map((c, i) => ({ c, i }));

  for (const { c: cluster, i: idx } of clusterIndices) {
    // Hitung a(i) - jarak rata-rata ke titik dalam cluster yang sama
    const sameCluster = clusterIndices
      .filter(({ c }) => c === cluster)
      .map(({ i }) => features[i]);

    const a =
      sameCluster.length > 1 ? averageDistance(features[idx], sameCluster) : 0;

    // Hitung b(i) - jarak rata-rata minimum ke cluster lain
    let b = Infinity;
    const otherClusters = [...new Set(clusters)].filter((c) => c !== cluster);

    for (const otherCluster of otherClusters) {
      const otherPoints = clusterIndices
        .filter(({ c }) => c === otherCluster)
        .map(({ i }) => features[i]);

      const dist = averageDistance(features[idx], otherPoints);
      if (dist < b) b = dist;
    }

    // Hitung silhouette untuk titik ini
    const s = b > a ? (b - a) / Math.max(a, b) : 0;
    totalScore += s;
  }

  return totalScore / features.length;
}

function averageDistance(point: number[], points: number[][]): number {
  return (
    points.reduce((sum, p) => sum + euclideanDistance(point, p), 0) /
    points.length
  );
}
