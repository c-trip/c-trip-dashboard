import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

import { SellForm } from "./sell-form";
import { CompanyBlocked } from "@/components/feedback/company-blocked";
import { getSchedule, getScheduleSeats } from "@/lib/api/schedules";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";

export default async function BalcaoVendaPage({
  params,
  searchParams,
}: PageProps<"/empresa/balcao/[scheduleId]">) {
  await requirePermission(PERMISSIONS.bookingSell);
  const { scheduleId } = await params;
  const priceParam = (await searchParams)?.price;
  const defaultPrice =
    Number(Array.isArray(priceParam) ? priceParam[0] : priceParam) || undefined;

  let detail, seats;
  try {
    [detail, seats] = await Promise.all([
      getSchedule(scheduleId),
      getScheduleSeats(scheduleId),
    ]);
  } catch {
    return (
      <div className="flex max-w-lg flex-col gap-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Venda ao balcão
          </h2>
        </div>
        <CompanyBlocked message="Não foi possível carregar esta viagem. Verifica se ainda tem embarque aberto." />
      </div>
    );
  }

  const route = `${detail.bus_model} · ${detail.bus_plate}`;
  const departure = `${detail.departure_date} · ${detail.departure_time}`;

  return (
    <div className="flex max-w-lg flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <Link
          href="/empresa/balcao"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft size={14} />
          Balcão
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Venda ao balcão
        </h2>
        <p className="text-sm text-muted-foreground">
          {departure} · {seats.available.length}/{seats.total_seats} lugares
          livres. O cliente não precisa de conta — o pagamento fica confirmado e
          o QR é gerado na hora.
        </p>
      </div>
      <SellForm
        scheduleId={scheduleId}
        seats={seats}
        route={route}
        departure={departure}
        defaultPrice={defaultPrice}
      />
    </div>
  );
}
