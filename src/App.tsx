/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { StudentView } from './components/StudentView';
import { KitchenView } from './components/KitchenView';
import { VentureView } from './components/VentureView';
import { MealPassModal } from './components/MealPassModal';
import { INITIAL_ORDERS, INITIAL_VOTES } from './data/mockData';
import { QuickOrder, OrderStatus, MenuVoteEntry } from './types';
import { Sparkles, Utensils, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'student' | 'kitchen' | 'venture'>('student');
  const [orders, setOrders] = useState<QuickOrder[]>(INITIAL_ORDERS);
  const [activeOrderId, setActiveOrderId] = useState<string>('ord-104');
  const [isMealPassOpen, setIsMealPassOpen] = useState<boolean>(false);
  const [votes, setVotes] = useState<MenuVoteEntry[]>(INITIAL_VOTES);
  const [userVote, setUserVote] = useState<MenuVoteEntry | undefined>(
    INITIAL_VOTES.find((v) => v.id === 'v8')
  );

  const activeOrder = orders.find((o) => o.id === activeOrderId);

  const handlePlaceOrder = (newOrder: QuickOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    setIsMealPassOpen(true);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const handleAdvanceActiveOrderStatus = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) return;

    const nextStatusMap: Record<OrderStatus, OrderStatus> = {
      queued: 'preparing',
      preparing: 'ready',
      ready: 'collected',
      collected: 'collected',
    };

    handleUpdateOrderStatus(orderId, nextStatusMap[ord.status]);
  };

  const handleCastVote = (
    choice: 'mess' | 'canteen' | 'outside_skip',
    preference?: string
  ) => {
    const newVote: MenuVoteEntry = {
      id: `v-${Date.now()}`,
      studentName: 'Priyanka (You)',
      rollNumber: '0251MBA353',
      session: 'lunch',
      choice,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dishPreference: preference,
    };

    setUserVote(newVote);
    setVotes((prev) => [newVote, ...prev.filter((v) => v.rollNumber !== '0251MBA353')]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      {/* Universal Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeOrder={activeOrder}
        onOpenMealPass={() => setIsMealPassOpen(true)}
        onPreOrderClick={() => {
          setActiveTab('student');
          window.scrollTo({ top: 350, behavior: 'smooth' });
        }}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {activeTab === 'student' && (
          <StudentView
            activeOrder={activeOrder}
            onOpenMealPass={() => setIsMealPassOpen(true)}
            onPlaceOrder={handlePlaceOrder}
            votes={votes}
            onCastVote={handleCastVote}
            userVote={userVote}
          />
        )}

        {activeTab === 'kitchen' && (
          <KitchenView
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            votes={votes}
          />
        )}

        {activeTab === 'venture' && <VentureView />}
      </main>

      {/* Digital Meal Pass Token Modal */}
      {activeOrder && (
        <MealPassModal
          order={activeOrder}
          isOpen={isMealPassOpen}
          onClose={() => setIsMealPassOpen(false)}
          onAdvanceStatus={handleAdvanceActiveOrderStatus}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">QuickMess DGU</span>
            <span>·</span>
            <span>Campus Pre-Order & Kitchen Demand Forecasting</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Designed for DGU Venture Quest by Priyanka (MBA Student · DBS Global University)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
