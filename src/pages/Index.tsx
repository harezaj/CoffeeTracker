import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBeans, createBean, deleteBean } from "@/lib/api";
import { CoffeeCard } from "@/components/CoffeeCard";
import { toast } from "sonner";

export default function Index() {
  const [name, setName] = useState("");
  const [roaster, setRoaster] = useState("");
  const [origin, setOrigin] = useState("");
  const [roastLevel, setRoastLevel] = useState("Medium");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [generalNotes, setGeneralNotes] = useState("");
  const [rank, setRank] = useState(3);
  const [gramsIn, setGramsIn] = useState(18);
  const [mlOut, setMlOut] = useState(36);
  const [brewTime, setBrewTime] = useState(30);
  const [temperature, setTemperature] = useState(93);
  const [price, setPrice] = useState(20);
  const [weight, setWeight] = useState(250);
  const [orderAgain, setOrderAgain] = useState(true);
  const [grindSize, setGrindSize] = useState(20);

  const queryClient = useQueryClient();

  const { data: beans = [] } = useQuery({
    queryKey: ["beans"],
    queryFn: fetchBeans,
  });

  const createMutation = useMutation({
    mutationFn: createBean,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beans"] });
      toast.success("Coffee bean added successfully!");
      resetForm();
    },
    onError: () => {
      toast.error("Failed to add coffee bean");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBean,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beans"] });
      toast.success("Coffee bean deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete coffee bean");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMutation.mutate({
      name,
      roaster,
      origin,
      roastLevel,
      notes,
      generalNotes,
      rank,
      gramsIn,
      mlOut,
      brewTime,
      temperature,
      price,
      weight,
      orderAgain,
      grindSize,
    });
  };

  const resetForm = () => {
    setName("");
    setRoaster("");
    setOrigin("");
    setRoastLevel("Medium");
    setNote("");
    setNotes([]);
    setGeneralNotes("");
    setRank(3);
    setGramsIn(18);
    setMlOut(36);
    setBrewTime(30);
    setTemperature(93);
    setPrice(20);
    setWeight(250);
    setOrderAgain(true);
    setGrindSize(20);
  };

  const addNote = () => {
    if (note.trim() && !notes.includes(note.trim())) {
      setNotes([...notes, note.trim()]);
      setNote("");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Coffee Bean Journey</h1>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link to="/recommendations">View Recommendations</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/calculator">Cost Calculator</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Bean Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roaster">Roaster</Label>
              <Input
                id="roaster"
                value={roaster}
                onChange={(e) => setRoaster(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roastLevel">Roast Level</Label>
              <select
                id="roastLevel"
                value={roastLevel}
                onChange={(e) => setRoastLevel(e.target.value)}
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
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (g)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                required
              />
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
                <Input
                  id="gramsIn"
                  type="number"
                  step="0.1"
                  value={gramsIn}
                  onChange={(e) => setGramsIn(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mlOut">Yield (ml)</Label>
                <Input
                  id="mlOut"
                  type="number"
                  step="0.1"
                  value={mlOut}
                  onChange={(e) => setMlOut(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brewTime">Brew Time (s)</Label>
                <Input
                  id="brewTime"
                  type="number"
                  value={brewTime}
                  onChange={(e) => setBrewTime(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grindSize">Grind Size</Label>
                <Input
                  id="grindSize"
                  type="number"
                  value={grindSize}
                  onChange={(e) => setGrindSize(Number(e.target.value))}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="generalNotes">General Notes</Label>
            <Textarea
              id="generalNotes"
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Add any general notes about this coffee..."
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
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 transition-all duration-300"
          >
            Add Coffee Bean
          </Button>
        </form>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Your Coffee Collection</h2>
          {beans.length === 0 ? (
            <p className="text-gray-500">No coffee beans added yet.</p>
          ) : (
            beans.map((bean) => (
              <CoffeeCard
                key={bean.id}
                bean={bean}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}