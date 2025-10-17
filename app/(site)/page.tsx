"use client";
import { signOut } from "next-auth/react";

export default function Home() {
  return (
    <div className="text-3xl font-bold underline">
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
