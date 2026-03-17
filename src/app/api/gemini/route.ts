import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, context, reservationStep } = await request.json();
    
    const reservationResponses = {
      askName: "Perfect! I'd love to help you reserve a table. What's your name?",
      askEmail: (name: string) => `Nice to meet you, ${name}! What's your email address so I can send you a confirmation?`,
      askPhone: "Great! What's your phone number for the reservation?",
      askDate: "Excellent! What date would you like to reserve? (Please use MM/DD/YYYY format or say 'today', 'tomorrow')",
      askTime: "Perfect! What time would you prefer? (e.g., 7:00 PM, 6:30 PM)",
      askPartySize: "How many people will be dining with us?",
      askTableType: "What type of seating would you prefer?\n• Regular table\n• Window seat\n• Private booth\n• Outdoor patio",
      askSpecialRequests: "Any special requests or dietary requirements I should note for your visit?",
      confirmReservation: (details: any) => `Perfect! Let me confirm your reservation:\n\n👤 Name: ${details.name}\n📧 Email: ${details.email}\n📞 Phone: ${details.phone}\n📅 Date: ${details.date}\n🕐 Time: ${details.time}\n👥 Party Size: ${details.partySize}\n🪑 Table: ${details.tableType}\n📝 Notes: ${details.specialRequests || 'None'}\n\nShall I proceed with this reservation?`
    };

    return NextResponse.json({
      response: message,
      reservationResponses,
      context: context || "general",
      aiEnhanced: true
    });

  } catch (error) {
    console.error("Gemini AI error:", error);
    return NextResponse.json(
      { error: "AI service temporarily unavailable" },
      { status: 500 }
    );
  }
}