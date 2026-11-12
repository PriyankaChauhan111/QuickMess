/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  Search,
  CheckCheck,
  ChevronRight,
  TrendingDown,
  Volume2,
} from 'lucide-react';
import { QuickOrder, OrderStatus, MenuVoteEntry } from '../types';
import { calculateKitchenDemandForecast } from '../utils/quickmess';

interface KitchenViewProps {
  orders: QuickOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  votes: MenuVoteEntry[];
}

export const KitchenView: React.FC<KitchenViewProps> = ({
  orders,
  onUpdateOrderStatus,
  votes,
}) => {
  const [selectedSlotFilter, setSelectedSlotFilter] = useState<string>('all');
  const [searchToken, setSearchToken] = useState<string>('');
  const [tokenVerificationFeedback, setTokenVerificationFeedback] = useState<string | null>(null);
  const [calledToken, setCalledToken] = useState<string | null>(null);

  // Forecast computation
  const messVotes = votes.filter((v) => v.choice === 'mess').length;
  const canteenVotes = votes.filter((v) => v.choice === 'canteen').length;
  const outsideVotes = votes.filter((v) => v.choice === 'outside_skip').length;

  const forecast = calculateKitchenDemandForecast({
    totalHostelResidents: 500,
    votesEatingMess: Math.max(messVotes, 14),
    votesEatingCanteen: Math.max(canteenVotes, 4),
    votesSkippingOrOutside: Math.max(outsideVotes, 3),
    preOrdersPlaced: orders.length,
    safetyBufferPercentage: 0.08,
  });

  const filteredOrders = orders.filter((ord) => {
    if (selectedSlotFilter !== 'all' && ord.pickupSlot.id !== selectedSlotFilter) {
      return false;
    }
    if (searchToken.trim()) {
      const query = searchToken.toLowerCase();
      return (
        ord.tokenCode.toLowerCase().includes(query) ||
        ord.studentName.toLowerCase().includes(query) ||
        ord.studentRoll.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleVerifyToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchToken.trim()) return;

    const matched = orders.find(
      (o) => o.tokenCode.toLowerCase() === searchToken.trim().toLowerCase()
    );

    if (matched) {
      if (matched.status !== 'collected') {
        onUpdateOrderStatus(matched.id, 'collected');
        setTokenVerificationFeedback(`✅ Token ${matched.tokenCode} verified! Handed over to ${matched.studentName}.`);
      } else {
        setTokenVerificationFeedback(`⚠️ Token ${matched.tokenCode} was already collected.`);
      }
    } else {
      setTokenVerificationFeedback(`❌ No order found matching "${searchToken}".`);
    }

    setTimeout(() => {
      setTokenVerificationFeedback(null);
    }, 4500);
  };

  const handleBatchMarkReady = (slotId: string) => {
    orders
      .filter((o) => o.pickupSlot.id === slotId && (o.status === 'queued' || o.status === 'preparing'))
      .forEach((o) => onUpdateOrderStatus(o.id, 'ready'));
  };

  const handleCallToken = (tokenCode: string) => {
    setCalledToken(tokenCode);
    setTimeout(() => setCalledToken(null), 4000);
  };

  // Grouped counts
  const queuedCount = orders.filter((o) => o.status === 'queued').length;
  const prepCount = orders.filter((o) => o.status === 'preparing').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;
  const collectedCount = orders.filter((o) => o.status === 'collected').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            Mess & Canteen Operations Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Express Counter & Batch Kitchen
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Real-time pre-order assembly by pickup slot, token dispatch, and menu poll demand forecasting.
          </p>
        </div>

        {/* Counter Summary Stats */}
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-stone-200 shadow-xs text-xs">
          <div className="px-3 border-r border-stone-200">
            <span className="text-stone-500 block text-[11px]">Queued</span>
            <span className="font-bold text-amber-600 text-sm font-mono tabular-nums">{queuedCount}</span>
          </div>
          <div className="px-3 border-r border-stone-200">
            <span className="text-stone-500 block text-[11px]">In Prep</span>
            <span className="font-bold text-blue-600 text-sm font-mono tabular-nums">{prepCount}</span>
          </div>
          <div className="px-3 border-r border-stone-200">
            <span className="text-stone-500 block text-[11px]">Ready at Counter</span>
            <span className="font-bold text-emerald-600 text-sm font-mono tabular-nums">{readyCount}</span>
          </div>
          <div className="px-3">
            <span className="text-stone-500 block text-[11px]">Collected</span>
            <span className="font-bold text-stone-700 text-sm font-mono tabular-nums">{collectedCount}</span>
          </div>
        </div>
      </div>

      {/* Called token announcement banner */}
      {calledToken && (
        <div className="bg-amber-600 text-white rounded-xl p-3.5 mb-6 shadow-md flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2.5 text-sm font-bold">
            <Volume2 className="w-5 h-5" />
            <span>NOW CALLING EXPRESS TOKEN: #{calledToken} TO COUNTER #1</span>
          </div>
          <span className="text-xs text-amber-100 font-mono">Beeper active</span>
        </div>
      )}

      {/* Demand Forecasting & Waste Prevention Widget */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 md:p-6 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
          <div>
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-600" />
              Kitchen Demand Forecast & Food Waste Prevention
            </div>
            <h2 className="text-lg font-bold text-stone-900 mt-1">
              Cook Target for Today's Lunch: {forecast.recommendedMealsToCook} Meals
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Based on {forecast.totalVotesCast} student poll votes from 500 total hostel residents + {orders.length} pre-orders.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-emerald-50 text-emerald-900 p-3 rounded-xl border border-emerald-200 text-xs">
            <TrendingDown className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold">~{forecast.estimatedKgFoodSaved} kg Cooked Food Saved</div>
              <div className="text-emerald-700 text-[11px]">
                {forecast.estimatedWasteReductionPercentage}% waste reduction vs cooking for 100% capacity
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-500">Projected Mess Diners</span>
            <div className="text-xl font-extrabold text-stone-900 font-mono tabular-nums mt-1">
              {forecast.projectedMessDiners}
            </div>
            <span className="text-[11px] text-stone-500">Regular hostel meal</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-500">Projected Canteen Diners</span>
            <div className="text-xl font-extrabold text-stone-900 font-mono tabular-nums mt-1">
              {forecast.projectedCanteenDiners}
            </div>
            <span className="text-[11px] text-stone-500">À la carte / snacks</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-stone-500">Estimated Outside / Skip</span>
            <div className="text-xl font-extrabold text-stone-600 font-mono tabular-nums mt-1">
              {forecast.projectedOutsideOrSkipping}
            </div>
            <span className="text-[11px] text-stone-500">No food prep needed</span>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
            <span className="text-amber-800 font-semibold">Recommended Prep</span>
            <div className="text-xl font-extrabold text-amber-900 font-mono tabular-nums mt-1">
              {forecast.recommendedMealsToCook} plates
            </div>
            <span className="text-[11px] text-amber-800">Includes 8% unannounced buffer</span>
          </div>
        </div>
      </div>

      {/* Quick Token Search & Scanner Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs mb-6">
        <form onSubmit={handleVerifyToken} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search or Scan Token (e.g. QM-104, student name, roll #)..."
              value={searchToken}
              onChange={(e) => setSearchToken(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            Verify & Hand Over
          </button>

          {searchToken && (
            <button
              type="button"
              onClick={() => setSearchToken('')}
              className="text-xs text-stone-500 hover:text-stone-800 underline whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </form>

        {tokenVerificationFeedback && (
          <div className="mt-3 p-2.5 bg-stone-100 rounded-lg text-xs font-medium text-stone-900 border border-stone-200">
            {tokenVerificationFeedback}
          </div>
        )}
      </div>

      {/* Filter by Slot Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedSlotFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedSlotFilter === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
          >
            All Pickup Slots ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedSlotFilter('slot-1230')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedSlotFilter === 'slot-1230'
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
          >
            12:30 PM Slot
          </button>
          <button
            type="button"
            onClick={() => setSelectedSlotFilter('slot-1300')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedSlotFilter === 'slot-1300'
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
          >
            1:00 PM Slot
          </button>
          <button
            type="button"
            onClick={() => setSelectedSlotFilter('slot-1330')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedSlotFilter === 'slot-1330'
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
          >
            1:30 PM Slot
          </button>
        </div>

        {selectedSlotFilter !== 'all' && (
          <button
            type="button"
            onClick={() => handleBatchMarkReady(selectedSlotFilter)}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark This Slot Batch "Ready for Pickup"</span>
          </button>
        )}
      </div>

      {/* Orders Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-stone-200">
            <UtensilsCrossed className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-stone-700">No orders found for this slot</h3>
            <p className="text-xs text-stone-500 mt-1">Pre-orders placed by students will show up here in real time.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isReady = order.status === 'ready';
            const isCollected = order.status === 'collected';
            const isPreparing = order.status === 'preparing';

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                  isReady
                    ? 'border-emerald-300 ring-2 ring-emerald-100'
                    : isCollected
                    ? 'border-stone-200 opacity-60 bg-stone-50'
                    : 'border-stone-200'
                }`}
              >
                <div>
                  {/* Token & Slot Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div>
                      <span className="text-2xl font-black font-mono tracking-tight text-stone-900 tabular-nums">
                        {order.tokenCode}
                      </span>
                      <div className="text-xs text-stone-500 font-medium">
                        {order.studentName} ({order.studentRoll})
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase font-mono ${
                          isReady
                            ? 'bg-emerald-100 text-emerald-800'
                            : isCollected
                            ? 'bg-stone-200 text-stone-700'
                            : isPreparing
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status}
                      </span>
                      <div className="text-[11px] text-stone-500 mt-0.5 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{order.pickupSlot.timeLabel.split('-')[0].trim()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="py-3 space-y-1.5 text-xs text-stone-800">
                    {order.items.map((oi, idx) => (
                      <div key={idx} className="flex justify-between items-start">
                        <span className="font-semibold">
                          {oi.quantity}x {oi.item.name}
                        </span>
                        <span className="text-stone-500 text-[11px] font-mono">
                          {oi.item.isHostelPlanIncluded ? 'Plan' : `₹${oi.item.price * oi.quantity}`}
                        </span>
                      </div>
                    ))}
                    {order.notes && (
                      <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 italic mt-2">
                        Note: {order.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <div className="flex items-center gap-2">
                    {order.status === 'queued' && (
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                        className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Start Packing
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                        className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Mark Ready at Counter
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(order.id, 'collected')}
                        className="flex-1 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Handover</span>
                      </button>
                    )}

                    {order.status === 'collected' && (
                      <span className="text-xs text-stone-500 italic py-1 block">
                        Collected by student
                      </span>
                    )}

                    {order.status !== 'collected' && (
                      <button
                        type="button"
                        onClick={() => handleCallToken(order.tokenCode)}
                        title="Beep / Call token at counter"
                        className="p-2 border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-lg transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
