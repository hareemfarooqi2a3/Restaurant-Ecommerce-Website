"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

const ChatbotNotification = ({ message, type, duration = 3000, onClose }: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success": return <CheckCircle size={20} className="text-green-500" />;
      case "error": return <AlertCircle size={20} className="text-red-500" />;
      case "info": return <Info size={20} className="text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success": return "bg-green-50 border-green-200";
      case "error": return "bg-red-50 border-red-200";
      case "info": return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`fixed top-4 right-4 z-[10000] p-4 rounded-lg border shadow-lg ${getBgColor()} max-w-sm`}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <p className="text-sm text-gray-800 flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default ChatbotNotification;