import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CoffeeBean } from "./CoffeeCard";
import { BasicDetails } from "./coffee-form/BasicDetails";
import { PurchaseDetails } from "./coffee-form/PurchaseDetails";
import { RankingSection } from "./coffee-form/RankingSection";
import { BrewingDetails } from "./coffee-form/BrewingDetails";
import { TastingNotes } from "./coffee-form/TastingNotes";
import { OrderAgainToggle } from "./coffee-form/OrderAgainToggle";

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
  const [weightUnit, setWeightUnit] = useState<'g' | 'oz'>('g');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const inputWeight = Number(formData.get("weight"));
    const weightInGrams = weightUnit === 'oz' ? inputWeight * 28.3495 : inputWeight;
    
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
      weight: weightInGrams,
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
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-[#121212] dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white text-2xl">Update Coffee Bean</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <BasicDetails 
            defaultValues={{
              name: bean.name,
              roaster: bean.roaster,
              origin: bean.origin,
              roastLevel: bean.roastLevel,
            }} 
          />
          
          <PurchaseDetails 
            defaultValues={{
              price: bean.price,
              weight: bean.weight,
            }}
            weightUnit={weightUnit}
            onWeightUnitChange={setWeightUnit}
          />
          
          <RankingSection 
            currentRank={rank} 
            onRankChange={setRank} 
          />
          
          <BrewingDetails 
            defaultValues={{
              gramsIn: bean.gramsIn,
              mlOut: bean.mlOut,
              brewTime: bean.brewTime,
              temperature: bean.temperature,
              grindSize: bean.grindSize,
            }} 
          />
          
          <OrderAgainToggle 
            checked={orderAgain}
            onCheckedChange={setOrderAgain}
          />
          
          <TastingNotes 
            notes={notes}
            currentNote={note}
            onNoteChange={setNote}
            onAddNote={addNote}
            onRemoveNote={(noteToRemove) => setNotes(notes.filter(n => n !== noteToRemove))}
          />

          <Button type="submit" className="w-full bg-coffee hover:bg-coffee-dark dark:bg-coffee dark:hover:bg-coffee-dark dark:text-white transition-all duration-300">
            Update Coffee Bean
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}