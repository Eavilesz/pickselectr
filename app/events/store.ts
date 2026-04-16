"use server";

import { createClient } from "@/lib/supabase/server";
import { Client, Product } from "./types";

// ---------------------------------------------------------------------------
// Row types (as stored in Supabase)
// ---------------------------------------------------------------------------

interface EventRow {
  id: string;
  slug: string;
  name: string;
  event_type: string;
  deadline: string | null;
  is_ready: boolean;
  digital_selected: number;
  album_selected: number;
  cover_selected: number;
}

interface ProductRow {
  event_id: string;
  type: string;
  photo_limit: number | null;
  includes_cover: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toClient(event: EventRow, products: ProductRow[]): Client {
  return {
    id: event.id,
    slug: event.slug,
    name: event.name,
    eventType: event.event_type as Client["eventType"],
    deadline: event.deadline,
    isReady: event.is_ready,
    digitalSelected: event.digital_selected,
    albumSelected: event.album_selected,
    coverSelected: event.cover_selected,
    products: products
      .filter((p) => p.event_id === event.id)
      .map((p) => ({
        type: p.type as Product["type"],
        photoLimit: p.photo_limit,
        includesCover: p.includes_cover,
      })),
  };
}

// ---------------------------------------------------------------------------
// Store functions (same signatures as the localStorage version)
// ---------------------------------------------------------------------------

export async function getStoredProducts(): Promise<Client[]> {
  const supabase = await createClient();

  const [
    { data: events, error: eventsError },
    { data: products, error: productsError },
  ] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("event_products").select("*"),
  ]);

  if (eventsError || productsError) return [];

  return (events as EventRow[]).map((e) =>
    toClient(e, (products as ProductRow[]) ?? []),
  );
}

export async function addStoredProduct(product: Client): Promise<void> {
  const supabase = await createClient();

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .insert({
      slug: product.slug,
      name: product.name,
      event_type: product.eventType,
      deadline: product.deadline,
      is_ready: product.isReady,
      digital_selected: product.digitalSelected,
      album_selected: product.albumSelected,
      cover_selected: product.coverSelected,
    })
    .select("id")
    .single();

  if (eventError || !eventData) {
    throw new Error(eventError?.message ?? "Failed to create event");
  }

  if (product.products.length > 0) {
    const { error: productsError } = await supabase
      .from("event_products")
      .insert(
        product.products.map((p) => ({
          event_id: eventData.id,
          type: p.type,
          photo_limit: p.photoLimit,
          includes_cover: p.includesCover ?? false,
        })),
      );

    if (productsError) {
      throw new Error(productsError.message);
    }
  }
}

export async function updateStoredProduct(
  slug: string,
  updates: Partial<Client>,
): Promise<void> {
  const supabase = await createClient();

  const dbUpdates: Partial<EventRow> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.eventType !== undefined) dbUpdates.event_type = updates.eventType;
  if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline;
  if (updates.isReady !== undefined) dbUpdates.is_ready = updates.isReady;
  if (updates.digitalSelected !== undefined)
    dbUpdates.digital_selected = updates.digitalSelected;
  if (updates.albumSelected !== undefined)
    dbUpdates.album_selected = updates.albumSelected;
  if (updates.coverSelected !== undefined)
    dbUpdates.cover_selected = updates.coverSelected;

  const { error } = await supabase
    .from("events")
    .update(dbUpdates)
    .eq("slug", slug);

  if (error) throw new Error(error.message);
}

export async function deleteStoredProduct(slug: string): Promise<void> {
  const supabase = await createClient();

  // event_products and photos cascade-delete via FK
  const { error } = await supabase.from("events").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
}
