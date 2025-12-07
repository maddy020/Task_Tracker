"use client";
import { signIn, signOut } from "next-auth/react";
import { getSession } from "next-auth/react";

export default function Home() {
  // const session = getSession();
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <button onClick={() => signIn("google")}>Sign in </button>
    </div>
  );
}
