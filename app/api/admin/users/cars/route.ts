// app/api/admin/cars/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Car from "@/lib/models/Car";   // <-- make sure this file exists

export async function GET() {
  await connectDB();
  const cars = await Car.find({}).populate("userId", "name email").lean();
  return NextResponse.json(cars);
}