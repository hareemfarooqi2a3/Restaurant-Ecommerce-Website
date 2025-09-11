import { NextRequest, NextResponse } from "next/server";
import { client } from "../../../../sanity/lib/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time, partySize, tableType, specialRequests } = body;

    // Generate reservation ID
    const reservationId = `RES-${Date.now()}`;

    // Combine date and time
    const reservationDateTime = new Date(`${date} ${time}`);

    // Create reservation document
    const reservation = await client.create({
      _type: "reservation",
      reservationId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      reservationDate: reservationDateTime.toISOString(),
      partySize: parseInt(partySize),
      tableType: tableType.toLowerCase(),
      specialRequests: specialRequests || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      reservation: {
        id: reservation._id,
        reservationId,
        status: "confirmed",
      },
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}