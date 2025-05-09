"use server";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getServerUser } from "@/lib/server/auth";
import connectDB from "@/lib/server/mongodb";
import User from "@/models/User";
import Student from "@/models/Student";

// GET /api/students - Get all students for the current user
export async function GET() {
  try {
    console.log("API: GET /api/students - Starting request");

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

    // Get all students for this user
    console.log("API: Fetching students for user ID:", dbUser._id);
    const students = await Student.find({ userId: dbUser._id }).sort({
      createdAt: -1,
    });
    console.log("API: Found", students.length, "students");

    // Update isLate for each student
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    for (const student of students) {
      const joined = new Date(student.createdAt);
      const now = new Date();
      let current = new Date(joined.getFullYear(), joined.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 1);
      const missed = [];
      while (
        current.getFullYear() < end.getFullYear() ||
        (current.getFullYear() === end.getFullYear() &&
          current.getMonth() <= end.getMonth())
      ) {
        const monthName = months[current.getMonth()];
        if (!student.feePaid.includes(monthName)) {
          missed.push(monthName);
        }
        current.setMonth(current.getMonth() + 1);
      }
      if (
        (student.isLate && missed.join(",") !== student.isLate.join(",")) ||
        (!student.isLate && missed.length > 0)
      ) {
        student.isLate = missed.length ? missed : null;
        await student.save();
      }
    }

    return NextResponse.json(students);
  } catch (error) {
    console.error("API: Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

// POST /api/students - Create a new student
export async function POST(request: Request) {
  try {
    console.log("API: POST /api/students - Starting request");

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
    const { name, email, phone, dob, isActive, isLate, feePaid } = body;

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

    // Create a new student
    console.log("API: Creating new student for user ID:", dbUser._id);
    const student = await Student.create({
      userId: dbUser._id,
      name,
      email,
      phone,
      dob: new Date(dob),
      isActive: isActive !== undefined ? isActive : true,
      isLate: isLate || null,
      feePaid: feePaid || [],
    });
    console.log("API: Student created successfully with ID:", student._id);

    // Set isLate for the new student
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const joined = new Date(student.createdAt);
    const now = new Date();
    let current = new Date(joined.getFullYear(), joined.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 1);
    const missed = [];
    while (
      current.getFullYear() < end.getFullYear() ||
      (current.getFullYear() === end.getFullYear() &&
        current.getMonth() <= end.getMonth())
    ) {
      const monthName = months[current.getMonth()];
      if (!student.feePaid.includes(monthName)) {
        missed.push(monthName);
      }
      current.setMonth(current.getMonth() + 1);
    }
    student.isLate = missed.length ? missed : null;
    await student.save();

    return NextResponse.json(student);
  } catch (error) {
    console.error("API: Error creating student:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}
