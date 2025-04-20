import mongoose from "mongoose";

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  fid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
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
userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Create the model if it doesn't exist, otherwise use the existing one
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
