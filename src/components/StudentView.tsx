/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Sparkles,
  MapPin,
  Flame,
  ArrowRight,
  ShieldCheck,
  Ticket,
} from 'lucide-react';
import { MenuItem, PickupSlot, QuickOrder, VenueType } from '../types';
import { MenuVotingCard } from './MenuVotingCard';
import { INITIAL_MENU_ITEMS, INITIAL_SLOTS } from '../data/mockData';

interface StudentViewProps {
  activeOrder?: QuickOrder;
  onOpenMealPass: () => void;
  onPlaceOrder: (newOrder: QuickOrder) => void;
  votes: any[];
  onCastVote: (choice: 'mess' | 'canteen' | 'outside_skip', preference?: string) => void;
  userVote?: any;
}

export const StudentView: React.FC<StudentViewProps> = ({
  activeOrder,
  onOpenMealPass,
  onPlaceOrder,
  votes,
  onCastVote,
  userVote,
}) => {
  const [selectedVenue, setSelectedVenue] = useState<VenueType>('hostel_mess');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [selectedSlot, setSelectedSlot] = useState<PickupSlot>(INITIAL_SLOTS[0]);
  
  // Cart state: itemId -> quantity
  const [cart, setCart] = useState<{ [id: string]: number }>({
    'thali-std': 1,
  });
  const [studentName, setStudentName] = useState('Priyanka (You)');
  const [studentRoll, setStudentRoll] = useState('0251MBA353');
  const [paymentMethod, setPaymentMethod] = useState<'hostel_plan' | 'upi' | 'cash_counter'>('hostel_plan');
  const [orderNotes, setOrderNotes] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const filteredMenuItems = INITIAL_MENU_ITEMS.filter((item) => {
    if (selectedVenue && item.venue !== selectedVenue) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (dietaryFilter !== 'all' && item.dietary !== dietaryFilter) return false;
    return true;
  });

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return { ...prev, [itemId]: updated };
    });
  };

  // Cart calculations
  const cartItemsList = Object.entries(cart)
    .map(([id, qty]) => {
      const item = INITIAL_MENU_ITEMS.find((m) => m.id === id);
      return item ? { item, quantity: qty } : null;
    })
    .filter(Boolean) as { item: MenuItem; quantity: number }[];

  const cartTotalItems = cartItemsList.reduce((sum, ci) => sum + ci.quantity, 0);

  // If using hostel plan, items with isHostelPlanIncluded have ₹0 item cost
  const foodSubtotal = cartItemsList.reduce((sum, ci) => {
    if (paymentMethod === 'hostel_plan' && ci.item.isHostelPlanIncluded) {
      return sum;
    }
    return sum + ci.item.price * ci.quantity;
  }, 0);

  const expressFee = 8; // standard fee from Mission 7
  const finalTotal = foodSubtotal + expressFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItemsList.length === 0) return;

    const randomId = Math.floor(100 + Math.random() * 900);
    const token = `QM-${randomId}`;

    const newOrder: QuickOrder = {
      id: `ord-${Date.now()}`,
      tokenCode: token,
      studentName: studentName || 'DGU Student',
      studentRoll: studentRoll || '24BTECH001',
      items: cartItemsList,
      pickupSlot: selectedSlot,
      venue: selectedVenue,
      subtotal: foodSubtotal,
      expressFee,
      totalPaid: finalTotal,
      paymentMethod,
      status: 'queued',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedReadyTime: selectedSlot.timeLabel.split('-')[0].trim(),
      notes: orderNotes,
    };

    onPlaceOrder(newOrder);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Active Token Callout Banner */}
      {activeOrder && (
        <div className="bg-amber-600 text-white rounded-2xl p-4 sm:p-5 shadow-lg mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-200">
                  Active Express Meal Pass
                </span>
                <span className="text-xs px-2 py-0.5 bg-white/25 rounded-md font-bold uppercase">
                  {activeOrder.status}
                </span>
              </div>
              <h3 className="text-lg font-bold">
                Token #{activeOrder.tokenCode} · {activeOrder.pickupSlot.timeLabel}
              </h3>
              <p className="text-xs text-amber-100">
                Pick up at {activeOrder.pickupSlot.counterNumber} ({activeOrder.venue === 'hostel_mess' ? 'Hostel Mess' : 'Main Canteen'})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenMealPass}
            className="w-full sm:w-auto px-5 py-2.5 bg-white text-stone-900 hover:bg-stone-100 font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer whitespace-nowrap"
          >
            Open Meal Pass & QR
          </button>
        </div>
      )}

      {/* Hero Strip & Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            DGU Campus, Dehradun · DBS Global University
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Skip the 20-Min Mess Queue
          </h1>
          <p className="text-sm text-stone-600 max-w-2xl mt-1">
            Pre-order your lunch, lock in a guaranteed pickup window, and collect your hot meal box from the express counter in under 3 minutes.
          </p>
        </div>

        {/* Quick Value Metrics */}
        <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-stone-200 shadow-xs text-xs">
          <div className="pr-3 border-r border-stone-200">
            <span className="text-stone-500 block">Average Queue</span>
            <span className="font-bold text-stone-900 text-sm">18.5 mins</span>
          </div>
          <div className="pr-3 border-r border-stone-200">
            <span className="text-stone-500 block">QuickMess Pickup</span>
            <span className="font-bold text-emerald-600 text-sm">2.4 mins</span>
          </div>
          <div>
            <span className="text-stone-500 block">Break Time Saved</span>
            <span className="font-bold text-amber-600 text-sm">~16 mins/meal</span>
          </div>
        </div>
      </div>

      {/* Daily Menu Voting Card (Demand Forecasting) */}
      <MenuVotingCard
        votes={votes}
        onCastVote={onCastVote}
        userVote={userVote}
      />

      {/* Step 1: Choose Pickup Slot */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 mb-8 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
              Step 1: Choose Your Lunch Pickup Window
            </h2>
          </div>
          <span className="text-xs text-stone-500">Pick the slot closest to your lecture release</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {INITIAL_SLOTS.slice(0, 3).map((slot) => {
            const isSelected = selectedSlot.id === slot.id;
            const remaining = slot.maxCapacity - slot.bookedCount;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/50 shadow-xs ring-1 ring-amber-500'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-stone-900">{slot.timeLabel}</span>
                  {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                </div>
                <div className="text-xs text-stone-500 mt-1">{slot.counterNumber}</div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-stone-600">{remaining} slots remaining</span>
                  <span className="font-mono text-emerald-600 font-semibold">Zero wait</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Choose Meals & Canteen Items */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Venue Toggle */}
        <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl max-w-fit">
          <button
            type="button"
            onClick={() => setSelectedVenue('hostel_mess')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              selectedVenue === 'hostel_mess'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Hostel Mess (Included in Plan)
          </button>
          <button
            type="button"
            onClick={() => setSelectedVenue('main_canteen')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              selectedVenue === 'main_canteen'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Main Campus Canteen
          </button>
        </div>

        {/* Dietary and Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'thali', 'main', 'snack', 'beverage'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {cat === 'all' ? 'All Dishes' : cat}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setDietaryFilter(dietaryFilter === 'high-protein' ? 'all' : 'high-protein')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              dietaryFilter === 'high-protein'
                ? 'bg-amber-600 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> High Protein
          </button>
        </div>
      </div>

      {/* Menu Item Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {filteredMenuItems.map((item) => {
          const qty = cart[item.id] || 0;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-all"
            >
              <div>
                {/* Meta header unboxed */}
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-700 capitalize">{item.category}</span>
                    <span>·</span>
                    <span>{item.caloriesApprox} kcal</span>
                    <span>·</span>
                    <span>Ready in {item.prepTimeMinutes}m</span>
                  </div>
                  {item.isHostelPlanIncluded && (
                    <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                      Plan Eligible
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-stone-900 leading-snug">
                  {item.name}
                </h3>
                {item.hindiName && (
                  <div className="text-xs text-stone-500 mt-0.5 font-sans">
                    {item.hindiName}
                  </div>
                )}

                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {item.description}
                </p>

                {item.tagline && (
                  <div className="mt-2.5 text-[11px] text-amber-700 font-medium">
                    ⚡ {item.tagline}
                  </div>
                )}
              </div>

              {/* Price & Cart Control */}
              <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-stone-500">
                    {item.isHostelPlanIncluded ? 'Meal Plan Price' : 'Standard Rate'}
                  </div>
                  <div className="text-lg font-bold text-stone-900 font-mono tabular-nums">
                    {item.isHostelPlanIncluded ? (
                      <span>₹0 <span className="text-xs font-normal text-stone-500">(Included)</span></span>
                    ) : (
                      <span>₹{item.price}</span>
                    )}
                  </div>
                </div>

                {qty === 0 ? (
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-stone-100 rounded-xl p-1 border border-stone-200">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 bg-white hover:bg-stone-200 rounded-lg flex items-center justify-center text-stone-800 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-stone-900 font-mono tabular-nums">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 bg-white hover:bg-stone-200 rounded-lg flex items-center justify-center text-stone-800 transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Cart Bar */}
      {cartTotalItems > 0 && !isCheckoutOpen && (
        <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-30">
          <div className="bg-stone-900 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 border border-stone-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-stone-950 font-bold shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-stone-300">
                  {cartTotalItems} item{cartTotalItems > 1 ? 's' : ''} · Slot: <span className="font-semibold text-white">{selectedSlot.timeLabel}</span>
                </div>
                <div className="text-base font-extrabold font-mono tabular-nums">
                  Total: ₹{finalTotal} <span className="text-xs text-stone-400 font-normal">(incl. ₹8 express fee)</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md"
            >
              <span>Review & Confirm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Checkout Review Drawer / Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 p-6 overflow-hidden">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <h3 className="text-lg font-bold text-stone-900">Confirm Your Pre-Order</h3>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="text-stone-500 hover:text-stone-800 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="mt-4 space-y-4">
              {/* Student identification */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">DGU Roll / ID</label>
                  <input
                    type="text"
                    required
                    value={studentRoll}
                    onChange={(e) => setStudentRoll(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 outline-hidden uppercase"
                  />
                </div>
              </div>

              {/* Slot Confirmation */}
              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900">
                <div className="font-semibold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  Reserved Pickup Slot: {selectedSlot.timeLabel}
                </div>
                <div className="text-amber-800 text-[11px] mt-0.5">
                  Collection Counter: {selectedSlot.counterNumber} ({selectedVenue === 'hostel_mess' ? 'Hostel Mess' : 'Main Canteen'})
                </div>
              </div>

              {/* Order Items list */}
              <div className="border border-stone-200 rounded-xl p-3 text-xs space-y-2">
                <div className="text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                  Order Breakdown
                </div>
                {cartItemsList.map((ci) => (
                  <div key={ci.item.id} className="flex justify-between items-center text-stone-800">
                    <span>
                      {ci.quantity}x {ci.item.name}
                    </span>
                    <span className="font-mono tabular-nums">
                      {paymentMethod === 'hostel_plan' && ci.item.isHostelPlanIncluded
                        ? '₹0 (Hostel Plan)'
                        : `₹${ci.item.price * ci.quantity}`}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-stone-600 pt-1 border-t border-stone-100">
                  <span>QuickMess Express Pickup Fee</span>
                  <span className="font-mono tabular-nums">₹{expressFee}</span>
                </div>
                <div className="flex justify-between items-center text-stone-950 font-bold text-sm pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="font-mono tabular-nums">₹{finalTotal}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('hostel_plan')}
                    className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                      paymentMethod === 'hostel_plan'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-500'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Hostel Meal Plan
                    <span className="block text-[10px] font-normal text-stone-500">Pay ₹8 express</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-500'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    UPI / GPay
                    <span className="block text-[10px] font-normal text-stone-500">Instant scan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_counter')}
                    className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                      paymentMethod === 'cash_counter'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-500'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Pay at Counter
                    <span className="block text-[10px] font-normal text-stone-500">During pickup</span>
                  </button>
                </div>
              </div>

              {/* Special instruction notes */}
              <div>
                <label className="block text-xs text-stone-600 mb-1">Kitchen Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Extra dal, pack in eco container, no green chilies"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Confirm & Generate Meal Pass (₹{finalTotal})</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
