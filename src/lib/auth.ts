import { auth } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Cookies from "js-cookie";

// Function to get the current user
export const getCurrentUser = (): Promise<User | null> => {
  console.log("getCurrentUser called");
  return new Promise((resolve) => {
    // If there's already a current user, resolve immediately
    if (auth.currentUser) {
      console.log(
        "Current user found in auth.currentUser:",
        auth.currentUser.uid
      );
      return resolve(auth.currentUser);
    }

    console.log(
      "No current user found in auth.currentUser, setting up listener"
    );
    // Set a timeout to prevent infinite waiting
    const timeoutId = setTimeout(() => {
      console.log("Auth state change timeout - resolving with null");
      resolve(null);
    }, 3000);

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timeoutId);
      console.log(
        "Auth state changed:",
        user ? `User found: ${user.uid}` : "No user"
      );
      resolve(user);
    });

    // Clean up the listener after 3 seconds if no response
    setTimeout(() => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    }, 3000);
  });
};

// Function to set the auth token in cookies
export const setAuthToken = async (user: User): Promise<void> => {
  try {
    const token = await user.getIdToken();
    console.log("Setting auth token cookie");
    Cookies.set("auth-token", token, {
      expires: 7, // Expires in 7 days
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  } catch (error) {
    console.error("Error setting auth token:", error);
    throw error;
  }
};

// Function to remove the auth token from cookies
export const removeAuthToken = (): void => {
  console.log("Removing auth token cookie");
  Cookies.remove("auth-token", { path: "/" });
};
