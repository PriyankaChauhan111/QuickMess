/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Vote, CheckCircle, Leaf, Users } from 'lucide-react';
import { MenuVoteEntry, MealSession } from '../types';

interface MenuVotingCardProps {
  votes: MenuVoteEntry[];
  onCastVote: (choice: 'mess' | 'canteen' | 'outside_skip', preference?: string) => void;
  userVote?: MenuVoteEntry;
}

export const MenuVotingCard: React.FC<MenuVotingCardProps> = ({
  votes,
  onCastVote,
  userVote,
}) => {
  const [selectedPreference, setSelectedPreference] = useState<string>('Hostel Thali');
  const [hasVotedToday, setHasVotedToday] = useState<boolean>(!!userVote);

  const totalVotes = votes.length;
  const messVotes = votes.filter((v) => v.choice === 'mess').length;
  const canteenVotes = votes.filter((v) => v.choice === 'canteen').length;
  const outsideVotes = votes.filter((v) => v.choice === 'outside_skip').length;

  const messPercent = totalVotes > 0 ? Math.round((messVotes / totalVotes) * 100) : 70;
  const canteenPercent = totalVotes > 0 ? Math.round((canteenVotes / totalVotes) * 100) : 18;
  const outsidePercent = totalVotes > 0 ? Math.round((outsideVotes / totalVotes) * 100) : 12;

  const handleVote = (choice: 'mess' | 'canteen' | 'outside_skip') => {
    onCastVote(choice, choice === 'mess' ? selectedPreference : undefined);
    setHasVotedToday(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 md:p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
            <Vote className="w-4 h-4 text-amber-600" />
            Kitchen Demand Forecasting Poll
          </div>
          <h2 className="text-lg font-bold text-stone-900 mt-1">
            Will you eat Lunch at the Campus Mess today?
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Your 1-tap vote informs the hostel kitchen 2 hours in advance to cook the exact required batches and avoid overcooking food.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-xl border border-emerald-200 text-xs font-medium">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span>Cuts ~20% Kitchen Wastage</span>
        </div>
      </div>

      {/* Voting actions */}
      <div className="mt-4">
        {!hasVotedToday ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-stone-700">If eating mess, dish choice:</span>
              <div className="flex gap-2">
                {['Hostel Thali', 'Rajma Chawal Box', 'High-Protein Bowl'].map((dish) => (
                  <button
                    key={dish}
                    type="button"
                    onClick={() => setSelectedPreference(dish)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                      selectedPreference === dish
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {dish}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleVote('mess')}
                className="py-3 px-4 rounded-xl border-2 border-stone-900 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all text-center cursor-pointer shadow-xs"
              >
                1. Yes, Eating at Hostel Mess
                <span className="block text-[11px] font-normal text-stone-300 mt-0.5">Reserve my batch in thali count</span>
              </button>

              <button
                type="button"
                onClick={() => handleVote('canteen')}
                className="py-3 px-4 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-900 text-xs font-bold transition-all text-center cursor-pointer"
              >
                2. Eating at Main Canteen
                <span className="block text-[11px] font-normal text-stone-500 mt-0.5">Will order snacks / express box</span>
              </button>

              <button
                type="button"
                onClick={() => handleVote('outside_skip')}
                className="py-3 px-4 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all text-center cursor-pointer"
              >
                3. Skipping or Eating Outside
                <span className="block text-[11px] font-normal text-stone-500 mt-0.5">Exempts my plate from cooking</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-stone-900">
                  Vote Cast: {userVote?.choice === 'mess' ? 'Eating at Hostel Mess' : userVote?.choice === 'canteen' ? 'Eating Canteen' : 'Skipping / Outside'}
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Thank you! Head cook received your preference. You can pre-order an express pickup slot below.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHasVotedToday(false)}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold underline underline-offset-2 shrink-0 cursor-pointer"
            >
              Change My Vote
            </button>
          </div>
        )}

        {/* Live Vote Breakdown Bar */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="flex justify-between items-center text-xs text-stone-600 mb-2">
            <div className="flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-stone-500" />
              <span>Campus Vote Tally ({totalVotes} responses today)</span>
            </div>
            <div className="flex gap-4 font-mono text-[11px] tabular-nums">
              <span className="text-amber-700 font-semibold">Mess {messPercent}%</span>
              <span className="text-stone-700">Canteen {canteenPercent}%</span>
              <span className="text-stone-500">Outside {outsidePercent}%</span>
            </div>
          </div>

          <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${messPercent}%` }}
              className="bg-amber-600 h-full transition-all duration-500"
              title={`Mess: ${messPercent}%`}
            />
            <div
              style={{ width: `${canteenPercent}%` }}
              className="bg-stone-600 h-full transition-all duration-500"
              title={`Canteen: ${canteenPercent}%`}
            />
            <div
              style={{ width: `${outsidePercent}%` }}
              className="bg-stone-300 h-full transition-all duration-500"
              title={`Outside: ${outsidePercent}%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
