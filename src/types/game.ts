export type TierId = 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7';

export type ComponentCategory =
  | 'basic'
  | 'cpu'
  | 'ram'
  | 'storage'
  | 'gpu'
  | 'motherboard'
  | 'psu'
  | 'cooling'
  | 'case'
  | 'monitor'
  | 'input'
  | 'expansion';

export interface ComponentItem {
  id: string;
  name: string;
  tier: TierId;
  category: ComponentCategory;
  cost: number;
  basePrice: number;
  powerDraw?: number; // Watts
  powerOutput?: number; // Watts for PSU
  tdpRating?: number; // Watts for cooling
  reliability: number; // 0.0 - 1.0
  socket?: string;
  ramType?: string;
  ramCapacityMb?: number;
  maxRamCapacityMb?: number;
  formFactor?: string;
  description: string;
  unlockTechId?: string;
  isUnlockedDefault?: boolean;
}

export interface CustomPartNaming {
  customName: string;
  componentId: string;
  unitsSold: number;
  reputation: number; // 0 - 100
  pricePremiumPct: number;
}

export interface InventoryItem {
  componentId: string;
  quantity: number;
  defective: number;
}

export interface Blueprint {
  id: string;
  name: string;
  type: 'pc' | 'supercomputer';
  tier: TierId;
  components: {
    cpu?: string;
    ram?: string;
    storage?: string;
    gpu?: string;
    motherboard?: string;
    psu?: string;
    cooling?: string;
    case?: string;
    monitor?: string;
    input?: string;
    // Supercomputer array specific
    computeCount?: number;
    interconnect?: string;
  };
  totalCost: number;
  sellingPrice: number;
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
  appealScore: number;
  releaseDate?: string;
  unitsSold: number;
  activeProduction: boolean;
}

export interface SuperContract {
  id: string;
  title: string;
  client: string;
  era: number;
  requiredPerformance: number;
  minReliability: number;
  deadlineMonths: number;
  payout: number;
  penalty: number;
  description: string;
  status: 'available' | 'in_progress' | 'completed' | 'failed';
  assignedBlueprintId?: string;
  monthsRemaining: number;
}

export interface TechNode {
  id: string;
  name: string;
  category: 'tier' | 'hardware' | 'memory' | 'storage' | 'software' | 'supercomputer';
  costRP: number;
  rpType: 'HW' | 'SW' | 'MFG' | 'DSG' | 'RSH';
  prereqs: string[];
  unlocksDescription: string;
  unlocksTier?: TierId;
  completed: boolean;
  progressRP: number;
}

export interface Employee {
  id: string;
  name: string;
  role: 'role_hw_eng' | 'role_sw_dev' | 'role_factory' | 'role_sales' | 'role_marketing' | 'role_manager';
  roleName: string;
  skill: number; // 1 to 10
  morale: number; // 0 to 100
  salary: number; // monthly
  assignment: 'idle' | 'research' | 'production' | 'marketing';
  assignedNodeId?: string;
}

export interface MarketSegment {
  id: string;
  name: string;
  populationPct: number;
  budgetPerUnit: number;
  priceWeight: number;
  perfWeight: number;
  relWeight: number;
  brandWeight: number;
  expandWeight: number;
  loyalty: number;
  elasticity: number;
  demandPool: number;
  unservedDemand: number;
  playerSharePct: number;
}

export interface Competitor {
  id: string;
  name: string;
  tagline: string;
  color: string;
  marketShare: number;
  valuation: number;
  monthlyRevenue: number;
  primaryTier: TierId;
  aggression: 'low' | 'medium' | 'high';
}

export interface NewsAnchor {
  id: string;
  date: string;
  headline: string;
  body: string;
  type: 'milestone' | 'historical' | 'market' | 'player';
  gameplayHook?: string;
  fired: boolean;
}

export interface CompanyState {
  name: string;
  founderName: string;
  background: 'bg_outsider' | 'bg_engineer' | 'bg_salesman' | 'bg_tinkerer';
  difficulty: 'diff_underdog' | 'diff_standard' | 'diff_tycoon';
  cash: number;
  debt: number;
  currentTier: TierId;
  brandAwareness: number; // 0 to 100
  popularity: number; // 0 to 100
  reputation: number; // 0 to 100
  customerSatisfaction: number; // 0 to 1.0
  facility: 'Garage' | 'Small Workshop' | 'Assembly Workshop' | 'Electronics Lab' | 'Fab Start' | 'Design Center' | 'Assembly Plant';
  monthlyAdSpend: number;
}

export interface GameDate {
  year: number;
  month: number;
  day: number;
}
