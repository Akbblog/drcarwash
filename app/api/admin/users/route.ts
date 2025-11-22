// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

export async function GET() {
  await connectDB();
  const users = await User.find({}).lean();      // lean returns plain JS objects
  return NextResponse.json(users);
}