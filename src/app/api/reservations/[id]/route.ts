import { NextRequest, NextResponse } from "next/server";
import { client } from "../../../../sanity/lib/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await request.json();
    const { id } = await params;

    const updatedReservation = await client
      .patch(id)
      .set({ status })
      .commit();

    return NextResponse.json({ 
      success: true, 
      reservation: updatedReservation 
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json(
      { error: "Failed to update reservation" },
      { status: 500 }
    );
  }
}