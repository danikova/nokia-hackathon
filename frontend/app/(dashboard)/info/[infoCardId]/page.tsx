import { getPB, getUserRole } from "@/lib/pocketbase";
import { InfoCard } from "../page";
import InfoCardEditor from "./InfoCardEditor";

async function getInfoCardById(id: string) {
  const pb = getPB();
  const record = await pb.collection('info_cards').getOne(id);
  return record as never as InfoCard;
}

export default async function InfoCardDetailPage({ params }: {
  params: { infoCardId: string }
}) {
  const infoCard = await getInfoCardById(params.infoCardId);
  const role = getUserRole();

  return (
    <div className="info-card m-16 max-md:m-8 flex flex-col gap-8">
      <InfoCardEditor infoCard={infoCard} />
    </div>
  );
}