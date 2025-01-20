import { useState } from "react";
import { Plus, X, Wand2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CoffeeBean } from "./CoffeeCard";
import { searchCoffeeDetails } from "@/lib/coffeeSearch";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

interface AddCoffeeFormProps {
  onAdd: (bean: Omit<CoffeeBean, "id">) => void;
}

export function AddCoffeeForm({ onAdd }: AddCoffeeFormProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [generalNotes, setGeneralNotes] = useState("");
  const [rank, setRank] = useState(5);
  const [orderAgain, setOrderAgain] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dataSources, setDataSources] = useState<{ url?: string; displayText: string }[]>([]);
  const [showDataSources, setShowDataSources] = useState(false);
  const [weightUnit, setWeightUnit] = useState<'g' | 'oz'>('g');

  const handleAutoPopulate = async (formData: FormData) => {
    const roaster = formData.get("roaster") as string;
    const name = formData.get("name") as string;
    const apiKey = localStorage.getItem('perplexity-api-key');

    if (!roaster || !name) {
      toast({
        title: "Missing Information",
        description: "Please enter both roaster and bean name to auto-populate.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key in the settings section at the bottom of the main page.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const details = await searchCoffeeDetails(roaster, name, apiKey);
      
      if (details.origin) {
        const originInput = document.querySelector('input[name="origin"]') as HTMLInputElement;
        if (originInput) originInput.value = details.origin;
      }
      
      if (details.roastLevel) {
        const roastLevelSelect = document.querySelector('select[name="roastLevel"]') as HTMLSelectElement;
        if (roastLevelSelect) roastLevelSelect.value = details.roastLevel;
      }
      
      if (details.notes) {
        setNotes(details.notes);
      }
      
      if (details.recommendedDose) {
        const gramsInInput = document.querySelector('input[name="gramsIn"]') as HTMLInputElement;
        if (gramsInInput) gramsInInput.value = details.recommendedDose.toString();
      }
      
      if (details.recommendedYield) {
        const mlOutInput = document.querySelector('input[name="mlOut"]') as HTMLInputElement;
        if (mlOutInput) mlOutInput.value = details.recommendedYield.toString();
      }
      
      if (details.recommendedBrewTime) {
        const brewTimeInput = document.querySelector('input[name="brewTime"]') as HTMLInputElement;
        if (brewTimeInput) brewTimeInput.value = details.recommendedBrewTime.toString();
      }

      if (details.price) {
        const priceInput = document.querySelector('input[name="price"]') as HTMLInputElement;
        if (priceInput) priceInput.value = details.price.toString();
      }

      if (details.weight) {
        const weightInput = document.querySelector('input[name="weight"]') as HTMLInputElement;
        if (weightInput) weightInput.value = details.weight.toString();
      }

      if (details.temperature) {
        const temperatureInput = document.querySelector('input[name="temperature"]') as HTMLInputElement;
        if (temperatureInput) temperatureInput.value = details.temperature.toString();
      }

      if (details.sources) {
        const cleanedSources = details.sources.map(source => {
          try {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const matches = source.match(urlRegex);
            
            if (matches && matches.length > 0) {
              const url = matches[0].replace(/[.,;]$/, '');
              let displayText = source.replace(url, '').trim();
              
              if (!displayText) {
                try {
                  const domain = new URL(url).hostname.replace('www.', '');
                  displayText = domain;
                } catch {
                  displayText = url;
                }
              }
              
              return {
                url,
                displayText: displayText || url
              };
            }
            
            const knownDomains = {
              'Onyx Coffee Lab': 'https://onyxcoffeelab.com',
              'Beanz': 'https://beanz.com',
              'Crema': 'https://crema.co',
              'Fellow Products': 'https://fellowproducts.com',
              'Trade Coffee': 'https://www.drinktrade.com',
              'Blue Bottle': 'https://bluebottlecoffee.com',
              'Intelligentsia': 'https://www.intelligentsia.com',
              'Counter Culture': 'https://counterculturecoffee.com'
            };
            
            for (const [domain, url] of Object.entries(knownDomains)) {
              if (source.toLowerCase().includes(domain.toLowerCase())) {
                return {
                  url,
                  displayText: source
                };
              }
            }
            
            return {
              displayText: source
            };
          } catch (e) {
            console.error('Error processing source:', e);
            return {
              displayText: source
            };
          }
        });
        
        setDataSources(cleanedSources);
      }

      toast({
        title: "Success",
        description: "Coffee details auto-populated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch coffee details. Please try again or fill in manually.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Convert weight to grams if needed
    const inputWeight = Number(formData.get("weight"));
    const weightInGrams = weightUnit === 'oz' ? inputWeight * 28.3495 : inputWeight;
    
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
      weight: weightInGrams,
      orderAgain,
      grindSize: Number(formData.get("grindSize")),
      purchaseCount: 1,
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
        <Button className="bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl dark:bg-[#171717] dark:hover:bg-[#222222] dark:text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Coffee Bean
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-[#171717] dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-coffee-dark dark:text-white text-2xl">Add New Coffee Bean</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roaster" className="dark:text-gray-200">Roaster</Label>
              <Input id="roaster" name="roaster" required className="dark:bg-[#222222] dark:border-gray-700 dark:text-white dark:focus:border-coffee" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-gray-200">Bean Name</Label>
              <div className="flex gap-2">
                <Input id="name" name="name" required className="dark:bg-[#222222] dark:border-gray-700 dark:text-white dark:focus:border-coffee" />
                <Button
                  type="button"
                  onClick={() => handleAutoPopulate(new FormData(document.querySelector('form')!))}
                  disabled={loading}
                  className="bg-coffee-dark hover:bg-coffee/90 dark:bg-coffee dark:hover:bg-coffee-dark"
                >
                  {loading ? (
                    "Loading..."
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Auto
                    </>
                  )}
                </Button>
              </div>
              {dataSources.length > 0 && (
                <AlertDialog open={showDataSources} onOpenChange={setShowDataSources}>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 text-xs flex items-center gap-1 dark:bg-[#222222] dark:border-gray-700 dark:text-gray-200"
                    >
                      <Info className="h-3 w-3" />
                      View Data Sources
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white dark:bg-[#171717] dark:border-gray-800">
                    <div className="absolute right-4 top-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDataSources(false)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Data Sources</AlertDialogTitle>
                      <AlertDialogDescription>
                        The following sources were used to populate the coffee details:
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="mt-4">
                      <ul className="list-disc pl-4 space-y-2">
                        {dataSources.map((source, index) => (
                          <li key={index} className="text-sm">
                            {source.url ? (
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-coffee hover:text-coffee-dark underline"
                              >
                                {source.displayText}
                              </a>
                            ) : (
                              <span>{source.displayText}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin" className="dark:text-gray-200">Origin</Label>
              <Input id="origin" name="origin" required className="dark:bg-[#222222] dark:border-gray-700 dark:text-white dark:focus:border-coffee" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roastLevel" className="dark:text-gray-200">Roast Level</Label>
              <select
                id="roastLevel"
                name="roastLevel"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-dark dark:bg-[#222222] dark:border-gray-700 dark:text-white dark:focus:border-coffee"
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
              <Label htmlFor="price" className="dark:text-gray-200">Price ($)</Label>
              <Input id="price" name="price" type="number" step="0.01" required className="dark:bg-[#222222] dark:border-gray-700 dark:text-white dark:focus:border-coffee" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="dark:text-gray-200">Weight</Label>
              <div className="flex gap-2">
                <Input 
                  id="weight" 
                  name="weight" 
                  type="number" 
                  step="0.1"
                  required 
                  className="flex-1 dark:bg-[#222222] dark:border-gray-700 dark:text-white dark:focus:border-coffee"
                />
                <ToggleGroup
                  type="single"
                  value={weightUnit}
                  onValueChange={(value) => value && setWeightUnit(value as 'g' | 'oz')}
                  className="border rounded-md"
                >
                  <ToggleGroupItem value="g" className="px-2 py-1">g</ToggleGroupItem>
                  <ToggleGroupItem value="oz" className="px-2 py-1">oz</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="dark:text-gray-200">Rank</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={rank >= value ? "default" : "outline"}
                  className={`${
                    rank >= value 
                      ? "bg-coffee-dark hover:bg-coffee/90 dark:bg-coffee dark:hover:bg-coffee-dark" 
                      : "dark:bg-[#222222] dark:border-gray-700 dark:text-gray-200"
                  }`}
                  onClick={() => setRank(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <h4 className="text-coffee-dark dark:text-white font-medium mb-4">Brew Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gramsIn" className="dark:text-gray-200">Dose (g)</Label>
                <Input id="gramsIn" name="gramsIn" type="number" step="0.1" required className="dark:bg-[#222222] dark:border-gray-700 dark:text-white dark:focus:border-coffee" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mlOut" className="dark:text-gray-200">Yield (ml)</Label>
                <Input id="mlOut" name="mlOut" type="number" step="0.1" required className="dark:bg-[#222222] dark:border-gray-700 dark:text-white dark:focus:border-coffee" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brewTime" className="dark:text-gray-200">Brew Time (s)</Label>
                <Input id="brewTime" name="brewTime" type="number" required className="dark:bg-[#222222] dark:border-gray-700 dark:text-white dark:focus:border-coffee" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature" className="dark:text-gray-200">Temperature (°C)</Label>
                <Input id="temperature" name="temperature" type="number" defaultValue={95} required className="dark:bg-[#222222] dark:border-gray-700 dark:text-white dark:focus:border-coffee" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grindSize" className="dark:text-gray-200">Grind Size</Label>
                <Input 
                  id="grindSize" 
                  name="grindSize" 
                  type="number" 
                  step="0.1" 
                  defaultValue={10} 
                  required 
                  className="dark:bg-[#222222] dark:border-gray-700 dark:text-white dark:focus:border-coffee"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="orderAgain" className="dark:text-gray-200">Order Again</Label>
              <Switch
                id="orderAgain"
                checked={orderAgain}
                onCheckedChange={setOrderAgain}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="dark:text-gray-200">General Notes</Label>
            <Textarea
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Add any general notes about this coffee bean..."
              className="min-h-[100px] dark:bg-[#222222] dark:border-gray-700 dark:text-white dark:focus:border-coffee"
            />
          </div>

          <div className="space-y-2">
            <Label className="dark:text-gray-200">Tasting Notes</Label>
            <div className="flex gap-2">
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add tasting note"
                className="dark:bg-[#222222] dark:border-gray-700 dark:text-white dark:focus:border-coffee"
              />
              <Button
                type="button"
                onClick={addNote}
                className="bg-coffee-dark hover:bg-coffee/90 dark:bg-coffee dark:hover:bg-coffee-dark"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {notes.map((n) => (
                <span
                  key={n}
                  className="px-3 py-1 rounded-full bg-gray-100 text-coffee-dark text-sm font-medium group flex items-center gap-2 dark:bg-gray-800 dark:text-gray-200"
                >
                  {n}
                  <button
                    type="button"
                    onClick={() => setNotes(notes.filter((note) => note !== n))}
                    className="text-coffee hover:text-coffee-dark transition-colors dark:text-gray-400 dark:hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-coffee-dark hover:bg-coffee/90 transition-all duration-300 dark:bg-coffee dark:hover:bg-coffee-dark">
            Add Coffee Bean
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
