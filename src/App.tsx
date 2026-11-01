import React from 'react';
import {
  INITIAL_COMPONENTS,
  INITIAL_TECH_TREE,
  INITIAL_NEWS_ANCHORS,
  INITIAL_MARKET_SEGMENTS,
  INITIAL_COMPETITORS,
  INITIAL_SUPER_CONTRACTS,
} from './data/initialGameData';
import {
  CompanyState,
  GameDate,
  ComponentItem,
  CustomPartNaming,
  InventoryItem,
  Blueprint,
  TechNode,
  Employee,
  NewsAnchor,
  MarketSegment,
  Competitor,
  SuperContract,
  TierId,
  ProductReviewSummary,
} from './types/game';
import { calculateCompanyValuation } from './utils/valuationEngine';
import { generateProductReview } from './utils/reviewEngine';
import { AppLogo } from './components/AppLogo';
import { AuthScreen, AuthUser } from './components/AuthScreen';
import { MainMenu } from './components/MainMenu';
import { CompanyWizardModal } from './components/CompanyWizardModal';
import { TierUnlockModal } from './components/TierUnlockModal';
import { LaunchReviewModal } from './components/LaunchReviewModal';
import { NewsTicker } from './components/NewsTicker';
import { BasicCatalogueTab } from './components/BasicCatalogueTab';
import { ResearchLabTab } from './components/ResearchLabTab';
import { DesignStudioTab } from './components/DesignStudioTab';
import { SupercomputerTab } from './components/SupercomputerTab';
import { MarketIntelTab } from './components/MarketIntelTab';
import { PersonnelTab } from './components/PersonnelTab';
import { FinancialLedgerTab } from './components/FinancialLedgerTab';
import confetti from 'canvas-confetti';

import {
  Cpu,
  Layers,
  Wrench,
  Lightbulb,
  Server,
  BarChart3,
  Users,
  DollarSign,
  Play,
  Pause,
  Home,
  Monitor,
  Flame,
  AlertCircle,
  Eye,
} from 'lucide-react';

type AppScreen = 'auth' | 'main_menu' | 'wizard' | 'in_game';
type TabId = 'catalogue' | 'research' | 'design' | 'supercomputer' | 'market' | 'personnel' | 'finance';

export function App() {
  // Navigation & Pre-game flow states
  const [appScreen, setAppScreen] = React.useState<AppScreen>('auth');
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);
  const [hasActiveGame, setHasActiveGame] = React.useState<boolean>(false);
  const [isCrtEnabled, setIsCrtEnabled] = React.useState<boolean>(true);

  // Celebratory Tier Unlock Modal State
  const [celebrationTier, setCelebrationTier] = React.useState<TierId | null>(null);

  // Press Embargo / Critic Review Modal State
  const [launchReviewTarget, setLaunchReviewTarget] = React.useState<{
    name: string;
    type: 'pc' | 'component' | 'supercomputer';
    review: ProductReviewSummary;
  } | null>(null);

  // Time Engine: 1952 start
  const [gameDate, setGameDate] = React.useState<GameDate>({ year: 1952, month: 3, day: 1 });
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [gameSpeed, setGameSpeed] = React.useState<number>(1); // 1 = normal, 2 = fast, 5 = ultra

  // Core Simulation States
  const [company, setCompany] = React.useState<CompanyState>({
    name: 'Apex Components',
    founderName: 'Alex Walker',
    background: 'bg_outsider',
    difficulty: 'diff_underdog',
    cash: 10000,
    debt: 0,
    currentTier: 'T0',
    brandAwareness: 10,
    popularity: 50,
    reputation: 50,
    customerSatisfaction: 0.85,
    facility: 'Garage',
    monthlyAdSpend: 100,
  });

  const [catalogue, setCatalogue] = React.useState<ComponentItem[]>(INITIAL_COMPONENTS);
  const [customParts, setCustomParts] = React.useState<Record<string, CustomPartNaming>>({});
  const [inventory, setInventory] = React.useState<Record<string, InventoryItem>>({});
  const [blueprints, setBlueprints] = React.useState<Blueprint[]>([]);
  const [techTree, setTechTree] = React.useState<TechNode[]>(INITIAL_TECH_TREE);
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [newsQueue, setNewsQueue] = React.useState<NewsAnchor[]>(INITIAL_NEWS_ANCHORS);
  const [marketSegments, setMarketSegments] = React.useState<MarketSegment[]>(INITIAL_MARKET_SEGMENTS);
  const [competitors, setCompetitors] = React.useState<Competitor[]>(INITIAL_COMPETITORS);
  const [superContracts, setSuperContracts] = React.useState<SuperContract[]>(INITIAL_SUPER_CONTRACTS);

  // Financial metrics
  const [monthlyRevenue, setMonthlyRevenue] = React.useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = React.useState(300); // garage rent
  const [monthlyNetProfit, setMonthlyNetProfit] = React.useState(-300);

  // Active Tab
  const [activeTab, setActiveTab] = React.useState<TabId>('catalogue');

  // Handle Authentication success
  const handleLoginSuccess = (user: AuthUser) => {
    setAuthUser(user);
    setAppScreen('main_menu');
  };

  // Handle Logout
  const handleLogout = () => {
    setAuthUser(null);
    setAppScreen('auth');
    setIsPlaying(false);
  };

  // Handle Start New Game
  const handleStartNewGame = () => {
    setAppScreen('wizard');
  };

  // Handle Resume Game
  const handleResumeGame = () => {
    if (hasActiveGame) {
      setAppScreen('in_game');
      setIsPlaying(true);
    }
  };

  // Handle Wizard completion
  const handleWizardComplete = (setup: {
    companyName: string;
    founderName: string;
    background: CompanyState['background'];
    difficulty: CompanyState['difficulty'];
    startingCash: number;
    initialPartName: string;
  }) => {
    setCompany({
      name: setup.companyName,
      founderName: setup.founderName,
      background: setup.background,
      difficulty: setup.difficulty,
      cash: setup.startingCash,
      debt: 0,
      currentTier: 'T0',
      brandAwareness: 10,
      popularity: 50,
      reputation: 50,
      customerSatisfaction: 0.85,
      facility: 'Garage',
      monthlyAdSpend: 100,
    });

    // Reset date to March 1, 1952
    setGameDate({ year: 1952, month: 3, day: 1 });

    // Register initial custom named part with initial critic review
    const initialComp = INITIAL_COMPONENTS.find((c) => c.id === 't0_power_cable');
    const initialReview = generateProductReview({
      name: setup.initialPartName,
      type: 'component',
      tier: 'T0',
      totalCost: initialComp?.cost || 4,
      sellingPrice: initialComp?.basePrice || 12,
      reliability: initialComp?.reliability || 0.95,
      appealScore: 72,
      currentYear: 1952,
    });

    setCustomParts({
      t0_power_cable: {
        customName: setup.initialPartName,
        componentId: 't0_power_cable',
        unitsSold: 0,
        recentSalesRate: 1,
        reputation: 50,
        pricePremiumPct: 0,
        sellingPrice: initialComp?.basePrice || 12,
        adSpend: 0,
        review: initialReview,
      },
    });

    setInventory({});
    setBlueprints([]);
    setEmployees([]);
    setTechTree(INITIAL_TECH_TREE.map((n) => ({ ...n, progressRP: 0, completed: false })));

    setHasActiveGame(true);
    setAppScreen('in_game');
    setIsPlaying(true);
  };

  // Master Clock Tick Interval
  React.useEffect(() => {
    if (!isPlaying || appScreen !== 'in_game') return;

    const intervalTime = 1000 / gameSpeed;
    const timer = setInterval(() => {
      setGameDate((prev) => {
        let newDay = prev.day + 1;
        let newMonth = prev.month;
        let newYear = prev.year;

        // Simplified 30-day month
        if (newDay > 30) {
          newDay = 1;
          newMonth += 1;
          if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
          }
          // Monthly ledger triggers on 1st of month
          handleMonthlyCycle();
        }

        // Daily cycle triggers (Research & Production progress)
        handleDailyTick();

        return { year: newYear, month: newMonth, day: newDay };
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, gameSpeed, appScreen, employees, techTree, inventory, company]);

  // Daily Tick handler: Advance research & calculate live daily product sales
  const handleDailyTick = () => {
    // 1. Advance Research Points (HW-RP)
    setTechTree((prevNodes) =>
      prevNodes.map((node) => {
        if (node.completed) return node;

        const assigned = employees.filter((e) => e.assignedNodeId === node.id);
        if (assigned.length === 0) return node;

        const totalRP = assigned.reduce((acc, eng) => {
          return acc + 5 * (eng.skill / 5) * (eng.morale / 100);
        }, 0);

        const newRP = node.progressRP + totalRP;
        if (newRP >= node.costRP) {
          // Node finished!
          confetti({ particleCount: 50, spread: 70 });

          // If this tech node unlocks a new tier, clear Tier Fog of War!
          if (node.unlocksTier && node.unlocksTier !== company.currentTier) {
            handleUnlockTier(node.unlocksTier);
          }

          return { ...node, progressRP: node.costRP, completed: true };
        }
        return { ...node, progressRP: newRP };
      })
    );

    // 2. Daily Sales & Market Velocity for Branded Components
    let dailyComponentRevenue = 0;
    setInventory((prevInv) => {
      let invChanged = false;
      const updatedInv = { ...prevInv };

      Object.keys(updatedInv).forEach((compId) => {
        const item = updatedInv[compId];
        if (item && item.quantity > 0) {
          const comp = catalogue.find((c) => c.id === compId);
          if (comp) {
            const partInfo = customParts[compId];
            const price = partInfo?.sellingPrice || comp.basePrice;
            const cost = comp.cost;

            // Price elasticity factor
            const markup = price / Math.max(1, cost);
            let elasticity = 1.0;
            if (markup <= 1.5) elasticity = 1.4;
            else if (markup <= 2.5) elasticity = 1.1;
            else if (markup <= 3.5) elasticity = 0.85;
            else if (markup <= 5.0) elasticity = 0.5;
            else elasticity = 0.25;

            // Ad boost (from individual item ad spend or company ad)
            const itemAdSpend = partInfo?.adSpend || 0;
            const companyAdBonus = 1 + ((company.monthlyAdSpend || 0) / 5000) * 0.15;
            const itemAdBonus = 1 + (itemAdSpend / 300) * 0.45;
            const reviewMult = partInfo?.review?.salesMultiplier || 1.0;
            const outsiderBonus = company.background === 'bg_outsider' ? 1.15 : 1.0;

            const baseDaily = Math.max(1, Math.round(1 + Math.random() * 2));
            const calculatedDailyDemand = Math.max(
              1,
              Math.round(baseDaily * elasticity * itemAdBonus * companyAdBonus * reviewMult * outsiderBonus)
            );

            const unitsSoldToday = Math.min(item.quantity, calculatedDailyDemand);
            if (unitsSoldToday > 0) {
              item.quantity -= unitsSoldToday;
              dailyComponentRevenue += unitsSoldToday * price;
              invChanged = true;

              // Update customParts units sold & daily velocity
              setCustomParts((prevParts) => {
                const current = prevParts[compId] || {
                  customName: comp.name,
                  componentId: compId,
                  unitsSold: 0,
                  reputation: 50,
                  pricePremiumPct: 0,
                };
                return {
                  ...prevParts,
                  [compId]: {
                    ...current,
                    unitsSold: (current.unitsSold || 0) + unitsSoldToday,
                    recentSalesRate: unitsSoldToday,
                    reputation: Math.min(100, current.reputation + 0.02),
                  },
                };
              });
            }
          }
        }
      });

      return invChanged ? updatedInv : prevInv;
    });

    // 3. Daily Sales & Market Velocity for Turnkey Assembled Computers
    let dailyPcRevenue = 0;
    setBlueprints((prevBps) => {
      let bpChanged = false;
      const updatedBps = prevBps.map((bp) => {
        const invCount = bp.inventoryCount ?? (bp.activeProduction ? 25 : 0);
        if (bp.activeProduction && invCount > 0) {
          const price = bp.sellingPrice;
          const cost = bp.totalCost;
          const markup = price / Math.max(1, cost);
          let elasticity = 1.0;
          if (markup <= 1.4) elasticity = 1.35;
          else if (markup <= 2.2) elasticity = 1.05;
          else if (markup <= 3.2) elasticity = 0.8;
          else if (markup <= 4.5) elasticity = 0.45;
          else elasticity = 0.2;

          const bpAdSpend = bp.adSpend || 0;
          const adBonus = 1 + (bpAdSpend / 300) * 0.5;
          const reviewMult = bp.review?.salesMultiplier || 1.0;
          const baseDemand = Math.max(1, Math.round((bp.appealScore / 35) * (0.8 + Math.random() * 0.4)));
          const dailyDemand = Math.max(1, Math.round(baseDemand * elasticity * adBonus * reviewMult));

          const soldToday = Math.min(invCount, dailyDemand);
          if (soldToday > 0) {
            dailyPcRevenue += soldToday * price;
            bpChanged = true;
            return {
              ...bp,
              inventoryCount: invCount - soldToday,
              unitsSold: (bp.unitsSold || 0) + soldToday,
              recentSalesRate: soldToday,
            };
          }
        }
        return bp;
      });

      return bpChanged ? updatedBps : prevBps;
    });

    // Credit daily cash and accumulate into monthly revenue
    const totalDailyRevenue = dailyComponentRevenue + dailyPcRevenue;
    if (totalDailyRevenue > 0) {
      setCompany((prev) => ({
        ...prev,
        cash: prev.cash + totalDailyRevenue,
      }));
      setMonthlyRevenue((prev) => prev + totalDailyRevenue);
    }
  };

  // Monthly Cycle handler
  const handleMonthlyCycle = () => {
    // 1. Facility rent & Payroll
    const rentMap: Record<string, number> = {
      Garage: 300,
      'Small Workshop': 800,
      'Assembly Workshop': 2200,
      'Electronics Lab': 6000,
      'Fab Start': 15000,
      'Design Center': 45000,
      'Assembly Plant': 120000,
    };
    const rent = rentMap[company.facility] || 300;
    const payroll = employees.reduce((acc, e) => acc + e.salary, 0);
    const companyAdSpend = company.monthlyAdSpend || 0;

    // Total product-specific ad spend
    const blueprintAdSpends = blueprints.reduce((acc, b) => acc + (b.adSpend || 0), 0);
    const componentAdSpends = Object.values(customParts).reduce((acc, p) => acc + (p.adSpend || 0), 0);
    const totalAdSpend = companyAdSpend + blueprintAdSpends + componentAdSpends;

    const totalExpenses = rent + payroll + totalAdSpend;

    // Deduct overhead from cash balance
    setCompany((prev) => ({
      ...prev,
      cash: prev.cash - totalExpenses,
      brandAwareness: Math.min(100, prev.brandAwareness + (totalAdSpend > 0 ? 0.8 : 0.2)),
      popularity: Math.min(100, Math.max(10, prev.popularity * 0.96 + (monthlyRevenue > 0 ? 1.5 : 0))),
    }));

    setMonthlyExpenses(totalExpenses);
    setMonthlyNetProfit(monthlyRevenue - totalExpenses);
    setMonthlyRevenue(0);

    // Trigger historical news anchors if date matches
    setNewsQueue((prevQueue) =>
      prevQueue.map((anchor) => {
        const anchorYear = parseInt(anchor.date.split('-')[0], 10);
        if (!anchor.fired && gameDate.year >= anchorYear) {
          return { ...anchor, fired: true };
        }
        return anchor;
      })
    );
  };

  // Order production of components & generate review for maiden batch
  const handleOrderProduction = (componentId: string, quantity: number, unitCost: number) => {
    const totalCost = quantity * unitCost;
    if (company.cash < totalCost) return;

    setCompany((prev) => ({ ...prev, cash: prev.cash - totalCost }));
    setInventory((prev) => {
      const current = prev[componentId] || { componentId, quantity: 0, defective: 0 };
      const defectRate = 0.05;
      const goodUnits = Math.round(quantity * (1 - defectRate));
      const defects = quantity - goodUnits;

      return {
        ...prev,
        [componentId]: {
          componentId,
          quantity: current.quantity + goodUnits,
          defective: current.defective + defects,
        },
      };
    });

    // If this custom part doesn't have a review yet, generate one and show review modal
    const comp = catalogue.find((c) => c.id === componentId);
    const existingPart = customParts[componentId];
    if (comp && (!existingPart || !existingPart.review)) {
      const partName = existingPart?.customName || comp.name;
      const price = existingPart?.sellingPrice || comp.basePrice;
      const review = generateProductReview({
        name: partName,
        type: 'component',
        tier: comp.tier,
        totalCost: comp.cost,
        sellingPrice: price,
        reliability: comp.reliability,
        appealScore: 70,
        currentYear: gameDate.year,
      });

      setCustomParts((prev) => {
        const current = prev[componentId] || {
          customName: partName,
          componentId,
          unitsSold: 0,
          reputation: 50,
          pricePremiumPct: 0,
          sellingPrice: price,
        };
        return {
          ...prev,
          [componentId]: {
            ...current,
            review,
          },
        };
      });

      setLaunchReviewTarget({
        name: partName,
        type: 'component',
        review,
      });
    }
  };

  // Custom Part Naming
  const handleUpdatePartName = (componentId: string, newName: string) => {
    setCustomParts((prev) => {
      const existing = prev[componentId] || {
        customName: newName,
        componentId,
        unitsSold: 0,
        reputation: 50,
        pricePremiumPct: 0,
      };
      return {
        ...prev,
        [componentId]: { ...existing, customName: newName },
      };
    });
  };

  // Update component selling price
  const handleUpdatePartPrice = (componentId: string, price: number) => {
    setCatalogue((prev) =>
      prev.map((c) => (c.id === componentId ? { ...c, basePrice: price } : c))
    );
    setCustomParts((prev) => {
      const existing = prev[componentId] || {
        customName: catalogue.find((c) => c.id === componentId)?.name || componentId,
        componentId,
        unitsSold: 0,
        reputation: 50,
        pricePremiumPct: 0,
      };
      return {
        ...prev,
        [componentId]: { ...existing, sellingPrice: price },
      };
    });
  };

  // Update Product-Specific Ad Spend
  const handleUpdateProductAdSpend = (
    itemId: string,
    itemType: 'pc' | 'component' | 'supercomputer',
    newAdSpend: number
  ) => {
    if (itemType === 'pc' || itemType === 'supercomputer') {
      setBlueprints((prev) =>
        prev.map((bp) => (bp.id === itemId ? { ...bp, adSpend: newAdSpend } : bp))
      );
    } else {
      setCustomParts((prev) => {
        const current = prev[itemId] || {
          customName: catalogue.find((c) => c.id === itemId)?.name || itemId,
          componentId: itemId,
          unitsSold: 0,
          reputation: 50,
          pricePremiumPct: 0,
        };
        return {
          ...prev,
          [itemId]: { ...current, adSpend: newAdSpend },
        };
      });
    }
  };

  // Update Product-Specific Selling Price
  const handleUpdateProductPrice = (
    itemId: string,
    itemType: 'pc' | 'component' | 'supercomputer',
    newPrice: number
  ) => {
    if (itemType === 'pc' || itemType === 'supercomputer') {
      setBlueprints((prev) =>
        prev.map((bp) => (bp.id === itemId ? { ...bp, sellingPrice: newPrice } : bp))
      );
    } else {
      handleUpdatePartPrice(itemId, newPrice);
    }
  };

  // Researcher Assignment
  const handleAssignResearcher = (employeeId: string, nodeId: string) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? { ...e, assignedNodeId: nodeId, assignment: 'research' } : e))
    );
  };

  const handleUnassignResearcher = (employeeId: string) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? { ...e, assignedNodeId: undefined, assignment: 'idle' } : e))
    );
  };

  // Trigger celebration modal & lift Tier Fog of War
  const handleUnlockTier = (nextTier: TierId) => {
    const facilityNameMap: Record<TierId, CompanyState['facility']> = {
      T0: 'Garage',
      T1: 'Small Workshop',
      T2: 'Assembly Workshop',
      T3: 'Electronics Lab',
      T4: 'Electronics Lab',
      T5: 'Fab Start',
      T6: 'Design Center',
      T7: 'Assembly Plant',
    };

    setCompany((prev) => ({
      ...prev,
      currentTier: nextTier,
      facility: facilityNameMap[nextTier] || prev.facility,
    }));

    setCelebrationTier(nextTier);
  };

  // Facility upgrade / Tier advancement
  const handleAdvanceTierFacility = (nextTier: TierId, cost: number) => {
    if (company.cash < cost) return;

    setCompany((prev) => ({
      ...prev,
      cash: prev.cash - cost,
    }));

    handleUnlockTier(nextTier);
  };

  // Save Computer Blueprint & Trigger Critic Launch Review
  const handleSaveBlueprint = (bp: Blueprint) => {
    const review = generateProductReview({
      name: bp.name,
      type: bp.type,
      tier: bp.tier,
      totalCost: bp.totalCost,
      sellingPrice: bp.sellingPrice,
      reliability: bp.validationErrors && bp.validationErrors.length === 0 ? 0.94 : 0.65,
      appealScore: bp.appealScore || 75,
      currentYear: gameDate.year,
    });

    const finalizedBlueprint: Blueprint = {
      ...bp,
      inventoryCount: bp.inventoryCount ?? 30,
      activeProduction: true,
      unitsSold: 0,
      recentSalesRate: 2,
      adSpend: 0,
      review,
    };

    setBlueprints((prev) => [...prev, finalizedBlueprint]);
    confetti({ particleCount: 50, spread: 70 });

    // Lift press embargo & reveal critic reviews
    setLaunchReviewTarget({
      name: bp.name,
      type: bp.type,
      review,
    });
  };

  // Bid Contract
  const handleBidContract = (contractId: string, bp: Blueprint) => {
    setSuperContracts((prev) =>
      prev.map((c) => {
        if (c.id === contractId) {
          setCompany((prevCo) => ({ ...prevCo, cash: prevCo.cash + c.payout }));
          confetti({ particleCount: 80, spread: 90 });
          return { ...c, status: 'completed' };
        }
        return c;
      })
    );
  };

  // Employee Hiring & Management
  const handleHireEmployee = (role: Employee['role']) => {
    const roleNames: Record<string, string> = {
      role_hw_eng: 'Hardware Engineer',
      role_factory: 'Factory Worker',
      role_sales: 'Sales Representative',
      role_sw_dev: 'Software Developer',
      role_manager: 'Department Manager',
    };
    const fees: Record<string, number> = {
      role_hw_eng: 1500,
      role_factory: 800,
      role_sales: 1000,
      role_sw_dev: 1200,
      role_manager: 2000,
    };
    const salaries: Record<string, number> = {
      role_hw_eng: 2800,
      role_factory: 1800,
      role_sales: 2200,
      role_sw_dev: 2500,
      role_manager: 3500,
    };

    const fee = fees[role] || 1000;
    if (company.cash < fee) return;

    const names = ['Arthur Pendelton', 'Clara Vance', 'David Chen', 'Eleanor Shaw', 'Franklin Cross'];
    const newEmp: Employee = {
      id: `emp_${Date.now()}`,
      name: names[Math.floor(Math.random() * names.length)],
      role,
      roleName: roleNames[role] || 'Staff Specialist',
      skill: Math.floor(Math.random() * 3) + 4, // 4 to 6
      morale: 85,
      salary: salaries[role] || 2000,
      assignment: 'idle',
    };

    setCompany((prev) => ({ ...prev, cash: prev.cash - fee }));
    setEmployees((prev) => [...prev, newEmp]);
  };

  const handleFireEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const handleTrainEmployee = (id: string) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const cost = e.skill * 500;
          if (company.cash >= cost && e.skill < 10) {
            setCompany((prevCo) => ({ ...prevCo, cash: prevCo.cash - cost }));
            return { ...e, skill: e.skill + 1, morale: Math.min(100, e.morale + 5) };
          }
        }
        return e;
      })
    );
  };

  // Valuation Calculation
  const inventoryVal = Object.entries(inventory).reduce((acc, [cId, item]) => {
    const comp = catalogue.find((c) => c.id === cId);
    return acc + (comp ? comp.cost * item.quantity : 0);
  }, 0);

  const valuation = calculateCompanyValuation(
    company,
    employees,
    techTree,
    inventoryVal,
    customParts,
    monthlyRevenue * 12,
    monthlyNetProfit * 12,
    18.5
  );

  // 1. Pre-Game Flow: Authentication Screen
  if (appScreen === 'auth' || !authUser) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. Pre-Game Flow: Main Menu
  if (appScreen === 'main_menu') {
    return (
      <MainMenu
        user={authUser}
        hasActiveGame={hasActiveGame}
        onNewGame={handleStartNewGame}
        onResumeGame={handleResumeGame}
        onLogout={handleLogout}
        isCrtEnabled={isCrtEnabled}
        onToggleCrt={() => setIsCrtEnabled(!isCrtEnabled)}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#080b0f] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      {/* CRT Scanline Overlay */}
      {isCrtEnabled && <div className="crt-overlay absolute inset-0 pointer-events-none z-30" />}

      {/* 5-Step Company Creation Modal */}
      {appScreen === 'wizard' && (
        <CompanyWizardModal onComplete={handleWizardComplete} />
      )}

      {/* Celebratory Tier Fog of War Lifted Modal */}
      {celebrationTier && (
        <TierUnlockModal
          unlockedTier={celebrationTier}
          facilityName={company.facility}
          onAcknowledge={() => setCelebrationTier(null)}
        />
      )}

      {/* Launch Critic Review & Press Embargo Lifted Modal */}
      {launchReviewTarget && (
        <LaunchReviewModal
          productName={launchReviewTarget.name}
          productType={launchReviewTarget.type}
          reviewSummary={launchReviewTarget.review}
          onClose={() => setLaunchReviewTarget(null)}
          onOpenMarketing={() => {
            setLaunchReviewTarget(null);
            setActiveTab('market');
          }}
        />
      )}

      {/* Main Top Header Bar with App Logo & Telemetry */}
      <header className="relative z-20 bg-[#12161f]/95 border-b border-[#30363d] px-3 sm:px-6 py-2.5 sm:py-3 sticky top-0 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
          {/* Left: App Logo & Company Identity */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            <AppLogo size="sm" showText={true} />

            <div className="h-5 w-px bg-[#30363d] hidden sm:block" />

            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-mono font-bold text-gray-200 uppercase truncate max-w-[110px] sm:max-w-none">
                {company.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 font-bold shrink-0">
                {company.currentTier}
              </span>
              <span className="text-[11px] font-mono text-gray-400 hidden lg:inline">
                • {company.facility}
              </span>
            </div>
          </div>

          {/* Right: Telemetry, Speed & Calendar Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 text-xs font-mono">
            {/* Cash Treasury */}
            <div className="bg-[#0b0e14] px-2.5 sm:px-3 py-1 rounded-xl border border-[#2b3547] flex items-center gap-1.5 shadow-inner">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[9px] text-gray-500 block uppercase hidden sm:block">Treasury</span>
                <span className="font-bold text-emerald-400 text-xs sm:text-sm">
                  ${company.cash >= 1000000
                    ? `${(company.cash / 1000000).toFixed(2)}M`
                    : company.cash >= 10000
                    ? `${(company.cash / 1000).toFixed(1)}k`
                    : company.cash.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            {/* Valuation (Hidden on small mobile) */}
            <div className="bg-[#0b0e14] px-3 py-1 rounded-xl border border-[#2b3547] hidden md:block shadow-inner">
              <span className="text-[9px] text-gray-500 block uppercase">Valuation</span>
              <span className="font-bold text-white text-xs sm:text-sm">
                ${valuation.totalValuation >= 1000000
                  ? `${(valuation.totalValuation / 1000000).toFixed(2)}M`
                  : valuation.totalValuation.toLocaleString()}
              </span>
            </div>

            {/* Calendar & Simulation Time Controls */}
            <div className="bg-[#0b0e14] px-2.5 sm:px-3 py-1 rounded-xl border border-[#2b3547] flex items-center gap-2 shadow-inner">
              <div>
                <span className="text-[9px] text-gray-500 block uppercase hidden sm:block">Date</span>
                <span className="font-bold text-white text-[11px] sm:text-xs">
                  {gameDate.year}-{String(gameDate.month).padStart(2, '0')}-{String(gameDate.day).padStart(2, '0')}
                </span>
              </div>

              <div className="flex items-center gap-1 border-l border-[#2b3547] pl-1.5 sm:pl-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1 rounded-lg hover:bg-[#1f2633] text-emerald-400 transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center"
                  title={isPlaying ? 'Pause simulation' : 'Resume simulation'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setGameSpeed((prev) => (prev === 1 ? 2 : prev === 2 ? 5 : 1))}
                  className="px-1.5 py-0.5 rounded-lg hover:bg-[#1f2633] text-gray-300 font-mono text-[10px] sm:text-[11px] font-bold transition-colors"
                  title="Toggle simulation speed"
                >
                  {gameSpeed}x
                </button>
              </div>
            </div>

            {/* Menu Button */}
            <button
              onClick={() => {
                setIsPlaying(false);
                setAppScreen('main_menu');
              }}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#161c28] border border-[#30363d] hover:border-emerald-500/50 text-gray-300 hover:text-white transition-all flex items-center gap-1"
              title="Pause & Return to Main Menu"
            >
              <Home className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline text-xs font-bold font-mono">MENU</span>
            </button>
          </div>
        </div>
      </header>

      {/* Primary Navigation Tabs */}
      <nav className="relative z-20 bg-[#12161f] border-b border-[#30363d] px-3 sm:px-6 select-none font-mono">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-1 sm:py-0">
          {[
            { id: 'catalogue', label: `Workshop (${company.currentTier})`, shortLabel: 'Workshop', icon: Wrench },
            { id: 'research', label: 'Research Lab (RP)', shortLabel: 'Research', icon: Lightbulb },
            { id: 'design', label: 'Design Studio & CAD', shortLabel: 'Design', icon: Layers },
            { id: 'supercomputer', label: 'Supercomputer Arrays', shortLabel: 'Supercluster', icon: Server },
            { id: 'market', label: 'Market & Ads', shortLabel: 'Market', icon: BarChart3 },
            { id: 'personnel', label: 'Staff & Labor', shortLabel: 'Staff', icon: Users },
            { id: 'finance', label: 'Valuation & Ledger', shortLabel: 'Ledger', icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`px-3 sm:px-4 py-2 sm:py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 border-b-2 transition-all whitespace-nowrap rounded-t-lg sm:rounded-t-none ${
                  isActive
                    ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-[#1a2130]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Workspace Body */}
      <main className="relative z-10 flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'catalogue' && (
          <BasicCatalogueTab
            catalogue={catalogue}
            inventory={inventory}
            customParts={customParts}
            cash={company.cash}
            currentTier={company.currentTier}
            onOrderProduction={handleOrderProduction}
            onUpdatePartName={handleUpdatePartName}
            onUpdatePartPrice={handleUpdatePartPrice}
          />
        )}

        {activeTab === 'research' && (
          <ResearchLabTab
            techTree={techTree}
            employees={employees}
            currentTier={company.currentTier}
            onAssignResearcher={handleAssignResearcher}
            onUnassignResearcher={handleUnassignResearcher}
            onAdvanceTierFacility={handleAdvanceTierFacility}
            cash={company.cash}
          />
        )}

        {activeTab === 'design' && (
          <DesignStudioTab
            catalogue={catalogue}
            blueprints={blueprints}
            currentTier={company.currentTier}
            onSaveBlueprint={handleSaveBlueprint}
            onNavigateToResearch={() => setActiveTab('research')}
          />
        )}

        {activeTab === 'supercomputer' && (
          <SupercomputerTab
            catalogue={catalogue}
            contracts={superContracts}
            cash={company.cash}
            onBidContract={handleBidContract}
          />
        )}

        {activeTab === 'market' && (
          <MarketIntelTab
            segments={marketSegments}
            competitors={competitors}
            company={company}
            blueprints={blueprints}
            customParts={customParts}
            catalogue={catalogue}
            inventory={inventory}
            onUpdateProductAdSpend={handleUpdateProductAdSpend}
            onUpdateProductPrice={handleUpdateProductPrice}
            onUpdateCompanyAdSpend={(spend) => setCompany((prev) => ({ ...prev, monthlyAdSpend: spend }))}
          />
        )}

        {activeTab === 'personnel' && (
          <PersonnelTab
            employees={employees}
            company={company}
            onHireEmployee={handleHireEmployee}
            onFireEmployee={handleFireEmployee}
            onTrainEmployee={handleTrainEmployee}
          />
        )}

        {activeTab === 'finance' && (
          <FinancialLedgerTab
            valuation={valuation}
            company={company}
            monthlyRevenue={monthlyRevenue}
            monthlyExpenses={monthlyExpenses}
            monthlyNetProfit={monthlyNetProfit}
          />
        )}
      </main>

      {/* Bottom Teletype Historical News Ticker */}
      <NewsTicker newsQueue={newsQueue} currentDate={gameDate} />
    </div>
  );
}
export default App;
