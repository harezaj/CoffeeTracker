import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";

interface PurchaseDetailsProps {
  defaultValues: {
    price: number;
    weight: number;
  };
  weightUnit: 'g' | 'oz';
  onWeightUnitChange: (value: 'g' | 'oz') => void;
}

export function PurchaseDetails({ defaultValues, weightUnit, onWeightUnitChange }: PurchaseDetailsProps) {
  // Convert the initial weight based on the selected unit
  const getInitialDisplayWeight = () => {
    if (weightUnit === 'oz') {
      return (defaultValues.weight / 28.3495).toFixed(2);
    }
    return defaultValues.weight.toString();
  };

  const [displayWeight, setDisplayWeight] = useState(getInitialDisplayWeight());

  // Update the display weight when the unit changes
  const handleUnitChange = (newUnit: 'g' | 'oz') => {
    if (!newUnit || newUnit === weightUnit) return;

    const currentValue = parseFloat(displayWeight);
    if (isNaN(currentValue)) return;

    let newValue: number;
    if (newUnit === 'oz') {
      // Convert from grams to ounces
      newValue = currentValue / 28.3495;
    } else {
      // Convert from ounces to grams
      newValue = currentValue * 28.3495;
    }

    setDisplayWeight(newValue.toFixed(2));
    onWeightUnitChange(newUnit);
  };

  // Handle direct weight input changes
  const handleWeightChange = (value: string) => {
    setDisplayWeight(value);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="price" className="dark:text-gray-200">Price ($)</Label>
        <Input 
          id="price" 
          name="price" 
          type="number" 
          step="0.01" 
          defaultValue={defaultValues.price} 
          required 
          className="dark:bg-[#1A1A1A] dark:border-gray-700 dark:text-white" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="weight" className="dark:text-gray-200">Weight</Label>
        <div className="flex gap-2">
          <Input 
            id="weight" 
            name="weight" 
            type="number"
            step="0.01"
            value={displayWeight}
            onChange={(e) => handleWeightChange(e.target.value)}
            required 
            className="flex-1 dark:bg-[#1A1A1A] dark:border-gray-700 dark:text-white"
          />
          <ToggleGroup
            type="single"
            value={weightUnit}
            onValueChange={handleUnitChange}
            className="border rounded-md dark:border-gray-700"
          >
            <ToggleGroupItem value="g" className="px-2 py-1 dark:data-[state=on]:bg-gray-700">g</ToggleGroupItem>
            <ToggleGroupItem value="oz" className="px-2 py-1 dark:data-[state=on]:bg-gray-700">oz</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}