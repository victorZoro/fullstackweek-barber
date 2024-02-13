"use client";

import { Button } from "@/app/_components/ui/button";
import Image from "next/image";
import {
  ChevronLeftIcon,
  MapPin,
  MapPinIcon,
  MenuIcon,
  StarIcon,
} from "lucide-react";
import { Barbershop } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/app/_components/ui/sheet";
import SideMenu from "@/app/_components/side-menu";

interface BarbershopInfoProps {
  barbershop: Barbershop;
}

const BarbershopInfo = ({ barbershop }: BarbershopInfoProps) => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div>
      <div className="relative h-[250px] w-full">
        <Button
          size="icon"
          variant="outline"
          className="absolute z-50 top-4 left-4"
          onClick={handleBackClick}
        >
          <ChevronLeftIcon />
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="absolute z-50 top-4 right-4"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>

          <SheetContent className="p-0">
            <SideMenu />
          </SheetContent>
        </Sheet>

        <Image
          src={barbershop.imageUrl}
          fill
          alt={barbershop.name}
          style={{
            objectFit: "cover",
          }}
          className="opacity-75"
        />
      </div>

      <div className="px-5 pt-3 pb-6 border-b border-solid border-secondary">
        <h1 className="text-xl font-bold">{barbershop.name}</h1>

        <div className="mt-2 flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <MapPinIcon className="stroke-primary" size={18} />
            <p className="text-sm">{barbershop.address}</p>
          </div>

          <div className="flex items-center gap-1">
            <StarIcon className="stroke-primary" size={18} />
            <p className="text-sm">5,0 (899 avaliações)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarbershopInfo;
