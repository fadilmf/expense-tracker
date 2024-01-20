"use client";

import {
  BarChart,
  Camera,
  GitGraphIcon,
  LogOut,
  LogOutIcon,
} from "lucide-react";
import { ModeToggle } from "./ui/mode-toggle";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";

export default function Navbar() {
  const router = useRouter();
  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      router.push("/auth");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <nav>
        <div className="container flex justify-between items-center border py-5">
          <div>
            <h1 className="font-bold text-xl">
              Expense<span className="text-blue-600">Tracker</span>
            </h1>
          </div>
          <ul className="flex items-center space-x-2">
            {/* <li>
              <BarChart />
            </li> */}
            <li>
              <ModeToggle />
            </li>
            <li className="flex items-center gap-2">
              <div className="p-1.5 border-2 rounded-sm text-xs hover:bg-slate-100 hover:cursor-pointer">
                <LogOut onClick={signUserOut} />
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
