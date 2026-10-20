import { CompanyState, Employee, TechNode, ComponentItem, CustomPartNaming, Blueprint, SuperContract } from '../types/game';

export interface ValuationBreakdown {
  tangibleAssets: number;
  earningsPower: number;
  marketPosition: number;
  technologyValue: number;
  humanCapital: number;
  brandValue: number;
  growthPremium: number;
  liabilities: number;
  totalValuation: number;
  rankTier: string;
}

export function calculateCompanyValuation(
  company: CompanyState,
  employees: Employee[],
  techNodes: TechNode[],
  inventoryValue: number,
  customParts: Record<string, CustomPartNaming>,
  annualRevenue: number,
  annualProfit: number,
  marketSharePct: number
): ValuationBreakdown {
  // 1. Tangible Assets: cash + 60% inventory + facilities
  const facilityValueMap: Record<string, number> = {
    Garage: 2000,
    'Small Workshop': 7000,
    'Assembly Workshop': 25000,
    'Electronics Lab': 90000,
    'Fab Start': 250000,
    'Design Center': 900000,
    'Assembly Plant': 2500000,
  };
  const facilityValue = facilityValueMap[company.facility] || 2000;
  const tangibleAssets = Math.round(company.cash + inventoryValue * 0.6 + facilityValue);

  // 2. Earnings Power: annual profit * multiple
  const multiple = 8 + (annualProfit > 0 ? 3 : 1);
  const earningsPower = Math.round(Math.max(0, annualProfit) * multiple);

  // 3. Market Position Value: Share * TAM * 0.008 (assumed base era TAM = $15M early)
  const estimatedTamUsd = 15000000;
  const marketPosition = Math.round((marketSharePct / 100) * estimatedTamUsd * 0.008);

  // 4. Technology Value: completed nodes + patents
  const completedNodes = techNodes.filter((n) => n.completed);
  const techValue = completedNodes.reduce((acc, n) => acc + n.costRP * 40, 0);

  // 5. Human Capital: Skill * role multiplier * $5k
  const roleMult: Record<string, number> = {
    role_hw_eng: 2.0,
    role_sw_dev: 1.8,
    role_manager: 1.5,
    role_sales: 1.2,
    role_factory: 0.8,
    role_marketing: 1.1,
  };
  const humanCapital = employees.reduce((acc, emp) => {
    return acc + Math.round(emp.skill * (roleMult[emp.role] || 1.0) * 1500);
  }, 0);

  // 6. Brand Value: awareness + reputation + custom parts
  const customPartsBonus = Object.values(customParts).reduce(
    (acc, p) => acc + (p.reputation * p.unitsSold * 0.01),
    0
  );
  const brandValue = Math.round((company.brandAwareness * 500) + (company.reputation * 800) + customPartsBonus);

  // 7. Growth Premium
  const growthPremium = Math.round(annualRevenue * 0.15);

  const liabilities = Math.round(company.debt);

  const total = tangibleAssets + earningsPower + marketPosition + techValue + humanCapital + brandValue + growthPremium - liabilities;

  let rankTier = 'E';
  if (total > 100000000) rankTier = 'S';
  else if (total > 10000000) rankTier = 'A';
  else if (total > 1000000) rankTier = 'B';
  else if (total > 100000) rankTier = 'C';
  else if (total > 25000) rankTier = 'D';

  return {
    tangibleAssets,
    earningsPower,
    marketPosition,
    technologyValue: techValue,
    humanCapital,
    brandValue,
    growthPremium,
    liabilities,
    totalValuation: Math.max(1000, total),
    rankTier,
  };
}
