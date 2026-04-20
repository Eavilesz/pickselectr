import { notFound } from "next/navigation";
import { getEventBySlug } from "@/app/events/store";
import SelectionPage from "./SelectionPage";
import PinGate from "@/components/PinGate";

export default async function SelectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = await getEventBySlug(slug);
  if (!client) notFound();

  return (
    <PinGate slug={slug}>
      <SelectionPage client={client} />
    </PinGate>
  );
}
