"use client";

import Link from "next/link";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { useSession, signOut } from "next-auth/react";
import { Spinner } from "./ui/spinner";
import UserIcon from "./UserIcon";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "./ui/separator";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-orange-500 h-18 shadow-2xl fixed top-0 left-0 w-full flex items-center z-50">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link href="/">
          <Logo iconClassName="text-orange-50" />
        </Link>

        <button
          onClick={() => {
            localStorage.removeItem("locationRequested");
            localStorage.removeItem("userLocation");
          }}
        >
          click
        </button>

        {status === "loading" && <Spinner className="text-orange-50" />}

        {status === "unauthenticated" && (
          <Button asChild variant={"secondary"}>
            <Link href="/login">Accedi</Link>
          </Button>
        )}

        {status === "authenticated" && session?.user && (
          <HoverCard>
            <HoverCardTrigger>
              <UserIcon />
            </HoverCardTrigger>
            <HoverCardContent align="end" className="z-99">
              <div className="flex justify-center mb-4">
                <UserIcon iconClassName="text-orange-50 bg-orange-500" />
              </div>

              <ul className="flex flex-col gap-2">
                <li>
                  <Link href={"/"} className="hover:underline">
                    Il mio profilo
                  </Link>
                </li>
                <li>
                  <Link href={"/"} className="hover:underline">
                    Impostazioni
                  </Link>
                </li>

                <Separator className="bg-orange-300 my-2" />

                <li>
                  <Button onClick={() => signOut({ callbackUrl: "/" })}>
                    Esci
                  </Button>
                </li>
              </ul>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
    </header>
  );
}
