import { NextRequest, NextResponse } from "next/server";
import { client } from "../../../sanity/lib/client";
import { mockFoods } from "../../../lib/mockData";

interface FoodItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  tags?: string[];
}

const restaurantFAQ = {
  hours: {
    keywords: ["hours", "open", "close", "timing", "schedule", "when", "time"],
    response: "🕐 **Restaurant Hours:**\nMonday-Sunday: 11:00 AM - 11:00 PM\n\n🍳 Kitchen closes at 10:30 PM for dine-in orders.\n📞 Call us for holiday hours!",
    suggestions: ["Order now", "Reserve table", "Delivery hours"]
  },
  location: {
    keywords: ["location", "address", "where", "directions", "find", "located"],
    response: "📍 **FoodTuck Location:**\n123 Food Street, Cuisine City\n\nWe're located in the heart of downtown, near the main shopping district!\n🚗 Free parking available behind the restaurant.",
    suggestions: ["Get directions", "Reserve table", "Parking info"]
  },
  delivery: {
    keywords: ["delivery", "deliver", "shipping", "send", "bring", "takeout"],
    response: "🚚 **Delivery & Takeout:**\n• Free delivery on orders $25+\n• Delivery time: 30-45 minutes\n• Delivery area: 5-mile radius\n• Delivery fee: $3.99 (under $25)\n• Takeout ready in 15-20 minutes",
    suggestions: ["Order for delivery", "Check delivery area", "Takeout order"]
  },
  payment: {
    keywords: ["payment", "pay", "card", "cash", "accept", "methods", "credit"],
    response: "💳 **Payment Methods:**\n• Credit/Debit Cards (Visa, MasterCard, Amex)\n• Digital Wallets (Apple Pay, Google Pay)\n• Cash (dine-in only)\n• Gift Cards\n• Buy Now, Pay Later options",
    suggestions: ["Order now", "Gift cards", "Payment help"]
  },
  allergies: {
    keywords: ["allergy", "allergic", "gluten", "dairy", "nuts", "dietary", "restrictions", "vegan", "vegetarian"],
    response: "🥗 **Dietary Accommodations:**\nWe accommodate various dietary needs:\n• Gluten-free options available\n• Dairy-free alternatives\n• Nut-free preparations\n• Vegetarian & Vegan dishes\n• Keto-friendly options\n\n⚠️ Please inform us of any allergies when ordering!",
    suggestions: ["Gluten-free menu", "Vegan options", "Allergy info"]
  },
  specials: {
    keywords: ["special", "deal", "offer", "discount", "promotion", "coupon", "sale"],
    response: "🎯 **Current Specials:**\n• Happy Hour: 3-6 PM (25% off appetizers)\n• Tuesday: Buy 1 Get 1 Pizza\n• Weekend Brunch Special\n• Student Discount: 15% off with ID\n• Senior Discount: 10% off (65+)\n• Military Discount: 20% off",
    suggestions: ["View specials", "Order now", "Student discount"]
  },
  contact: {
    keywords: ["contact", "phone", "call", "email", "reach", "number"],
    response: "📞 **Contact Information:**\n• Phone: (555) 123-FOOD\n• Email: hello@foodtuck.com\n• Social: @FoodTuckEats\n• Manager: manager@foodtuck.com\n\nWe're here to help! 😊",
    suggestions: ["Call now", "Email us", "Follow us"]
  }
};

const getSmartResponse = (message: string, foods: FoodItem[]) => {
  const lowerMessage = message.toLowerCase();
  
  // Check FAQ first
  for (const [key, faq] of Object.entries(restaurantFAQ)) {
    if (faq.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        items: [],
        response: faq.response,
        suggestions: faq.suggestions,
        type: 'faq'
      };
    }
  }
  
  // Food preference keywords
  const keywords = {
    spicy: ["spicy", "hot", "chili", "pepper"],
    vegetarian: ["vegetarian", "vegan", "veggie", "plant"],
    popular: ["popular", "best", "recommended", "favorite"],
    cheap: ["cheap", "affordable", "budget", "inexpensive"],
    healthy: ["healthy", "light", "diet", "low-calorie"]
  };
  
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => lowerMessage.includes(word))) {
      const filteredItems = foods.filter(food => 
        food.tags?.some(tag => tag.toLowerCase().includes(category)) ||
        food.name.toLowerCase().includes(category)
      );
      
      if (filteredItems.length > 0) {
        return {
          items: filteredItems.slice(0, 4),
          response: `Here are some ${category} options for you! 🍽️`
        };
      }
    }
  }
  
  return null;
};

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();
    
    const lowerMessage = message.toLowerCase();
    
    // Try to get foods from Sanity, fallback to mock data
    let foods;
    try {
      foods = await client.fetch(`
        *[_type == "food" && available == true] {
          _id,
          name,
          price,
          category,
          tags,
          "image": image.asset->url
        }
      `);
      if (!foods || foods.length === 0) {
        foods = mockFoods;
      }
    } catch (error) {
      console.log("Using mock data - Sanity not configured");
      foods = mockFoods;
    }

    let response = "";
    let suggestedItems: FoodItem[] = [];
    let suggestions: string[] = [];

    const smartMatch = getSmartResponse(message, foods);
    if (smartMatch) {
      suggestedItems = smartMatch.items;
      response = smartMatch.response;
      suggestions = smartMatch.suggestions || ["Add to cart", "Show more", "Different category"];
    } else {
      const matchedItems = foods.filter((food: FoodItem) => 
        food.name.toLowerCase().includes(lowerMessage) ||
        food.category.toLowerCase().includes(lowerMessage) ||
        lowerMessage.includes(food.name.toLowerCase()) ||
        lowerMessage.includes(food.category.toLowerCase())
      );

      if (matchedItems.length > 0) {
        suggestedItems = matchedItems.slice(0, 3);
        response = `I found ${matchedItems.length} item${matchedItems.length > 1 ? 's' : ''} for you! 🎯\n\n${matchedItems.slice(0, 3).map((item: FoodItem) => 
          `• ${item.name} - $${item.price.toFixed(2)}`
        ).join('\n')}\n\nWould you like me to add any of these to your cart?`;
        suggestions = ["Add all to cart", "Add individual items", "Show more options", "Different items"];
      } else if (lowerMessage.includes("menu") || lowerMessage.includes("show") || lowerMessage.includes("list")) {
        const categories = [...new Set(foods.map((f: FoodItem) => f.category))] as string[];
        const popularItems = foods.slice(0, 6);
        response = `Here's our menu! 📋\n\n**Categories:** ${categories.join(", ")}\n\n**Popular Items:**\n${popularItems.map((item: FoodItem) => 
          `• ${item.name} - $${item.price.toFixed(2)}`
        ).join('\n')}\n\nWhat would you like to order?`;
        suggestedItems = [];
        suggestions = [...categories.slice(0, 3), "Add items to cart"];
      } else if (lowerMessage.includes("reserve") || lowerMessage.includes("table") || lowerMessage.includes("book")) {
        response = "I'd be happy to help you reserve a table! 🪑✨\n\nLet me gather some information. What's your name?";
        suggestions = ["John Doe", "Book for tonight", "Party of 4"];
        return NextResponse.json({
          response,
          suggestedItems: [],
          suggestions,
          context: "reservation",
          timestamp: new Date().toISOString()
        });
      } else if (lowerMessage.includes("help") || lowerMessage.includes("what") || lowerMessage.includes("can you")) {
        response = "I'm your FoodTuck AI assistant! 🤖✨\n\nI can help you with:\n• 🍽️ **Food Orders** - Find and order delicious meals\n• 📅 **Table Reservations** - Book your perfect dining spot\n• 📋 **Menu Browsing** - Explore our full menu\n• 💡 **Restaurant Info** - Hours, location, delivery\n• 🎯 **Specials & Deals** - Current promotions\n• 🥗 **Dietary Info** - Allergies, nutrition, special diets\n\nWhat would you like to know?";
        suggestions = ["Restaurant hours", "Location info", "Current specials", "Dietary options"];
      } else {
        // Handle common conversational inputs
        if (lowerMessage.includes("hi") || lowerMessage.includes("hello") || lowerMessage.includes("hey")) {
          response = "Hello! Welcome to FoodTuck! 👋😊\n\nI'm here to help you with orders, reservations, and any questions about our restaurant. What can I do for you today?";
          suggestions = ["Show menu", "Reserve table", "Restaurant hours", "Current specials"];
        } else if (lowerMessage.includes("thanks") || lowerMessage.includes("thank you")) {
          response = "You're very welcome! 😊 Is there anything else I can help you with today?";
          suggestions = ["Order food", "Make reservation", "Restaurant info", "Nothing else"];
        } else if (lowerMessage.includes("bye") || lowerMessage.includes("goodbye")) {
          response = "Goodbye! Thanks for visiting FoodTuck. We hope to see you soon! 👋🍽️";
          suggestions = ["Order for later", "Make reservation", "Follow us", "Leave review"];
        } else {
          response = "I'm here to help! 😊\n\nI can assist you with:\n• 🍽️ Food orders & menu questions\n• 📅 Table reservations\n• ℹ️ Restaurant information (hours, location, etc.)\n• 🎯 Current specials & deals\n• 🥗 Dietary accommodations\n\nWhat would you like to know?";
          suggestions = ["Show menu", "Reserve table", "Restaurant info", "Current specials"];
        }
      }
    }

    return NextResponse.json({
      response,
      suggestedItems,
      suggestions,
      context: context || "general",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { 
        error: "I'm having trouble processing your request right now. Please try again!",
        response: "Sorry, I'm experiencing some technical difficulties. Please try again in a moment! 🔧",
        suggestions: ["Try again", "Contact support", "Browse menu"]
      },
      { status: 500 }
    );
  }
}