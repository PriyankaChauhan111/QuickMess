/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MealSession = 'lunch' | 'snacks' | 'dinner' | 'breakfast';

export type VenueType = 'hostel_mess' | 'main_canteen';

export interface MenuItem {
  id: string;
  name: string;
  hindiName?: string;
  description: string;
  category: 'thali' | 'main' | 'snack' | 'beverage' | 'addon';
  venue: VenueType;
  price: number; // in INR
  isHostelPlanIncluded: boolean; // ₹0 for hostel students if on meal plan
  dietary: 'veg' | 'jain' | 'high-protein';
  caloriesApprox: number;
  prepTimeMinutes: number;
  availableCount: number;
  tagline?: string;
}

export interface PickupSlot {
  id: string;
  timeLabel: string;
  session: MealSession;
  maxCapacity: number;
  bookedCount: number;
  counterNumber: string;
  isAvailable: boolean;
}

export type OrderStatus = 'queued' | 'preparing' | 'ready' | 'collected';

export interface OrderItem {
  item: MenuItem;
  quantity: number;
  customization?: string;
}

export interface QuickOrder {
  id: string;
  tokenCode: string;
  studentName: string;
  studentRoll: string;
  items: OrderItem[];
  pickupSlot: PickupSlot;
  venue: VenueType;
  subtotal: number;
  expressFee: number;
  totalPaid: number;
  paymentMethod: 'hostel_plan' | 'upi' | 'cash_counter';
  status: OrderStatus;
  createdAt: string;
  estimatedReadyTime: string;
  notes?: string;
}

export interface MenuVoteEntry {
  id: string;
  studentName: string;
  rollNumber: string;
  session: MealSession;
  choice: 'mess' | 'canteen' | 'outside_skip';
  timestamp: string;
  dishPreference?: string;
}

export interface VentureMission {
  missionNumber: number;
  title: string;
  subtitle: string;
  summary: string;
  keyPoints: { label: string; value: string }[];
  details: string;
}
