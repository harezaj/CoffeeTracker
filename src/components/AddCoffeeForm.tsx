import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CoffeeBean } from "./CoffeeCard";

interface AddCoffeeFormProps {
  onAdd: (bean: Omit<CoffeeBean, "id">) => void;
}

export function AddCoffeeForm({ onAdd }: AddCoffeeFormProps) {
  const [open, setOpen] = useState(false);
  const [tastingNote, setTastingNote] = useState("");
  const [tastingNotes, setTastingNotes] = useState<string[]>([]);
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newBean = {
      name: formData.get("name") as string,
      roaster: formData.get("roaster") as string,
      origin: formData.get("origin") as string,
      roastLevel: formData.get("roastLevel") as string,
      rating,
      tastingNotes,
    };

    onAdd(newBean);
    setOpen(false);
    setTastingNotes([]);
    setRating(5);
  };

  const addTastingNote = () => {
    if (tastingNote.trim() && !tastingNotes.includes(tastingNote.trim())) {
      setTastingNotes([...tastingNotes, tastingNote.trim()]);
      setTastingNote("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-coffee hover:bg-coffee-dark">
          <Plus className="mr-2 h-4 w-4" /> Add Coffee Bean
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-cream">
        <DialogHeader>
          <DialogTitle>Add New Coffee Bean</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required className="bg-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roaster">Roaster</Label>
            <Input id="roaster" name="roaster" required className="bg-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="origin">Origin</Label>
            <Input id="origin" name="origin" required className="bg-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roastLevel">Roast Level</Label>
            <select
              id="roastLevel"
              name="roastLevel"
              className="w-full rounded-md border border-input bg-white px-3 py-2"
              required
            >
              <option value="Light">Light</option>
              <option value="Medium-Light">Medium-Light</option>
              <option value="Medium">Medium</option>
              <option value="Medium-Dark">Medium-Dark</option>
              <option value="Dark">Dark</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={rating >= value ? "default" : "outline"}
                  className={rating >= value ? "bg-coffee hover:bg-coffee-dark" : ""}
                  onClick={() => setRating(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tasting Notes</Label>
            <div className="flex gap-2">
              <Input
                value={tastingNote}
                onChange={(e) => setTastingNote(e.target.value)}
                placeholder="Add tasting note"
                className="bg-white"
              />
              <Button
                type="button"
                onClick={addTastingNote}
                className="bg-coffee hover:bg-coffee-dark"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tastingNotes.map((note) => (
                <span
                  key={note}
                  className="px-2 py-1 rounded-full bg-coffee/10 text-coffee text-sm flex items-center gap-1"
                >
                  {note}
                  <button
                    type="button"
                    onClick={() => setTastingNotes(tastingNotes.filter((n) => n !== note))}
                    className="text-coffee hover:text-coffee-dark"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full bg-coffee hover:bg-coffee-dark">
            Add Coffee Bean
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}