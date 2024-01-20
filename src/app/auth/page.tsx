"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { auth, provider } from "@/lib/firebaseClient";
import { useGetUserInfo } from "@/lib/useGetUserInfo";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const { isAuth } = useGetUserInfo();

  const handleGoogleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, provider);
      const authInfo = {
        userID: result.user.uid,
        name: result.user.displayName,
        profilePhoto: result.user.photoURL,
        isAuth: true,
      };
      localStorage.setItem("auth", JSON.stringify(authInfo));

      router.push("/");
    } catch (error) {
      console.error("Google login error: ", error);
    }
  };

  if (isAuth) {
    router.push("/");
  }

  return (
    <>
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-md shadow-md">
        <ModeToggle />
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-600">
          Login
        </h2>

        {/* <div className="mb-4">
          <label className="block text-gray-600 text-sm font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
        >
          Login with Email
        </button>
        </form> */}

        <hr className="my-6" />

        {/* Tombol login menggunakan Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:shadow-outline-red"
        >
          Login with Google
        </button>
      </div>
    </>
  );
}
