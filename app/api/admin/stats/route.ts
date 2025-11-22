import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import Car from "@/lib/models/Car";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();

  const [users, cars] = await Promise.all([
    User.countDocuments(),
    Car.countDocuments(),
  ]);

  // 30‑day active users
  const activePeriod = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const activeUsers = await User.countDocuments({
    lastLogin: { $gte: activePeriod },
  });

  return NextResponse.json({ userCount: users, activeUsers, carCount: cars });
}