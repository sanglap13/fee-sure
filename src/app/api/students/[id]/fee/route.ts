"use server";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getServerUser } from "@/lib/server/auth";
import connectDB from "@/lib/server/mongodb";
import User from "@/models/User";
import Student from "@/models/Student";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("API: POST /api/students/[id]/fee - Starting request");

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

    const { month, date } = await request.json();
    const studentId = params.id;

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
    console.log("API: Finding student with ID:", studentId);
    const student = await Student.findOne({
      _id: studentId,
      userId: dbUser._id,
    });

    if (!student) {
      console.log("API: Student not found");
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Add the month to feePaid array
    student.feePaid = [...student.feePaid, month];

    // Check for late payments
    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
    });
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

    // Get the last paid month
    const lastPaidMonth = student.feePaid[student.feePaid.length - 1];
    const lastPaidIndex = months.indexOf(lastPaidMonth);
    const currentMonthIndex = months.indexOf(currentMonth);

    // If current month is ahead of last paid month, add missing months to isLate
    if (currentMonthIndex > lastPaidIndex) {
      const missingMonths = months.slice(
        lastPaidIndex + 1,
        currentMonthIndex + 1
      );
      student.isLate = [...(student.isLate || []), ...missingMonths];
    }

    await student.save();
    console.log("API: Fee payment recorded successfully");

    return NextResponse.json(student);
  } catch (error) {
    console.error("API: Error updating fee payment:", error);
    return NextResponse.json(
      { error: "Failed to update fee payment" },
      { status: 500 }
    );
  }
}
