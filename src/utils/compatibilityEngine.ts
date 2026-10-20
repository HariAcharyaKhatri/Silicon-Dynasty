import { Blueprint, ComponentItem } from '../types/game';

export interface CompatibilityResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  calculatedPowerDraw: number;
  calculatedReliability: number;
  calculatedPerformance: number;
}

export function validatePcBlueprint(
  blueprint: Blueprint,
  catalogue: ComponentItem[]
): CompatibilityResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const getComp = (id?: string) => catalogue.find((c) => c.id === id);

  const cpu = getComp(blueprint.components.cpu);
  const mb = getComp(blueprint.components.motherboard);
  const ram = getComp(blueprint.components.ram);
  const psu = getComp(blueprint.components.psu);
  const cooling = getComp(blueprint.components.cooling);
  const caseComp = getComp(blueprint.components.case);

  // Check required core components
  if (!cpu) errors.push('Missing CPU / Processing unit');
  if (!mb) errors.push('Missing Motherboard / Backplane');
  if (!ram) errors.push('Missing Memory / RAM module');
  if (!psu) errors.push('Missing Power Supply Unit (PSU)');

  // 1. RULE_SOCKET: CPU socket must match Motherboard socket
  if (cpu && mb) {
    if (cpu.socket && mb.socket && cpu.socket !== mb.socket) {
      errors.push(`Socket Mismatch: CPU (${cpu.socket}) cannot fit Motherboard socket (${mb.socket})`);
    }
  }

  // 2. RULE_RAM_GEN: RAM module generation must match Motherboard RAM spec
  if (ram && mb) {
    if (ram.ramType && mb.ramType && ram.ramType !== mb.ramType) {
      errors.push(`Memory Generation Mismatch: RAM type (${ram.ramType}) incompatible with board slots (${mb.ramType})`);
    }
  }

  // 3. RULE_RAM_CAPACITY: RAM size cannot exceed CPU address limits
  if (ram && cpu && ram.ramCapacityMb && cpu.maxRamCapacityMb) {
    if (ram.ramCapacityMb > cpu.maxRamCapacityMb) {
      errors.push(
        `Address Space Limit: Memory (${ram.ramCapacityMb * 1024} KB) exceeds CPU maximum address space (${cpu.maxRamCapacityMb * 1024} KB)`
      );
    }
  }

  // 4. RULE_POWER: Total power draw must not exceed PSU output
  let totalDraw = 0;
  if (cpu) totalDraw += cpu.powerDraw || 0;
  if (mb) totalDraw += mb.powerDraw || 0;
  if (ram) totalDraw += ram.powerDraw || 0;

  if (psu) {
    const output = psu.powerOutput || 0;
    if (totalDraw > output) {
      errors.push(`Power Overload: Total system draw (${totalDraw}W) exceeds PSU output capacity (${output}W)`);
    } else if (totalDraw > output * 0.85) {
      warnings.push(`High Power Load: Running at over 85% of PSU rated wattage`);
    }
  }

  // 5. RULE_COOLER_TDP: Cooler rating must handle CPU TDP
  if (cpu && cooling) {
    const cpuTdp = cpu.powerDraw || 10;
    const coolingCap = cooling.tdpRating || 15;
    if (coolingCap < cpuTdp) {
      warnings.push(`Thermal Throttling: Cooling capacity (${coolingCap}W) is lower than CPU thermal output (${cpuTdp}W)`);
    }
  } else if (cpu && (cpu.powerDraw || 0) > 25 && !cooling) {
    warnings.push('No Dedicated Cooling: CPU produces heat (>25W) without a designated heatsink/chiller');
  }

  // 6. RULE_CASE_FORM_FACTOR: Motherboard must physically fit Case
  if (mb && caseComp) {
    if (caseComp.formFactor && mb.formFactor && caseComp.formFactor !== mb.formFactor) {
      warnings.push(`Form Factor Clearance: Chassis might require bracket adapters for this board layout`);
    }
  }

  // Calculate composite reliability
  const items = [cpu, mb, ram, psu, cooling, caseComp].filter(Boolean) as ComponentItem[];
  const avgReliability = items.length > 0 ? items.reduce((acc, c) => acc * c.reliability, 1.0) : 0.8;

  // Calculate rough performance score
  let perfScore = 0;
  if (cpu) perfScore += (cpu.cost * 0.3) + 10;
  if (ram) perfScore += (ram.cost * 0.2) + 5;

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    calculatedPowerDraw: totalDraw,
    calculatedReliability: Math.round(avgReliability * 100) / 100,
    calculatedPerformance: Math.round(perfScore),
  };
}

export function validateSupercomputerBlueprint(
  blueprint: Blueprint,
  catalogue: ComponentItem[]
): CompatibilityResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const getComp = (id?: string) => catalogue.find((c) => c.id === id);

  const cpu = getComp(blueprint.components.cpu);
  const interconnect = getComp(blueprint.components.interconnect);
  const ram = getComp(blueprint.components.ram);
  const cooling = getComp(blueprint.components.cooling);
  const psu = getComp(blueprint.components.psu);

  const unitCount = blueprint.components.computeCount || 2;

  if (!cpu) errors.push('Missing Compute Element / Processing Blade');
  if (!interconnect) errors.push('Missing System Interconnect / Backplane');
  if (!cooling) errors.push('Missing Industrial Cooling Subsystem');
  if (!psu) errors.push('Missing Industrial Power Grid');

  // SUPER_RULE_ARRAY_QTY
  if (unitCount < 2 || unitCount > 64) {
    errors.push(`Rack Capacity Violation: Compute blades (${unitCount}) must be between 2 and 64 units per frame`);
  }

  // Compute total array TDP & Draw
  const bladeDraw = cpu?.powerDraw || 50;
  const totalArrayTdp = bladeDraw * unitCount;
  const systemOverhead = 200; // interconnect, fans, control
  const totalDraw = totalArrayTdp + systemOverhead;

  // SUPER_RULE_ARRAY_TDP
  if (cooling) {
    const coolingCap = cooling.tdpRating || 100;
    if (coolingCap < totalArrayTdp) {
      errors.push(`Thermal Failure: Total array heat (${totalArrayTdp}W) exceeds cooling capability (${coolingCap}W)`);
    } else if (coolingCap < totalArrayTdp * 1.2) {
      warnings.push('Marginal Thermal Buffer: Immersion chiller running near maximum thermal absorption');
    }
  }

  // SUPER_RULE_ARRAY_POWER
  if (psu) {
    const psuCap = psu.powerOutput || 500;
    if (psuCap < totalDraw) {
      errors.push(`Substation Draw Limit: Cluster requires ${totalDraw}W, but Power System only supplies ${psuCap}W`);
    }
  }

  const calculatedPerf = Math.round((unitCount * (cpu?.cost || 100) * 0.4) + (ram?.cost || 50));
  const avgReliability = (cpu?.reliability || 0.9) * (psu?.reliability || 0.95) * (cooling?.reliability || 0.9);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    calculatedPowerDraw: totalDraw,
    calculatedReliability: Math.round(avgReliability * 100) / 100,
    calculatedPerformance: calculatedPerf,
  };
}
