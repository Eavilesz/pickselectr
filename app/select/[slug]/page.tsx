import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlug, getSelections } from "@/app/events/store";
import { getPhotosBySlug } from "@/lib/r2";
import SelectionPage from "./SelectionPage";
import PinGate from "@/components/PinGate";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const client = await getEventBySlug(slug);
  if (!client) return {};
  return {
    title: `${client.name} — Selección de Fotos`,
    description: `Selecciona tus fotos favoritas`,
  };
}

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
