import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBeans } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function CostCalculator() {
  const [selectedBeanId, setSelectedBeanId] = useState<string>("");
  const [usesMilk, setUsesMilk] = useState(false);
  const [milkCost, setMilkCost] = useState(0);
  const [usesSyrup, setUsesSyrup] = useState(false);
  const [syrupCost, setSyrupCost] = useState(0);

  const { data: beans = [] } = useQuery({
    queryKey: ["beans"],
    queryFn: fetchBeans,
  });

  const selectedBean = beans.find((bean) => bean.id === selectedBeanId);

  const calculateCost = () => {
    if (!selectedBean) return 0;

    // Calculate coffee cost per serving
    const gramsPerServing = selectedBean.gramsIn;
    const costPerGram = selectedBean.price / selectedBean.weight;
    const coffeeCost = gramsPerServing * costPerGram;

    // Add additional costs if applicable
    const totalMilkCost = usesMilk ? milkCost : 0;
    const totalSyrupCost = usesSyrup ? syrupCost : 0;

    return coffeeCost + totalMilkCost + totalSyrupCost;
  };

  const totalCost = calculateCost();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Cost Calculator</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Select Coffee Bean</Label>
            <Select value={selectedBeanId} onValueChange={setSelectedBeanId}>
              <SelectTrigger>
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

          {selectedBean && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Bean Details:</p>
                <p>Price: ${selectedBean.price}</p>
                <p>Weight: {selectedBean.weight}g</p>
                <p>Dose per serving: {selectedBean.gramsIn}g</p>
                <p>Grind Size: {selectedBean.grindSize}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="milk-toggle">Include Milk Cost</Label>
              <Switch
                id="milk-toggle"
                checked={usesMilk}
                onCheckedChange={setUsesMilk}
              />
            </div>
            {usesMilk && (
              <div className="space-y-2">
                <Label htmlFor="milk-cost">Cost per serving ($)</Label>
                <Input
                  id="milk-cost"
                  type="number"
                  step="0.01"
                  value={milkCost}
                  onChange={(e) => setMilkCost(Number(e.target.value))}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="syrup-toggle">Include Syrup Cost</Label>
              <Switch
                id="syrup-toggle"
                checked={usesSyrup}
                onCheckedChange={setUsesSyrup}
              />
            </div>
            {usesSyrup && (
              <div className="space-y-2">
                <Label htmlFor="syrup-cost">Cost per serving ($)</Label>
                <Input
                  id="syrup-cost"
                  type="number"
                  step="0.01"
                  value={syrupCost}
                  onChange={(e) => setSyrupCost(Number(e.target.value))}
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Cost Breakdown</h2>
          {selectedBean ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span>Coffee Cost:</span>
                  <span>${(selectedBean.gramsIn * (selectedBean.price / selectedBean.weight)).toFixed(2)}</span>
                </p>
                {usesMilk && (
                  <p className="flex justify-between">
                    <span>Milk Cost:</span>
                    <span>${milkCost.toFixed(2)}</span>
                  </p>
                )}
                {usesSyrup && (
                  <p className="flex justify-between">
                    <span>Syrup Cost:</span>
                    <span>${syrupCost.toFixed(2)}</span>
                  </p>
                )}
                <div className="border-t pt-2 mt-2">
                  <p className="flex justify-between font-semibold">
                    <span>Total Cost per Serving:</span>
                    <span>${totalCost.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Select a coffee bean to see the cost breakdown</p>
          )}
        </div>
      </div>
    </div>
  );
}