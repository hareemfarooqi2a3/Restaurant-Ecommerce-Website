"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, Users, Phone, Mail, MapPin } from "lucide-react";

interface Reservation {
  _id: string;
  reservationId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDate: string;
  partySize: number;
  tableType: string;
  specialRequests?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
}

const ReservationManager = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/reservations");
      if (response.ok) {
        const data = await response.json();
        setReservations(data.reservations || []);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setReservations(prev =>
          prev.map(res => res._id === id ? { ...res, status: status as any } : res)
        );
      }
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  };

  const filteredReservations = reservations.filter(res => 
    filter === "all" || res.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Reservation Management</h1>
        
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          {["all", "pending", "confirmed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filter === status
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status} ({reservations.filter(r => status === "all" || r.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
            <p className="text-gray-500">No reservations match your current filter.</p>
          </div>
        ) : (
          filteredReservations.map((reservation) => (
            <div key={reservation._id} className="bg-white rounded-lg shadow-md p-6 border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {reservation.customerName}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {reservation.reservationId}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                    {reservation.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {new Date(reservation.reservationDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {new Date(reservation.reservationDate).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{reservation.partySize} people</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{reservation.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{reservation.customerPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm capitalize">{reservation.tableType} table</span>
                </div>
              </div>

              {reservation.specialRequests && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Special Requests:</strong> {reservation.specialRequests}
                  </p>
                </div>
              )}

              {reservation.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateReservationStatus(reservation._id, "confirmed")}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => updateReservationStatus(reservation._id, "cancelled")}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {reservation.status === "confirmed" && (
                <button
                  onClick={() => updateReservationStatus(reservation._id, "completed")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReservationManager;