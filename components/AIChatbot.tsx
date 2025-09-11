"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Calendar, ShoppingCart, Bot, User, Sparkles, ThumbsUp, ThumbsDown, Copy, Mic, MicOff, Zap } from "lucide-react";
import { useCart } from "../src/app/Context/CartContext";
import ChatbotNotification from "./ChatbotNotification";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "reservation" | "order" | "suggestion";
  suggestions?: string[];
  isTyping?: boolean;
  rating?: "up" | "down" | null;
}

interface ReservationData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  tableType: string;
  specialRequests?: string;
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      text: "Hi! I'm your FoodTuck AI assistant 🤖\n\nI can help you with:\n🍽️ **Food Orders** - Browse our menu and add items to your cart\n📅 **Table Reservations** - Book a table for your dining experience\n\nHow can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
      suggestions: ["Order Food 🍕", "Reserve Table 📅", "Show Menu 📋", "Help ❓"],
      rating: null,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationState, setConversationState] = useState<"general" | "reservation" | "ordering">("general");
  const [reservationData, setReservationData] = useState<Partial<ReservationData>>({});
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [notification, setNotification] = useState<{message: string; type: "success" | "error" | "info"} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type });
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = () => setIsListening(false);
      recognitionInstance.onend = () => setIsListening(false);
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = useCallback((text: string, sender: "user" | "bot", type: "text" | "reservation" | "order" | "suggestion" = "text", suggestions?: string[]) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender,
      timestamp: new Date(),
      type,
      suggestions,
      rating: null,
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const processUserMessage = async (message: string) => {
    setIsTyping(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const lowerMessage = message.toLowerCase();

    if (conversationState === "general") {
      if (lowerMessage.includes("reserve") || lowerMessage.includes("table") || lowerMessage.includes("book")) {
        setConversationState("reservation");
        addMessage("I'd be happy to help you reserve a table! Let me gather some information. What's your name?", "bot");
      } else if (lowerMessage.includes("order") || lowerMessage.includes("food") || lowerMessage.includes("menu")) {
        setConversationState("ordering");
        addMessage("Great! I can help you place an order. What would you like to order today? You can mention specific dishes or ask to see our menu.", "bot");
      } else if (lowerMessage.includes("help")) {
        addMessage("I'm here to help! I can assist you with:\n\n🍽️ **Food Orders** - Browse menu and add items to cart\n📅 **Table Reservations** - Book a table for dining\n\nJust tell me what you'd like to do!", "bot", "suggestion", ["Order Food", "Reserve Table", "Show Popular Items"]);
      } else {
        addMessage("Hello! I can help you with table reservations or food orders. What would you like to do today?", "bot", "suggestion", ["Order Food 🍕", "Reserve Table 📅", "Show Menu 📋"]);
      }
    } else if (conversationState === "reservation") {
      await handleReservationFlow(message);
    } else if (conversationState === "ordering") {
      await handleOrderFlow(message);
    }

    setIsTyping(false);
  };

  const handleReservationFlow = async (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Handle suggestion clicks
    if (lowerMessage === "john doe") {
      setReservationData(prev => ({ ...prev, name: "John Doe" }));
      addMessage(`Nice to meet you, John Doe! What's your email address?`, "bot", "reservation", ["john@example.com", "Enter email"]);
      return;
    }
    
    if (lowerMessage === "book for tonight") {
      const today = new Date();
      const dateStr = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`;
      if (!reservationData.name) {
        addMessage("I'd love to help you book for tonight! First, what's your name?", "bot", "reservation", ["John Doe", "Enter name"]);
        return;
      } else {
        setReservationData(prev => ({ ...prev, date: dateStr }));
        addMessage(`Perfect! Booking for tonight (${dateStr}). What time would you prefer?`, "bot", "reservation", ["7:00 PM", "8:00 PM", "6:30 PM"]);
        return;
      }
    }
    
    if (lowerMessage === "party of 4") {
      if (!reservationData.name) {
        addMessage("Great! A party of 4. First, what's your name?", "bot", "reservation", ["John Doe", "Enter name"]);
        return;
      } else {
        setReservationData(prev => ({ ...prev, partySize: 4 }));
        addMessage("Perfect! Party of 4. What type of seating would you prefer?", "bot", "reservation", ["Regular table", "Window seat", "Booth", "Outdoor"]);
        return;
      }
    }
    
    // Regular reservation flow
    if (!reservationData.name) {
      setReservationData(prev => ({ ...prev, name: message }));
      addMessage(`Nice to meet you, ${message}! What's your email address?`, "bot", "reservation", ["Enter email", "Skip for now"]);
    } else if (!reservationData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(message.trim())) {
        setReservationData(prev => ({ ...prev, email: message.trim() }));
        addMessage("Great! What's your phone number?", "bot", "reservation", ["Enter phone", "Skip for now"]);
      } else {
        addMessage("Please provide a valid email address (e.g., john@example.com).", "bot", "reservation", ["john@example.com", "Try again"]);
      }
    } else if (!reservationData.phone) {
      setReservationData(prev => ({ ...prev, phone: message }));
      addMessage("Perfect! What date would you like to reserve?", "bot", "reservation", ["Today", "Tomorrow", "This weekend", "Enter date"]);
    } else if (!reservationData.date) {
      let dateToSet = message;
      if (lowerMessage === "today") {
        const today = new Date();
        dateToSet = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`;
      } else if (lowerMessage === "tomorrow") {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateToSet = `${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}/${tomorrow.getDate().toString().padStart(2, '0')}/${tomorrow.getFullYear()}`;
      }
      setReservationData(prev => ({ ...prev, date: dateToSet }));
      addMessage(`Great! Reserving for ${dateToSet}. What time would you prefer?`, "bot", "reservation", ["6:00 PM", "7:00 PM", "8:00 PM", "Other time"]);
    } else if (!reservationData.time) {
      setReservationData(prev => ({ ...prev, time: message }));
      addMessage("Perfect! How many people will be dining?", "bot", "reservation", ["2 people", "4 people", "6 people", "Other"]);
    } else if (!reservationData.partySize) {
      let partySize = parseInt(message);
      if (message.includes("people")) {
        partySize = parseInt(message.split(" ")[0]);
      }
      if (partySize > 0) {
        setReservationData(prev => ({ ...prev, partySize }));
        addMessage(`Excellent! Party of ${partySize}. What type of seating would you prefer?`, "bot", "reservation", ["Regular table", "Window seat", "Private booth", "Outdoor patio"]);
      } else {
        addMessage("Please provide a valid number of people.", "bot", "reservation", ["2 people", "4 people", "Enter number"]);
      }
    } else if (!reservationData.tableType) {
      setReservationData(prev => ({ ...prev, tableType: message }));
      addMessage("Perfect! Any special requests or dietary requirements?", "bot", "reservation", ["No special requests", "Vegetarian options", "Birthday celebration", "Wheelchair accessible"]);
    } else {
      const finalReservation = { ...reservationData, specialRequests: message === "No special requests" ? "" : message };
      await submitReservation(finalReservation as ReservationData);
    }
  };

  const handleOrderFlow = async (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Handle "Add all to cart" specifically
    if (lowerMessage.includes("add all") || lowerMessage === "add all to cart") {
      // Get the last suggested items and add them all
      const lastBotMessage = messages.filter(m => m.sender === "bot" && m.type === "order").pop();
      if (lastBotMessage) {
        // Mock adding items - in real implementation, you'd track suggested items
        const mockItems = [
          { id: "1", name: "Classic Burger", price: 12.99, image: "/burger.png" },
          { id: "2", name: "Margherita Pizza", price: 15.99, image: "/pizza.png" }
        ];
        
        mockItems.forEach(item => {
          addToCart({ ...item, quantity: 1 });
        });
        
        showNotification(`Added ${mockItems.length} items to cart! 🛒`, "success");
        addMessage("Great! I've added all the suggested items to your cart. You can view your cart and proceed to checkout anytime. Would you like to order anything else?", "bot", "order", ["View cart", "Order more", "Checkout"]);
        return;
      }
    }
    
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: lowerMessage, context: 'ordering' })
      });
      
      const data = await response.json();
      
      if (data?.suggestedItems && Array.isArray(data.suggestedItems) && data.suggestedItems.length > 0) {
        // Only add to cart if user explicitly requested it
        if (lowerMessage.includes("add") || lowerMessage.includes("order") || lowerMessage.includes("buy")) {
          let addedCount = 0;
          data.suggestedItems.forEach((item: any) => {
            if (item?._id && item?.name && typeof item?.price === 'number') {
              addToCart({
                id: item._id,
                name: item.name,
                price: item.price,
                image: item.image || "/food.png",
                quantity: 1
              });
              addedCount++;
            }
          });
          
          if (addedCount > 0) {
            showNotification(`Added ${addedCount} item${addedCount > 1 ? 's' : ''} to cart! 🛒`, "success");
          }
        }
        
        addMessage(data.response, "bot", "order", data.suggestions);
      } else if (lowerMessage.includes("checkout") || lowerMessage.includes("done")) {
        addMessage("Perfect! You can view your cart and proceed to checkout using the cart icon in the navigation. Is there anything else I can help you with?", "bot");
        setConversationState("general");
      } else {
        addMessage(
          data.response || "I can help you find items from our menu. Try asking for specific dishes or say 'show menu' to see available items.", 
          "bot", 
          "suggestion", 
          data.suggestions || ["Show menu", "Popular items", "Help"]
        );
      }
    } catch (error) {
      addMessage("Sorry, I'm having trouble accessing our menu right now. Please try again or browse our menu directly.", "bot");
    }
  };

  const submitReservation = async (reservation: ReservationData) => {
    try {
      const response = await fetch("/api/reservations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservation),
      });

      if (response.ok) {
        addMessage(
          `Perfect! Your table reservation has been confirmed for ${reservation.date} at ${reservation.time} for ${reservation.partySize} people. You'll receive a confirmation email shortly. Is there anything else I can help you with?`,
          "bot",
          "reservation"
        );
        showNotification("Reservation confirmed! 🎉", "success");
      } else {
        addMessage("Sorry, there was an issue with your reservation. Please try again or call us directly.", "bot");
        showNotification("Reservation failed. Please try again.", "error");
      }
    } catch (error) {
      addMessage("Sorry, there was an issue processing your reservation. Please try again.", "bot");
      showNotification("Network error. Please check your connection.", "error");
    }

    setConversationState("general");
    setReservationData({});
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      addMessage(inputText, "user");
      processUserMessage(inputText);
      setInputText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const rateMessage = (messageId: string, rating: "up" | "down") => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    ));
  };

  const copyMessage = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification("Message copied to clipboard!", "success");
    } catch (error) {
      showNotification("Failed to copy message", "error");
    }
  };

  return (
    <>
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <ChatbotNotification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-4 rounded-full shadow-lg z-[9999] transition-all duration-300 hover:scale-110"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl z-[9999] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-t-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageCircle size={20} />
                <div className="flex items-center gap-2">
                  <span className="font-semibold">FoodTuck Assistant</span>
                  <Zap size={16} className="text-yellow-300" />
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-orange-600 p-1 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div key={message.id}>
                  <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] ${message.sender === "user" ? "" : "flex gap-2"}`}>
                      {message.sender === "bot" && (
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot size={16} className="text-white" />
                        </div>
                      )}
                      <div className={`relative group ${
                        message.sender === "user" ? "flex items-start gap-2" : ""
                      }`}>
                        {message.sender === "user" && (
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <User size={16} className="text-white" />
                          </div>
                        )}
                        <div className={`p-3 rounded-lg ${
                          message.sender === "user"
                            ? "bg-blue-500 text-white rounded-br-sm"
                            : "bg-gray-100 text-gray-800 rounded-bl-sm"
                        }`}>
                          <p className="text-sm whitespace-pre-line">{message.text}</p>
                          
                          {/* Message Type Icons */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              {message.type === "reservation" && (
                                <div className="flex items-center gap-1 text-xs opacity-75">
                                  <Calendar size={12} />
                                  <span>Reservation</span>
                                </div>
                              )}
                              {message.type === "order" && (
                                <div className="flex items-center gap-1 text-xs opacity-75">
                                  <ShoppingCart size={12} />
                                  <span>Order</span>
                                </div>
                              )}
                              {message.type === "suggestion" && (
                                <div className="flex items-center gap-1 text-xs opacity-75">
                                  <Sparkles size={12} />
                                  <span>Suggestions</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Message Actions */}
                            {message.sender === "bot" && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => copyMessage(message.text)}
                                  className="p-1 hover:bg-gray-200 rounded text-xs"
                                  title="Copy message"
                                >
                                  <Copy size={10} />
                                </button>
                                <button
                                  onClick={() => rateMessage(message.id, "up")}
                                  className={`p-1 hover:bg-gray-200 rounded text-xs ${
                                    message.rating === "up" ? "text-green-600" : ""
                                  }`}
                                  title="Helpful"
                                >
                                  <ThumbsUp size={10} />
                                </button>
                                <button
                                  onClick={() => rateMessage(message.id, "down")}
                                  className={`p-1 hover:bg-gray-200 rounded text-xs ${
                                    message.rating === "down" ? "text-red-600" : ""
                                  }`}
                                  title="Not helpful"
                                >
                                  <ThumbsDown size={10} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 ml-10">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs hover:bg-orange-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message... (Shift+Enter for new line)"
                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none min-h-[44px] max-h-24 text-gray-900 placeholder-gray-500"
                    rows={1}
                  />
                  {recognition && (
                    <button
                      onClick={toggleVoiceInput}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                        isListening ? "text-red-500 animate-pulse" : "text-gray-400 hover:text-gray-600"
                      }`}
                      title={isListening ? "Stop listening" : "Voice input"}
                    >
                      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors flex items-center justify-center min-w-[44px]"
                >
                  <Send size={18} />
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleSuggestionClick("Show me the menu")}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs hover:bg-gray-50 transition-colors text-gray-700"
                >
                  📋 Menu
                </button>
                <button
                  onClick={() => handleSuggestionClick("I want to reserve a table")}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs hover:bg-gray-50 transition-colors text-gray-700"
                >
                  📅 Reserve
                </button>
                <button
                  onClick={() => handleSuggestionClick("What are your popular dishes?")}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs hover:bg-gray-50 transition-colors text-gray-700"
                >
                  ⭐ Popular
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;