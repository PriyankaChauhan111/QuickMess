/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Pure calculations and business rules for QuickMess Campus Pre-Ordering
 * as defined in the DGU Venture Quest Plan by Priyanka.
 */

export interface UnitEconomicsParams {
  activeCustomers: number;
  purchasesPerCustomer: number;
  feePerOrder: number; // selling price
  variableCostPerOrder: number; // payment gateway, packaging, counter stipend
  monthlyFixedCost: number; // marketing, counter banner, coordination
}

export interface UnitEconomicsResult {
  monthlyOrders: number;
  monthlyRevenue: number;
  variableCosts: number;
  contributionPerSale: number;
  totalContribution: number;
  monthlyFixedCost: number;
  operatingSurplus: number;
  breakEvenOrders: number;
  breakEvenCustomers: number;
  isProfitable: boolean;
}

/**
 * Calculates unit economics and break-even for QuickMess scenarios.
 */
export function calculateUnitEconomics(params: UnitEconomicsParams): UnitEconomicsResult {
  const {
    activeCustomers,
    purchasesPerCustomer,
    feePerOrder,
    variableCostPerOrder,
    monthlyFixedCost,
  } = params;

  const monthlyOrders = Math.round(activeCustomers * purchasesPerCustomer);
  const monthlyRevenue = monthlyOrders * feePerOrder;
  const variableCosts = monthlyOrders * variableCostPerOrder;
  const contributionPerSale = Number((feePerOrder - variableCostPerOrder).toFixed(2));
  const totalContribution = monthlyOrders * contributionPerSale;
  const operatingSurplus = Math.round(totalContribution - monthlyFixedCost);

  // Break-even orders = Fixed Cost / Contribution per sale
  const breakEvenOrders = contributionPerSale > 0 
    ? Math.ceil(monthlyFixedCost / contributionPerSale) 
    : Infinity;

  // Break-even customers = Break-even orders / purchasesPerCustomer
  const breakEvenCustomers = purchasesPerCustomer > 0 && breakEvenOrders !== Infinity
    ? Math.ceil(breakEvenOrders / purchasesPerCustomer)
    : Infinity;

  return {
    monthlyOrders,
    monthlyRevenue,
    variableCosts,
    contributionPerSale,
    totalContribution,
    monthlyFixedCost,
    operatingSurplus,
    breakEvenOrders,
    breakEvenCustomers,
    isProfitable: operatingSurplus >= 0,
  };
}

export interface MarketSizeParams {
  totalPotentialCustomers: number; // TAM customers (e.g. 30,000 Dehradun students)
  serviceableCustomers: number; // SAM customers (e.g. 3,000 DGU hostel students)
  obtainableCustomers: number; // SOM customers (e.g. 300 pilot 1st/2nd yr students)
  annualSpendPerCustomer: number; // e.g. ₹960 (₹8 fee * 12 orders/mo * 10 months)
}

export interface MarketSizeResult {
  tam: number;
  sam: number;
  som: number;
}

export function calculateMarketSize(params: MarketSizeParams): MarketSizeResult {
  return {
    tam: params.totalPotentialCustomers * params.annualSpendPerCustomer,
    sam: params.serviceableCustomers * params.annualSpendPerCustomer,
    som: params.obtainableCustomers * params.annualSpendPerCustomer,
  };
}

export interface DemandForecastInput {
  totalHostelResidents: number;
  votesEatingMess: number;
  votesEatingCanteen: number;
  votesSkippingOrOutside: number;
  preOrdersPlaced: number;
  safetyBufferPercentage?: number; // e.g. 0.08 for 8% unannounced buffer
}

export interface DemandForecastResult {
  totalVotesCast: number;
  projectedMessDiners: number;
  projectedCanteenDiners: number;
  projectedOutsideOrSkipping: number;
  recommendedMealsToCook: number;
  estimatedWasteReductionPercentage: number;
  estimatedKgFoodSaved: number;
}

/**
 * Predicts kitchen batch preparation quantities based on menu poll votes & pre-orders.
 * Normalizes votes and calculates baseline meal count with a sensible buffer.
 */
export function calculateKitchenDemandForecast(input: DemandForecastInput): DemandForecastResult {
  const {
    totalHostelResidents,
    votesEatingMess,
    votesEatingCanteen,
    votesSkippingOrOutside,
    preOrdersPlaced,
    safetyBufferPercentage = 0.08,
  } = input;

  const totalVotesCast = votesEatingMess + votesEatingCanteen + votesSkippingOrOutside;
  
  let messRatio = 0.70; // baseline 70% if no votes
  let canteenRatio = 0.15;
  let skippingRatio = 0.15;

  if (totalVotesCast > 0) {
    messRatio = votesEatingMess / totalVotesCast;
    canteenRatio = votesEatingCanteen / totalVotesCast;
    skippingRatio = votesSkippingOrOutside / totalVotesCast;
  }

  // Projected diners based on resident population
  const rawProjectedMess = Math.round(totalHostelResidents * messRatio);
  const projectedCanteenDiners = Math.round(totalHostelResidents * canteenRatio);
  const projectedOutsideOrSkipping = Math.round(totalHostelResidents * skippingRatio);

  // Kitchen should ensure at least all preOrders are fulfilled plus a buffered projection
  const bufferMeals = Math.round(rawProjectedMess * safetyBufferPercentage);
  const recommendedMealsToCook = Math.max(preOrdersPlaced, rawProjectedMess + bufferMeals);

  // Conventional mess cooking assumption: cook for 100% of residents (which causes ~20-30% waste)
  const conventionalCookedMeals = Math.round(totalHostelResidents * 0.95);
  const savedMeals = Math.max(0, conventionalCookedMeals - recommendedMealsToCook);
  const estimatedWasteReductionPercentage = Math.round((savedMeals / conventionalCookedMeals) * 100);
  
  // Average meal portion ~ 450g (0.45kg)
  const estimatedKgFoodSaved = Math.round(savedMeals * 0.45);

  return {
    totalVotesCast,
    projectedMessDiners: rawProjectedMess,
    projectedCanteenDiners,
    projectedOutsideOrSkipping,
    recommendedMealsToCook,
    estimatedWasteReductionPercentage,
    estimatedKgFoodSaved,
  };
}

/**
 * Checks if a time slot can accept more orders.
 */
export function isSlotAvailable(currentBookings: number, slotCapacity: number = 25): boolean {
  return currentBookings < slotCapacity;
}

/**
 * Estimates wait time saved for a student given queue length.
 * In DGU Venture plan: average normal queue takes 15-25 minutes, express pickup takes < 3 minutes.
 */
export function calculateTimeSaved(normalWaitMinutes: number = 20, pickupWaitMinutes: number = 3): number {
  return Math.max(0, normalWaitMinutes - pickupWaitMinutes);
}
