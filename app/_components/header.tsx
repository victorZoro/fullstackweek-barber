"use client";

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  CalendarIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "./ui/avatar";
import Link from "next/link";

const Header = () => {
  const { data } = useSession();

  const handleLoginClick = () => signIn("google");
  const handleLogoutClick = () => signOut();

  return (
    <Card>
      <CardContent className="p-5 justify-between items-center flex flex-row">
        <Image src="/logo.png" alt="FSW Barber" height={22} width={120} />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon size={18} />
            </Button>
          </SheetTrigger>

          <SheetContent className="p-0">
            <SheetHeader className="text-left border-b border-solid border-secondary p-5">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            {data?.user ? (
              <div className="flex justify-between items-center px-5 py-6">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={data.user?.image ?? ""} />
                  </Avatar>

                  <h2 className="font-bold">{data.user.name}</h2>
                </div>

                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleLogoutClick}
                >
                  <LogOutIcon size={18} />
                </Button>
              </div>
            ) : (
              <div className="px-5 py-6 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <UserIcon size={32} />
                  <h2 className="font-bold">Olá! Faça seu login.</h2>
                </div>

                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={handleLoginClick}
                >
                  <LogInIcon size={18} className="mr-2" />
                  <span>Fazer Login.</span>
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-3 px-5">
              <Button variant="outline" className="flex justify-start" asChild>
                <Link href="/">
                  <HomeIcon size={18} className="mr-2" />
                  <span>Início</span>
                </Link>
              </Button>

              {data?.user && (
                <Button
                  variant="outline"
                  className="flex justify-start"
                  asChild
                >
                  <Link href="/bookings">
                    <CalendarIcon size={18} className="mr-2" />
                    <span>Agendamentos</span>
                  </Link>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default Header;
