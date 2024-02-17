import { format } from "date-fns";

import Header from "../_components/header";
import BookingItem from "../_components/booking-item";
import Search from "./_components/search";
import BarbershopItem from "./_components/barbershop-item";

import { ptBR } from "date-fns/locale";
import { db } from "../_lib/prisma";

export default async function Home() {
  const barbershops = await db.barbershop.findMany({});

  return (
    <div>
      <Header />

      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">Olá, Victor!</h2>
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE',' d 'de' MMMM", {
            locale: ptBR,
          })}
        </p>
      </div>

      <div className="px-5 mt-6">
        <Search />
      </div>

      <div className="px-5 mt-6">
        <h2 className="text-xs font-bold uppercase text-gray-400 mb-3">
          Agendamentos
        </h2>
        <BookingItem />
      </div>

      <div className="mt-6">
        <h2 className="text-xs font-bold uppercase text-gray-400 mb-3 px-5">
          Barbearias
        </h2>
        <div className="flex gap-4 px-5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xs font-bold uppercase text-gray-400 mb-3 px-5">
          Populares
        </h2>
        <div className="flex gap-4 px-5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  );
}
