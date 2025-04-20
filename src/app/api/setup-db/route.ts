"use server";

import { NextResponse } from "next/server";
import connectDB from "@/lib/server/mongodb";
import User from "@/models/User";
import Student from "@/models/Student";

export async function GET() {
  try {
    console.log("Connecting to MongoDB...");

    // Connect to MongoDB
    await connectDB();
    console.log("Connected to MongoDB successfully");

    // Create indexes for User model
    await User.collection.createIndex({ fid: 1 }, { unique: true });
    console.log("User indexes created successfully");

    // Create indexes for Student model
    await Student.collection.createIndex({ userId: 1 });
    console.log("Student indexes created successfully");

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
    });
  } catch (error) {
    console.error("Error setting up database:", error);
    return NextResponse.json(
      {
        error: "Failed to set up database",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
