export interface WebAttackData {
  id: number;
  request_size: number;
  response_size: number;
  response_time: number;
  http_method: string;
  status_code: number;
  url_length: number;
  param_count: number;
  user_agent_length: number;
  is_ajax: number;
  attack_type_id: number;
  attack_type: string;
  description: string;
}

export interface WebAttackDataWithCluster extends WebAttackData {
  cluster: number;
}

export interface Centroid {
  cluster: number;
  values: number[]; // misalnya [request_size, response_time]
  features: string[];
}

export interface ClusterResult {
  cluster: number; // Jumlah cluster yang terbentuk
  silhouetteScore: number;
  centroids: Centroid[];
  clusteredData: WebAttackDataWithCluster[];
}
