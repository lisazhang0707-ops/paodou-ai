export interface ContractMeta {
  projectName: string;
  date: string;
  budget: number;
  elevatorCount: number;
  elevatorTypes: string[];
  bidder: string;
  projectType: string;
  bidMethod: string;
  region: string;
  won: boolean;
  tags: string[];
}

export interface Contract {
  fileName: string;
  meta: ContractMeta;
  body: string;
  /** pre-computed match score, set by matcher */
  matchScore?: number;
}

/** Fields used to query matching contracts against current bid */
export interface MatchQuery {
  projectType: string;
  elevatorCount: number;
  budget: number;
  elevatorTypes: string[];
  region?: string;
  tags: string[];
}
