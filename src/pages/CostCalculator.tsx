import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { fetchBeans } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CostCalculator() {
  const [selectedBeanId, setSelectedBeanId] = useState<string>("");
  const [milkCost, setMilkCost] = useState<number>(0);
  const [syrupCost, setSyrupCost] = useState<number>(0);
  const [usesMilk, setUsesMilk] = useState(false);
  const [usesSyrup, setUsesSyrup] = useState(false);
  const [servings, setServings] = useState<number>(1);

  const { data: beans = [] } = useQuery({
    queryKey: ["beans"],
    queryFn: fetchBeans,
  });

  const selectedBean = beans.find((bean) => bean.id === selectedBeanId);

  const calculateCostPerServing = () => {
    if (!selectedBean) return 0;

    // Calculate coffee cost per serving
    const gramsPerServing = selectedBean.gramsIn;
    const costPerGram = selectedBean.price / selectedBean.weight;
    const coffeeCost = gramsPerServing * costPerGram;

    // Add additional costs if applicable
    const totalMilkCost = usesMilk ? milkCost : 0;
    const totalSyrupCost = usesSyrup ? syrupCost : 0;

    return (coffeeCost + totalMilkCost + totalSyrupCost) * servings;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Coffee Cost Calculator</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Select Coffee Bean</Label>
              <Select value={selectedBeanId} onValueChange={setSelectedBeanId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a coffee bean" />
                </SelectTrigger>
                <SelectContent>
                  {beans.map((bean) => (
                    <SelectItem key={bean.id} value={bean.id}>
                      {bean.name} - {bean.roaster}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Number of Servings</Label>
              <Input
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Include Milk Cost</Label>
                <Switch
                  checked={usesMilk}
                  onCheckedChange={setUsesMilk}
                />
              </div>
              {usesMilk && (
                <div>
                  <Label>Milk Cost per Serving ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={milkCost}
                    onChange={(e) => setMilkCost(Number(e.target.value))}
                    placeholder="Enter milk cost per serving"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Include Syrup Cost</Label>
                <Switch
                  checked={usesSyrup}
                  onCheckedChange={setUsesSyrup}
                />
              </div>
              {usesSyrup && (
                <div>
                  <Label>Syrup Cost per Serving ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={syrupCost}
                    onChange={(e) => setSyrupCost(Number(e.target.value))}
                    placeholder="Enter syrup cost per serving"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold">Cost Breakdown</h2>
          {selectedBean ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-600">Bean Cost per Gram:</span>
                <span className="font-medium">${(selectedBean.price / selectedBean.weight).toFixed(3)}</span>
                
                <span className="text-gray-600">Grams per Serving:</span>
                <span className="font-medium">{selectedBean.gramsIn}g</span>
                
                <span className="text-gray-600">Grind Size:</span>
                <span className="font-medium">{selectedBean.grindSize}</span>
                
                {usesMilk && (
                  <>
                    <span className="text-gray-600">Milk Cost per Serving:</span>
                    <span className="font-medium">${milkCost.toFixed(2)}</span>
                  </>
                )}
                
                {usesSyrup && (
                  <>
                    <span className="text-gray-600">Syrup Cost per Serving:</span>
                    <span className="font-medium">${syrupCost.toFixed(2)}</span>
                  </>
                )}
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Cost ({servings} serving{servings > 1 ? 's' : ''}):</span>
                  <span className="text-2xl font-bold">${calculateCostPerServing().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                  <span>Cost per Serving:</span>
                  <span>${(calculateCostPerServing() / servings).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Select a coffee bean to see cost breakdown</p>
          )}
        </Card>
      </div>
    </div>
  );
};
