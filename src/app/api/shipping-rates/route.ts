import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cache
const rateCache = new Map<string, { data: Record<string, number>; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Restaurant delivery options — no courier companies involved
const DELIVERY_OPTIONS = [
  {
    id: "standard_delivery",
    label: "Standard Delivery",
    description: "Our own delivery riders · 45–60 min",
    baseCost: 3.99,
  },
  {
    id: "express_delivery",
    label: "Express Delivery",
    description: "Priority dispatch · 20–30 min",
    baseCost: 6.99,
  },
  {
    id: "scheduled_delivery",
    label: "Scheduled Delivery",
    description: "Choose your preferred time slot",
    baseCost: 4.99,
  },
  {
    id: "pickup",
    label: "Self Pickup",
    description: "Collect from our restaurant · Free",
    baseCost: 0,
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { zip, country } = body;

    if (!zip || typeof zip !== "string" || zip.trim().length === 0) {
      return NextResponse.json({ error: "Valid ZIP/Postal code is required" }, { status: 400 });
    }
    if (!country || typeof country !== "string" || country.trim().length === 0) {
      return NextResponse.json({ error: "Valid Country is required" }, { status: 400 });
    }

    const cacheKey = `${country.toUpperCase()}-${zip.trim()}`;
    const cached = rateCache.get(cacheKey);

    if (cached && cached.timestamp + CACHE_TTL > Date.now()) {
      console.log(`[Cache HIT] Returning cached rates for ${cacheKey}`);
      return NextResponse.json(cached.data, { status: 200 });
    }
    console.log(`[Cache MISS] Calculating delivery rates for ${cacheKey}`);

    // Simulate a short processing delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Build restaurant delivery rates
    // Express costs slightly more for international/distant locations
    const isInternational = !["PK", "US", "CA"].includes(country.toUpperCase());
    const distancePremium = isInternational ? 2 : 0;

    const rates: Record<string, number> = {};
    for (const option of DELIVERY_OPTIONS) {
      const cost = parseFloat(
        (option.baseCost + (option.id === "express_delivery" ? distancePremium : 0)).toFixed(2)
      );
      rates[option.id] = cost;
    }

    rateCache.set(cacheKey, { data: rates, timestamp: Date.now() });

    return NextResponse.json(rates, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in /api/shipping-rates:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid request format." }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error calculating delivery rates." },
      { status: 500 }
    );
  }
}
