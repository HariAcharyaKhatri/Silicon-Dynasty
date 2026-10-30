import { Blueprint, ComponentItem, CriticReview, ProductReviewSummary, GameDate } from '../types/game';

interface ReviewInput {
  name: string;
  type: 'pc' | 'component' | 'supercomputer';
  tier: string;
  totalCost: number;
  sellingPrice: number;
  reliability: number; // 0.0 - 1.0
  appealScore?: number;
  components?: ComponentItem[];
  currentYear: number;
}

export function generateProductReview(input: ReviewInput): ProductReviewSummary {
  const { name, type, tier, totalCost, sellingPrice, reliability, appealScore = 75, currentYear } = input;

  // 1. Value for Money calculation (Price to cost ratio)
  const markupRatio = sellingPrice / Math.max(1, totalCost);
  let valueScore = 7;
  let valueVerdict = 'Fairly priced';
  if (markupRatio <= 1.5) {
    valueScore = 9.5;
    valueVerdict = 'Unbeatable value for performance';
  } else if (markupRatio <= 2.2) {
    valueScore = 8.5;
    valueVerdict = 'Very competitive retail price point';
  } else if (markupRatio <= 3.0) {
    valueScore = 7.0;
    valueVerdict = 'Fairly priced for early adopters';
  } else if (markupRatio <= 4.2) {
    valueScore = 5.2;
    valueVerdict = 'Noticeable pricing premium';
  } else {
    valueScore = 3.5;
    valueVerdict = 'Exorbitantly overpriced for what it delivers';
  }

  // 2. Reliability & Build Quality Score
  const relPct = Math.round(reliability * 100);
  let reliabilityScore = 7;
  let relVerdict = 'Standard engineering durability';
  if (relPct >= 96) {
    reliabilityScore = 9.8;
    relVerdict = 'Industrial-grade solder and rock-solid endurance';
  } else if (relPct >= 90) {
    reliabilityScore = 8.6;
    relVerdict = 'High manufacturing tolerance with minimal defect risk';
  } else if (relPct >= 80) {
    reliabilityScore = 7.0;
    relVerdict = 'Decent daily durability under normal loads';
  } else if (relPct >= 65) {
    reliabilityScore = 5.0;
    relVerdict = 'Prone to component fatigue and thermal throttling';
  } else {
    reliabilityScore = 3.2;
    relVerdict = 'Frequent hardware failures reported during burn-in testing';
  }

  // 3. Performance / Technical Competence
  let performanceScore = Math.min(10, Math.max(4, Math.round((appealScore / 10) * 10) / 10));

  // 4. Overall Weighted Score
  const rawScore = performanceScore * 0.4 + reliabilityScore * 0.35 + valueScore * 0.25;
  const overallScore = Math.round(Math.min(10, Math.max(2.5, rawScore)) * 10) / 10;

  // Badge & Sales Multiplier determination
  let badge: ProductReviewSummary['badge'] = 'Average';
  let salesMultiplier = 1.0;

  if (overallScore >= 9.0) {
    badge = 'Exceptional';
    salesMultiplier = 1.55; // +55% sales boost
  } else if (overallScore >= 8.0) {
    badge = "Editor's Choice";
    salesMultiplier = 1.35; // +35% sales boost
  } else if (overallScore >= 7.0) {
    badge = 'Strong Contender';
    salesMultiplier = 1.15; // +15% sales boost
  } else if (overallScore >= 5.5) {
    badge = 'Average';
    salesMultiplier = 1.0; // Normal baseline
  } else if (valueScore < 5.0) {
    badge = 'Overpriced';
    salesMultiplier = 0.75; // -25% penalty
  } else {
    badge = 'Unreliable';
    salesMultiplier = 0.65; // -35% penalty
  }

  // 5. Select Era-Themed Publications & Critics
  let publications: Array<{ pub: string; reviewer: string }> = [];

  if (currentYear < 1970) {
    publications = [
      { pub: 'The Industrial Computing Gazette', reviewer: 'Arthur Vance, Senior Tech Editor' },
      { pub: 'Vacuum & Pulse Weekly', reviewer: 'Evelyn Reed, Hardware Benchmarks' },
      { pub: 'Office Automation Journal', reviewer: 'Walter Sterling, Enterprise Analyst' },
    ];
  } else if (currentYear < 1995) {
    publications = [
      { pub: 'Byte & Circuit Monthly', reviewer: 'Marcus Flynn, Lead Hardware Architect' },
      { pub: 'Silicon Valley Chronicle', reviewer: 'Diane Kowalski, Systems Testing' },
      { pub: 'Personal Computer Gazette', reviewer: 'Gordon Wright, Retail Desk' },
    ];
  } else if (currentYear < 2015) {
    publications = [
      { pub: 'PC Power & Architecture Labs', reviewer: 'Julian Vance, Hardware Analyst' },
      { pub: 'Maximum Silicon Digest', reviewer: 'Clara Mercer, Performance Benchmarking' },
      { pub: 'TechBench Global', reviewer: 'Dmitri Rostov, Systems Reviewer' },
    ];
  } else {
    publications = [
      { pub: 'Quantum & Cloud Architecture Review', reviewer: 'Dr. Aris Thorne, Fellow Analyst' },
      { pub: 'NextGen Silicon Matrix', reviewer: 'Sora Tanaka, Systems Testing Lead' },
      { pub: 'The Modern Hardware Vanguard', reviewer: 'Elena Rostova, Chief Editor' },
    ];
  }

  // Generate 3 Contextual Critic Quotes
  const reviews: CriticReview[] = [
    {
      publication: publications[0].pub,
      reviewer: publications[0].reviewer,
      score: Math.min(10, Math.max(3, Math.round((overallScore + (Math.random() * 0.6 - 0.3)) * 10) / 10)),
      verdict: overallScore >= 7.5 ? 'Highly Recommended' : 'Promising but flawed',
      comment:
        overallScore >= 8.0
          ? `The ${name} sets a new high-water mark for ${tier} architecture. ${relVerdict}, paired with ${valueVerdict.toLowerCase()}. An unquestionable buy for enthusiasts and commercial outfits alike.`
          : overallScore >= 6.0
          ? `A solid, competent release with the ${name}. It manages ${relVerdict.toLowerCase()}, though buyers should carefully weigh if the price matches their specific workflow needs.`
          : `While we admire the ambition of the ${name}, it is held back by ${relVerdict.toLowerCase()} and ${valueVerdict.toLowerCase()}. Wait for price cuts or hardware revisions.`,
      highlight: overallScore >= 7.5 ? 'positive' : overallScore >= 6.0 ? 'neutral' : 'critical',
    },
    {
      publication: publications[1].pub,
      reviewer: publications[1].reviewer,
      score: Math.min(10, Math.max(3, Math.round((overallScore + (Math.random() * 0.8 - 0.4)) * 10) / 10)),
      verdict: valueScore >= 7.5 ? 'Great Value' : 'Cost Concern',
      comment:
        valueScore >= 7.5
          ? `On the test bench, the ${name} delivered tremendous bang-for-buck. At $${sellingPrice.toLocaleString()}, you are receiving exceptional engineering without paying a bloated corporate tax.`
          : `Priced at $${sellingPrice.toLocaleString()}, the unit margin feels steep. Competitors will quickly exploit this window unless retail discounts or bundled software soften the landing.`,
      highlight: valueScore >= 7.0 ? 'positive' : 'critical',
    },
    {
      publication: publications[2].pub,
      reviewer: publications[2].reviewer,
      score: Math.min(10, Math.max(3, Math.round((overallScore + (Math.random() * 0.6 - 0.3)) * 10) / 10)),
      verdict: reliabilityScore >= 7.5 ? 'Rock Solid' : 'Quality Scrutiny',
      comment:
        reliabilityScore >= 8.0
          ? `Our 72-hour stress-test cycle revealed zero thermal anomalies or dropped bus cycles. The fabrication tolerances in this ${tier} hardware indicate a manufacturer that cares about long-term survival.`
          : `Our bench tests encountered intermittent hiccups under heavy peak power draws. Ensure adequate ventilation and proper surge stabilization when deploying the ${name}.`,
      highlight: reliabilityScore >= 7.5 ? 'positive' : 'critical',
    },
  ];

  return {
    overallScore,
    performanceScore,
    reliabilityScore,
    valueScore,
    badge,
    salesMultiplier,
    date: `${currentYear}`,
    reviews,
  };
}

export const AD_OPTIONS: Array<{
  id: string;
  name: string;
  monthlyCost: number;
  appealBoostPct: number;
  description: string;
  badge: string;
}> = [
  {
    id: 'ad_none',
    name: 'Word of Mouth Only',
    monthlyCost: 0,
    appealBoostPct: 0,
    description: 'Rely solely on existing customer satisfaction and organic tech community recommendations.',
    badge: 'FREE',
  },
  {
    id: 'ad_local_flyer',
    name: 'Local Tech Circulars & Classifieds',
    monthlyCost: 50,
    appealBoostPct: 15,
    description: 'Bi-weekly flyers distributed in local hobby shops, electronics clubs, and university bulletin boards.',
    badge: '+$50/mo',
  },
  {
    id: 'ad_tech_journal',
    name: 'Tech Magazine Full-Page Spread',
    monthlyCost: 200,
    appealBoostPct: 35,
    description: 'Prominent glossy color spread in national computing publications with technical spec breakdowns.',
    badge: '+$200/mo',
  },
  {
    id: 'ad_radio_mail',
    name: 'Direct Mail Catalogues & Radio Spot',
    monthlyCost: 600,
    appealBoostPct: 65,
    description: 'Targeted mail-order brochures sent to corporate offices paired with regional drive-time radio ads.',
    badge: '+$600/mo',
  },
  {
    id: 'ad_prime_blitz',
    name: 'Nationwide Teletype & Billboard Blitz',
    monthlyCost: 1500,
    appealBoostPct: 110,
    description: 'High-impact metropolitan billboards, industrial trade show exhibits, and prime media coverage.',
    badge: '+$1,500/mo',
  },
];
