import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateUnitEconomics,
  calculateMarketSize,
  calculateKitchenDemandForecast,
  isSlotAvailable,
  calculateTimeSaved,
} from './quickmess.js';

test('Base Scenario matches Mission 7 in DGU Venture Quest', () => {
  // Base scenario: 300 customers, 12 purchases/customer, selling price ₹8, var cost ₹2, fixed cost ₹6000
  const base = calculateUnitEconomics({
    activeCustomers: 300,
    purchasesPerCustomer: 12,
    feePerOrder: 8,
    variableCostPerOrder: 2,
    monthlyFixedCost: 6000,
  });

  assert.equal(base.monthlyOrders, 3600);
  assert.equal(base.monthlyRevenue, 28800);
  assert.equal(base.contributionPerSale, 6);
  assert.equal(base.totalContribution, 21600);
  assert.equal(base.operatingSurplus, 15600);
  assert.equal(base.breakEvenOrders, 1000); // 6000 / 6 = 1000 orders
  assert.equal(base.breakEvenCustomers, 84); // 1000 / 12 = 83.33 -> 84 students
  assert.equal(base.isProfitable, true);
});

test('Ambitious Scenario matches Mission 7 in DGU Venture Quest', () => {
  // Ambitious: 800 customers, 15 purchases/customer, ₹10 fee, var cost ₹2.5, fixed cost ₹12000
  const ambitious = calculateUnitEconomics({
    activeCustomers: 800,
    purchasesPerCustomer: 15,
    feePerOrder: 10,
    variableCostPerOrder: 2.5,
    monthlyFixedCost: 12000,
  });

  assert.equal(ambitious.monthlyOrders, 12000);
  assert.equal(ambitious.monthlyRevenue, 120000);
  assert.equal(ambitious.contributionPerSale, 7.5);
  assert.equal(ambitious.totalContribution, 90000);
  assert.equal(ambitious.operatingSurplus, 78000);
  assert.equal(ambitious.isProfitable, true);
});

test('Conservative Scenario matches Mission 7 in DGU Venture Quest', () => {
  // Conservative: 100 customers, 8 purchases/customer, ₹6 fee, var cost ₹2, fixed cost ₹6000
  const conservative = calculateUnitEconomics({
    activeCustomers: 100,
    purchasesPerCustomer: 8,
    feePerOrder: 6,
    variableCostPerOrder: 2,
    monthlyFixedCost: 6000,
  });

  assert.equal(conservative.monthlyOrders, 800);
  assert.equal(conservative.monthlyRevenue, 4800);
  assert.equal(conservative.contributionPerSale, 4);
  assert.equal(conservative.totalContribution, 3200);
  assert.equal(conservative.operatingSurplus, -2800); // small loss ₹2,800
  assert.equal(conservative.isProfitable, false);
});

test('TAM, SAM, SOM calculation matches Mission 8', () => {
  // TAM: 30000 * 960 = 2,88,00,000 (INR 2.88 Cr)
  // SAM: 3000 * 960 = 28,80,000 (INR 28.8 Lakh)
  // SOM: 300 * 960 = 2,88,000 (INR 2.88 Lakh)
  const market = calculateMarketSize({
    totalPotentialCustomers: 30000,
    serviceableCustomers: 3000,
    obtainableCustomers: 300,
    annualSpendPerCustomer: 960,
  });

  assert.equal(market.tam, 28800000);
  assert.equal(market.sam, 2880000);
  assert.equal(market.som, 288000);
});

test('Kitchen Demand Forecasting predicts headcount and food waste reduction', () => {
  const forecast = calculateKitchenDemandForecast({
    totalHostelResidents: 500,
    votesEatingMess: 280,
    votesEatingCanteen: 70,
    votesSkippingOrOutside: 50,
    preOrdersPlaced: 65,
    safetyBufferPercentage: 0.08,
  });

  assert.ok(forecast.totalVotesCast === 400);
  assert.ok(forecast.projectedMessDiners > 0);
  assert.ok(forecast.recommendedMealsToCook >= forecast.projectedMessDiners);
  assert.ok(forecast.estimatedKgFoodSaved > 0);
});

test('Time saved calculation correctly compares normal queue vs pickup', () => {
  assert.equal(calculateTimeSaved(20, 3), 17);
  assert.equal(calculateTimeSaved(15, 2), 13);
  assert.equal(isSlotAvailable(10, 25), true);
  assert.equal(isSlotAvailable(25, 25), false);
});
