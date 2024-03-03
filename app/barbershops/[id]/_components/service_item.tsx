"use client";

import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { Barbershop, Booking, Service } from "@prisma/client";
import { ptBR } from "date-fns/locale/pt-BR";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { generateDayTimeList } from "../_helpers/hours";
import { format } from "date-fns/format";
import { saveBooking } from "../_actions/save-booking";
import { setHours, setMinutes } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getDayBookings } from "../_actions/get-day-bookings";

interface ServiceItemProps {
  barbershop: Barbershop;
  service: Service;
  isAuthenticated: boolean;
}

const ServiceItem = ({
  barbershop,
  service,
  isAuthenticated,
}: ServiceItemProps) => {
  const router = useRouter();

  const { data } = useSession();

  const [date, setDate] = useState<Date | undefined>();
  const [schedule, setSchedule] = useState<string | undefined>();
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);

  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (!date) return;

    const refreshAvailableSchedules = async () => {
      const currentDayBookings = await getDayBookings(barbershop.id, date);
      setDayBookings(currentDayBookings);
    };

    refreshAvailableSchedules();
  }, [date, barbershop.id]);

  const timeList = useMemo(() => {
    if (!date) return [];

    return generateDayTimeList(date).filter((time) => {
      const targetHours = Number(time.split(":")[0]);
      const targetMinutes = Number(time.split(":")[1]);

      const findMatchingSchedule = dayBookings.find((booking) => {
        const bookingHours = booking.date.getHours();
        const bookingMinutes = booking.date.getMinutes();

        return bookingHours === targetHours && bookingMinutes === targetMinutes;
      });

      if (!findMatchingSchedule) return true;

      return false;
    });
  }, [date, dayBookings]);

  const handleBookingClick = () => {
    if (!isAuthenticated) return signIn("google");
  };

  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
    setSchedule(undefined);
  };

  const handleScheduleClick = (time: string) => {
    setSchedule(time);
  };

  const handleBookingSubmit = async () => {
    setSubmitIsLoading(true);

    try {
      if (!schedule || !date || !data?.user) return;

      const hours = Number(schedule.split(":")[0]);
      const minutes = Number(schedule.split(":")[1]);
      const scheduledDate = setMinutes(setHours(date, hours), minutes);

      console.log(scheduledDate);

      await saveBooking({
        serviceId: service.id,
        barbershopId: barbershop.id,
        date: scheduledDate,
        userId: (data.user as any).id,
      });

      setIsSheetOpen(false);

      toast("Reserva realizada com sucesso!", {
        description: format(scheduledDate, "dd 'de' MMMM 'às' HH:mm", {
          locale: ptBR,
        }),
        action: {
          label: "Visualizar",
          onClick: () => router.push("/bookings"),
        },
      });

      setDateAsUndefined();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitIsLoading(false);
    }
  };

  const setDateAsUndefined = () => {
    setDate(undefined);
    setSchedule(undefined);
  };

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex gap-4 items-center">
          <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              fill
              style={{
                objectFit: "contain",
              }}
              alt={service.name}
            />
          </div>

          <div className="flex flex-col w-full">
            <h2 className="font-bold text-sm">{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>

            <div className="flex items-center justify-between mt-3">
              <p className="font-bold text-sm text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger>
                  <Button variant="secondary" onClick={handleBookingClick}>
                    Reservar
                  </Button>
                </SheetTrigger>

                <SheetContent className="p-0">
                  <SheetHeader className="text-left px-5 py-6 border-b border-solid border-secondary">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="py-6 px-5">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateClick}
                      locale={ptBR}
                      fromDate={new Date()}
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: {
                          width: "100%",
                        },
                        nav_button: {
                          width: "32px",
                          height: "32px",
                        },
                        nav_button_next: {
                          width: "32px",
                          height: "32px",
                        },
                        nav_button_previous: {
                          width: "32px",
                          height: "32px",
                        },
                        button: {
                          width: "100%",
                        },
                        caption: {
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </div>

                  {date && (
                    <div className="py-6 px-5 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden border-y border-solid border-secondary">
                      {timeList.map((time) => (
                        <Button
                          onClick={() => handleScheduleClick(time)}
                          variant={time === schedule ? "default" : "outline"}
                          className="rounded-full"
                          key={time}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="py-6 px-5 border-t border-solid border-secondary">
                    <Card>
                      <CardContent className="p-3 flex flex-col gap-4">
                        <div className="flex justify-between">
                          <h2 className="font-bold">{service.name}</h2>
                          <h3>
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(service.price))}
                          </h3>
                        </div>

                        {date && (
                          <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm">Data</h3>
                            <h4 className="text-sm capitalize">
                              {format(date, "dd 'de' MMMM", { locale: ptBR })}
                            </h4>
                          </div>
                        )}

                        {schedule && (
                          <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm">Horário</h3>
                            <h4 className="text-sm capitalize">{schedule}</h4>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <h3 className="text-gray-400 text-sm">Barbearia</h3>
                          <h4 className="text-sm capitalize">
                            {barbershop.name}
                          </h4>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <SheetFooter className="px-5">
                    <Button
                      onClick={handleBookingSubmit}
                      disabled={!date || !schedule || submitIsLoading}
                    >
                      {submitIsLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Confirmar reserva
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
