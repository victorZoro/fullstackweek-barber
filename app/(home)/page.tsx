import { format } from "date-fns"

import Image from "next/image";
import Header from "../_components/header";
import BookingItem from "../_components/booking-item";
import Search from "./_components/search";
import { ptBR } from "date-fns/locale";

export default function Home() {
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

        <div className="px-5 mt-6">
          <Search />
        </div>

        <div className="px-5 mt-6">
          <h2 className="text-xs font-bold uppercase text-gray-400 mb-3">Agendamentos</h2>
          <BookingItem />
        </div>
      </div>
    </div>
  );
}
