import { notFound } from "next/navigation";
import Link from "next/link";
import { getStoredProducts } from "../../store";
import EditForm from "./EditForm";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getStoredProducts();
  const client = products.find((c) => c.slug === slug);
  if (!client) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/events"
          className="text-xs text-neutral-500 hover:text-neutral-200 transition-colors"
        >
          ← Eventos
        </Link>
        <span className="text-white/15">/</span>
        <Link
          href={`/events/${slug}`}
          className="text-xs text-neutral-500 hover:text-neutral-200 transition-colors"
        >
          {client.name}
        </Link>
        <span className="text-white/15">/</span>
        <span className="text-xs text-neutral-300 font-medium">Editar</span>
      </div>

      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-1">
          Admin
        </p>
        <h1 className="text-2xl font-medium text-white">Editar evento</h1>
      </div>

      <EditForm client={client} />
    </div>
  );
}
