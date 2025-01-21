import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface TastingNotesProps {
  notes: string[];
  currentNote: string;
  onNoteChange: (note: string) => void;
  onAddNote: () => void;
  onRemoveNote: (note: string) => void;
}

export function TastingNotes({ notes, currentNote, onNoteChange, onAddNote, onRemoveNote }: TastingNotesProps) {
  return (
    <div className="space-y-2">
      <Label className="dark:text-gray-200">Tasting Notes</Label>
      <div className="flex gap-2">
        <Input
          value={currentNote}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Add tasting note"
          className="dark:bg-[#1A1A1A] dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
        />
        <Button
          type="button"
          onClick={onAddNote}
          className="bg-coffee hover:bg-coffee-dark dark:bg-coffee dark:hover:bg-coffee-dark dark:text-white"
        >
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {notes.map((n) => (
          <span
            key={n}
            className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium group flex items-center gap-2 dark:bg-gray-800 dark:text-gray-200"
          >
            {n}
            <button
              type="button"
              onClick={() => onRemoveNote(n)}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}