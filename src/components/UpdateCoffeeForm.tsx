import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CoffeeBean } from "./CoffeeCard";

interface UpdateCoffeeFormProps {
  bean: CoffeeBean;
  onUpdate: (id: string, updates: Partial<Omit<CoffeeBean, "id">>) => void;
}

export function UpdateCoffeeForm({ bean, onUpdate }: UpdateCoffeeFormProps) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>(bean.notes);
  const [rank, setRank] = useState(bean.rank);
  const [orderAgain, setOrderAgain] = useState(bean.orderAgain);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updates = {
      name: formData.get("name") as string,
      roaster: formData.get("roaster") as string,
      origin: formData.get("origin") as string,
      roastLevel: formData.get("roastLevel") as string,
      notes,
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

    onUpdate(bean.id, updates);
    setOpen(false);
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
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-2xl">Update Coffee Bean</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Bean Name</Label>
              <Input id="name" name="name" defaultValue={bean.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roaster">Roaster</Label>
              <Input id="roaster" name="roaster" defaultValue={bean.roaster} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <Input id="origin" name="origin" defaultValue={bean.origin} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roastLevel">Roast Level</Label>
              <select
                id="roastLevel"
                name="roastLevel"
                defaultValue={bean.roastLevel}
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
              <Input id="price" name="price" type="number" step="0.01" defaultValue={bean.price} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (g)</Label>
              <Input id="weight" name="weight" type="number" defaultValue={bean.weight} required />
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
                <Input id="gramsIn" name="gramsIn" type="number" step="0.1" defaultValue={bean.gramsIn} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mlOut">Yield (ml)</Label>
                <Input id="mlOut" name="mlOut" type="number" step="0.1" defaultValue={bean.mlOut} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brewTime">Brew Time (s)</Label>
                <Input id="brewTime" name="brewTime" type="number" defaultValue={bean.brewTime} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input id="temperature" name="temperature" type="number" defaultValue={bean.temperature} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grindSize">Grind Size</Label>
                <Input id="grindSize" name="grindSize" type="number" defaultValue={bean.grindSize} required />
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
            Update Coffee Bean
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}