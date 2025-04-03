import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import Cookies from "js-cookie";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Set up auth state listener to manage cookies
if (typeof window !== "undefined") {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // User is signed in, set the token cookie
        const token = await user.getIdToken();
        Cookies.set("auth-token", token, {
          expires: 7, // Expires in 7 days
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      } catch (error) {
        console.error("Error setting auth token:", error);
      }
    } else {
      // User is signed out, remove the token cookie
      Cookies.remove("auth-token", { path: "/" });
    }
  });
}
