interface SelectionButtonProps {
  selectedCount: number;
  onSave: () => void;
  isSaving?: boolean;
  savedOk?: boolean;
}

export default function SelectionButton({
  selectedCount,
  onSave,
  isSaving = false,
  savedOk = false,
}: SelectionButtonProps) {
  const disabled = selectedCount === 0 || isSaving;

  let label: string;
  if (isSaving) {
    label = "Guardando…";
  } else if (savedOk) {
    label = "Selección guardada ✓";
  } else if (selectedCount > 0) {
    label = `Guardar selección · ${selectedCount}`;
  } else {
    label = "Guardar selección";
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="bg-gradient-to-t from-black via-black/95 to-transparent pt-10 pb-8 px-6">
        <div className="max-w-sm mx-auto">
          <button
            onClick={onSave}
            disabled={disabled}
            className="w-full border border-white/60 text-white py-4 text-xs tracking-[0.3em] uppercase font-medium disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white hover:text-black transition-all duration-300"
          >
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}
