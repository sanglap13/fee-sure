import mongoose from "mongoose";

// Define the schema for the Student model
const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
studentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Create the model if it doesn't exist, otherwise use the existing one
const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
