/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCircle2, Clock, MapPin, Sparkles, AlertCircle, QrCode } from 'lucide-react';
import { QuickOrder } from '../types';

interface MealPassModalProps {
  order: QuickOrder;
  isOpen: boolean;
  onClose: () => void;
  onAdvanceStatus?: (orderId: string) => void;
}

export const MealPassModal: React.FC<MealPassModalProps> = ({
  order,
  isOpen,
  onClose,
  onAdvanceStatus,
}) => {
  if (!isOpen) return null;

  const steps = [
    { key: 'queued', label: 'Order Queued', time: order.createdAt },
    { key: 'preparing', label: 'Kitchen Preparing', time: order.estimatedReadyTime },
    { key: 'ready', label: 'Ready at Counter', time: order.pickupSlot.timeLabel.split('-')[0].trim() },
    { key: 'collected', label: 'Collected & Done', time: 'Completed' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Top Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
              DGU QuickMess Express Pass
            </div>
            <h3 className="text-xl font-bold mt-0.5">Meal Pickup Token</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close meal pass modal"
            className="text-stone-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Token Number Display */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-6 text-center">
          <div className="text-xs text-amber-800 font-medium">SHOW THIS TOKEN AT EXPRESS COUNTER</div>
          <div className="text-5xl font-extrabold text-stone-900 tracking-tight my-2 font-mono tabular-nums">
            {order.tokenCode}
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-stone-600 font-medium">
            <span>{order.studentName}</span>
            <span>·</span>
            <span>{order.studentRoll}</span>
          </div>
        </div>

        {/* Pickup Details Strip */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <div>
              <div className="text-stone-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Slot Time
              </div>
              <div className="text-stone-900 font-semibold mt-1 text-sm">{order.pickupSlot.timeLabel}</div>
            </div>
            <div>
              <div className="text-stone-500 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" /> Collection Spot
              </div>
              <div className="text-stone-900 font-semibold mt-1 text-sm">{order.pickupSlot.counterNumber}</div>
            </div>
          </div>

          {/* Status Tracker */}
          <div>
            <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-3">
              Preparation Progress
            </div>
            <div className="relative">
              <div className="flex items-center justify-between">
                {steps.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div key={step.key} className="flex-1 flex flex-col items-center text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-amber-600 text-white ring-4 ring-amber-100'
                            : isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {isDone && !isCurrent ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      <span className={`text-[11px] mt-1.5 font-medium leading-tight ${isCurrent ? 'text-amber-700 font-bold' : 'text-stone-600'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* QR Code representation */}
          <div className="flex items-center gap-4 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
            <div className="w-16 h-16 bg-white p-1 rounded-lg border border-stone-300 flex items-center justify-center shrink-0">
              <QrCode className="w-12 h-12 text-stone-800" />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-stone-900">Dedicated Express Pickup</div>
              <div className="text-stone-500 mt-0.5">
                Scan or read out {order.tokenCode} to staff at {order.pickupSlot.counterNumber}. Food is boxed and waiting for you!
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div className="border-t border-stone-200 pt-4">
            <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Reserved Meal Items
            </div>
            <div className="space-y-1.5 text-xs">
              {order.items.map((oi, i) => (
                <div key={i} className="flex justify-between items-center text-stone-800">
                  <span>
                    {oi.quantity}x {oi.item.name}
                    {oi.customization && <span className="text-stone-500 italic ml-1">({oi.customization})</span>}
                  </span>
                  <span className="font-mono tabular-nums">
                    {oi.item.isHostelPlanIncluded ? 'Hostel Plan' : `₹${oi.item.price * oi.quantity}`}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center text-stone-600 pt-1">
                <span>Express Counter Convenience Fee</span>
                <span className="font-mono tabular-nums">₹{order.expressFee}</span>
              </div>
              <div className="flex justify-between items-center text-stone-900 font-bold border-t border-stone-200 pt-2 text-sm">
                <span>Total Paid</span>
                <span className="font-mono tabular-nums">₹{order.totalPaid}</span>
              </div>
            </div>
          </div>

          {/* Value callout */}
          <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl border border-emerald-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Queue Bypassed:</span> You saved ~18-22 minutes compared to the regular mess lunch queue today!
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex gap-2 pt-2">
            {order.status !== 'collected' && onAdvanceStatus && (
              <button
                type="button"
                onClick={() => onAdvanceStatus(order.id)}
                className="flex-1 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {order.status === 'ready' ? 'I Have Collected My Meal' : 'Simulate Next Prep State'}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
