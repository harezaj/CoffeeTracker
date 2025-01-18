import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [generalNotes, setGeneralNotes] = useState("");
  const [rank, setRank] = useState(5);
  const [orderAgain, setOrderAgain] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newBean = {
      name: formData.get("name") as string,
      roaster: formData.get("roaster") as string,
      origin: formData.get("origin") as string,
      roastLevel: formData.get("roastLevel") as string,
      notes,
      generalNotes,
      rank,
      gramsIn: Number(formData.get("gramsIn")),
      mlOut: Number(formData.get("mlOut")),
      brewTime: Number(formData.get("brewTime")),
      temperature: Number(formData.get("temperature")),
      price: Number(formData.get("price")),
      weight: Number(formData.get("weight")),
      orderAgain,
      grindSize: Number(formData.get("grindSize")),
    };

    onAdd(newBean);
    setOpen(false);
    setNotes([]);
    setGeneralNotes("");
    setRank(5);
    setOrderAgain(true);
  };

  const addNote = () => {
    if (note.trim() && !notes.includes(note.trim())) {
      setNotes([...notes, note.trim()]);
      setNote("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gray-900 hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl">
          <Plus className="mr-2 h-4 w-4" /> Add Coffee Bean
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-2xl">Add New Coffee Bean</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Bean Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roaster">Roaster</Label>
              <Input id="roaster" name="roaster" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <Input id="origin" name="origin" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roastLevel">Roast Level</Label>
              <select
                id="roastLevel"
                name="roastLevel"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              >
                <option value="Light">Light</option>
                <option value="Medium-Light">Medium-Light</option>
                <option value="Medium">Medium</option>
                <option value="Medium-Dark">Medium-Dark</option>
                <option value="Dark">Dark</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" name="price" type="number" step="0.01" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (g)</Label>
              <Input id="weight" name="weight" type="number" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rank</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={rank >= value ? "default" : "outline"}
                  className={rank >= value ? "bg-gray-900" : ""}
                  onClick={() => setRank(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-gray-900 font-medium mb-4">Brew Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gramsIn">Dose (g)</Label>
                <Input id="gramsIn" name="gramsIn" type="number" step="0.1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mlOut">Yield (ml)</Label>
                <Input id="mlOut" name="mlOut" type="number" step="0.1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brewTime">Brew Time (s)</Label>
                <Input id="brewTime" name="brewTime" type="number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input id="temperature" name="temperature" type="number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grindSize">Grind Size</Label>
                <Input id="grindSize" name="grindSize" type="number" required />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="orderAgain">Order Again</Label>
              <Switch
                id="orderAgain"
                checked={orderAgain}
                onCheckedChange={setOrderAgain}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>General Notes</Label>
            <Textarea
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Add any general notes about this coffee bean..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Tasting Notes</Label>
            <div className="flex gap-2">
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add tasting note"
              />
              <Button
                type="button"
                onClick={addNote}
                className="bg-gray-900 hover:bg-gray-800"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {notes.map((n) => (
                <span
                  key={n}
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium group flex items-center gap-2"
                >
                  {n}
                  <button
                    type="button"
                    onClick={() => setNotes(notes.filter((note) => note !== n))}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 transition-all duration-300">
            Add Coffee Bean
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
