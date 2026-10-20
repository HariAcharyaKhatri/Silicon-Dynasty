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
} from './types/game';
import { calculateCompanyValuation } from './utils/valuationEngine';
import { AppLogo } from './components/AppLogo';
import { AuthScreen, AuthUser } from './components/AuthScreen';
import { MainMenu } from './components/MainMenu';
import { CompanyWizardModal } from './components/CompanyWizardModal';
import { TierUnlockModal } from './components/TierUnlockModal';
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

    // Register initial custom named part
    setCustomParts({
      t0_power_cable: {
        customName: setup.initialPartName,
        componentId: 't0_power_cable',
        unitsSold: 0,
        reputation: 50,
        pricePremiumPct: 0,
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

  // Daily Tick handler
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
    const adSpend = company.monthlyAdSpend || 0;
    const totalExpenses = rent + payroll + adSpend;

    // 2. Sales execution from inventory
    let totalSalesRev = 0;
    setInventory((prevInv) => {
      const updated = { ...prevInv };

      Object.keys(updated).forEach((compId) => {
        const item = updated[compId];
        if (item.quantity > 0) {
          const comp = catalogue.find((c) => c.id === compId);
          if (comp) {
            // Calculate demand
            const adBonus = 1 + (adSpend / 10000) * 0.15;
            const outsiderBonus = company.background === 'bg_outsider' ? 1.15 : 1.0;
            const monthlySellRate = Math.min(
              item.quantity,
              Math.max(10, Math.round(50 * adBonus * outsiderBonus))
            );

            item.quantity -= monthlySellRate;
            const price = comp.basePrice;
            totalSalesRev += monthlySellRate * price;

            // Update part reputation & units sold
            setCustomParts((prevParts) => {
              const current = prevParts[compId] || {
                customName: comp.name,
                componentId: compId,
                unitsSold: 0,
                reputation: 50,
                pricePremiumPct: 0,
              };
              const newSold = current.unitsSold + monthlySellRate;
              const newRep = Math.min(100, current.reputation + 0.2);
              const pricePremium = Math.round((newRep / 10) * 0.5 * 10) / 10;
              return {
                ...prevParts,
                [compId]: {
                  ...current,
                  unitsSold: newSold,
                  reputation: newRep,
                  pricePremiumPct: pricePremium,
                },
              };
            });
          }
        }
      });

      return updated;
    });

    const net = totalSalesRev - totalExpenses;
    setMonthlyRevenue(totalSalesRev);
    setMonthlyExpenses(totalExpenses);
    setMonthlyNetProfit(net);

    // Update Company balance & brand metrics
    setCompany((prev) => ({
      ...prev,
      cash: prev.cash + net,
      brandAwareness: Math.min(100, prev.brandAwareness + (adSpend > 0 ? 0.8 : 0.2)),
      popularity: Math.min(100, Math.max(10, prev.popularity * 0.95 + (totalSalesRev > 0 ? 2 : 0))),
    }));

    // Trigger historical news anchors if date matches
    setNewsQueue((prevQueue) =>
      prevQueue.map((anchor) => {
        if (!anchor.fired && gameDate.year >= 1952) {
          return { ...anchor, fired: true };
        }
        return anchor;
      })
    );
  };

  // Order production of components
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

  // Update selling price
  const handleUpdatePartPrice = (componentId: string, price: number) => {
    setCatalogue((prev) =>
      prev.map((c) => (c.id === componentId ? { ...c, basePrice: price } : c))
    );
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

  // Save Computer Blueprint
  const handleSaveBlueprint = (bp: Blueprint) => {
    setBlueprints((prev) => [...prev, bp]);
    confetti({ particleCount: 30, spread: 50 });
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

      {/* Main Top Header Bar with App Logo & Telemetry */}
      <header className="relative z-20 bg-[#12161f] border-b border-[#30363d] px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 backdrop-blur-md">
        <div className="flex items-center gap-4">
          {/* Main App Logo in top-left */}
          <AppLogo size="sm" showText={true} />

          <div className="h-6 w-px bg-[#30363d] hidden sm:block" />

          {/* Company & Facility info */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-gray-200 uppercase">{company.name}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 font-bold">
              {company.currentTier}
            </span>
            <span className="text-[11px] font-mono text-gray-400 hidden md:inline">
              • {company.facility}
            </span>
          </div>
        </div>

        {/* Financial & Time Controls */}
        <div className="flex items-center gap-4 text-xs font-mono">
          {/* Treasury */}
          <div className="bg-[#0b0e14] px-3.5 py-1.5 rounded-xl border border-[#2b3547] flex items-center gap-2 shadow-inner">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-gray-500 block uppercase">Cash Treasury</span>
              <span className="font-bold text-emerald-400 text-sm">
                ${company.cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Valuation */}
          <div className="bg-[#0b0e14] px-3.5 py-1.5 rounded-xl border border-[#2b3547] hidden lg:block shadow-inner">
            <span className="text-[10px] text-gray-500 block uppercase">Valuation</span>
            <span className="font-bold text-white text-sm">
              ${valuation.totalValuation.toLocaleString()}
            </span>
          </div>

          {/* Time & Calendar Controls */}
          <div className="bg-[#0b0e14] px-3.5 py-1.5 rounded-xl border border-[#2b3547] flex items-center gap-3 shadow-inner">
            <div>
              <span className="text-[10px] text-gray-500 block uppercase">Calendar</span>
              <span className="font-bold text-white text-sm">
                {gameDate.year}-{String(gameDate.month).padStart(2, '0')}-{String(gameDate.day).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-1 border-l border-[#2b3547] pl-2.5">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 rounded-lg hover:bg-[#1f2633] text-emerald-400 transition-colors"
                title={isPlaying ? 'Pause simulation' : 'Resume simulation'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setGameSpeed((prev) => (prev === 1 ? 2 : prev === 2 ? 5 : 1))}
                className="p-1 rounded-lg hover:bg-[#1f2633] text-gray-300 font-mono text-[11px] font-bold transition-colors"
                title="Toggle simulation speed"
              >
                {gameSpeed}x
              </button>
            </div>
          </div>

          {/* Return to Main Menu Button */}
          <button
            onClick={() => {
              setIsPlaying(false);
              setAppScreen('main_menu');
            }}
            className="p-2 rounded-xl bg-[#161c28] border border-[#30363d] hover:border-emerald-500/50 text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
            title="Pause & Return to Main Menu"
          >
            <Home className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline text-xs font-bold font-mono">MENU</span>
          </button>
        </div>
      </header>

      {/* Primary Navigation Tabs */}
      <nav className="relative z-20 bg-[#12161f] border-b border-[#30363d] px-6 flex items-center gap-1 overflow-x-auto select-none font-mono">
        {[
          { id: 'catalogue', label: `Workshop Catalogue (${company.currentTier})`, icon: Wrench },
          { id: 'research', label: 'Research Lab (RP)', icon: Lightbulb },
          { id: 'design', label: 'Design Studio & CAD', icon: Layers },
          { id: 'supercomputer', label: 'Supercomputer Arrays', icon: Server },
          { id: 'market', label: 'Market & Advertising', icon: BarChart3 },
          { id: 'personnel', label: 'Personnel & Labor', icon: Users },
          { id: 'finance', label: 'Valuation & Ledger', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-[#1a2130]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Main Workspace Body */}
      <main className="relative z-10 flex-1 p-6 max-w-7xl mx-auto w-full">
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
            onUpdateAdSpend={(spend) => setCompany((prev) => ({ ...prev, monthlyAdSpend: spend }))}
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
