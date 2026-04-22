"use client";

import Link from "next/link";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { useSession, signOut } from "next-auth/react";
import UserIcon from "./user/UserIcon";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "./ui/separator";
import UserIconSkeleton from "./user/Skeleton";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { useTranslations } from "next-intl";

export default function Header() {
  const { data: session, status } = useSession();
  const t = useTranslations("header");

  return (
    <header className="bg-orange-300 h-18 shadow-2xl fixed top-0 left-0 w-full flex items-center z-50">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link href="/">
          <Logo
            iconClassName="text-orange-400"
            textClassName="text-orange-900"
          />
        </Link>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />

          {status === "loading" && <UserIconSkeleton size={40} />}

          {status === "unauthenticated" && (
            <Button asChild variant={"secondary"}>
              <Link href="/login">{t("login")}</Link>
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
                      {t("profile")}
                    </Link>
                  </li>
                  <li>
                    <Link href={"/"} className="hover:underline">
                      {t("settings")}
                    </Link>
                  </li>

                  <Separator className="bg-orange-300 my-2" />

                  <li>
                    <Button onClick={() => signOut({ callbackUrl: "/" })}>
                      {t("logout")}
                    </Button>
                  </li>
                </ul>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
      </div>
    </header>
  );
}
