import { NextResponse } from "next/server";
import { client } from "../../../sanity/lib/client";

export async function GET() {
  try {
    const reservations = await client.fetch(`
      *[_type == "reservation"] | order(createdAt desc) {
        _id,
        reservationId,
        customerName,
        customerEmail,
        customerPhone,
        reservationDate,
        partySize,
        tableType,
        specialRequests,
        status,
        createdAt
      }
    `);

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}