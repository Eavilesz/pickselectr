import { notFound } from "next/navigation";
import { getEventBySlug, getSelections } from "@/app/events/store";
import { getPhotosBySlug } from "@/lib/r2";
import SelectionPage from "./SelectionPage";
import PinGate from "@/components/PinGate";

export default async function SelectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [client, photos, savedSelections] = await Promise.all([
    getEventBySlug(slug),
    getPhotosBySlug(slug),
    getSelections(slug),
  ]);
  if (!client) notFound();

  return (
    <PinGate slug={slug}>
      <SelectionPage
        client={client}
        photos={photos}
        savedSelections={savedSelections}
      />
    </PinGate>
  );
}
