/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Utensils, Clock, LayoutDashboard, FileText, CheckCircle2 } from 'lucide-react';
import { QuickOrder } from '../types';

interface HeaderProps {
  activeTab: 'student' | 'kitchen' | 'venture';
  setActiveTab: (tab: 'student' | 'kitchen' | 'venture') => void;
  activeOrder?: QuickOrder;
  onOpenMealPass: () => void;
  onPreOrderClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeOrder,
  onOpenMealPass,
  onPreOrderClick,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('student');
            }}
            className="text-xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:text-amber-600 transition-colors"
          >
            QuickMess <span className="text-amber-600 font-semibold text-sm">DGU</span>
          </a>

          {/* Zone 2: 4-5 single-line clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            <button
              type="button"
              onClick={() => setActiveTab('student')}
              className={`whitespace-nowrap shrink-0 transition-colors pb-1 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'student'
                  ? 'text-amber-600 border-b-2 border-amber-600 font-semibold'
                  : 'hover:text-stone-900'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Campus Menu & Order</span>
            </button>

            {activeOrder && (
              <button
                type="button"
                onClick={onOpenMealPass}
                className="whitespace-nowrap shrink-0 text-stone-600 hover:text-stone-900 transition-colors pb-1 flex items-center gap-1.5 cursor-pointer"
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>My Meal Pass ({activeOrder.tokenCode})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('kitchen')}
              className={`whitespace-nowrap shrink-0 transition-colors pb-1 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'kitchen'
                  ? 'text-amber-600 border-b-2 border-amber-600 font-semibold'
                  : 'hover:text-stone-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Kitchen & Counter Hub</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('venture')}
              className={`whitespace-nowrap shrink-0 transition-colors pb-1 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'venture'
                  ? 'text-amber-600 border-b-2 border-amber-600 font-semibold'
                  : 'hover:text-stone-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>DGU Venture Plan</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {activeTab === 'student' ? (
              activeOrder ? (
                <button
                  type="button"
                  onClick={onOpenMealPass}
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>View Pass #{activeOrder.tokenCode}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onPreOrderClick}
                  className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Pre-Order Pickup
                </button>
              )
            ) : activeTab === 'kitchen' ? (
              <button
                type="button"
                onClick={() => setActiveTab('student')}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Switch to Student Mode
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('student')}
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Test Student Experience
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar for small screens */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-stone-200 text-xs font-medium text-stone-600">
          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={`px-2 py-1 ${activeTab === 'student' ? 'text-amber-600 font-bold' : ''}`}
          >
            Menu & Order
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kitchen')}
            className={`px-2 py-1 ${activeTab === 'kitchen' ? 'text-amber-600 font-bold' : ''}`}
          >
            Kitchen Operations
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('venture')}
            className={`px-2 py-1 ${activeTab === 'venture' ? 'text-amber-600 font-bold' : ''}`}
          >
            Venture Plan
          </button>
        </div>
      </div>
    </header>
  );
};
