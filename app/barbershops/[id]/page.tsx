import { db } from "@/app/_lib/prisma";
import BarbershopInfo from "./_components/barbershop_info";
import ServiceItem from "./_components/service_item";

interface BarbershopDetailsProps {
  params: {
    id?: string;
  };
}

const BarbershopDetails = async ({ params }: BarbershopDetailsProps) => {
  if (!params.id) {
    //TODO: redirect to homepage or 404
    return null;
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true,
    },
  });

  if (!barbershop) {
    //TODO: redirect to homepage or 404
    return null;
  }

  return (
    <div>
      <BarbershopInfo barbershop={barbershop} />

      <div className="px-5 flex flex-col gap-4 py-6">
        {barbershop.services.map((service) => (
          <ServiceItem key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default BarbershopDetails;
