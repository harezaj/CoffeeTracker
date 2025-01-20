interface TastingNotesProps {
  notes: string[];
  toTitleCase: (str: string) => string;
}

export function TastingNotes({ notes, toTitleCase }: TastingNotesProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {notes.map((note) => (
        <span
          key={note}
          className="px-3 py-1 rounded-full bg-gray-100 dark:bg-[#222222] text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-[#2A2A2A] transition-colors"
        >
          {toTitleCase(note)}
        </span>
      ))}
    </div>
  );
}