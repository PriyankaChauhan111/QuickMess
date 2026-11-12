/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Calculator,
  Compass,
  Calendar,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { VENTURE_MISSIONS, VALIDATION_EXPERIMENTS } from '../data/mockData';
import { calculateUnitEconomics } from '../utils/quickmess';

export const VentureView: React.FC = () => {
  const [selectedMissionIndex, setSelectedMissionIndex] = useState<number>(0);

  // Financial modeler interactive state initialized to Mission 7 Base Scenario
  const [customers, setCustomers] = useState<number>(300);
  const [purchasesPerCustomer, setPurchasesPerCustomer] = useState<number>(12);
  const [feePerOrder, setFeePerOrder] = useState<number>(8);
  const [variableCost, setVariableCost] = useState<number>(2);
  const [fixedCost, setFixedCost] = useState<number>(6000);

  const econ = calculateUnitEconomics({
    activeCustomers: customers,
    purchasesPerCustomer,
    feePerOrder,
    variableCostPerOrder: variableCost,
    monthlyFixedCost: fixedCost,
  });

  const applyScenarioPreset = (preset: 'base' | 'ambitious' | 'conservative') => {
    if (preset === 'base') {
      setCustomers(300);
      setPurchasesPerCustomer(12);
      setFeePerOrder(8);
      setVariableCost(2);
      setFixedCost(6000);
    } else if (preset === 'ambitious') {
      setCustomers(800);
      setPurchasesPerCustomer(15);
      setFeePerOrder(10);
      setVariableCost(2.5);
      setFixedCost(12000);
    } else if (preset === 'conservative') {
      setCustomers(100);
      setPurchasesPerCustomer(8);
      setFeePerOrder(6);
      setVariableCost(2);
      setFixedCost(6000);
    }
  };

  const activeMission = VENTURE_MISSIONS[selectedMissionIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Venture Plan Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-600" />
              DGU Venture Quest · Complete Venture Plan
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              QuickMess: Campus Pre-Ordering Platform
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Submitted for <span className="font-semibold text-stone-800">Entrepreneurship & Innovation</span> at DBS Global University (DGU), Dehradun.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs">
            <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl">
              <span className="text-stone-500 block">Student Author</span>
              <span className="font-bold text-stone-900">Priyanka (DGU Student)</span>
              <span className="text-stone-500 block text-[11px] font-mono">priyanka.0251mba353@dgu.ac.in</span>
            </div>
            <a
              href="/public/assets/aistudio/priyanka.0251mba353_dgu.ac.in_1894e95c.pdf"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Original PDF</span>
            </a>
          </div>
        </div>

        {/* Quick Nav Strip of all 12 Missions */}
        <div className="pt-4 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {VENTURE_MISSIONS.map((m, idx) => (
            <button
              key={m.missionNumber}
              type="button"
              onClick={() => setSelectedMissionIndex(idx)}
              className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-all cursor-pointer font-medium ${
                selectedMissionIndex === idx
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              M{m.missionNumber}: {m.title.split('&')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Mission Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4 mb-5">
          <div>
            <span className="text-xs font-mono font-bold text-amber-700 uppercase">
              MISSION {activeMission.missionNumber}
            </span>
            <h2 className="text-xl font-extrabold text-stone-900 mt-0.5">
              {activeMission.title}
            </h2>
            <p className="text-xs text-stone-500">{activeMission.subtitle}</p>
          </div>
          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-lg font-medium self-start sm:self-auto">
            {activeMission.summary}
          </span>
        </div>

        {/* Key Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {activeMission.keyPoints.map((kp, i) => (
            <div key={i} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
              <span className="font-bold text-stone-900 block mb-1">{kp.label}</span>
              <p className="text-stone-600 leading-relaxed">{kp.value}</p>
            </div>
          ))}
        </div>

        <div className="text-xs text-stone-700 bg-amber-50/50 p-4 rounded-xl border border-amber-100 leading-relaxed">
          <span className="font-bold text-stone-900 block mb-1">Detailed Field Rationale:</span>
          {activeMission.details}
        </div>
      </div>

      {/* Interactive Unit Economics Simulator (Mission 7) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-amber-600" />
              Mission 7 · Interactive Unit Economics Simulator
            </div>
            <h2 className="text-lg font-bold text-stone-900 mt-1">
              QuickMess Revenue, Cost & Break-Even Modeler
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Test Priyanka's Base, Ambitious, and Conservative pilot scenarios or customize sliders below.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => applyScenarioPreset('base')}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Base (300 users)
            </button>
            <button
              type="button"
              onClick={() => applyScenarioPreset('ambitious')}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Ambitious (800)
            </button>
            <button
              type="button"
              onClick={() => applyScenarioPreset('conservative')}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Conservative (100)
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-xs">
          <div>
            <div className="flex justify-between font-semibold text-stone-800 mb-1.5">
              <span>Active Students</span>
              <span className="font-mono tabular-nums">{customers} users</span>
            </div>
            <input
              type="range"
              min="50"
              max="1500"
              step="25"
              value={customers}
              onChange={(e) => setCustomers(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[11px] text-stone-500">DGU hostel residents adopting service</span>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-stone-800 mb-1.5">
              <span>Orders per Month / User</span>
              <span className="font-mono tabular-nums">{purchasesPerCustomer} orders</span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              step="1"
              value={purchasesPerCustomer}
              onChange={(e) => setPurchasesPerCustomer(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[11px] text-stone-500">~3 lunch pre-orders per weekday</span>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-stone-800 mb-1.5">
              <span>Convenience Fee / Order</span>
              <span className="font-mono tabular-nums">₹{feePerOrder}</span>
            </div>
            <input
              type="range"
              min="5"
              max="15"
              step="1"
              value={feePerOrder}
              onChange={(e) => setFeePerOrder(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[11px] text-stone-500">Far below ₹150 outside delivery cost</span>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-stone-800 mb-1.5">
              <span>Variable Cost / Order</span>
              <span className="font-mono tabular-nums">₹{variableCost}</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="0.5"
              value={variableCost}
              onChange={(e) => setVariableCost(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[11px] text-stone-500">Packaging sticker, UPI processing</span>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-stone-800 mb-1.5">
              <span>Monthly Fixed Costs</span>
              <span className="font-mono tabular-nums">₹{fixedCost}</span>
            </div>
            <input
              type="range"
              min="2000"
              max="20000"
              step="1000"
              value={fixedCost}
              onChange={(e) => setFixedCost(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[11px] text-stone-500">Counter staff stipend, banners, flyers</span>
          </div>
        </div>

        {/* Calculated Financial Output */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
          <div>
            <span className="text-stone-500">Monthly Volume</span>
            <div className="text-xl font-black text-stone-900 font-mono tabular-nums mt-0.5">
              {econ.monthlyOrders.toLocaleString()} orders
            </div>
            <span className="text-[11px] text-stone-500">Across lunch break slots</span>
          </div>

          <div>
            <span className="text-stone-500">Monthly Gross Revenue</span>
            <div className="text-xl font-black text-stone-900 font-mono tabular-nums mt-0.5">
              ₹{econ.monthlyRevenue.toLocaleString()}
            </div>
            <span className="text-[11px] text-stone-500">₹{econ.contributionPerSale.toFixed(2)} contribution/order</span>
          </div>

          <div>
            <span className="text-stone-500">Operating Surplus / (Loss)</span>
            <div
              className={`text-xl font-black font-mono tabular-nums mt-0.5 ${
                econ.operatingSurplus >= 0 ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {econ.operatingSurplus >= 0 ? '+' : ''}₹{econ.operatingSurplus.toLocaleString()}
            </div>
            <span className="text-[11px] text-stone-500">
              {econ.operatingSurplus >= 0 ? 'Profitable surplus' : 'Pilot subsidy needed'}
            </span>
          </div>

          <div>
            <span className="text-stone-500">Break-Even Threshold</span>
            <div className="text-xl font-black text-amber-700 font-mono tabular-nums mt-0.5">
              {econ.breakEvenOrders.toLocaleString()} orders
            </div>
            <span className="text-[11px] text-stone-500">~{econ.breakEvenCustomers} active students</span>
          </div>
        </div>
      </div>

      {/* Competitor Battlefield 2x2 Matrix & Positioning (Mission 5 & 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-600" />
              Missions 5 & 6 · Competitor Battlefield
            </div>
            <h2 className="text-lg font-bold text-stone-900 mt-1">
              Positioning Map: Convenience vs Affordability
            </h2>
            <p className="text-xs text-stone-500 mt-0.5 mb-6">
              QuickMess combines hostel affordability with delivery-app speed.
            </p>

            {/* 2x2 Grid Visualization */}
            <div className="relative w-full aspect-4/3 bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col justify-between">
              {/* Grid axes labels */}
              <div className="text-[11px] font-bold text-stone-500 text-center">
                ↑ HIGH AFFORDABILITY (Free / Low Cost)
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold text-stone-500">
                <span>← LOW CONVENIENCE (Long Queues)</span>
                <span>HIGH CONVENIENCE (Instant Pickup) →</span>
              </div>
              <div className="text-[11px] font-bold text-stone-500 text-center">
                ↓ LOW AFFORDABILITY (₹150-300+ extra)
              </div>

              {/* Competitor Markers positioned by Axis X and Y scores from PDF */}
              {/* Item 1: Standing in mess queue: X:3, Y:9 */}
              <div
                style={{ left: '25%', top: '15%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 bg-stone-700 text-white text-[11px] px-2.5 py-1 rounded-md shadow-xs text-center"
              >
                <div className="font-bold">Mess Queue</div>
                <div className="text-[9px] opacity-80">Free / 20m wait</div>
              </div>

              {/* Item 2: Outside Delivery (Zomato/Swiggy): X:6, Y:3 */}
              <div
                style={{ left: '60%', top: '75%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 bg-rose-600 text-white text-[11px] px-2.5 py-1 rounded-md shadow-xs text-center"
              >
                <div className="font-bold">Zomato / Swiggy</div>
                <div className="text-[9px] opacity-80">₹150-300 / 40m gate wait</div>
              </div>

              {/* Item 3: Nearby Snacks Stalls: X:7, Y:6 */}
              <div
                style={{ left: '70%', top: '42%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 bg-amber-700 text-white text-[11px] px-2.5 py-1 rounded-md shadow-xs text-center"
              >
                <div className="font-bold">Maggi & Snack Stalls</div>
                <div className="text-[9px] opacity-80">Cheap snacks / Crowded</div>
              </div>

              {/* QuickMess: X:9, Y:8 (Sweet Spot) */}
              <div
                style={{ left: '84%', top: '22%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 bg-emerald-600 text-white text-[11px] px-3 py-1.5 rounded-lg shadow-md ring-4 ring-emerald-100 text-center animate-pulse"
              >
                <div className="font-extrabold flex items-center gap-1 justify-center">
                  <Sparkles className="w-3 h-3" /> QuickMess
                </div>
                <div className="text-[10px] text-emerald-100">₹8 fee / 2m pickup</div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-stone-500 mt-4 leading-relaxed">
            <span className="font-semibold text-stone-800">Desired Association:</span> "The fastest way to eat a proper campus meal" — zero delivery fees, zero line-standing, supporting hostel meal plans.
          </p>
        </div>

        {/* Market Size & Demand (Mission 8) */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              Mission 8 · Market Sizing (TAM / SAM / SOM)
            </div>
            <h2 className="text-lg font-bold text-stone-900 mt-1">
              Campus Market Potential in Dehradun
            </h2>
            <p className="text-xs text-stone-500 mt-0.5 mb-6">
              Calculated using ₹960 annual spend per student (₹8 fee * 12 orders/mo * 10 academic months).
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-stone-900">TAM (Total Addressable Market)</span>
                  <span className="font-mono font-extrabold text-stone-900 text-sm">₹2,88,00,000 (₹2.88 Cr)</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  30,000 hostel & PG college students across Dehradun's major residential universities (DGU, UPES, Graphic Era, DIT).
                </p>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-950">SAM (Serviceable Addressable Market)</span>
                  <span className="font-mono font-extrabold text-amber-900 text-sm">₹28,80,000 (₹28.8 Lakh)</span>
                </div>
                <p className="text-[11px] text-amber-800 mt-1">
                  3,000 hostel-resident undergraduate students living on DGU campus eating daily at mess and canteens.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-950">SOM (Serviceable Obtainable Market)</span>
                  <span className="font-mono font-extrabold text-emerald-900 text-sm">₹2,88,000 (₹2.88 Lakh)</span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-1">
                  300 beachhead students (10% of DGU, one hostel block) targeted in initial pilot phase.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Annual Spend Assumption: ₹960/student</span>
            <span className="font-semibold text-stone-700">10-Month Academic Year</span>
          </div>
        </div>
      </div>

      {/* 30-Day Validation Experiment Tracker (Mission 11 & 12) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-600" />
              Missions 11 & 12 · 30-Day Validation Experiment
            </div>
            <h2 className="text-lg font-bold text-stone-900 mt-1">
              Field Experiment Execution & Warden Review
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Testing the 3 core assumptions before capital expenditure or software deployment.
            </p>
          </div>
          <span className="text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg font-medium self-start sm:self-auto">
            Progress: Week 3 Live Run
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {VALIDATION_EXPERIMENTS.map((exp, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                exp.status === 'completed'
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : exp.status === 'in-progress'
                  ? 'border-amber-300 bg-amber-50/60 ring-2 ring-amber-100'
                  : 'border-stone-200 bg-stone-50 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="font-bold text-stone-900">{exp.week}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      exp.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : exp.status === 'in-progress'
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {exp.status}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-stone-900 mb-1">{exp.title}</h3>
                <p className="text-[11px] text-stone-600 leading-relaxed mb-3">
                  <span className="font-semibold text-stone-700">Target:</span> {exp.target}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200/60 text-[11px]">
                <span className="font-semibold text-stone-800 block mb-0.5">Field Result:</span>
                <p className="text-stone-700 italic">{exp.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
