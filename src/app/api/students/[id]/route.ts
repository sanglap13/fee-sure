"use server";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getServerUser } from "@/lib/server/auth";
import connectDB from "@/lib/server/mongodb";
import User from "@/models/User";
import Student from "@/models/Student";

// GET /api/students/[id] - Get a specific student
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log("API: GET /api/students/[id] - Starting request");

    // Try to get the user using server-side authentication
    const serverUser = await getServerUser();
    console.log(
      "API: Server user:",
      serverUser ? `Found user with ID: ${serverUser.uid}` : "No user found"
    );

    // If server-side auth fails, try client-side auth as fallback
    let user = null;
    if (!serverUser) {
      console.log("API: Trying client-side authentication as fallback");
      user = await getCurrentUser();
      console.log(
        "API: Client-side user:",
        user ? `Found user with ID: ${user.uid}` : "No user found"
      );
    } else {
      // Convert server user to a format compatible with the rest of the code
      user = { uid: serverUser.uid, email: serverUser.email };
    }

    if (!user) {
      console.log("API: Unauthorized - No user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    console.log("API: Connecting to MongoDB...");
    await connectDB();
    console.log("API: Connected to MongoDB successfully");

    // Find the user in our database
    console.log("API: Finding user in database with fid:", user.uid);
    const dbUser = await User.findOne({ fid: user.uid });
    console.log(
      "API: Database user:",
      dbUser ? `Found user with ID: ${dbUser._id}` : "No user found in database"
    );

    if (!dbUser) {
      console.log("API: User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the student
    console.log("API: Fetching student with ID:", id);
    const student = await Student.findOne({
      _id: id,
      userId: dbUser._id,
    });

    if (!student) {
      console.log("API: Student not found");
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("API: Error fetching student:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

// PATCH /api/students/[id] - Update a student
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log("API: PATCH /api/students/[id] - Starting request");

    // Try to get the user using server-side authentication
    const serverUser = await getServerUser();
    console.log(
      "API: Server user:",
      serverUser ? `Found user with ID: ${serverUser.uid}` : "No user found"
    );

    // If server-side auth fails, try client-side auth as fallback
    let user = null;
    if (!serverUser) {
      console.log("API: Trying client-side authentication as fallback");
      user = await getCurrentUser();
      console.log(
        "API: Client-side user:",
        user ? `Found user with ID: ${user.uid}` : "No user found"
      );
    } else {
      // Convert server user to a format compatible with the rest of the code
      user = { uid: serverUser.uid, email: serverUser.email };
    }

    if (!user) {
      console.log("API: Unauthorized - No user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("API: Request body:", body);

    // Connect to MongoDB
    console.log("API: Connecting to MongoDB...");
    await connectDB();
    console.log("API: Connected to MongoDB successfully");

    // Find the user in our database
    console.log("API: Finding user in database with fid:", user.uid);
    const dbUser = await User.findOne({ fid: user.uid });
    console.log(
      "API: Database user:",
      dbUser ? `Found user with ID: ${dbUser._id}` : "No user found in database"
    );

    if (!dbUser) {
      console.log("API: User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the student
    console.log("API: Finding student with ID:", id);
    const student = await Student.findOne({
      _id: id,
      userId: dbUser._id,
    });

    if (!student) {
      console.log("API: Student not found");
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Update the student
    console.log("API: Updating student with ID:", id);

    // Handle different update types
    if (body.isActive !== undefined) {
      student.isActive = body.isActive;
    }

    if (body.isLate !== undefined) {
      student.isLate = body.isLate;
    }

    if (body.feePaid !== undefined) {
      student.feePaid = body.feePaid;
    }

    // Save the updated student
    await student.save();
    console.log("API: Student updated successfully");

    return NextResponse.json(student);
  } catch (error) {
    console.error("API: Error updating student:", error);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}

// DELETE /api/students/[id] - Delete a student
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log("API: DELETE /api/students/[id] - Starting request");

    // Try to get the user using server-side authentication
    const serverUser = await getServerUser();
    console.log(
      "API: Server user:",
      serverUser ? `Found user with ID: ${serverUser.uid}` : "No user found"
    );

    // If server-side auth fails, try client-side auth as fallback
    let user = null;
    if (!serverUser) {
      console.log("API: Trying client-side authentication as fallback");
      user = await getCurrentUser();
      console.log(
        "API: Client-side user:",
        user ? `Found user with ID: ${user.uid}` : "No user found"
      );
    } else {
      // Convert server user to a format compatible with the rest of the code
      user = { uid: serverUser.uid, email: serverUser.email };
    }

    if (!user) {
      console.log("API: Unauthorized - No user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    console.log("API: Connecting to MongoDB...");
    await connectDB();
    console.log("API: Connected to MongoDB successfully");

    // Find the user in our database
    console.log("API: Finding user in database with fid:", user.uid);
    const dbUser = await User.findOne({ fid: user.uid });
    console.log(
      "API: Database user:",
      dbUser ? `Found user with ID: ${dbUser._id}` : "No user found in database"
    );

    if (!dbUser) {
      console.log("API: User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find and delete the student
    console.log("API: Finding and deleting student with ID:", id);
    const student = await Student.findOneAndDelete({
      _id: id,
      userId: dbUser._id,
    });

    if (!student) {
      console.log("API: Student not found");
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    console.log("API: Student deleted successfully");
    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("API: Error deleting student:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}
