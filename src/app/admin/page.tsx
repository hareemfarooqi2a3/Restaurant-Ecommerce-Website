"use client";

import Link from "next/link";
import { Calendar, ShoppingBag, Users, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Reservations */}
          <Link href="/admin/reservations">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="h-8 w-8 text-orange-500" />
                <span className="text-2xl font-bold text-gray-900">24</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reservations</h3>
              <p className="text-gray-600">Manage table bookings and reservations</p>
            </div>
          </Link>

          {/* Orders */}
          <Link href="/admin/orders">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <ShoppingBag className="h-8 w-8 text-green-500" />
                <span className="text-2xl font-bold text-gray-900">156</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Orders</h3>
              <p className="text-gray-600">View and manage customer orders</p>
            </div>
          </Link>

          {/* Customers */}
          <Link href="/admin/customers">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-blue-500" />
                <span className="text-2xl font-bold text-gray-900">1,234</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customers</h3>
              <p className="text-gray-600">Customer management and analytics</p>
            </div>
          </Link>

          {/* Analytics */}
          <Link href="/admin/analytics">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="h-8 w-8 text-purple-500" />
                <span className="text-2xl font-bold text-gray-900">$12.5k</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600">Sales and performance metrics</p>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">New reservation from John Doe</span>
              <span className="text-sm text-gray-500">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">Order #ORD-1234 completed</span>
              <span className="text-sm text-gray-500">5 minutes ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">New customer registration</span>
              <span className="text-sm text-gray-500">10 minutes ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}