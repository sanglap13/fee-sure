"use server";

import { NextResponse } from "next/server";
import connectDB from "@/lib/server/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { fid, email } = await request.json();

    if (!fid || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Check if user exists
    let user = await User.findOne({ fid });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await User.create({
        fid,
        email,
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error checking/creating user:", error);
    return NextResponse.json(
      { error: "Failed to process user" },
      { status: 500 }
    );
  }
}
