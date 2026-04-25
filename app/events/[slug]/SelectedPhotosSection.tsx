"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Photo } from "@/lib/r2";
import { Selections, saveWorkedOn } from "@/app/events/store";

type TierKey = "digital" | "album" | "cover";

const TIER_CONFIG: Record<TierKey, { label: string; dot: string }> = {
  digital: { label: "Digital", dot: "bg-neutral-400" },
  album: { label: "Álbum", dot: "bg-slate-400" },
  cover: { label: "Portada", dot: "bg-amber-600" },
};

export default function SelectedPhotosSection({
  slug,
  selections,
  photoMap,
}: {
  slug: string;
  selections: Selections;
  photoMap: Map<string, Photo>;
}) {
  const [collapsed, setCollapsed] = useState<Record<TierKey, boolean>>({
    digital: false,
    album: false,
    cover: false,
  });
  const [workedOn, setWorkedOn] = useState<Set<string>>(
    () => new Set(selections.workedOn),
  );
  const [, startTransition] = useTransition();

  const allSelectedIds = [
    ...new Set([
      ...selections.digital,
      ...selections.album,
      ...selections.cover,
    ]),
  ];

  if (allSelectedIds.length === 0) return null;

  const tiers: Array<{ key: TierKey; ids: string[] }> = [
    { key: "digital", ids: selections.digital },
    { key: "album", ids: selections.album },
    { key: "cover", ids: selections.cover },
  ].filter(({ ids }) => ids.length > 0);

  const toggleCollapsed = (key: TierKey) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleWorked = (photoId: string) => {
    const next = new Set(workedOn);
    if (next.has(photoId)) next.delete(photoId);
    else next.add(photoId);
    const snapshot = Array.from(next);
    setWorkedOn(next);
    startTransition(async () => {
      await saveWorkedOn(slug, snapshot);
    });
  };

  return (
    <div className="mt-5 space-y-5">
      {tiers.map(({ key, ids }) => {
        const { label, dot } = TIER_CONFIG[key];
        const isOpen = !collapsed[key];
        const isDigital = key === "digital";
        const workedCount = isDigital
          ? ids.filter((id) => workedOn.has(id)).length
          : 0;

        return (
          <div key={key} className="bg-neutral-900 border border-white/10">
            {/* Collapsible header */}
            <button
              onClick={() => toggleCollapsed(key)}
              className="w-full flex items-center gap-2 px-6 py-4 text-left hover:bg-white/5 transition-colors"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
              <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
                {label}
              </span>
              {isDigital && selections.digital.length > 0 && (
                <span className="text-[10px] text-neutral-600 tabular-nums">
                  · {workedCount}/{ids.length} trabajadas
                </span>
              )}
              <span className="text-[10px] text-neutral-600 tabular-nums ml-auto">
                {ids.length} foto{ids.length !== 1 ? "s" : ""}
              </span>
              <svg
                className={`w-3 h-3 text-neutral-600 shrink-0 ml-2 transition-transform ${isOpen ? "" : "-rotate-90"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Photo grid */}
            {isOpen && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {ids.map((id) => {
                    const photo = photoMap.get(id);
                    if (!photo) return null;
                    const displayName = photo.name ?? id.slice(0, 8);
                    const isDone = isDigital && workedOn.has(id);

                    return (
                      <div key={id} className="flex flex-col gap-1.5">
                        <div
                          className={`relative aspect-square overflow-hidden bg-neutral-800 ${isDigital ? "cursor-pointer group" : ""}`}
                          onClick={
                            isDigital ? () => toggleWorked(id) : undefined
                          }
                          title={
                            isDigital
                              ? isDone
                                ? "Marcar como pendiente"
                                : "Marcar como trabajada"
                              : undefined
                          }
                        >
                          <Image
                            src={photo.thumbnailUrl}
                            alt={displayName}
                            fill
                            className={`object-cover transition-opacity ${isDone ? "opacity-25" : ""}`}
                            sizes="120px"
                          />
                          {/* Checkmark overlay when done */}
                          {isDone && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-white drop-shadow"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          {/* Hover hint for unchecked digital photos */}
                          {isDigital && !isDone && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                              <svg
                                className="w-6 h-6 text-white/70"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p
                          className={`text-[10px] truncate leading-tight transition-colors ${isDone ? "text-neutral-600 line-through" : "text-neutral-500"}`}
                          title={displayName}
                        >
                          {displayName}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
